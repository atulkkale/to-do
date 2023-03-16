const router = require('express').Router();
const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const {
  createTask,
  updateTask,
  getTasks,
  rearrangeTasks,
  deleteTask,
} = require('../controllers/taskController');

router.post('/create', cookieJwtAuth, createTask);
router.patch('/update/:id', cookieJwtAuth, updateTask);
router.get('/list', cookieJwtAuth, getTasks);
router.patch('/rearrange', cookieJwtAuth, rearrangeTasks);
router.delete('/delete/:id', cookieJwtAuth, deleteTask);

module.exports = router;
