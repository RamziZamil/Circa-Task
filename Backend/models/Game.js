const mongoose = require("mongoose");

const Question = new mongoose.Schema(
  {
    equation: String,
    correctAnswer: Number,
    playerAnswer: Number,
    timeTaken: Number,
    isCorrect: Boolean,
  },
  { _id: false }
);

const Game = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  difficulty: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  questions: [Question],
  currentQuestionIndex: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Game", Game);
