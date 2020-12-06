import React from 'react';
import {Container, Jumbotron} from 'react-bootstrap';
import {Tasks, NewMainTask} from './Tasks'
import {teamData} from '../services/Teams';

class Team extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            teamName: "",
            teamNumber: "",
        }
        
        //this.maintask_ref = null;
        this.get_details = this.get_details.bind(this)
    }

    async get_details(){
        
        let res = await teamData(this.props.match.params.teamNumber);
        
        this.setState({
            teamName: res.teamName,
            teamNumber: res.teamNumber
        })
    }
    
    async componentDidMount() {
        await this.get_details();
    }

    render() {
        //return (<h1>Hello {this.props.match.params.teamNumber}</h1>);
        return (
                <Container>
                    <Jumbotron className="text-center">
                        <h3 style={{fontFamily:"'Anton',sans-serif"}}>{this.state.teamName}</h3>
                        <h5>{this.state.teamNumber}</h5>
                        <br></br>
                    </Jumbotron>
                    <Tasks teamNumber={this.props.match.params.teamNumber}/>
                </Container>
        );
    }
}

export default Team