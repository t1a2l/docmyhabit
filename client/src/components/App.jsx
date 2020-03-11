import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import Main from "./Main";
import DocAction from "./DocAction";
// import Actions from "./Actions";
import {Route, Switch} from "react-router-dom";

function App() {
  return (
    <div>
      <Header></Header>
      <Switch>
        <Route path="/" exact component={Main}></Route>
        <Route path="/Login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
        <Route path="/doc-new-action" component={DocAction}></Route>
        {/* <Route path="/all-actions" component={Actions}></Route> */}
      </Switch>
      <Footer></Footer>
    </div>
  );
}

export default App;
