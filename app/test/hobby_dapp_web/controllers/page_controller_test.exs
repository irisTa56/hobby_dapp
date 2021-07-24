defmodule HobbyDappWeb.PageControllerTest do
  use HobbyDappWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/phoenix")
    assert html_response(conn, 200) =~ "Welcome to Phoenix!"
  end
end
