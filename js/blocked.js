// Array of professional motivational quotes
const quotes = [
    { text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.", author: "Paul J. Meyer" },
    { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
    { text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
    { text: "The more you are focused on time, performances and how you compare to others, the more you will miss out on the potential of your own development.", author: "Thibaut Meurisse" },
    { text: "The successful man is the average man, focused.", author: "Unknown" },
    { text: "Lack of direction, not lack of time, is the problem. We all have twenty-four hour days.", author: "Zig Ziglar" },
    { text: "The most successful people are those who are good at plan B.", author: "James Yorke" },
    { text: "The successful person has the habit of doing the things failures don't like to do.", author: "Thomas Edison" },
    { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
    { text: "The successful man is the one who finds out what is the matter with his business before that which is wrong with it finds it out for him.", author: "Timothy Cole" }
];

// Function to get a random quote
function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Function to update time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('timeInfo').textContent = `${dateString} • ${timeString}`;
}

// Function to format milliseconds into human readable string
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
}

// Function to display avoided time from storage with a live counter
function startAvoidedTimeCounter() {
    const sessionStartTime = Date.now();

    chrome.storage.local.get(['avoidedTime', 'lastResetDate'], (result) => {
        const today = new Date().toISOString().split('T')[0];
        let storedAvoidedTime = result.avoidedTime || 0;

        if (result.lastResetDate !== today) {
            storedAvoidedTime = 0;
        }

        const updateDisplay = () => {
            const currentSessionTime = Date.now() - sessionStartTime;
            const totalAvoidedTime = storedAvoidedTime + currentSessionTime;
            const timeStr = formatTime(totalAvoidedTime);
            document.getElementById('avoidedTime').textContent = `⏱️ You avoided ${timeStr} of distraction today`;
        };

        // Update immediately and then every second
        updateDisplay();
        setInterval(updateDisplay, 1000);
    });
}

// Function to display user goal
function displayUserGoal() {
    chrome.storage.local.get(['userGoal'], (result) => {
        if (result.userGoal) {
            const goalContainer = document.getElementById('goal-container');
            const goalText = document.getElementById('user-goal');
            goalText.textContent = `[${result.userGoal}]`;
            goalContainer.style.display = 'block';
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    // Set random quote
    const quote = getRandomQuote();
    document.getElementById('quote').textContent = `"${quote.text}"`;
    document.getElementById('author').textContent = quote.author;

    // Update time immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000);

    // Display avoided time
    startAvoidedTimeCounter();

    // Display user goal
    displayUserGoal();

    // Back button functionality
    document.getElementById('backButton').addEventListener('click', function () {
        chrome.storage.local.get(['selectedSiteUrl'], (result) => {
            const redirectUrl = result.selectedSiteUrl || 'https://notion.com/';
            window.location.href = redirectUrl;
        });
    });
});
