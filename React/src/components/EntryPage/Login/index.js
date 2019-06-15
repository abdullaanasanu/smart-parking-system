import React, {Component} from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCardHeader,
  MDBBtn,
  MDBInput, MDBAlert
} from "mdbreact";
import Cookies from "universal-cookie";
import { Redirect } from "react-router-dom";

const cookies = new Cookies();

var styles = {
  cardHeader: {
      marginTop: '-60px'
  },
  submitBtn: {
      width: '100%'
  },
  card: {
    marginTop: 90
  }
};

class LoginCard extends Component{

  state = {
    userEmail: '',
    userPassword: '', 
    btnDisabled: false,
    error: false
  }

  
  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value, [prop + "Error"]: false });
  };

  handleLoginSubmit = e => {
    e.preventDefault();
    this.setState({ btnDisabled: true }); 
    var url = "http://192.168.43.60:3000/api/sp/login";
    fetch(url, {
      method: "POST", // or 'PUT'
      body: JSON.stringify(this.state), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.resCode === 0) {
          this.setState({ completed: true, error: false });
          var a = new Date();
          a = new Date(a.getTime() + 1000 * 60 * 60 * 24 * 365);
          cookies.set("data", res.token, { path: "/", expires: a });
          window.location.reload()
        } else if (res.resCode === 2) {
          this.setState({error: true});
        }
        this.setState({ btnDisabled: false });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
    
  render() {
    return (
    
      <MDBCol md="6">
        {this.state.completed ? <Redirect to="/home" /> : ""}
        <MDBCard style={styles.card}>
          <MDBCardBody>
            <MDBCardHeader className="form-header  blue darken-3 rounded" style={styles.cardHeader}>
              <h3 className="my-3 white-text">
                <MDBIcon icon="lock" /> Login:
              </h3>
            </MDBCardHeader>
            {this.state.error ? 
              <MDBAlert color="danger" >
                Invalid Login Credentials!
              </MDBAlert>
            :
              ""
            }
            <form onSubmit={this.handleLoginSubmit}>
              <div className="grey-text">
                <MDBInput
                  label="Type your email"
                  icon="envelope"
                  group
                  type="email"
                  validate
                  error="wrong"
                  success="right"
                  value={this.state.userEmail}
                  onChange={this.handleChange("userEmail")}
                />
                <MDBInput
                  label="Type your password"
                  icon="lock"
                  group
                  type="password"
                  validate
                  value={this.state.userPassword}
                  onChange={this.handleChange("userPassword")}
                />
              </div>

              <div className="text-center mt-4">
                  <MDBBtn
                  className="mb-3 white-text"
                  type="submit"
                  style={styles.submitBtn}
                  gradient="blue"
                  disabled = {this.state.btnDisabled}
                  >
                  Login
                  </MDBBtn>
              </div>
              
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  }
  
};

export default LoginCard;