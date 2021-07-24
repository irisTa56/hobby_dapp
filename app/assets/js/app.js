// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
const _css = require("../css/phoenix.css");

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html"

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import BallotPage from "../ts/pages/BallotPage";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/ballot">
        <BallotPage />
      </Route>
      <Route>
        <nav>
          <ul>
            <li>
              <Link to="/ballot">Ballot</Link>
            </li>
          </ul>
        </nav>
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
