import React from "react";
import ReactDom from "react-dom";
import {} from "../src/css/styles.css";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";

ReactDom.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
