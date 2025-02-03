let gameStarted = false;
let gameOver = false;
let playerWon = false;
let deck = [];
let dealerCards = [];
let playerCards = [];

let gameOutput = document.getElementById('gameOutput');
let dealerScore = document.getElementById('dealerScore');
let playerScore = document.getElementById('playerScore');
let newGameBtn = document.getElementById('newGameBtn');
let drawCardBtn = document.getElementById('drawCardBtn');
let stopBtn = document.getElementById('stopGameBtn');
let playerCardContainer = document.getElementById('playerCards');
let dealerCardContainer = document.getElementById('dealerCards');


function createDeck() {
    let suits = ['spades', 'diamonds', 'clubs', 'hearts'];
    let values = ["ace", "king", "queen", "jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
    let newDeck = [];
    for (let suit of suits) {
        for (let value of values) {
            newDeck.push({ suit: suit, value: value });
        }
    }
    return newDeck;
}


function getCardImagePath(card) {
    return `cards/${card.value}_of_${card.suit}.png`;
}


function getCardString(card) {
    return `${card.value.charAt(0).toUpperCase() + card.value.slice(1)} of ${card.suit.charAt(0).toUpperCase() + card.suit.slice(1)}`;
}


function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}


function newGame() {
    gameStarted = true;
    gameOver = false;
    playerWon = false;  

    deck = createDeck();
    shuffleDeck(deck);

    dealerCards = [deck.pop(), deck.pop()];
    playerCards = [deck.pop(), deck.pop()];

   // console.log("Dealer's cards:", dealerCards);


    newGameBtn.style.display = 'none';
    drawCardBtn.style.display = 'inline';
    stopBtn.style.display = 'inline';

    displayGameStatus();
}


function drawNewCard() {
    playerCards.push(deck.pop());
    displayGameStatus();
    checkGameOver();
}


function stopGame() {
    gameOver = true;
    playDealerTurn(); 
    displayGameStatus();
}


function playDealerTurn() {
    while (calculateScore(dealerCards) < 17) {
        dealerCards.push(deck.pop());
    }

    checkGameOver();
}



function displayGameStatus() {
    playerCardContainer.innerHTML = '';
    dealerCardContainer.innerHTML = '';



    
    for (let card of playerCards) {
        let cardImg = document.createElement('img');
        cardImg.src = getCardImagePath(card);
        cardImg.alt = getCardString(card);
        cardImg.classList.add('card-img');
        playerCardContainer.appendChild(cardImg);
    }

    
    if (gameOver) {
        
        for (let card of dealerCards) {
            let cardImg = document.createElement('img');
            cardImg.src = getCardImagePath(card);
            cardImg.alt = getCardString(card);
            cardImg.classList.add('card-img');
            dealerCardContainer.appendChild(cardImg);
        }   
    } else {
        
        let dealerCardImg1 = document.createElement('img');
        dealerCardImg1.src = getCardImagePath(dealerCards[0]);  
        dealerCardImg1.alt = getCardString(dealerCards[0]);
        dealerCardImg1.classList.add('card-img');
        dealerCardContainer.appendChild(dealerCardImg1);

        let dealerCardImg2 = document.createElement('img');
        dealerCardImg2.src = 'cards/cardback.png';  
        dealerCardImg2.alt = 'Card Back';
        dealerCardImg2.classList.add('card-img');
        dealerCardContainer.appendChild(dealerCardImg2);
    }

    
    let playerScore = calculateScore(playerCards);
    let dealerScore = gameOver ? calculateScore(dealerCards) : calculateScore([dealerCards[0]]);

        gameOutput.value = `Player's (Score: ${playerScore})\nDealer's (Score: ${dealerScore})`;

    if (gameOver) {
        if (playerScore > 21) {
            gameOutput.value += "\nYou lost! You busted.";
        } else if (dealerScore > 21) {
            gameOutput.value += "\nYou won! Dealer busted.";
            playerWon = true;
        } else if (playerScore > dealerScore) {
            gameOutput.value += "\nYou won!";
            playerWon = true;
        } else if (playerScore === dealerScore) {
            gameOutput.value += "\nIt's a tie!";
        } else {
            gameOutput.value += "\nYou lost!";
        }

        newGameBtn.style.display = 'inline';
        drawCardBtn.style.display = 'none';
        stopBtn.style.display = 'none';
    }
}






function checkGameOver() {
    let playerScore = calculateScore(playerCards);
    if (playerScore > 21) {
        gameOver = true;
        playerWon = false;
        displayGameStatus();
    }
}


function calculateScore(cards) {
    let score = 0;
    let hasAce = false; 

    for (let card of cards) {
        let value = card.value;
        if (value === 'ace') {
            if (!hasAce) {
                score += 11;  
                hasAce = true;
            } else {
                score += 1;  
            }
        } else if (['king', 'queen', 'jack'].includes(value)) {
            score += 10;
        } else {
            score += parseInt(value);
        }
    }

    if (hasAce && score > 21) {
        score -= 10; 
    }

    return score;
}

newGameBtn.addEventListener('click', newGame);
drawCardBtn.addEventListener('click', drawNewCard);
stopBtn.addEventListener('click', stopGame);
