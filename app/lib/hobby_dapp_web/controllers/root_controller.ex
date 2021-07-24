defmodule HobbyDappWeb.RootController do
  use HobbyDappWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
