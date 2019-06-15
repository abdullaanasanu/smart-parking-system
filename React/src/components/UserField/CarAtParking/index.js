import React, { Component } from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCardHeader,
  MDBBtn,
  MDBInput,
  MDBListGroup, MDBListGroupItem, MDBContainer, MDBBadge, MDBRow, MDBAlert
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
    car: {
        fontSize: 35,
        padding: '20px 0'
    },
    carSlot: {
        textAlign: 'center',
        margin: 3,
        cursor: 'pointer',
        minHeight: 80
    },
    road: {
        height: 15,
        width: '100%',
        borderRight: '7px #4caf50 solid'
    },
    card: {
      marginTop: 90
    }
};

class CarAtParking extends Component {

    state = {
        parkingSlot: false,
        parkings: false,
        slots: false
    };

    componentDidMount() {
        const authToken = cookie.get("data");
        var url = "http://192.168.43.60:3000/api/sp/car-at-parking/";
        fetch(url + authToken)
          .then(res => res.json())
          .then(res => {
            if (res.resCode === 0) {
              this.setState({
                isLoggedIn: true,
                parkings: res.data
              });
            }else {
                this.setState({
                    isLoggedIn: true,
                    parkings: false
                });
            }
          })
          .catch(error => {
            console.error("Error:", error);
          });
          url = "http://192.168.43.60:3000/api/sp/parking-slots/";
          fetch(url + authToken)
            .then(res => res.json())
            .then(res => {
              if (res.resCode === 0) {
                this.setState({
                  isLoggedIn: true,
                  slots: res.data
                });
              }else if (res.resCode === 2){
                  this.setState({
                      isLoggedIn: true,
                      slots: false
                  });
              }
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
                  <MDBCardHeader className="form-header orange lighten-1 rounded" style={styles.cardHeader}>
                    <h3 className="my-3 white-text">
                      <MDBIcon icon="car" /> Car at Parkings:
                    </h3>
                  </MDBCardHeader>
                    <MDBListGroup className="mt-3">
                        
                        {this.state.parkings ? 
                            this.state.parkings.map(car => (
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                                    {car.carNumber} { car.Slot === 'ent' ? <MDBBadge color="warning" pill>Entering</MDBBadge> : <MDBBadge color="primary" pill>{car.Slot}</MDBBadge> }
                                </MDBListGroupItem>
                            ))
                            :
                            
                            <MDBAlert color="warning" >
                                No Car At Parkings
                            </MDBAlert>
                        }
                    </MDBListGroup>
                    <MDBContainer>
                        <MDBRow className="mt-5">
                        {this.state.slots ? 
                            this.state.slots.map(slot => (
                                
                                slot.Status == 1 ? <MDBCol className="green lighten-1 rounded white-text" style={styles.carSlot}><h5 className="h5">{slot.SlotId.toUpperCase()}</h5><MDBIcon icon="parking" style={styles.car} /></MDBCol> : slot.Status == 2 ? <MDBCol className="blue lighten-1 rounded white-text" style={styles.carSlot}><h5 className="h5">{slot.SlotId.toUpperCase()}</h5><MDBIcon icon="car" style={styles.car} /></MDBCol> : <MDBCol className="yellow lighten-1 rounded" style={styles.carSlot}><h5 className="h5">{slot.SlotId.toUpperCase()}</h5><MDBIcon icon="lock" style={styles.car} /></MDBCol>
                            
                            ))
                            
                            :
                            'Slot Data Unavailable'
                        }
                            <MDBCol ></MDBCol>
                        </MDBRow>
                    </MDBContainer>
                    <div className="stylish-color-dark" style={styles.road}></div>
    
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
        );
    }
};

export default CarAtParking;