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


$(document).on('ready', function(){
  $('.js-show-pokemon').on('click', function(event){
    event.preventDefault();
    var $button = $(event.currentTarget);
    var pokemonUri = $button.data('pokemon-uri');

    var pokemon = new PokemonApp.Pokemon(pokemonUri);
    pokemon.render();
  })
})