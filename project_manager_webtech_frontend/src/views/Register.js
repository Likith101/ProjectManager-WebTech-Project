import React from 'react'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Jumbotron from 'react-bootstrap/Jumbotron';

import '../fonts.css'

const {register} = require('../services/Auth');

class Register extends React.Component {
    constructor(){
        super();
        this.state = {
            user: "",
            password: ""
        };
        this.userHandler = this.userHandler.bind(this);
        this.passwordHandler = this.passwordHandler.bind(this);
        this.emailHandler = this.emailHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    userHandler(ev){
        this.setState({user: ev.target.value});
    }

    emailHandler(ev){
        this.setState({email: ev.target.value});
    }


    passwordHandler(ev){
        this.setState({password: ev.target.value});
    }

    submitHandler(){
        //console.log(this.state.email,this.state.password);
        let r = register(this.state);
        if(r) window.location.href='/';
    }

    render() {
        return (
            <Container>
                <Jumbotron>
                    <h1 style={{fontFamily: "'Anton',sans-serif"}}>Register</h1>
                    <h3>Enter your details</h3>
                </Jumbotron>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            Username
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        type="text"
                        onChange={this.userHandler}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            Email ID
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        type="email"
                        onChange={this.emailHandler}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            Password
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        type="password"
                        onChange={this.passwordHandler}
                    />
                </InputGroup>
                <Button onClick={this.submitHandler}>Submit</Button>
            </Container>
        );
    }
}

export default Register