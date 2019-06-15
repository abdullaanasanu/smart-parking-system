import React, { Component, Fragment } from "react";
import {
    MDBContainer,
    MDBRow
} from "mdbreact";
import SignUpCard from "./SignUp";
import LoginCard from "./Login";

var styles = {
    marginTop: '10px',
};

class EntryPage extends Component{

    render() {
        return (
            <Fragment>
                <MDBContainer style={styles}>
                    <MDBRow>
                        <SignUpCard />
                        <LoginCard />

                    </MDBRow>
                </MDBContainer>
            </Fragment>
        );
    }
}

export default EntryPage;