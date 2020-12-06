import React from 'react'
import { Card, InputGroup } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'
import { Route, Switch } from 'react-router-dom'
import FormControl from 'react'

import '../fonts.css'

const { getTeams } = require('../services/Teams')

class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            teams: []
        }
    }

    generateList(data) {
        return (
            <Card className="text-center" key={data.teamNumber} style={{margin: "20px"}} bg="light" text="dark">
                <Card.Body>
                <Card.Title style={{fontFamily: "'Castoro',serif"}}><b>{data.teamName}</b></Card.Title>
                <Button variant="success" href={`/team/${data.teamNumber}`}>Open</Button>
                </Card.Body>
                <Card.Footer><span style={{fontFamily: "'Anton',sans-serif"}}>Invite Code</span><br></br>{data.teamNumber}</Card.Footer>
            </Card>
        );
    }

    async componentDidMount() {
        let res = await getTeams();
        this.setState({ teams: res })
    }

    render() {
        return (
            <Container>
                <Jumbotron className="text-center">
                    <h1 style={{fontFamily: "\'Anton\',sans-serif"}}>Your teams</h1>
                </Jumbotron>
                {this.state.teams.map(data=>this.generateList(data))}
            </Container>
        );
    }
}

export default Home;