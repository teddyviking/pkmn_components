function pokemonEvolutions () {
  if (!window.PokemonApp) {
    window.PokemonApp = {};
  }

  PokemonApp.Evolutions = function (pokemon) {
    getEvolutions(this, pokemon);
  } 

  PokemonApp.Evolutions.prototype.render = function () {
    console.log(this);

    var evolutionsHTML = generateEvolutionsHTML(this.evolutions);

    $('.evolutions').html(evolutionsHTML);
  }

  $('.js-show-evolutions').on('click', function(event){
    event.preventDefault();
    var $evolutionsButton = $(event.currentTarget);

    PokemonApp.lastPokemonEvolutions.render();
  });

  function getEvolutions(evolutionsHolder, pokemon) {
    evolutionsHolder.evolutions = [];

    async.until(
      function(){ return pokemon.info },
      function(callback){
        setTimeout(function () {
            callback(null);
        }, 1000);
      },
      function(){
        console.log('Evolutions!');

        pokemon.info.evolutions.forEach(function(evolution){
          $.ajax({
            url: '/api/pokemon/' + idFromUri(evolution.resource_uri),
            success: function (response) {
              evolutionsHolder.evolutions.push(response);
            }
          });
        });
      }
    );
  }

  function idFromUri (pokemonUri) {
    var uriSegments = pokemonUri.split("/");
    var secondLast = uriSegments.length - 2;
    return uriSegments[secondLast];
  }; 

  function generateEvolutionsHTML(evolutions) {
    var finalHTML = '<ul>\n';
    evolutions.forEach(function(evolution, index){
      finalHTML += ('<li>' + evolution.name + '</li>\n');
    })
    return finalHTML += '</ul>'  
  }

}