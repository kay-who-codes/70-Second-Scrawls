document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('click', startGame);
});

document.getElementById('go-back').addEventListener('click', resetGame);

document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

let countdownInterval;

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

function loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }
}

// Load dark mode preference on page load
window.onload = loadDarkMode;

async function startGame(event) {
    const difficulty = event.target.id;
    const cards = await fetchCards();
    const card = getCardByDifficulty(cards, difficulty);

    document.getElementById('category').innerText = card.category;
    const promptsContainer = document.getElementById('prompts');
    promptsContainer.innerHTML = '';

    card.prompts.forEach(prompt => {
        const div = document.createElement('div');
        div.innerText = prompt;
        promptsContainer.appendChild(div);
    });

    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('game-area').style.display = 'flex';
    document.getElementById('go-back').style.display = 'block';

    const flipSound = document.getElementById('flip-sound');
    flipSound.play();

    startTimer(71);
}

async function fetchCards() {
    const response = await fetch('Assets/cards.txt');
    const text = await response.text();
    return parseCards(text);
}

function parseCards(text) {
    return text.trim().split('\n').map(line => {
        const parts = line.split(',');
        return {
            category: parts[0],
            difficulty: parts[1],
            prompts: parts.slice(2)
        };
    });
}

function getCardByDifficulty(cards, difficulty) {
    const filteredCards = cards.filter(card => card.difficulty === difficulty);
    return filteredCards[Math.floor(Math.random() * filteredCards.length)];
}

function startTimer(seconds) {
    const timerElement = document.getElementById('timer');
    const timeUpElement = document.getElementById('time-up');
    const timerSound = document.getElementById('timer-sound');

    let timeLeft = seconds;
    timerElement.innerText = timeLeft;

    countdownInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            timerElement.style.display = 'none';
            timeUpElement.style.display = 'block';
            timerSound.play();
        }
    }, 1000);

    timeUpElement.addEventListener('click', resetGame);
}

function resetGame() {
    clearInterval(countdownInterval);
    document.getElementById('timer').style.display = 'block';
    document.getElementById('time-up').style.display = 'none';
    document.getElementById('difficulty-selection').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('go-back').style.display = 'none';
}

document.getElementById('viewRulesBtn').addEventListener('click', function() {
    fetchRules();
});

// Get the modal
var modal = document.getElementById("rulesModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function fetchRules() {
    // Fetch the rules.txt or rules.pdf
    fetch('rules.txt')
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            // If rules.txt is not found, try to load rules.pdf
            return fetch('rules.pdf');
        }
    })
    .then(data => {
        if (typeof data === 'string') {
            // Display the rules.txt content
            document.getElementById('rulesContent').innerHTML = formatRules(data);
            modal.style.display = "block";
        } else {
            // Display the rules.pdf content
            document.getElementById('rulesContent').innerHTML = '<iframe src="rules.pdf" width="100%" height="600px"></iframe>';
            modal.style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error fetching rules:', error);
    });
}

function formatRules(text) {
    // Function to beautify the text content from rules.txt
    // You can update this function to format the text as needed
    return '<pre style="white-space: pre-wrap;">' + text + '</pre>'; // Ensure text wraps
}

// Play Sound When Clicking Button

const Button_Sound = new Audio('Assets/click.mp3'); // Create an Audio object

// Function to play the sound
function playButton_Sound() {
  Button_Sound.play();
}

// Add event listeners to buttons
document.getElementById('go-back').addEventListener('click', playButton_Sound);