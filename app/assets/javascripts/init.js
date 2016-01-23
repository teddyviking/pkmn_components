if (!window.PokemonApp) {
  window.PokemonApp = {};
}


PokemonApp.init = function (){
  console.log('Pokemon App is online');
  pokemonComponent();
}

$(document).on('ready', function(){
  PokemonApp.init();
});