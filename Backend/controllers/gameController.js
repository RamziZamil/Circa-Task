const Game = require("../models/Game");
const generateQuestion = require("../utils/generateQuestion");

exports.startGame = async (req, res) => {
  try {
    const { player, level } = req.body;

    if (!player || !level) {
      return res
        .status(400)
        .json({ message: "player and level are required." });
    }

    const { q, correct } = generateQuestion(level);

    const game = await Game.create({
      name: player,
      difficulty: level,
      questions: [{ equation: q, correctAnswer: correct }],
    });

    return res.status(201).json({
      message: `Hello ${player}, find your submit API URL below`,
      submit_url: `/game/${game._id}/submit`,
      question: q,
      time_started: game.startTime,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.submitAnswer = async (req, res) => {
  try {
    const gameId = req.params.id;
    const { answer } = req.body;

    if (answer === undefined) {
      return res.status(400).json({ message: "Answer is required." });
    }

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found." });
    if (!game.isActive)
      return res.status(400).json({ message: "Game has ended." });

    const currentIndex = game.currentQuestionIndex;
    const currentQuestion = game.questions[currentIndex];

    const now = new Date();
    const previousTime =
      currentIndex === 0
        ? game.startTime
        : game.questions[currentIndex - 1].timeTaken;
    const timeTaken = Math.round((now - new Date(game.startTime)) / 1000);

    const isCorrect =
      Number(answer.toFixed(2)) ===
      Number(currentQuestion.correctAnswer.toFixed(2));

    currentQuestion.playerAnswer = answer;
    currentQuestion.timeTaken = timeTaken;
    currentQuestion.isCorrect = isCorrect;

    const { q, correct } = generateQuestion(game.difficulty);
    game.questions.push({
      equation: q,
      correctAnswer: correct,
    });

    game.currentQuestionIndex += 1;
    await game.save();

    return res.status(200).json({
      result: isCorrect
        ? `Good job ${game.name}, your answer is correct!`
        : `Sorry ${game.name}, your answer is incorrect.`,
      time_taken: timeTaken,
      next_question: {
        submit_url: `/game/${game._id}/submit`,
        question: q,
      },
      current_score: `${game.questions.filter((q) => q.isCorrect).length} / ${
        game.currentQuestionIndex
      }`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};
exports.endGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found." });

    if (!game.isActive) {
      return res.status(200).json({ message: "Game already ended." });
    }

    game.isActive = false;

    const totalTime = game.questions.reduce(
      (sum, q) => sum + (q.timeTaken || 0),
      0
    );

    const correctAnswers = game.questions.filter(
      (q) => q.isCorrect && q.timeTaken != null
    );
    let best = null;
    if (correctAnswers.length > 0) {
      best = correctAnswers.reduce((min, q) =>
        q.timeTaken < min.timeTaken ? q : min
      );
    }

    await game.save();

    res.status(200).json({
      name: game.name,
      difficulty: game.difficulty,
      current_score: `${game.questions.filter((q) => q.isCorrect).length} / ${
        game.currentQuestionIndex
      }`,
      total_time_spent: totalTime + " seconds",
      best_score: best
        ? {
            question: best.equation,
            answer: best.correctAnswer,
            time_taken: best.timeTaken + " seconds",
          }
        : "No correct answers yet.",
      history: game.questions.map((q, i) => ({
        question: q.equation,
        correct_answer: q.correctAnswer,
        player_answer: q.playerAnswer,
        time_taken: q.timeTaken,
        is_correct: q.isCorrect,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};
