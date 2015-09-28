class PokemonApi
  POKEMON_API_URL = "http://pokeapi.co/api/v1"

  def self.uri(path)
    url_string = "#{POKEMON_API_URL}/#{path}/"
    return URI.parse(url_string)
  end

  def self.request(path)
    uri = self.uri(path)
    response = Net::HTTP.get_response(uri)
    return response.body
  end
end
