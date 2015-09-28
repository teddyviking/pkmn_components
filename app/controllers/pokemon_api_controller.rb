require("net/http")

class PokemonApiController < ApplicationController
  def forward
    response = PokemonApi.request(params[:uri])
    render(:json => response)
  end
end
