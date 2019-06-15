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

class SignUpCard extends Component {

  state = {
    newUserEmail: '',
    newUserMobileNumber: '',
    newUserFullName: '',
    newUserPassword: '',
    disableButton: false,
    newAccountCreated: false,
    error: ''
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value, [prop + "Error"]: false });
  };

  handleSubmit = e => {
    e.preventDefault();
    //this.setState({ disableButton: true });
    var url = "http://192.168.43.60:3000/api/sp/signup";
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
          this.setState({newAccountCreated: true});
          this.setState({error: ''});
        } else if (res.code === 2) {
          this.setState({error: 'Email Already used'});
        }
        this.setState({ disableButton: false });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  render() {
    return (
    
      <MDBCol md="6">
        <MDBCard style={styles.card}>
          <MDBCardBody>
            <MDBCardHeader className="form-header blue lighten-2 rounded" style={styles.cardHeader}>
              <h3 className="my-3 white-text">
                <MDBIcon icon="user" /> Sign Up:
              </h3>
            </MDBCardHeader>
            { this.state.newAccountCreated ? (
              
              <MDBAlert color="success" >
                <MDBIcon icon="check-circle" /> Account Created!
              </MDBAlert>
            ) : (
            <form onSubmit={this.handleSubmit}>
              <div className="grey-text">
                <MDBInput
                  label="Type your email"
                  icon="envelope"
                  group
                  type="email"
                  validate
                  error="wrong"
                  success="right"
                  value={this.state.newUserEmail}
                  onChange={this.handleChange("newUserEmail")}
                />
                <MDBInput
                  label="Type your mobile number"
                  icon="phone"
                  group
                  type="text"
                  validate
                  error="wrong"
                  success="right"
                  value={this.state.newUserMobileNumber}
                  onChange={this.handleChange("newUserMobileNumber")}
                />
                
                <MDBInput
                  label="Type your full name"
                  icon="user"
                  group
                  type="text"
                  validate
                  error="wrong"
                  success="right"
                  value={this.state.newUserFullName}
                  onChange={this.handleChange("newUserFullName")}
                />
                <MDBInput
                  label="Type your password"
                  icon="lock"
                  group
                  type="password"
                  validate
                  value={this.state.newUserPassword}
                  onChange={this.handleChange("newUserPassword")}
                />
              </div>

              <div className="text-center mt-4">
                  <MDBBtn
                  className="mb-3 white-text"
                  type="submit"
                  style={styles.submitBtn}
                  gradient="blue"
                  disabled={this.state.disableButton}
                  >
                  Sign Up
                  </MDBBtn>
              </div>
              </form>
            )}
            
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  }

  
};

export default SignUpCard;