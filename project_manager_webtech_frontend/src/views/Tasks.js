import React from 'react'
import MainTask from './MainTask'
//import '../Tasks.css'
import '../fonts.css'

import {loadT, createT, deleteT} from '../services/Task'
import { Button } from 'react-bootstrap'

class NewMainTask extends React.Component {
    
    constructor(props) {
        super(props)

        this.newTask = this.newTask.bind(this)
    }

    newTask() {
        this.props.newTask()
    }

    render() {
        return (
            <div className="TNew">
                <Button variant = "success" onClick={this.newTask} style={{fontFamily: "'Roboto Mono', monospace"}}>Add new main task to project</Button>
            </div>
        )
    }
}

class Tasks extends React.Component {
    
    constructor(props) {
        super(props)

        this.tasks = []
        this.tkey = ""
        
        this.state = {
            keys : this.tasks
        }

        this.newTask = this.newTask.bind(this)
        this.deleteTask = this.deleteTask.bind(this)
        this.reload = this.reload.bind(this)
        this.complete = this.complete.bind(this)
    }

    async componentDidMount() {
        
        var temp = await loadT(this.props.teamNumber)
        this.tasks = temp.tasks

        if(this.tasks.length === 0)
        {
            this.tkey = await createT(this.props.teamNumber)
            this.tasks.push(this.tkey)
        }

        this.setState ({
            keys : this.tasks
        })

        this.interval = setInterval(() => this.reload(), 60000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async reload() {
        
        var temp = await loadT(this.props.teamNumber)
        this.tasks = temp.tasks

        this.setState ({
            keys : this.tasks
        })
    }

    async newTask() {
        
        this.tkey = await createT(this.props.teamNumber)
        this.tasks.push(this.tkey)

        this.setState ({
            keys : this.tasks
        })
    }

    async deleteTask(key) {

        var ref = []

        for(var i = 0; i < this.tasks.length; i++)
        {
            if(this.tasks[i] !== key)
            {
                ref.push(this.tasks[i])
            }
            else
            {
                await deleteT(key)
            }
        }

        this.tasks = ref

        this.setState ({
            keys : this.tasks
        })
    }

    async complete(){

    }

    render() {
        return (
            <div id="Tasks">
                <NewMainTask newTask = {this.newTask}/>
                {this.tasks.map((tkey) => <MainTask key={tkey} taskId={tkey} teamNumber={this.props.teamNumber} deleteTask = {this.deleteTask} pad={0} completechange={this.complete}/>)}
            </div>
        )
    }
}

export {Tasks}
export {NewMainTask}
