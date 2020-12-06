import './App.css';
import React, { useCallback } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './views/Login'
import Register from './views/Register'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import Home from './views/Home'
import Team from './views/Team'

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button'


import './fonts.css'

const { auth, login } = require('./services/Auth')
const {createTeam, joinTeam_1} = require('./services/Teams')
var new_team_ref;
var join_team_ref;

async function createNewTeam(){
  //console.log(new_team_ref.value);
  let r = await createTeam(new_team_ref.value)
  window.location.href = '/';
}
async function joinTeam(){
  console.log(join_team_ref.value);
  let r = await joinTeam_1(join_team_ref.value)
  window.location.href = '/';
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      logged_in: 0,
      data: {}
    }
    this.log_out = this.log_out.bind(this);
    this.log_in = this.log_in.bind(this);

    new_team_ref = null;
    join_team_ref = null;

  }
  async componentDidMount() {
    const auth_check = await auth();
    //console.log(auth_check);
    if (auth_check) this.setState({ logged_in: 1, data: auth_check });
  }

  async log_in() {
    const auth_check = await auth();
    if (auth_check) this.setState({ logged_in: 1, data: auth_check });
  }

  async log_out() {
    localStorage.removeItem('x-access-token');
    const auth_check = await auth();
    if (!auth_check) this.setState({ logged_in: 0, data: {} });
    window.location.href = "/";
  }

  newTeam_render() {
    return (
      <Container>
        <h2>Create a new team</h2>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Team Name"
            ref = {(el) => {new_team_ref = el}}
          />
        </InputGroup>
        <Button onClick={createNewTeam}>Done</Button>
      </Container>
    );
  }

  joinTeam_render() {
    return (
      <Container>
        <h2>Join a team</h2>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Team Number"
            ref = {(el) => {join_team_ref = el}}
          />
        </InputGroup>
        <Button onClick={joinTeam}>Done</Button>
      </Container>
    );
  }

  authentication() {
    return (
      <Router>
        <Navbar bg="light" variant="light">
          <Navbar.Brand style={{fontFamily: "'Pacifico', cursive"}} href='/'>Project Manager</Navbar.Brand>
          <Nav className='mr-auto'>
            <Nav.Link href="/">Login</Nav.Link>
            <Nav.Link href="/register">Signup</Nav.Link>
          </Nav>
        </Navbar>
        <Route path="/" exact render={(props) => <Login login_func={this.log_in} {...props} />} />
        <Route path="/register" exact render={(props) => <Register login_func={this.log_in} {...props} />} />
      </Router>
    );
  }

  home() {
    return (
      <Router>
        <Navbar bg="light" variant="light">
          <Navbar.Brand style={{fontFamily: "'Pacifico', cursive"}} href='/'>Project Manager</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/new_team">New Team</Nav.Link>
            <Nav.Link href="/join_team">Join Team</Nav.Link>
            <Nav.Link onClick={this.log_out} style={{color:"red"}}>{this.state.data.email}(Click to Logout)</Nav.Link>
            </Nav>
        </Navbar>
        <Route path='/' exact component={Home} />
        <Route path='/new_team' exact render={this.newTeam_render} />
        <Route path='/join_team' exact render={this.joinTeam_render} />
        <Route path='/team/:teamNumber' exact component = {Team}/>

      </Router>
    )
  }

  render() {
    return this.state.logged_in ? this.home() : this.authentication();
  }
}

export default App;