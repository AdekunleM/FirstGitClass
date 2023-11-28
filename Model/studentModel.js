const mongoose = require('mongoose');
// create a schema object from mongoose object
const participantSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      stack: {
        type: String,
        required: true,
      },
      score:{
        html:{
            type: String,
            required: true,
        },
        css:{
            type: String,
            required: true,
        },
        javascript:{
            type: String,
            required: true,
        }
        
      }
    },
    { timestamps: true }
  );
  
  // create a model object from our schema
  const participantModel = mongoose.model("particpants", participantSchema);
  
  // export the model
  module.exports = participantModel;