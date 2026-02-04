const Game = require("../models/game");

exports.addGameScore = async (req, res) => {
  try {
    const { gameName, score, remarks } = req.body;

    const game = await Game.create({
      user: req.user.id,
      gameName,
      score,
      remarks
    });

    res.status(201).json({
      message: "Game score saved successfully",
      game
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getGameHistory = async (req, res) => {
  try {
    let games;

    if (req.user.role === "elder") {
      games = await Game.find({ user: req.user.id }).sort({ createdAt: -1 });
    } else {
      games = await Game.find().populate("user", "name email");
    }

    res.status(200).json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
