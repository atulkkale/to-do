const router = require('express').Router();
const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const {
  createTask,
  updateTask,
  getTasks,
  rearrangeTasks,
} = require('../controllers/taskController');

router.post('/create', cookieJwtAuth, createTask);
router.patch('/update/:id', updateTask);
router.get('/list', getTasks);
router.post('/rearrange', rearrangeTasks);

module.exports = router;
