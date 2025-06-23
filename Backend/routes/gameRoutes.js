const express = require("express");
const router = express.Router();
const {
  startGame,
  submitAnswer,
  endGame,
} = require("../controllers/gameController");

router.post("/start", startGame);
router.post("/:id/submit", submitAnswer);
router.get("/:id/end", endGame);

module.exports = router;
