import React, {Component} from "react";
import { Route, Switch } from "react-router-dom";
import EntryPage from "./components/EntryPage";
import NotFound from "./components/NotFound";
import UserField from "./components/UserField";
import Logout from "./components/Logout";


class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={EntryPage} />
        <Route exact path="/home" component={UserField} />
        <Route exact path="/logout" component={Logout} />
        

        {/* <Route path="/addons/iframe" component={IframePage} /> */}
        
        <Route component={NotFound}/>
      </Switch>
    );
  }
}

export default Routes;
