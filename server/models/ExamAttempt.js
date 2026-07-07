const mongoose = require("mongoose");

const examAttemptSchema = new mongoose.Schema(

{

    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    testSnapshot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"TestSnapshot",
        required:true
    },

    startedAt:{
        type:Date,
        default:Date.now
    },

    submittedAt:{
        type:Date
    },

    status:{
        type:String,
        enum:[
            "in-progress",
            "submitted"
        ],
        default:"in-progress"
    },

    totalQuestions:{
        type:Number,
        default:0
    },

    totalMarks:{
        type:Number,
        default:0
    },

    obtainedMarks:{
        type:Number,
        default:0
    },

    percentage:{
        type:Number,
        default:0
    },

    timeTaken:{
        type:Number,
        default:0
    }

},

{
    timestamps:true
}

);

module.exports=mongoose.model(
    "ExamAttempt",
    examAttemptSchema
);