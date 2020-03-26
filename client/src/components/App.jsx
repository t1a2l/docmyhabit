import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import Main from "./Main";
import DocAction from "./DocAction";
import AddTypes from "./AddTypes";
import {Route, Switch} from "react-router-dom";
import { makeStyles  } from "@material-ui/core/styles";
import DocMyHabitToolbar from "./DocMyHabitToolbar";
import { LastLocationProvider } from 'react-router-last-location';

const useStyles = makeStyles(theme => ({
  backgroundContent: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    minHeight: "100vh", /* will cover the 100% of viewport */
    overflow: "hidden",
    display: "block",
    position: "relative"
  }
}));

function App() {
  const classes = useStyles();
  return (
    <div className={classes.backgroundContent}>
      <LastLocationProvider>
        <DocMyHabitToolbar />
        <Header></Header>
        <div style={{marginBottom: "40px"}}>
          <Switch>
            <Route path="/" exact component={Main}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/register" component={Register}></Route>
            <Route path="/doc-new-action" component={DocAction}></Route>
            <Route path="/add-types" component={AddTypes}></Route>
          </Switch>
        </div>
        <Footer></Footer>
      </LastLocationProvider>
    </div>
  );
}

export default App;
