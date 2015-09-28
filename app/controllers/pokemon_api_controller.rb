require("net/http")

class PokemonApiController < ApplicationController
  POKEMON_API_URL = "http://pokeapi.co/api/v1"

  def forward
    url_string = "#{POKEMON_API_URL}/#{params[:uri]}/"
    response = poke_request(url_string)
    render(:json => response)
  end


  private

  def poke_request(url_string)
    uri = URI.parse(url_string)
    response = Net::HTTP.get_response(uri)
    return response.body
  end
end
