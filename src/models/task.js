const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
      lowercase: true,
    },
    taskDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    taskStatus: {
      type: String,
      enums: {
        values: ['completed', 'incomplete'],
      },
      default: 'incomplete',
      lowercase: true,
      required: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
