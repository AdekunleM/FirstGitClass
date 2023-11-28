const express = require('express');
const {createParticipant, getAll, getOne, updateParticipant, deleteParticipant}= require('../controllers/studentControl');

const router = express.Router();
router.post('/create', createParticipant);
router.get('/getall', getAll);
router.get('/getone/:participantId', getOne);
router.put('/update/:participantId', updateParticipant);
router.delete('/delete/:participantId', deleteParticipant);

module.exports = router;
