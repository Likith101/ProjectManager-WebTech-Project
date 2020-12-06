const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    teamNumber: {
        type: String
    },
    taskName: {
        type: String
    },
    parent:{
        type: mongoose.Schema.Types.ObjectId
    },
    children: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    taskComments: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    taskStatus:{
        type: Number
    }
})

const CommentSchema = new mongoose.Schema({
    commentUser: {
        type: String,
    },
    commentText: {
        type: String,
    },
})

const Task = mongoose.model('Task', TaskSchema);
const Comment = mongoose.model('Comment', CommentSchema);

exports.Task = Task;
exports.Comment = Comment;
