//making a namespace we do this so its not in global scope
let ties = 0;
let player1Wins = 0;
let player2Wins = 0;
const App = {
  //all of our selection html elements
  $: {
    menu: document.querySelector("[data-id=actions]"),
    actionsButtons: document.querySelector("[data-id=HiddenActions]"),
    resetButton: document.querySelector("[data-id=reset]"),
    newRound: document.querySelector("[data-id=newRound]"),
    squares: document.querySelectorAll("[data-id=square]"), // selects all from square id
    player: document.querySelector("[data-id=playerIcon"),
    playerText: document.querySelector("[data-id=playerText]"),
    modal: document.querySelector("[data-id=Modal]"),
    Winner: document.querySelector("[data-id=Winner]"),
    modalButton: document.querySelector("[data-id=modalButton]"),
    number1wins: document.querySelector("[data-id=num1Wins]"),
    number2wins: document.querySelector("[data-id=num2Wins]"),
    numberTies: document.querySelector("[data-id=numTies]"),
  },

  state: {
    currentPlayer: 1,
    moves: [],
  },

  getGameStatus(moves) {
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const p1Moves = moves.filter((move) => move.playerId === 1).map((move) => +move.squareId);
    const p2Moves = moves.filter((move) => move.playerId === 2).map((move) => +move.squareId);

    let winner = null;
    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in Progress",
      winner,
    };
  },

  //calling our event listeners using another function
  init() {
    App.registerEventListeners();
  },

  //registering the basic event listeners
  registerEventListeners() {
    //Done
    App.$.menu.addEventListener("click", (event) => {
      App.$.actionsButtons.classList.toggle("hidden"); //listens for click on actions class to then toggle the hidden class
    });
    App.$.resetButton.addEventListener("click", (event) => {
      console.log("Reset Game");
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      ties = 0;
      player1Wins = 0;
      player2Wins = 0;
      App.$.numberTies.innerHTML = `${ties} Wins`;
      App.$.number1wins.innerHTML = `${player1Wins} Wins`;
      App.$.number2wins.innerHTML = `${player2Wins} Wins`;
    });
    App.$.newRound.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
    });
    //can play again and reset the game board
    App.$.modalButton.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.toggle("hidden");
    });
    //To Do
    App.$.squares.forEach((square) => {
      //we used a ` here so we could use the $ stuff
      square.addEventListener("click", (event) => {
        console.log(`square with id ${event.target.id}`);

        // if the sqaure has a child (x or o we skip/dont let the user play there)
        if (square.hasChildNodes()) {
          return;
        }

        //set a variable to current player
        let currentPlayer = App.state.currentPlayer;

        //sets the tag for icon
        const icon = document.createElement("i");

        //checks to see if its player 1 or not
        if (currentPlayer === 1) {
          icon.classList.add("fa-solid", "fa-x");
        } else {
          icon.classList.add("fa-solid", "fa-o");
        }

        //tells us the state of the board
        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        // if player one then when they play we replace all the player 1 stuff with player 2
        if (App.state.currentPlayer === 1) {
          App.$.player.classList.replace("fa-x", "fa-o");
          App.$.playerText.innerHTML = "Player 2, you're up!";
          App.state.currentPlayer = 2;
        } else {
          App.$.player.classList.replace("fa-o", "fa-x");
          App.$.playerText.innerHTML = "Player 1, you're up!";
          App.state.currentPlayer = 1;
        }

        console.log(App.state);
        square.replaceChildren(icon);

        //check for winner
        const game = App.getGameStatus(App.state.moves);
        console.log(game);

        console.log(player1Wins);
        console.log(player2Wins);
        console.log(ties);
        // once the game is complete this lets us do the modal
        if (game.status === "complete") {
          if (game.winner == 1) {
            App.$.Winner.innerHTML = `Player ${game.winner} Wins`;
            App.$.modal.classList.toggle("hidden");
            player1Wins += 1;
            App.$.number1wins.innerHTML = `${player1Wins} Wins`;
          } else if (game.winner == 2) {
            App.$.Winner.innerHTML = `Player ${game.winner} Wins`;
            App.$.modal.classList.toggle("hidden");
            player2Wins += 1;
            App.$.number2wins.innerHTML = `${player2Wins} Wins`;
          } else {
            App.$.Winner.innerHTML = "Tie";
            App.$.modal.classList.toggle("hidden");
            ties += 1;
            App.$.numberTies.innerHTML = `${ties} Wins`;
          }
        }
      });

      //<i class="fa-solid fa-x"></i>   //<i class="fa-solid fa-o"></i>
    });
  },
};

//call back to init function when the window loads
window.addEventListener("load", App.init);
