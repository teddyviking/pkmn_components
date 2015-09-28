class PokemonApi
  POKEMON_API_URL = "http://pokeapi.co/api/v1"

  def self.request(path)
    url_string = "#{POKEMON_API_URL}/#{path}/"
    uri = URI.parse(url_string)
    response = Net::HTTP.get_response(uri)
    return response.body
  end
end
