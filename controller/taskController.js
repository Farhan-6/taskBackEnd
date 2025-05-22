const authMiddleWare = require("../middleware/authMiddleWare")
const {addTask, editTask, getTask, deleteTask} = require("../services/taskService")
const router = require("express").Router()

router.post('/addTask', authMiddleWare, addTask)
router.put('/editTask/:id', authMiddleWare, editTask)
router.get('/getTask/:id', authMiddleWare, getTask)
router.delete('/deleteTask/:id', authMiddleWare, deleteTask)

module.exports = router