PokemonApp.Pokemon = function (pokemonUri) {
  this.id = PokemonApp.Pokemon.idFromUri(pokemonUri);
};

PokemonApp.Pokemon.prototype.render = function () {
  console.log("Rendering pokemon: #" + this.id);

  var self = this;

  $.ajax({
    url: '/api/pokemon/' + this.id,
    success: function (response) {
      self.info = response;
      
      $('.js-pkmn-name').text(self.info.name);
      $('.js-pkmn-number').text(self.info.pkdx_id);
      $('.js-pkmn-height').text(self.info.height);
      $('.js-pkmn-weight').text(self.info.weight);
      $('.js-pkmn-hp').text(self.info.hp);
      $('.js-pkmn-att-def').text(self.info.attack + ' - ' +self.info.defense);
      $('.js-pkmn-sp').text(self.info.sp_atk + ' - ' +self.info.sp_def);
      $('.js-pkmn-speed').text(self.info.speed);
      $('.js-pkmn-types').text(PokemonApp.Pokemon.formatTypes(self.info.types));

      $('.js-pokemon-modal').modal('show');
    },
    error: function (error) {
      console.log('Impossible to retrieve data.')
      console.log(error);
    }
  });
};

PokemonApp.Pokemon.idFromUri = function (pokemonUri) {
  var uriSegments = pokemonUri.split("/");
  var secondLast = uriSegments.length - 2;
  return uriSegments[secondLast];
};

PokemonApp.Pokemon.formatTypes = function (pkmnTypes) {
  var types = Object.keys(pkmnTypes).reduce(function(prev, key){
    return prev + ' ' + pkmnTypes[key].name;
  }, '');
  return types;
}

PokemonApp.Pokemon.prototype.renderImage = function () {
  var self = this;

  $.ajax({
    url: '/api/sprite/' + this.id,
    success: function (response) {
      self.image = response.image;

      $('.js-pkmn-image').html('<img src="http://pokeapi.co' + self.image+'">');      
    },
    error: function (error) {
      console.log(error);
    }
  });

}

$(document).on('ready', function(){
  $('.js-show-pokemon').on('click', function(event){
    event.preventDefault();
    var $button = $(event.currentTarget);
    var pokemonUri = $button.data('pokemon-uri');

    var pokemon = new PokemonApp.Pokemon(pokemonUri);
    pokemon.render();
    pokemon.renderImage();
  })
})