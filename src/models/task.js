const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  taskData: {
    type: String,
    required: true,
  },
  taskStatus: {
    type: String,
    enums: {
      values: ['completed', 'incomplete'],
    },
  },
  order: {
    type: Number,
    required: true,
  },
  taskOwner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('Task', taskSchema);
