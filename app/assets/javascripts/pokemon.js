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

  function renderPokemonAttributes (pokemon) {
    $.ajax({
      url: '/api/pokemon/' + pokemon.id,
      success: function (response) {
        pokemon.info = response;
        
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
}