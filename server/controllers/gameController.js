const mongoose = require("mongoose");
const GameScore = require("../models/gameScore");
const axios = require("axios");

const gamesList = [
  {
    _id: "memory-match",
    gameName: "Memory Match",
    description: "Match pairs of cards to improve concentration and memory.",
    icon: "🧠",
    category: "Memory",
    difficulty: "Easy",
    bestScore: 1200,
  },
  {
    _id: "number-order",
    gameName: "Number Order",
    description: "Tap numbers in the correct ascending order.",
    icon: "🔢",
    category: "Focus",
    difficulty: "Easy",
    bestScore: 950,
  },
  {
    _id: "trivia-quiz",
    gameName: "Trivia Quiz",
    description: "Answer simple quiz questions and improve recall.",
    icon: "❓",
    category: "Quiz",
    difficulty: "Easy",
    bestScore: 1000,
  },
  {
    _id: "word-puzzle",
    gameName: "Word Puzzle",
    description: "Make correct words from shuffled letters.",
    icon: "🔤",
    category: "Language",
    difficulty: "Medium",
    bestScore: 1100,
  },
];

const getLoggedInUserId = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId;
};

exports.getGamesList = async (req, res) => {
  try {
    res.status(200).json(gamesList);
  } catch (error) {
    console.error("Error fetching games list:", error);
    res.status(500).json({ message: "Failed to fetch games list" });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = gamesList.find((g) => g._id === gameId);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error("Error fetching game details:", error);
    res.status(500).json({ message: "Failed to fetch game details" });
  }
};

exports.addGameScore = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);
    const { gameId, gameName, score } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!gameId || !gameName || score === undefined || score === null) {
      return res.status(400).json({
        message: "gameId, gameName and score are required",
      });
    }

    const newScore = await GameScore.create({
      userId,
      gameId,
      gameName,
      score,
      playedAt: new Date(),
    });

    res.status(201).json({
      message: "Game score saved successfully",
      gameScore: newScore,
    });
  } catch (error) {
    console.error("Error saving game score:", error);
    res.status(500).json({ message: "Failed to save game score" });
  }
};

exports.getGameHistory = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);
    const { elderId } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    let query = {};
    if (elderId) {
      query.userId = elderId;
    } else {
      // For family members, get game history for all their linked elders
      const User = require("../models/user");
      const user = await User.findById(userId);
      if (user.role === "family" && user.elderIds && user.elderIds.length > 0) {
        query.userId = { $in: user.elderIds };
      } else {
        query.userId = userId;
      }
    }

    const scores = await GameScore.find(query).sort({ playedAt: -1 });

    res.status(200).json(scores);
  } catch (error) {
    console.error("Error fetching game history:", error);
    res.status(500).json({ message: "Failed to fetch game history" });
  }
};

exports.getGameScoresByGameId = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);
    const { gameId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const scores = await GameScore.find({
      userId,
      gameId,
    }).sort({ score: -1, playedAt: -1 });

    res.status(200).json(scores);
  } catch (error) {
    console.error("Error fetching game scores:", error);
    res.status(500).json({ message: "Failed to fetch game scores" });
  }
};

exports.getMyBestScores = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const bestScores = await GameScore.aggregate([
      {
        $match: { userId: objectUserId },
      },
      {
        $group: {
          _id: "$gameId",
          gameName: { $first: "$gameName" },
          bestScore: { $max: "$score" },
          lastPlayedAt: { $max: "$playedAt" },
        },
      },
      {
        $sort: { gameName: 1 },
      },
    ]);

    res.status(200).json(bestScores);
  } catch (error) {
    console.error("Error fetching best scores:", error);
    res.status(500).json({ message: "Failed to fetch best scores" });
  }
};

exports.getTriviaQuestions = async (req, res) => {
  try {
    const response = await axios.get(
      "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple",
    );

    res.status(200).json(response.data.results || []);
  } catch (error) {
    console.error("Error fetching trivia questions:", error);

    const fallbackQuestions = [
      {
        question: "What color is the sky on a clear day?",
        correct_answer: "Blue",
        incorrect_answers: ["Green", "Red", "Yellow"],
      },
      {
        question: "How many days are there in a week?",
        correct_answer: "7",
        incorrect_answers: ["5", "6", "8"],
      },
      {
        question: "Which animal says meow?",
        correct_answer: "Cat",
        incorrect_answers: ["Dog", "Cow", "Goat"],
      },
      {
        question: "Which meal is usually eaten in the morning?",
        correct_answer: "Breakfast",
        incorrect_answers: ["Dinner", "Supper", "Snack"],
      },
      {
        question: "What do we use to see?",
        correct_answer: "Eyes",
        incorrect_answers: ["Hands", "Feet", "Ears"],
      },
    ];

    res.status(200).json(fallbackQuestions);
  }
};
