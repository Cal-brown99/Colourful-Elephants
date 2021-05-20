const elephants = [
    "blue-elephant.png",
    "green-elephant.png",
    "orange-elephant",
    "pink-elephant",
    "purple-elephant",
    "red-elephant",
];

const gameTime = 30; /*------------------------------------------------------------------------ Time given to play the game */
const gameId = "game";

class game {
    constructor(totalTime) {
        this.totalTime = totalTime;
        this.timeLeft = timeTotal;
        this.timer = document.getElementById("remainingTime")
        this.playerCredentials = getElementById("playerCredentials");
        this.gamePanel = getElementById("main-gameBoard");
        this.addListeners();
    }

    /*------------------------------------------------------------------------ Starts the game function when the player submits a name */

    start() {
        this.loadConfiguration();
        this.showPlayerForm();
    }

    addListeners() {
        let playerForm = document.getElementById("playerForm");
        playerForm.addEventListener("submit", this.onStartGameHandler.bind(this)); // Returns bound function that will be invoked later
    }

    /*------------------------------------------------------------------------ Creates default game configuration, if it already exists then it loads from local storage */

    loadConfiguration() {
        this.configuration = JSON.parse(localStorage.getItem(gameId));
        if (!this.configuration) { // Sets configuration to the default value
            this.configuration = {
                playerName: "",
                scores: [],
            };
        }
    }

/*------------------------------------------------------------------------ This allows player names and scores to be loaded from the users local storage */

    showPlayerForm() {
        document.getElementById("playerName").value = this.configuration.playerName;
        this.renderScores();
        this.gamePanel.classList.toggle("d-none", true);
        this.playerPanel.classList.toggle("d-none", false);
    }

    showGameanel() {
        this.playerPanel.classList.toggle("d-none", true);
        this.gamePanel.classList.toggle("d-none", false);
    }

}