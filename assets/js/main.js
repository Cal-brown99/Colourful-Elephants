const elephants = [
    "blue",
    "green",
    "orange",
    "pink",
    "purple",
    "red",
];

const gameTime = 30; /*------------------------------------------------------------------------ Time given to play the game */
const gameId = "board-game";

class Game {
    constructor(totalTime) {
        this.totalTime = totalTime;
        this.fullDeck = [];
        this.timeLeft = totalTime;
        this.correctPoints = document.getElementById("right");
        this.incorrectPoints = document.getElementById("wrong");
        this.timer = document.getElementById("remainingTime")
        this.configuration = null;
        this.playerCredentials = document.getElementById("playerCredentials");
        this.gamePanel = document.getElementById("main-gameBoard");
        this.checkCard = null;
        this.addListeners();
    }

    /*------------------------------------------------------------------------ Starts the game function when the player submits a name */

    start() {
        this.loadConfiguration();
        this.showPlayerCredentials();
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

    startGame() {
        this.checkCard = null;
        this.score = 0;
        this.timeLeft = this.totalTime;
        this.matchedCards = []; // Array which will store the matched cards as the game progresses
        this.busy = true;
        setTimeout(() => {
            this.shuffleDeck(this.fullDeck);
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 30);
        this.timer.innerText = this.timeLeft;
        this.turns.innerText = this.score;
        this.showGamePanel();
        this.appendCards();
        this.subscribeButton();
    }

    /*------------------------------------------------------------------------ This allows player names and scores to be loaded from the users local storage */

    showPlayerCredentials() {
        document.getElementById("playerName").value = this.configuration.playerName;
        this.renderScores();
        this.gamePanel.classList.toggle("d-none", true);
        this.playerCredentials.classList.toggle("d-none", false);
    }

    showGamePanel() {
        this.playerCredentials.classList.toggle("d-none", true);
        this.gamePanel.classList.toggle("d-none", false);
    }

    checkForMatch(card) {
        if (this.checkCardType(card) === this.checkCardType(this.checkCard)) {
            this.cardMatcher(card, this.checkCard);
        } else {
            this.notAMatch(card, this.checkCard);
            // Clears the card selection
            this.checkCard = null;
        }
    }

    colourMatcher(card1, card2) {
        // Adds the cards to the matchedCards array to track progress
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        this.checkCard = null;
    }

    notAMatch(card1, card2) {
        this.busy = true;
        
    }

    checkCardType(card) {
        return card.getElementsByClassName("card-value")[0].src;
    }

    shuffleDeck() {
        for (let i = this.fullDeck.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            this.fullDeck[randomIndex].style.order = i;
            this.fullDeck[1].style.order = randomIndex;
        }
    }

    renderScores() {
        let scoresContainer = document.getElementById("scores");
        if (scoresContainer.firstElementChild) {
            scoresContainer.firstElementChild.remove();
        }
        let table = document.createElement("table");
        let header = table.createTHead();
        let headers = header.insertRow(0);
        headers.innerHTML = `<th class="position">Position</th>
                            <th class="player-name">Player Name</th>
                            <th class="points">Total Score</th>
                            <th class="total-time">Total Time</th>`;
        let tblBody = document.createElement('tbody');
        this.configuration.scores.forEach((score, index) => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td class="position">${index + 1}</td> 
                            <td class="player-name">${score.playerName}</td>
                            <td class="points">${score.points}</td>
                            <td class="total-time">${score.totalTime}</td>`;
            if (score.currentPlayer) {
                tr.classList.add('last-game');
            }
            tblBody.appendChild(tr);
        });
        table.appendChild(tblBody);
        scoresContainer.appendChild(table);
    }

    onStartGameHandler(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        // Assigns the current player's name to the configuration object to start the game
        this.configuration.playerName = event.target[0].value;
        //Starts the game
        this.startGame();
    }

    renderCard(color, label, id) {
        return `<div class="cards">
                    <span class="card" id="${id}"> 
                        <img class="card-value card-img" src="assets/images/${color}-elephant.png" alt="Picture card">
                            <spam class="card-label">${label}</spam>
                    </span>
                    <span class="card small" id="${id}"> 
                        <img class="card-value card-img" src="assets/images/${color}-elephant.png" alt="Picture card">
                            <spam class="card-label">${label}</spam>
                    </span>`;
    }

//   <span class="x">
//   <a id="videolink" href="http://www.youtube.com/watch?v=ImTTW94ZicM" class="video-class" target="_blank">
//    <img src="https://i.ytimg.com/vi/ImTTW94ZicM/mqdefault.jpg"  border="2px" alt="Video" />
//    <img class="videoicon"  src="http://vignette3.wikia.nocookie.net/plazmabursttwo/images/a/a8/Play_button.png/revision/latest?cb=20121111212438" data-pin-nopin="true" />
//   </a>  
// </span>

    appendCard(element, label, id) {
        elephants.forEach((color) => {
            element.insertAdjacentHTML("beforeend", this.renderCard(color, label, color));
            let el = document.getElementById(color);
            el.addEventListener("click", this.onClickCard.bind(this));
        });
        // insertAdjacentHTML inserts the HTML from the renderCard function for each item in the concatenated allCards array using the appropriate image file
    }

    let cards = Array.from(document.getElementsByClassName("cards"));

        cards.forEach((cards) => {
            cards.addEventListener("click", () => {
                this.popSound();
            });
        });
        this.fullDeck = cards; // Declares a new array of HTML cards for the game
    }

    startCountDown() {
        return setInterval(() => {
            this.timeLeft--;
            this.timer.innerText = this.timeLeft;
            if (this.timeLeft === 0) 
                this.gameOver(); // Ends game when countdown reaches 0
        }, 30);
    }

    gameFinished() {
        clearInterval(this.countDown);
        // Removes remaining cards from the board
        this.removeCards();
        this.showPlayerPanel();
    }

    currentScore() {
        let currentScore = document.getElementById('current-score');
        currentScore.innerText = this.totalTurns;
    }

    gameOver() {
        this.renderScores();
        this.boardPanel.classList.toggle("d-none", true);
        this.playerPanel.classList.toggle("d-none", false);
        this.gameFinished();
    }

    gameWin() {
        this.currentScore();
        this.updateScores();
        this.gameFinished();
    }

    updateScores() {
        // Disable the previous current played game 
        let index = this.configuration.scores.findIndex((score) => score.currentPlayer === true);
        if (index !== -1) {
            this.configuration.scores[index].currentPlayer = false;
        }

        // Adds the new score to the scoreboard
        this.configuration.scores.push({
            playerName: this.configuration.playerName,
            points: this.totalTurns,
            totalTime: this.totalTime - this.timeLeft,
            currentPlayer: true
        });

         this.configuration.scores.sort((a, b) => {
            if (a.points < b.points) {
                return -1;
            }
            if (a.points > b.points) {
                return 1;
            }
            if (a.totalTime < b.totalTime) {
                return -1;
            }
            if (a.totalTime > b.totalTime) {
                return 1;
            }
            return 0;
        });

    onClickCard(event) {
        console.log(event);
        let node = event.target;
        while (!node.hasAttribute("id")) {
            node = node.parentNode;
        }
        node.remove();
    }
}

const game = new Game(gameTime);
game.start();