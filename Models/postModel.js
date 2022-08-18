const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userID: {
        type: String,
        ref: "User"
    },
    states: {
        type: Number,
        enum: [0,1, 2, 3],
        default: 1
    }
    ,
    description: {
        type: String,
        default: ""
    },
    files: {
        type: Array,
        default: []
    },
    timeOfPost: {
        type: String,
        // required: true,
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    },
    shares: {
        type: Array,
        default: []
    }
}, { timestamps: true }
);

const postModel = new mongoose.model('Post', postSchema);
module.exports = postModel;
