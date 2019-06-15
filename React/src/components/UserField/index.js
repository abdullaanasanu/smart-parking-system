import React, { Component, Fragment } from "react";
import {
    MDBContainer,
    MDBRow
} from "mdbreact";
import MyCars from "./MyCars";
import CarAtParking from "./CarAtParking";
import MyWallets from "./Accounts";

var styles = {
    marginTop: '20px',
};

class UserField extends Component{

    

    render() {
        return (
            <Fragment>
                <MDBContainer style={styles}>
                    <MDBRow>
                        <MyCars />
                        <CarAtParking />
                        <MyWallets />
                    </MDBRow>
                </MDBContainer>
            </Fragment>
        );
    }
}

export default UserField;