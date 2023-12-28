const mongoose = require('mongoose');
// create a schema object from mongoose object
const participantSchema = new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
      stack: {
        type: String,
        enum: ['Frontend', 'Backend'],
        required: true,
      },
      email:{
        type: String,
        unique: true,
        required: true,
      },
      password:{
        type: String,
        required: true,
      },
      score:{
        html:{
            type: Number,
            
        },
        css:{
            type: Number,
            
        },
        javaScript:{
            type: Number,
            
        },
        node:{
          type: Number,
        }
      },
      role:{
        type: String,
        enum: ['Teacher', 'Student'],
        required: true,
      },
      isAdmin:{
        type: Boolean,
        // default : false,
      },
      blacklist:{
        type: Array,
        default:[]
      },
    },
    { timestamps: true }
  );
  
  // create a model object from our schema
  const participantModel = mongoose.model("particpants", participantSchema);
  
  // export the model
  module.exports = participantModel;