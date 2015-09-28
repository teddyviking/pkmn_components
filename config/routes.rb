Rails.application.routes.draw do
  get("/api/*uri", :to => "pokemon_api#forward")
end
