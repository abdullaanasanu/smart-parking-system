import React, { Component } from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCardHeader,
  MDBBtn,
  MDBInput,
  MDBListGroup, MDBListGroupItem, MDBBadge, MDBAlert
} from "mdbreact";
import Cookies from "universal-cookie";

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
  }
};

class MyCars extends Component {

  state = {
    CarNumbers: false,
    newCarNumber: ''
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value, [prop + "Error"]: false });
  };

  
  componentDidMount() {
    const authToken = cookie.get("data");
    var url = "http://192.168.43.60:3000/api/sp/my-cars/";
    fetch(url + authToken)
      .then(res => res.json())
      .then(res => {
        if (res.resCode === 0) {
          this.setState({
            isLoggedIn: true,
            CarNumbers: res.data
          });
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
  
  handleAddCarSubmit = e => {
    e.preventDefault();
    //this.setState({ btnDisabled: true }); 
    const authToken = cookie.get("data");
    var url = "http://192.168.43.60:3000/api/sp/add-car/";
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
          this.setState({ completed: true, error: '' });
          CarNumbers.push({ carNumber: this.state.newCarNumber });
          this.setState({ CarNumbers, newCarNumber: '' });
        } else if (res.resCode === 2) {
          this.setState({error: 'Invalid Login Credentails!'});
        }
        this.setState({ btnDisabled: false });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  render() {
    return (
    
      <MDBCol md="4">
        <MDBCard style={styles.card}>
          <MDBCardBody>
            <MDBCardHeader className="form-header green lighten-2 rounded" style={styles.cardHeader}>
              <h3 className="my-3 white-text">
                <MDBIcon icon="user" /> My Cars:
              </h3>
            </MDBCardHeader>
              <MDBListGroup className="mt-3">
                  {/*<MDBListGroupItem className="d-flex justify-content-between align-items-center">
                      KL 54 D 2231<MDBBadge color="primary" pill>1h</MDBBadge>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                      KL 55 H 5563<MDBBadge color="primary" pill>2h</MDBBadge>
    </MDBListGroupItem>*/}
                  {this.state.CarNumbers ? 
                    this.state.CarNumbers.map(car => (
                      <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                          {car.carNumber}
                      </MDBListGroupItem>
                    
                    ))
                    :
                    <MDBAlert color="warning" >
                      You have not added your cars yet!
                    </MDBAlert>
                  }
              </MDBListGroup>
              <h4 className="mt-5 text-center">Add New Car</h4>
            <form onSubmit={this.handleAddCarSubmit}>
              <div className="grey-text">
                
                <MDBInput
                  label="Type your new car number"
                  icon="car"
                  group
                  type="text"
                  validate
                  error="wrong"
                  success="right"
                  value={this.state.newCarNumber}
                  onChange={this.handleChange("newCarNumber")}
                />
              </div>

              <div className="text-center mt-4">
                  <MDBBtn
                  className="mb-3 white-text"
                  type="submit"
                  gradient="blue"
                  >
                  Add
                  </MDBBtn>
              </div>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  }
  
};

export default MyCars;