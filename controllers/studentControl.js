const participantModel = require("../Model/studentModel");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.signUp = async (req, res) => {
    try {
        //Get the required fields from the request object body
        const { fullName, email, password, stack, role } = req.body;

        //Make sure all required fields are present
        if (!fullName || !email || !password || !stack || !role) {
            return res.status(400).json({
                message: "Please provide all necessary information"
            })
        }
        //Check if the user is already existing in the database
        const checkUser = await participantModel.findOne({ email: email.toLowerCase() })
        if (checkUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        //Encrypt the user's password
        const salt = bcrypt.genSaltSync(12);
        const hashedPassword = bcrypt.hashSync(password, salt);

        //Use the role to determine an administrator
        let admin;

        if (role === 'Teacher') {
            admin = true
        }
        else {
            admin = false;
        }

        //Create a  new user 
        const user = new participantModel({
            fullName,
            email,
            stack,
            role,
            password: hashedPassword,
            isAdmin: admin
        })

        //Make sure to save the user data to the database
        await user.save();

        res.status(201).json({
            data: user
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        //Get the user's login details

        const { email, password } = req.body;

        //Make sure both fields are valid
        if (!email || !password) {
            return res.status(400).json({
                message: "Fields cannot be empty"
            })
        }
        //Find the user in the database
        const checkEmail = await participantModel.findOne({ email: email.toLowerCase() })

        // Check if the user is not existing and return a response
        if (!checkEmail) {
            return res.status(404).json({
                message: "User does not exist"
            })
        }
        //Verify the user's password
        const checkPassword = bcrypt.compareSync(password, checkEmail.password);
        if (!checkPassword) {
            return res.status(400).json({
                message: "Password is incorrect"
            })
        }
        const token = jwt.sign({
            userId: checkEmail._id,
            fullName: checkEmail.fullName,
            email: checkEmail.email,
            admin: checkEmail.isAdmin,
        }, process.env.SECRET, { expiresIn: "1 day" })

        //Return a success response

        res.status(201).json({
            message: "User successfully logged in",
            token: token
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
exports.createAdmin = async (req, res) => {
    try {
        const admin = await participantModel.create;
        if (!admin) {
            res.status(400).json({
                message: "Failed to create Admin"
            })
        }
        else {
            res.status(201).json({
                message: "Admin created successfully",
                admin
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.makeAdmin = async (req, res, next) => {
    try {
        const participantId = req.params.adminId
        const participant = await participantModel.findById(participantId)

        const adminData = await participantModel.findByIdAndUpdate(participantId, { isAdmin: true }, { new: true })
        if (!participant) {
            return res.status(400).json({
                message: `Admin with id ${participantId} does not exist`
            })
        }
        else {
            return res.status(201).json({
                message: `Admin with id ${participantId} updated as an Admin`,
                data: adminData

            })
        }

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

}


exports.createParticipant = async (req, res) => {
    try {
        const participant = await participantModel.create(req.body);
        if (!participant) {
            res.status(400).json({
                message: "Failed to create participant"
            })
        }
        else {
            res.status(201).json({
                message: "Participant created successfully",
                participant
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
exports.getAll = async (req, res) => {
    try {
        const user = await participantModel.find().sort({createdAt: -1});
        if (user.length === 0) {
           return res.status(200).json({
                message: "There are currently no participants in the database."
            })
        }else {
            res.status(200).json({
                message: "Participants fetched successfully",
                totalNumberOfParticipants: user.length,
                data: user
            })
        }

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
exports.getOne = async (req, res) => {
    try {
        const participantId = req.params.participantId
        const participant = await participantModel.findById(participantId);
        if (!participant) {
            res.status(404).json({
                message: "Failed to get participant"
            })
        }
        else {
            res.status(201).json({
                message: "Participant fetched successfully",
                data: participant
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
}
exports.scoreUpdate= async (req, res) => {
    try {
        const participantId = req.params.participantId;
        const {html, css, javaScript, node} = req.body.score;
        const participant = await participantModel.findById(req.params.participantId)
        if (!participant) {
            return res.status(400).json({
                message: `Participant with id ${participantId} does not exist`
            })
        }
        const participantData = {
            score:{
                html,
                node,
                javaScript,
                css,
            }
            
        };


        const updatedData = await participantModel.findByIdAndUpdate(
            participantId,
            participantData,
            { new: true });



        res.status(201).json({
            message: `Participant with id ${participantId} updated`,
            data: updatedData

        })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })

    }
}
exports.deleteParticipant = async (req, res) => {
    try {
        const participantId = req.params.participantId;
        const participant = await participantModel.findById(req.params.participantId)

        if (!participant) {
            res.status(404).json({
                message: `Participant with id ${participantId} does not exist`
            });
        }
        else {
            await participantModel.findByIdAndDelete(participantId);
            res.status(201).json({
                message: `Participant with id ${participantId} deleted`
            });
        }


    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
exports.getResult = async (req, res) => {
    try{
        const participantId = req.params.participantId
        const score = await participantModel.findById(participantId);
        if (!score){
            return res.status(404).json({
                message: "Participant score not found"
            });
        }
        else {
            return res.status(200).json({
                message: "Participant score successfully retrieved",
                data: score
            })
        }


    }catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}
exports.logOut = async(req, res) =>{
    try{
        //Get the user's Id from the request user payload
        const {userId} = req.user
        //
        const hasAuthorization = req.headers.authorization;
        //check if it is empty
        if (!hasAuthorization){
            return res.status(401).json({message: "Authorization token not found"})
        }
        //Split the token from the bearer
        const token = hasAuthorization.split(" ")[1];

        const user= await participantModel.findById(userId);

        //check if the user does not exist
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        //Blacklist the token
        user.blacklist.push(token);

        await user.save();

        //Return a response

        res.status(200).json({message: "User logged out successfully"})

    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


