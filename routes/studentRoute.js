const express = require('express');
const { signUp, login, createParticipant, getAll, getOne, scoreUpdate, deleteParticipant, makeAdmin, createAdmin, logOut, getResult, } = require('../controllers/studentControl');
const {authenticate, admin} = require('../middleware/authorization');

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.post('/create', createParticipant);
router.get('/getall', admin, getAll);
router.get('/getone/:participantId', admin, getOne);
router.put('/update/:participantId', admin, authenticate, scoreUpdate);
router.delete('/delete/:participantId', admin, deleteParticipant);
router.put("/admin/:adminId", admin, makeAdmin);
router.post("/admin", admin, createAdmin);
router.post("/logout", authenticate, logOut);
router.get("/result/:participantId",  getResult)

module.exports = router;
