(function pokemonComponent() {

  if (!window.PokemonApp) {
    window.PokemonApp = {};
  }

  if (!PokemonApp.fetchedPokemons) {
    PokemonApp.fetchedPokemons = {};
  }

//Pokemon API

  PokemonApp.Pokemon = function (pokemonUri) {
    this.id = idFromUri(pokemonUri);
  };

  PokemonApp.Pokemon.prototype.render = function () {
    console.log("Rendering pokemon: #" + this.id);

    getPokemonInfo(this, renderPokemonInfo);
    getPokemonImage(this, renderPokemonImage);
  };


  PokemonApp.Pokemon.prototype.renderEvolutions = function () {
    console.log("Rendering evolutions of pokemon: #" + this.id);

    getPokemonEvolutions(this, renderPokemonEvolutions);
  }

//====================================================================

//Set on click events
  $(document).on('ready', function(){
    $('.js-show-pokemon').on('click', function(event){
      event.preventDefault();
      var $button = $(event.currentTarget);
      var pokemonUri = $button.data('pokemon-uri');

      PokemonApp.lastPokemon = new PokemonApp.Pokemon(pokemonUri);
      PokemonApp.lastPokemon.render();
    });

    $('.js-show-evolutions').on('click', function(event){
      event.preventDefault();
      var $evolutionsButton = $(event.currentTarget);

      PokemonApp.lastPokemon.renderEvolutions();
    });
  });

//====================================================================


//GET Methods
  
  function getPokemonInfo(pokemon, callback) {
    $.ajax({
      url: '/api/pokemon/' + pokemon.id,
      success: function(response){
        pokemon.info = response;
        PokemonApp.fetchedPokemons[pokemon.info.id] = pokemon.info;
        callback(pokemon);
      },
      error: function(error){
        console.log(error);
      }
    });
  }

  function getPokemonImage(pokemon, callback) {  
    var spriteId = parseInt(pokemon.id) + 1;

    $.ajax({
      url: '/api/sprite/' + spriteId,
      success: function (response) {
        pokemon.image = response.image;

        callback(pokemon.image);
      },
      error: function (error) {
        console.log(error);
      }
    });
  }

  function getPokemonDescription (pokemon, callback) {
    var descriptions = pokemon.info.descriptions;
    var description = getLastGenerationDescription(descriptions);
    var descriptionUri = getUriDescription(description);

    $.ajax({
      url: '/api/' + descriptionUri,
      success: function(response){
        pokemon.description = response.description;

        callback(pokemon.description);
      },
      error: function (error) {
        console.log(error);
      }
    })
  }

  function getPokemonEvolutions(pokemon, callback) {
    if(!pokemon.evolutions){
      pokemon.evolutions = [];

      pokemon.info.evolutions.forEach(function(evolution){
        $.ajax({
          url: '/api/pokemon/' + idFromUri(evolution.resource_uri),
          success: function (response) {
            pokemon.evolutions.push(response);
            callback(pokemon.evolutions);
          }
        });
      });
    }
  }

//====================================================================

// Render Methods

  function renderPokemonInfo (pokemon) {
    getPokemonDescription(pokemon, renderPokemonDescription);
          
    $('.js-pkmn-name').text(pokemon.info.name);
    $('.js-pkmn-number').text(pokemon.info.pkdx_id);
    $('.js-pkmn-height').text(pokemon.info.height);
    $('.js-pkmn-weight').text(pokemon.info.weight);
    $('.js-pkmn-hp').text(pokemon.info.hp);
    $('.js-pkmn-att-def').text(pokemon.info.attack + ' - ' +pokemon.info.defense);
    $('.js-pkmn-sp').text(pokemon.info.sp_atk + ' - ' +pokemon.info.sp_def);
    $('.js-pkmn-speed').text(pokemon.info.speed);
    $('.js-pkmn-types').text(formatTypes(pokemon.info.types));

    $('.js-pokemon-modal').modal('show');
  }

  function renderPokemonDescription(pokemonDescription){
    $('.js-pkmn-description').text(pokemonDescription);
  }

  function renderPokemonImage (pokemonImage) {
    var $imageHolder = $('.js-pkmn-image');
    $imageHolder.html('');
    
    $imageHolder.html('<img src="http://pokeapi.co' + pokemonImage +'">');      
  }

  function renderPokemonEvolutions (pokemonEvolutions) {
    var evolutionsHTML = '<ul>\n';

    pokemonEvolutions.forEach(function(evolution, index){
      evolutionsHTML += ('<li data-pokemon-uri="'+ evolution.resource_uri + '">' + evolution.name + '</li>\n');
    });

    evolutionsHTML += '</ul>';

    $('.evolutions').html(evolutionsHTML);
  }

//====================================================================


//Helper Methods
  function idFromUri (pokemonUri) {
    var uriSegments = pokemonUri.split("/");
    var secondLast = uriSegments.length - 2;
    
    return uriSegments[secondLast];
  };

  

  function formatTypes (pkmnTypes) {
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
