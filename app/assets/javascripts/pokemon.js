function pokemonComponent() {

  if (!window.PokemonApp) {
    window.PokemonApp = {};
  }

  //Pokemon API
  PokemonApp.Pokemon = function (pokemonUri) {
    this.id = idFromUri(pokemonUri);
  };

  PokemonApp.Pokemon.prototype.render = function () {
    console.log("Rendering pokemon: #" + this.id);

    renderPokemonAttributes(this);
    renderPokemonImage(this);
  };


  //Set on click event
  $('.js-show-pokemon').on('click', function(event){
    event.preventDefault();
    var $button = $(event.currentTarget);
    var pokemonUri = $button.data('pokemon-uri');

    PokemonApp.lastPokemon = new PokemonApp.Pokemon(pokemonUri);
    PokemonApp.lastPokemon.render();
  });



  //Private Methods
  function idFromUri (pokemonUri) {
    var uriSegments = pokemonUri.split("/");
    var secondLast = uriSegments.length - 2;
    return uriSegments[secondLast];
  };

  function renderPokemonAttributes (pokemon) {
    $.ajax({
      url: '/api/pokemon/' + pokemon.id,
      success: function (response) {
        pokemon.info = response;
        renderPokemonDescription(pokemon);
        
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
      },
      error: function (error) {
        console.log('Impossible to retrieve data.')
        console.log(error);
      }
    });
  }

  function renderPokemonImage (pokemon) {
    var $imageHolder = $('.js-pkmn-image');
    $imageHolder.html('');
    var spriteId = parseInt(pokemon.id) + 1;

    $.ajax({
      url: '/api/sprite/' + spriteId,
      success: function (response) {
        pokemon.image = response.image;

        $imageHolder.html('<img src="http://pokeapi.co' + pokemon.image+'">');      
      },
      error: function (error) {
        console.log(error);
      }
    });
  }

  function renderPokemonDescription(pokemon){
    var descriptions = pokemon.info.descriptions;
    var description = getLastGenerationDescription(descriptions);
    var descriptionUri = description.resource_uri.split('/').slice(-3,-1).join('/');

    $.ajax({
      url: '/api/' + descriptionUri,
      success: function(response){
        pokemon.description = response.description;

        $('.js-pkmn-description').text(pokemon.description);
      }
    })
  }

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
}