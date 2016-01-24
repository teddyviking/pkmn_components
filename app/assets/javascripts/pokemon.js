(function pokemonComponent() {

  if (!window.PokemonApp) {
    window.PokemonApp = {};
  }

  if (!PokemonApp.fetchedPokemons) {
    PokemonApp.fetchedPokemons = {};
  }

//Pokemon API

  PokemonApp.Pokemon = function (id) {
    this.id = id;
  };

  PokemonApp.fetchPokemon = function (pokemonUri) {
    var id = idFromUri(pokemonUri)

    var pokemon = PokemonApp.fetchedPokemons[id];

    if (!pokemon) {
      return new PokemonApp.Pokemon(id);
    } else {
      return pokemon;
    }
  }

  PokemonApp.Pokemon.prototype.render = function () {
    console.log("Rendering pokemon: #" + this.id);

    getPokemonInfo(this, renderPokemonInfo);
    getPokemonImage(this, renderPokemonImage);

    return this;
  };

  PokemonApp.Pokemon.prototype.renderEvolutions = function () {
    console.log("Rendering evolutions of pokemon: #" + this.id);

    getPokemonEvolutions(this, renderPokemonEvolutions);
  }

  PokemonApp.cleanPokemon = function (){
    setModalAttributes({});
    setModalDescription();
    setModalImage();
    resetModalEvolutions();
  }

//====================================================================

//Set on click events
  $(document).on('ready', function(){
    $('.js-show-pokemon').on('click', function(event){
      event.preventDefault();
      var $button = $(event.currentTarget);
      var pokemonUri = $button.data('pokemon-uri');

      PokemonApp.cleanPokemon();
      var pokemon = PokemonApp.fetchPokemon(pokemonUri);
      
      PokemonApp.lastPokemon = pokemon.render();
    });

    $('.js-show-evolutions').on('click', function(event){
      event.preventDefault();
      var $evolutionsButton = $(event.currentTarget);

      PokemonApp.lastPokemon.renderEvolutions();
    });
  });

//====================================================================


//GET Methods
  
  function getPokemonInfo (pokemon, callback) {

    if (PokemonApp.fetchedPokemons[pokemon.id]){
      return callback(null, pokemon);
    }

    $.ajax({
      url: '/api/pokemon/' + pokemon.id,
      success: function(response){
        pokemon.info = response;
        PokemonApp.fetchedPokemons[pokemon.id] = pokemon;
        if (callback) {callback(null, pokemon);}
      },
      error: function(error){
        callback(error);
      }
    });
  }

  function getPokemonImage (pokemon, callback) {  
    if (PokemonApp.fetchedPokemons[pokemon.id] && pokemon.image){
      
      return callback(null, pokemon.image);
    }

    var spriteId = parseInt(pokemon.id) + 1;

    $.ajax({
      url: '/api/sprite/' + spriteId,
      success: function (response) {
        pokemon.image = response.image;

        if(callback){callback(null, pokemon.image);}
      },
      error: function (error) {
        callback(error);
      }
    });
  }

  function getPokemonDescription (pokemon, callback) {
    
    if (PokemonApp.fetchedPokemons[pokemon.id].description){
      return callback(null, pokemon.description);
    }

    var descriptions = pokemon.info.descriptions;
    var description = getLastGenerationDescription(descriptions);
    var descriptionUri = getUriDescription(description);

    $.ajax({
      url: '/api/' + descriptionUri,
      success: function(response){
        pokemon.description = response.description;

        if (callback) {callback(null, pokemon.description);}
      },
      error: function (error) {
        callback(error);
      }
    })
  }

  function getPokemonEvolutions (pokemon, callback) {
    
    if(PokemonApp.fetchedPokemons[pokemon.id].evolutions){
      return callback(null, pokemon.evolutions);
    }

    evolutions = pokemon.info.evolutions.map(function(evolution){
      return PokemonApp.fetchPokemon(evolution.resource_uri);
    })


    async.map(evolutions,
      function(evolution, callback){
        getPokemonInfo(evolution, callback);
        getPokemonImage(evolution,function(){});
      },
      function(err, finalEvolutions){
        pokemon.evolutions = finalEvolutions;
        renderPokemonEvolutions(null, pokemon.evolutions);
      }
    )
  }

//====================================================================

// Render Methods

  function renderPokemonInfo (err, pokemon) {
    getPokemonDescription(pokemon, renderPokemonDescription);
    setModalAttributes(pokemon.info);   

    $('.js-pokemon-modal').modal('show');
  }

  function renderPokemonDescription(err, pokemonDescription){
    setModalDescription(pokemonDescription);
  }

  function renderPokemonImage (err, pokemonImage) {
    setModalImage(pokemonImage);     
  }

  function renderPokemonEvolutions (err, pokemonEvolutions) {
    var evolutionsHTML = '<ul>\n';

    pokemonEvolutions.forEach(function(evolution, index){
      evolutionsHTML += ('<li data-pokemon-uri="'+ 
                        evolution.info.resource_uri + 
                        '"><img src="http://pokeapi.co' +
                        evolution.image +'">' +
                        evolution.info.name + '</li>\n');
    });

    evolutionsHTML += '</ul>';

    $('.evolutions').html(evolutionsHTML);
  }

//====================================================================

// Modal manager methods

  function setModalAttributes (attributes)  {
    $('.js-pkmn-name').text(attributes.name || '');
    $('.js-pkmn-number').text(attributes.pkdx_id || '');
    $('.js-pkmn-height').text(attributes.height || '');
    $('.js-pkmn-weight').text(attributes.weight || '');
    $('.js-pkmn-hp').text(attributes.hp || '');
    $('.js-pkmn-att-def').text((attributes.attack || '' ) + ' - ' + (attributes.defense || ''));
    $('.js-pkmn-sp').text((attributes.sp_atk || '') + ' - ' +(attributes.sp_def || ''));
    $('.js-pkmn-speed').text(attributes.speed || '');
    $('.js-pkmn-types').text(formatTypes(attributes.types) || '');
  }

  function setModalDescription (description) {
    $('.js-pkmn-description').text(description || '');
  }

  function setModalImage (image) {
    var imageTag;
    if (image) { imageTag = '<img src="http://pokeapi.co' + image +'">' }

    $('.js-pkmn-image').html(imageTag || '');
  }

  function resetModalEvolutions (evolutions) {
    $('.evolutions').html('');
  }

//====================================================================

//Helper Methods
  function idFromUri (pokemonUri) {
    var uriSegments = pokemonUri.split("/");
    var secondLast = uriSegments.length - 2;
    
    return uriSegments[secondLast];
  };

  function formatTypes (pkmnTypes) {
    if(!pkmnTypes){ return undefined }

    var types = Object.keys(pkmnTypes).reduce(function(prev, key){
      return prev + ' ' + pkmnTypes[key].name;
    }, '');
    return types;
  }

  function getLastGenerationDescription(descriptions){
    var greatestGeneration = 1;
    var descriptionIndex = 0;

    descriptions.forEach(function(description, index){
      var generation = description.name.split('_')[2];
      generation = parseInt(generation);
      if (generation > greatestGeneration) {
        greatestGeneration = generation;
        descriptionIndex = index;
      }
    });
    return descriptions[descriptionIndex];
  }

  function getUriDescription (description) {
    var splittedUri = description.resource_uri.split('/');
    return splittedUri.slice(-3,-1).join('/');
  }

})();
