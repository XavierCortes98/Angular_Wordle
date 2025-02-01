const express = require("express");
const cors = require("cors");
const words = require("an-array-of-spanish-words");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/**
 * Obtiene una palabra aleatoria de 5 letras
 * @returns {string | null}
 */
const getRandomFiveLetterWord = () => {
  const fiveLetterWords = words.filter((word) => word.length === 5); // 🔹 Corrección aquí
  if (fiveLetterWords.length === 0) return null; // 🔹 Corrección aquí
  return fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)]; // 🔹 Corrección aquí
};

app.get("/getWord", (req, res) => {
  const word = getRandomFiveLetterWord();
  if (word) {
    res.json(word);
  } else {
    res.status(404).json({ error: "No se han encontrado palabras" });
  }
});

app.post("/checkWord", (req, res) => {
  const word = req.body.word;

  if (words.includes(word.toLowerCase())) {
    res.json(true);
  } else {
    res.json(false);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
