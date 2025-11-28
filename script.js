const words = [
  ["grave", "demon", "possessed", "darkness", "nightmare"],
  ["ritual", "casket", "phantom", "witchcraft", "torment"],
  ["apparition", "bloodmoon", "poltergeist", "abomination", "dollmaker"]
];

let level = 0, selectedWord = "", guessed = [], lives = 6;

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const playBtn = document.getElementById("playBtn");
const retryBtn = document.getElementById("retryBtn");
const bgMusic = document.getElementById("bgMusic");
const levelText = document.getElementById("levelText");
const wordDisplay = document.getElementById("word");
const livesDisplay = document.getElementById("lives");
const lettersContainer = document.getElementById("letters");
const jumpscare = document.getElementById("jumpscare");
const jumpscareSound = document.getElementById("jumpscareSound");
const flash = document.getElementById("flash");

const jumpscareImages = ["asset/j1.jpg","asset/j2.jpeg","asset/j3.jpeg","asset/j4.jpeg"];
const jumpscareSounds = ["assets/s1.mp3","assets/s2.mp3","assets/s3.mp3"];

playBtn.onclick = () => startGame();
retryBtn.onclick = () => generateLevel();

function startGame() {
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  bgMusic.volume = 0.55;
  bgMusic.play();
  generateLevel();
}

function generateLevel() {
  selectedWord = words[level][Math.floor(Math.random() * words[level].length)];
  guessed = [];
  lives = 6;
  levelText.textContent = `LEVEL ${level + 1}`;
  retryBtn.classList.add("hidden");

  wordDisplay.textContent = selectedWord.split("").map(() => "_ ").join("");
  livesDisplay.textContent = `LIVES: ${lives}`;

  lettersContainer.innerHTML = "";
  "abcdefghijklmnopqrstuvwxyz".split("").forEach(letter => {
    let btn = document.createElement("button");
    btn.textContent = letter;
    btn.onclick = () => handleGuess(letter, btn);
    lettersContainer.appendChild(btn);
  });

  randomJumpscareLoop();
}

function handleGuess(letter, btn) {
  btn.disabled = true;
  guessed.push(letter);

  if (!selectedWord.includes(letter)) {
    lives--;
    livesDisplay.textContent = `LIVES: ${lives}`;
    triggerFlash();
    triggerScreenShake();
    if (lives <= 0) return gameOver(false);
  }

  wordDisplay.textContent = selectedWord
    .split("")
    .map(l => guessed.includes(l) ? l : "_")
    .join(" ");

  if (!wordDisplay.textContent.includes("_")) {
    level++;
    if (level >= words.length) return gameOver(true);
    setTimeout(generateLevel, 1200);
  }
}

function gameOver(won) {
  lettersContainer.innerHTML = "";
  retryBtn.classList.remove("hidden");
  levelText.textContent = won ? "YOU ESCAPED!" : "YOU DIED!";
}

function triggerFlash() {
  flash.style.opacity = 1;
  setTimeout(() => flash.style.opacity = 0, 120);
}

function triggerScreenShake() {
  document.body.classList.add("shake-screen");
  setTimeout(() => document.body.classList.remove("shake-screen"), 400);
}

function triggerJumpscare() {
  jumpscare.src = jumpscareImages[Math.floor(Math.random() * jumpscareImages.length)];
  jumpscareSound.src = jumpscareSounds[Math.floor(Math.random() * jumpscareSounds.length)];
  jumpscare.classList.remove("hidden");
  jumpscareSound.play();
  triggerFlash();
  setTimeout(() => jumpscare.classList.add("hidden"), 800);
}

function randomJumpscareLoop() {
  setTimeout(() => {
    triggerJumpscare();
    randomJumpscareLoop();
  }, Math.random() * 7000 + 5000);
}
