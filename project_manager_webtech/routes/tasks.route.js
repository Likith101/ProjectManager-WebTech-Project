const { User } = require('../models/user.model')
const { Team } = require('../models/teams.model')
const auth = require('../middleware/auth')
const { Task, Comment } = require('../models/tasks.model')
const express = require('express')
const router = express.Router()

router.get('/:teamNumber/loadT', auth, async (req, res) => {

    let user = await User.findById(req.user._id)

    if (!user) {
        return res.status(401).send()
    }

    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({
            teamNumber: req.params.teamNumber
        })

        if (!team) {
            return res.status(404).send("Team not found")
        }

        return res.status(200).json(team)
    }
    else {
        return res.status(401).send()
    }
})

router.get('/:taskId/loadST', auth, async (req, res) => {

    let user = await User.findById(req.user._id)

    if (!user) {
        return res.status(401).send()
    }

    let task = await Task.findById(req.params.taskId)

    if (!task) {
        return res.status(404).send("Task not found")
    }
    else {
        return res.status(200).json(task)
    }
})

router.get('/:teamNumber/createT', auth, async (req, res) => {

    let user = await User.findById(req.user._id)

    if (!user) {
        return res.status(401).send()
    }

    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({
            teamNumber: req.params.teamNumber
        })

        if (!team) {
            return res.status(404).send("Team not found")
        }

        let task = new Task({
            teamNumber: req.params.teamNumber,
            taskName: "New Task",
            children: [],
            parent: null,
            taskComments: [],
            taskStatus: 0
        })

        await task.save()
        team.tasks.push(task._id)
        await team.save()
        return res.status(200).json(task._id)
    }
    else {
        return res.status(401).send()
    }
})

router.get('/:taskId/createST', auth, async (req, res) => {

    let user = await User.findById(req.user._id)

    if (!user) {
        return res.status(401).send()
    }

    let ptask = await Task.findById(req.params.taskId)

    if (!ptask) {
        return res.status(404).send("Task not found")
    }

    let task = new Task({
        teamNumber: ptask.teamNumber,
        taskName: "New Task",
        children: [],
        parent: ptask._id,
        taskComments: [],
        taskStatus: 0
    })

    await task.save()
    ptask.children.push(task._id)
    await ptask.save()

    return res.status(200).json(task._id)
})

router.delete('/:taskId/deleteT', auth, async (req, res) => {

    let user = await User.findById(req.user._id)

    if (!user) {
        return res.status(401).send()
    }

    let task = await Task.findById(req.params.taskId)

    if (!task) {
        return res.status(404).send("Task not found")
    }

    let team = await Team.findOne({
        teamNumber: task.teamNumber
    })

    if (!team) {
        return res.status(404).send("Team not found")
    }

    let index = team.tasks.indexOf(task._id)

    await deleteTasks(task._id)

    if (index > -1) {
        team.tasks.splice(index, 1)
    }

    await team.save()

    return res.status(200).send()
})

router.delete('/:taskId/deleteST', auth, async (req, res) => {

    let user = await User.findById(req.user._id)

    if (!user) {
        return res.status(401).send()
    }

    let task = await Task.findById(req.params.taskId)

    if (!task) {
        return res.status(404).send("Task not found")
    }

    let ptask = await Task.findById(task.parent)

    if (!ptask) {
        return res.status(404).send("Parent task not found")
    }

    let index = ptask.children.indexOf(task._id)

    await deleteTasks(task._id)

    if (index > -1) {
        ptask.children.splice(index, 1)
    }

    await ptask.save()

    return res.status(200).send()
})

router.post('/:taskId/:taskName/renameT', auth, async (req, res) => {

    let user = await User.findById(req.user._id)

    if (!user) {
        return res.status(401).send()
    }

    let task = await Task.findById(req.params.taskId)

    if (!task) {
        return res.status(404).send("Task not found")
    }

    task.taskName = req.params.taskName
    await task.save()

    return res.status(200).send()
})

router.post('/:taskId/:taskStatus/updateST', auth, async (req, res) => {

    let user = await User.findById(req.user._id)

    if (!user) {
        return res.status(401).send()
    }

    let task = await Task.findById(req.params.taskId)

    if (!task) {
        return res.status(404).send("Task not found")
    }

    if (!isNaN(parseFloat(req.params.taskId))) {
        task.taskStatus = req.params.taskStatus
        await task.save()
    }

    return res.status(200).send()
})

async function deleteTasks(taskID) {
    let task = await Task.findById(taskID);

    if (!task) {
        return 0;
    }

    for (var i in task.children) {
        await deleteTasks(task.children[i]);
    }

    await Task.findOneAndDelete({
        _id: task._id
    })
}

module.exports = router

/*router.delete('/:teamNumber/:taskID/delete_main_task', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if (!task) return res.status(404).send("Task not found")
        let index = team.tasks.indexOf(task._id);
        await recursive_deletion(task._id);
        //let index = team.tasks.indexOf(req.params.taskID)
        if(index > -1) team.tasks.splice(index,1)
        await team.save();
        return res.status(200).send();
    } else return res.status(401).send();
})
router.get('/:teamNumber/:taskID/details', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if (!task) return res.status(404).send("Task not found")
        return res.status(200).json(task)
    } else return res.status(401).send();
})
const router = express.Router();

router.post('/:teamNumber/createMainTask', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber });
        if (!team) return res.status(404).send("Team not found")
        let task = new Task({
            taskName: req.body.taskName,
            children: [],
            taskComments: [],
            parent_task: null
        });
        await task.save();
        team.tasks.push(task._id);
        await team.save();
        return res.status(200).json(task);
    }
    else return res.status(401).send();
})

router.post('/:teamNumber/:taskID/createSubTask', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let parent_task = await Task.findById(req.params.taskID);
        if (!parent_task) return res.status(404).send("Task not found");
        let task = new Task({
            taskName: req.body.taskName,
            children: [],
            taskComments: [],
            parent_task: parent_task._id
        });
        await task.save();
        parent_task.children.push(task._id);
        await parent_task.save();
        return res.status(200).send(task);
    } else return res.status(401).send();
})
router.post('/:teamNumber/:taskID/rename', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if (!task) return res.status(404).send("Task not found")
        task.taskName = req.body.taskName;
        await task.save();
        return res.status(200).send();
    } else return res.status(401).send();
})

router.delete('/:teamNumber/:taskID/delete_sub_task', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if (!task) return res.status(404).send("Task not found")
        let parent_task = await Task.findById(task.parent_task);
        if(!parent_task) res.status(404).send("Parent task does not exist")
        let index = parent_task.children.indexOf(task._id);
        await recursive_deletion(task._id);
        //let index = parent_task.children.indexOf(req.params.taskID)
        if(index > -1) parent_task.children.splice(index,1)
        await parent_task.save();
        return res.status(200).send();
    } else return res.status(401).send();
})

router.put('/:teamNumber/:taskID/:status', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if (!task) return res.status(404).send("Task not found")
        task.taskStatus = parseInt(req.params.status);
        await task.save();
        return res.status(200).send();
    } else return res.status(401).send();
})*/