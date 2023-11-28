const participantModel = require("../Model/studentModel");


exports.createParticipant= async (req, res)=>{
    try{
        const participant= await participantModel.create(req.body);
        if (!participant){
            res.status(400).json({
                message: "Failed to create participant"
            })}
            else{
                res.status(201).json({
                    message: "Participant created successfully",
                    participant
                })
            }
        } catch (err){
        res.status(500).json({
            message: err.message
        })
    }
}
exports.getAll = async (req, res) => {
    try{
        const participant = await participantModel.find();
        if (!participant){
            res.status(400).json({
                message: "Failed to get participants"
            })
        }
        else {
            res.status(201).json({
                message: "Participants fetched successfully",
                totalNumberOfParticipants: participant.length,
                data:participant
            })
        }

    }catch (err){
        res.status (500).json({
            message:err.message
        })
    }
}
exports.getOne = async (req, res)=>{
    try{
        const participantId = req.params.participantId
        const participant = await participantModel.findById(participantId);
        if (!participant){
            res.status(404).json({
                message: "Failed to get participant"
            })
        }
        else {
            res.status(201).json({
                message: "Participant fetched successfully",
                data:participant
            })
        }
    }catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
}
exports.updateParticipant = async (req, res)=>{
    try{
        const participantId = req.params.participantId;
        const participant = await participantModel.findById(req.params.participantId)
        const participantData= {
            name:req.body.name || participant.name,
            stack: req.body.stack || participant.stack,
            score: req.body.score || participant.score
          }
        const updatedData = await participantModel.findByIdAndUpdate(participantId, participantData, {new: true});
        if (!participant){
            res.status(400).json({
                message: `Trainee with id ${participantId} does not exist`
            })
        }
        else {
            res.status(201).json({
                message:  `Trainee with id ${participantId} updated`,
                data:updatedData

            })
        }

    }catch(err){
        res.status(500).json({
            message: err.message
        })

    }
}
exports.deleteParticipant = async (req, res)=>{
    try{
        const participantId = req.params.participantId;
        const participant = await participantModel.findById(req.params.participantId)
    
        if (!participant) {
            res.status(404).json({
              message: `Participant with id ${participantId} does not exist`
            });
          }
          else{
            await participantModel.findByIdAndDelete(participantId);
            res.status(201).json({
              message: `Participant with id ${participantId} deleted`
            });
          }
      

    }catch (err){
        res.status(500).json({
            message: err.message
        })
    }
}

