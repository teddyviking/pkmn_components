if (!window.PokemonApp) {
  window.PokemonApp = {};
}


PokemonApp.init = function (){
  console.log('Pokemon App is online');
}

$(document).on('ready', function(){
  PokemonApp.init();
});