import React, { Component, Fragment } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {
MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBFormInline,
MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon
} from "mdbreact";
import "./index.css";
import Routes from "./Routes";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";

const cookie = new Cookies();

class App extends Component {

  state = {
    isOpen: false,
    isLoggedIn: false,
    userData: false
  };

   
  componentDidMount() {
    document.title = "Welcome to Smart Parking";
    const authToken = cookie.get("data");
    var url = "http://192.168.43.60:3000/api/sp/auth/";
    fetch(url + authToken)
      .then(res => res.json())
      .then(res => {
        if (res.resCode === 0) {
          this.setState({
            isLoggedIn: true,
            userData: res.authData
          });
        }else{
          this.setState({
            isLoggedIn: false,
            userData: false
          });
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
  
  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }
  
  render() {
    return (
      <Router>
        <Fragment>
          {this.state.isLoggedIn ? <Redirect to="/home" /> : ""}
          <MDBNavbar color="blue-gradient" dark expand="md">
              <MDBNavbarBrand>
              <strong className="white-text">Smart Parking</strong>
              </MDBNavbarBrand>
              <MDBNavbarToggler onClick={this.toggleCollapse} />
              <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
              <MDBNavbarNav left>
                  { /*<MDBNavItem>
                  <MDBNavLink to="/">Home</MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                  <MDBDropdown>
                      <MDBDropdownToggle nav caret>
                      <span className="mr-2">Dropdown</span>
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                      <MDBDropdownItem href="#!">Action</MDBDropdownItem>
                      <MDBDropdownItem href="#!">Another Action</MDBDropdownItem>
                      <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
                      <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
                      </MDBDropdownMenu>
                  </MDBDropdown> 
                  </MDBNavItem>*/}
              </MDBNavbarNav>
              <MDBNavbarNav right>
                {this.state.isLoggedIn ? 
                  <Fragment>
                    <MDBNavItem>
                      <MDBNavLink className="waves-effect waves-light" to="#!">
                        <MDBIcon fas icon="rupee-sign" /> {this.state.userData.wallet}
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBDropdown>
                        <MDBDropdownToggle nav caret>
                        <MDBIcon icon="user" /> {this.state.userData.fullName}
                        </MDBDropdownToggle>
                        <MDBDropdownMenu className="dropdown-default" right>
                          <MDBDropdownItem href="/logout">Logout</MDBDropdownItem>
                        </MDBDropdownMenu>
                      </MDBDropdown>
                    </MDBNavItem>
                  </Fragment>
                  : ""
                }
                
              </MDBNavbarNav>
              </MDBCollapse>
          </MDBNavbar>
          <Routes />
        </Fragment>
      </Router>
    );
  }
}

export default App;
