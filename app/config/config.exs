# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

# Configures the endpoint
config :hobby_dapp, HobbyDappWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "x96oT3GsodVIkrdz09VIx2Nn/hypz6s9I5LxZGtFxWAWlr4hJZvGHQhuYwqRwK2z",
  render_errors: [view: HobbyDappWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: HobbyDapp.PubSub,
  live_view: [signing_salt: "ln/4q80S"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
