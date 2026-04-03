const gamesData = [
  {
    _id: "memory-match",
    gameName: "Memory Match",
    description: "Match pairs of cards to improve concentration and memory.",
    icon: "🧠",
    category: "Memory",
    difficulty: "Easy",
    color: "primary",
    instructions: [
      "Click any two cards to flip them.",
      "If both cards match, they stay open.",
      "If they do not match, they close again.",
      "Finish with fewer moves for a better score."
    ],
    bestScore: 1200
  },
  {
    _id: "number-order",
    gameName: "Number Order",
    description: "Tap numbers in the correct ascending order.",
    icon: "🔢",
    category: "Focus",
    difficulty: "Easy",
    color: "success",
    instructions: [
      "Read the numbers on the screen.",
      "Click them in ascending order.",
      "Wrong click reduces score.",
      "Finish quickly to earn more points."
    ],
    bestScore: 950
  },
  {
    _id: "word-puzzle",
    gameName: "Word Puzzle",
    description: "Make correct words from shuffled letters.",
    icon: "🔤",
    category: "Language",
    difficulty: "Medium",
    color: "warning",
    instructions: [
      "Look at the shuffled letters.",
      "Arrange them into the correct word.",
      "Each correct answer adds points.",
      "Try to complete all rounds."
    ],
    bestScore: 1100
  },
  {
    _id: "quick-math",
    gameName: "Quick Math",
    description: "Solve simple math questions to sharpen the mind.",
    icon: "➕",
    category: "Math",
    difficulty: "Medium",
    color: "info",
    instructions: [
      "Read the math question carefully.",
      "Choose the correct answer.",
      "Each right answer gives points.",
      "Faster answers give bonus score."
    ],
    bestScore: 1000
  },
  {
    _id: "color-match",
    gameName: "Color Match",
    description: "Match the correct color and improve visual response.",
    icon: "🎨",
    category: "Visual",
    difficulty: "Easy",
    color: "danger",
    instructions: [
      "See the target color name.",
      "Choose the matching color block.",
      "Correct answers increase score.",
      "Wrong answers reduce score."
    ],
    bestScore: 870
  }
];

export default gamesData;