import React, { Component } from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCardHeader,
  MDBBtn,
  MDBInput,
  MDBTable,
  MDBTableHead,
  MDBTableBody, 
  MDBBadge, 
  MDBAlert,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter 
} from "mdbreact";
import Cookies from "universal-cookie";
import { Redirect } from "react-router-dom";

const cookie = new Cookies();

var styles = {
  cardHeader: {
      marginTop: '-60px'
  },
  submitBtn: {
      width: '100%'
  },
  card: {
    marginTop: 90
  },
  rounded: {
    borderRadius: 40
  }
};

class MyWallets extends Component {

  state = {
    History: false,
    rechargeToken: '',
    btnDisabled: false,
    error: false,
    completed: false,
    modal: false
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value, [prop + "Error"]: false });
  };

  
  componentDidMount() {
    const authToken = cookie.get("data");
    var url = "http://192.168.43.60:3000/api/sp/my-history/";
    fetch(url + authToken)
      .then(res => res.json())
      .then(res => {
        if (res.resCode === 0) {
          this.setState({
            isLoggedIn: true,
            History: res.data
          });
        }else{
          this.setState({
            isLoggedIn: true,
            History: false
          });
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
  
  handleRechargeSubmit = e => {
    e.preventDefault();
    this.setState({ btnDisabled: true }); 
    const authToken = cookie.get("data");
    var url = "http://192.168.43.60:3000/api/sp/recharge/";
    fetch(url + authToken, {
      method: "POST", // or 'PUT'
      body: JSON.stringify(this.state), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.resCode === 0) {
          let CarNumbers = this.state.CarNumbers;
          this.setState({ completed: true, error: false });
          CarNumbers.push({ carNumber: this.state.newCarNumber });
          this.setState({ CarNumbers, newCarNumber: '' });
          window.location.reload()
        } else if (res.resCode === 2) {
          this.setState({error: true, completed: false});
        }
        this.setState({ btnDisabled: false });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
    
      <MDBCol md="4">
        <MDBCard style={styles.card}>
          <MDBCardBody>
            <MDBCardHeader className="form-header purple lighten-3 rounded" style={styles.cardHeader}>
              <h3 className="my-3 white-text">
                <MDBIcon icon="user" /> Account:
              </h3>
            </MDBCardHeader>
              <h4 className="mt-5 text-center">Recharge Wallet</h4>
              { this.state.error ? 
                <div>
                  <MDBAlert color="danger" >
                    Invaid Recharge Token
                  </MDBAlert>
                </div>
                : ""
              }
              { this.state.completed ? 
                <MDBAlert color="success" >
                  Wallet Recharged!
                </MDBAlert>
                : ""
              }

            <form onSubmit={this.handleRechargeSubmit}>
              <div className="grey-text">
                
                <MDBInput
                  label="Type your recharge token"
                  icon="coins"
                  group
                  type="text"
                  validate
                  error="wrong"
                  success="right"
                  value={this.state.rechargeToken}
                  onChange={this.handleChange("rechargeToken")}
                />
              </div>

              <div className="text-center mt-4">
                  <MDBBtn
                  className="mb-3 white-text"
                  type="submit"
                  gradient="aqua"
                  disable={this.state.btnDisabled}
                  >
                  Recharge
                  </MDBBtn>
              </div>
            </form>
            <h4 className="mt-5 text-center">History</h4>
            <div className="text-center">
              <MDBBtn onClick={this.toggle} style={styles.rounded} color="success">View History</MDBBtn>
            </div>
            <MDBModal isOpen={this.state.modal} toggle={this.toggle} size="lg">
              <MDBModalHeader toggle={this.toggle}>View History</MDBModalHeader>
              <MDBModalBody>
                <MDBTable>
                  <MDBTableHead>
                    <tr>
                      <th>Car Number</th>
                      <th>Entry Time</th>
                      <th>Exist Time</th>
                      <th>Hours</th>
                      <th>Payment</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    {this.state.History ? 
                      this.state.History.map(hst => (
                        <tr>
                          <td>{hst.carNumber}</td>
                          <td>{new Date(hst.EntryTime).toString().substring(0, 15)+' '+new Date(hst.EntryTime).toLocaleTimeString()}</td>
                          <td>{new Date(hst.ExistTime).toString().substring(0, 15)+' '+new Date(hst.ExistTime).toLocaleTimeString()}</td>
                          <td><MDBBadge color="primary" pill>{hst.Hours}h</MDBBadge></td>
                          <td><MDBBadge color="success" pill><MDBIcon icon="rupee-sign" />{hst.Cost}</MDBBadge></td>    
                        </tr>
                      ))
                      :
                      <MDBAlert color="warning" >
                        No history to display
                      </MDBAlert>
                    }
                  </MDBTableBody>
                </MDBTable>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
              </MDBModalFooter>
            </MDBModal>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  }
  
};

export default MyWallets;