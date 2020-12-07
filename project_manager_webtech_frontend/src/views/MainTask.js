import React from 'react'
import { Card, InputGroup, FormControl, Button, ButtonGroup } from 'react-bootstrap'
import { loadST, renameT, createST, deleteST, updateST } from '../services/Task'

import '../fonts.css'

class MainTask extends React.Component {

    constructor(props) {
        super(props)

        this.comments = []
        this.tasks = []
        this.tkey = ""
        this.name = ""
        this.comp = 0
        this.color = ""

        this.state = {
            Id: this.props.taskId,
            Name: "",
            pDisplay: "block",
            formDisplay: "none",
            sDisplay: "none",
            minDisplay: "none",
            maxDisplay: "none",
            comDisplay: "block",
            uncomDisplay: "none",
            Comments: this.comments,
            Tasks: this.tasks,
            Completed : 0,
            bgColor: "#FF0000"
        }

        this.deleteTask = this.deleteTask.bind(this)
        this.editName = this.editName.bind(this)
        this.editNameSubmit = this.editNameSubmit.bind(this)
        this.editNameChange = this.editNameChange.bind(this)
        this.editNameKeyPress = this.editNameKeyPress.bind(this)
        this.editFormSubmit = this.editFormSubmit.bind(this)
        this.newComment = this.newComment.bind(this)
        this.newSubTask = this.newSubTask.bind(this)
        this.minimiseSubTasks = this.minimiseSubTasks.bind(this)
        this.maximiseSubTasks = this.maximiseSubTasks.bind(this)
        this.deleteSubTask = this.deleteSubTask.bind(this)
        this.reload = this.reload.bind(this)
        this.completed = this.completed.bind(this)
        this.uncompleted = this.uncompleted.bind(this)
        this.complete = this.complete.bind(this)
        this.colorHex = this.colorHex.bind(this)
    }

    async componentDidMount() {
        
        var temp = await loadST(this.props.taskId)
        this.tasks = temp.children
        this.name = temp.taskName
        this.comp = temp.taskStatus
        this.colorHex(this.comp)

        if(this.tasks.length === 0)
        {
            if(this.comp === 100)
            {
                this.setState({
                    Name : this.name,
                    comDisplay: "none",
                    uncomDisplay: "block"
                })
            }
            else
            {
                this.setState({
                    Name : this.name,
                    comDisplay: "block",
                    uncomDisplay: "none"
                })
            }
        }
        else
        {
            this.setState({
                Name : this.name,
                sDisplay : "block",
                minDisplay : "block",
                comDisplay: "none",
                uncomDisplay: "none",
                Tasks : this.tasks,
            })
        }

        this.interval = setInterval(() => this.reload(), 30000)
    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async reload() {

        var temp = await loadST(this.props.taskId)
        this.tasks = temp.children
        this.name = temp.taskName

        var temp = await loadST(this.props.taskId)
        this.tasks = temp.children
        this.name = temp.taskName
        
        var temp1 = "none"
        if(this.state.pDisplay !== temp1)
        {
            this.setState ({
                Name : this.name,
                Tasks : this.tasks
            })
        }
    }

    async completed() {

        this.comp = 100
        await updateST(this.props.taskId, this.comp)
        this.colorHex(this.comp)

        this.setState({
            comDisplay: "none",
            uncomDisplay: "block",
            Completed: this.comp
        })

        this.props.completechange()
    }

    async uncompleted() {

        this.comp = 0
        await updateST(this.props.taskId, this.comp)
        this.colorHex(this.comp)

        this.setState({
            comDisplay: "block",
            uncomDisplay: "none",
            Completed: this.comp
        })

        this.props.completechange()
    }

    async complete() {

        this.comp = 0

        for (var i = 0; i < this.tasks.length; i++) {
            var temp = await loadST(this.tasks[i])

            this.comp = this.comp + temp.taskStatus
            console.log(this.comp)
        }

        this.comp = this.comp / this.tasks.length

        await updateST(this.props.taskId, this.comp)
        this.colorHex(this.comp)

        if (this.comp === 100) {
            if (this.tasks.length === 0) {
                this.setState({
                    comDisplay: "none",
                    uncomDisplay: "block",
                    Completed: this.comp
                })
            }
            else {
                this.setState({
                    comDisplay: "none",
                    uncomDisplay: "none",
                    Completed: this.comp
                })
            }
        }
        else {
            if (this.tasks.length === 0) {
                this.setState({
                    comDisplay: "block",
                    uncomDisplay: "none",
                    Completed: this.comp
                })
            }
            else {
                this.setState({
                    comDisplay: "none",
                    uncomDisplay: "none",
                    Completed: this.comp
                })
            }
        }

        this.props.completechange()
    }

    async colorHex(value) {

        var r, g, b = 0

        if (value < 50) {
            r = 255
            g = Math.round(5.1 * value)
        }
        else {
            g = 255
            r = Math.round(510 - 5.10 * value)
        }
        var h = r * 0x10000 + g * 0x100 + b * 0x1

        this.color = '#' + ('000000' + h.toString(16)).slice(-6)

        this.setState({
            bgColor: this.color
        })
    }

    deleteTask() {
        this.props.deleteTask(this.props.taskId)
    }

    editName() {
        this.setState((prev) => ({
            Name: prev.Name,
            pDisplay: "none",
            formDisplay: "block",
        }))
    }

    editNameChange(event) {
        this.setState({
            Name: event.target.value,
        })
    }

    async editNameKeyPress(event) {

        if (event.key === "Enter") {
            await renameT(this.props.taskId, this.state.Name)

            this.setState({
                pDisplay: "block",
                formDisplay: "none"
            })
        }
    }

    async editNameSubmit() {

        await renameT(this.props.taskId, this.state.Name)

        this.setState({
            pDisplay: "block",
            formDisplay: "none"
        })
    }

    editFormSubmit() {
        return false
    }

    newComment() {

    }

    async newSubTask() {

        this.tkey = await createST(this.props.taskId)
        this.tasks.push(this.tkey)

        this.setState({
            sDisplay: "block",
            minDisplay: "block",
            maxDisplay: "none",
            comDisplay: "none",
            uncomDisplay: "none",
            Tasks: this.tasks
        })

        this.complete()
    }

    minimiseSubTasks() {

        this.setState({
            sDisplay: "none",
            minDisplay: "none",
            maxDisplay: "block"
        })
    }

    maximiseSubTasks() {

        this.setState({
            sDisplay: "block",
            minDisplay: "block",
            maxDisplay: "none"
        })
    }

    async deleteSubTask(key) {

        var ref = []

        for(var i = 0; i < this.tasks.length; i++)
        {
            if(this.tasks[i] !== key)
            {
                ref.push(this.tasks[i])
            }
            else
            {
                await deleteST(this.tasks[i])
            }
        }

        this.tasks = ref

        if(this.tasks.length === 0)
        {
            if(this.comp === 100)
            {
                this.setState({
                    sDisplay : "none",
                    minDisplay : "none",
                    comDisplay : "none",
                    uncomDisplay : "block",
                    Tasks: this.tasks
                })
            }
            else
            {
                this.setState({
                    sDisplay : "none",
                    minDisplay : "none",
                    comDisplay : "block",
                    uncomDisplay : "none",
                    Tasks: this.tasks
                })
            }
        }
        else
        {
            this.setState ({
                Tasks : this.tasks
            })
        }

        this.complete()
    }

    render() {
        return (
            <div>
                <Card style={{ marginBottom: 20, marginLeft: this.props.pad, marginTop: 20 }}>
                    <Card.Header style={{ backgroundColor: this.state.bgColor }}></Card.Header>
                    <Card.Body>
                        <Card.Title style={{ display: this.state.pDisplay, fontFamily: "'Castoro', serif" }}>
                            {this.state.Name}
                        </Card.Title>
                        <InputGroup className="mb-3">
                            <FormControl
                                type="text"
                                value={this.state.Name}
                                onChange={this.editNameChange}
                                onKeyPress={this.editNameKeyPress}
                                style={{ display: this.state.formDisplay }}
                            >
                            </FormControl>
                        </InputGroup>
                        <Button variant="success" onClick={this.editNameSubmit} style={{ display: this.state.formDisplay, fontFamily: "'Roboto Mono', monospace" }}><img className="Icons" src={process.env.PUBLIC_URL+'/Submit.png'} alt=""></img>Submit</Button>
                    </Card.Body>
                    <Card.Footer>
                        <ButtonGroup className="mb-2">
                            <Button variant="danger" onClick={this.deleteTask} style={{ fontFamily: "'Roboto Mono', monospace" }}><img className="Icons"src={process.env.PUBLIC_URL+'/Delete.png'} alt=""></img>Delete</Button>
                            <Button variant="dark" onClick={this.minimiseSubTasks} style={{ display: this.state.minDisplay, fontFamily: "'Roboto Mono', monospace" }}><img className="Icons" src={process.env.PUBLIC_URL+'/Minimise.png'} alt=""></img>Hide Tasks</Button>
                            <Button variant="dark" onClick={this.maximiseSubTasks} style={{ display: this.state.maxDisplay, fontFamily: "'Roboto Mono', monospace" }}><img className="Icons" src={process.env.PUBLIC_URL+'/Maximise.png'} alt=""></img>Show Tasks</Button>
                            <Button variant="dark" onClick={this.editName} style={{ display: this.state.pDisplay, fontFamily: "'Roboto Mono', monospace" }}><img className="Icons" src={process.env.PUBLIC_URL+'/Edit.png'} alt=""></img>Edit Task</Button>
                            <Button variant="primary" onClick={this.completed} style={{display: this.state.comDisplay, fontFamily:"'Roboto Mono',monospace"}}><img className="Icons" src={process.env.PUBLIC_URL+'/Completed.png'} alt=""></img>Complete</Button>
                            <Button variant="primary" onClick={this.uncompleted} style={{display: this.state.uncomDisplay, fontFamily:"'Roboto Mono', monospace"}}><img className="Icons" src={process.env.PUBLIC_URL+'/Uncompleted.png'} alt=""></img>Not Complete</Button>
                            <Button variant="success" onClick={this.newSubTask} style={{ fontFamily: "'Roboto Mono', monospace" }}><img className="Icons" src={process.env.PUBLIC_URL+'/Add.png'} alt=""></img>Add Subtask</Button>
                        </ButtonGroup>
                    </Card.Footer>
                </Card>
                <div style={{ display: this.state.sDisplay }}>
                    {this.tasks.map((tkey) => <MainTask key={tkey} taskId={tkey} teamNumber={this.props.teamNumber} deleteTask={this.deleteSubTask} pad={this.props.pad + 40} completechange={this.complete}/>)}
                </div>
            </div>
        )
    }
}

export default MainTask