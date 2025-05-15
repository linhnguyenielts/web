let timedScore = 0;
let isTimerExpired = false;
let timerInterval = null;
window.submitNowClicked = false;
window.extraTimeUsed = { minutes: 0, seconds: 0 };
   // Add this to your existing JavaScript
        document.addEventListener('DOMContentLoaded', function() {
		document.querySelectorAll('.page-number').forEach(el => {
    el.addEventListener('click', function () {
        const number = this.textContent.trim();
        const questionEl = document.getElementById(`question${number}`);
        if (questionEl) {
            questionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

    // Get elements
    const introPage = document.getElementById('introPage');
    const startButton = document.getElementById('startButton');
    const mainContainer = document.getElementById('mainContainer'); // Ensure this is defined
    const timerDisplay = document.querySelector('.timer');
    
    // Start button click handler
    startButton.addEventListener('click', function() {
        // Hide intro page
        introPage.classList.add('hidden');
        
        // Show main container (using class selector)
        mainContainer.classList.add('visible'); // Ensure we are using the correct reference
        
        // Start the timer (60 minutes)
        startTimer(1 * 60, timerDisplay);
        
        // Initialize the test
        initializeTest();
    });
});
function startTimer(duration, display) {
    let timer = duration;
    let isExtraTime = false;
    let extraTimeStarted = 0;
    
    // Clear any existing timer first
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Create the time's up modal if it doesn't exist
    if (!document.getElementById('timesUpModal')) {
        const modal = document.createElement('div');
        modal.id = 'timesUpModal';
        modal.className = 'modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Time's Up!</h2>
                <p>Would you like to submit your test now or continue working?</p>
                <div class="modal-buttons">
                    <button id="submitNowBtn">Submit Now</button>
                    <button id="continueBtn">Continue</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Handle "Submit Now" button click
document.getElementById('submitNowBtn').addEventListener('click', function() {
    modal.style.display = 'none';
    // Store the timed score if we haven't already, but don't show answers
    if (!isTimerExpired) {
        timedScore = calculateScoreWithoutFeedback(); // Calculate without submitting
        isTimerExpired = true;
    }
    // Set flag to indicate submit now was clicked (not extended time)
    window.submitNowClicked = true;
    // Find and click the submit button to trigger the normal submission flow
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.click();
    }
});

// Handle "Continue" button click
document.getElementById('continueBtn').addEventListener('click', function() {
    modal.style.display = 'none';
    isExtraTime = true;
    extraTimeStarted = 0;
    // Make sure we know the user is using extra time (not submitting immediately)
    window.submitNowClicked = false;
    // Reset extra time tracking
    window.extraTimeUsed = { minutes: 0, seconds: 0 };
    // Clear and restart the interval to ensure clean state
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // Store the timed score if we haven't already, but don't show answers
    if (!isTimerExpired) {
        // Modified to calculate score without showing answers or disabling inputs
        timedScore = calculateScore(true); // Calculate without submitting
        isTimerExpired = true;
    }
});
    }
    
    function updateTimer() {
    if (isExtraTime) {
        // Extra time mode
        extraTimeStarted++;
        const minutes = Math.floor(extraTimeStarted / 60);
        const seconds = extraTimeStarted % 60;
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = "Extra time: " + formattedMinutes + ":" + formattedSeconds;
        // Store the extra time used for display in the score
        window.extraTimeUsed = {
            minutes: minutes,
            seconds: seconds
        };
    } else if (timer > 0) {
        // Regular timer
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        
        if (timer > 300) {
            display.textContent = minutes + " minutes";
        } else {
            const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
            const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
            display.textContent = formattedMinutes + ":" + formattedSeconds;
        }
        timer--;
    } else {
        // Time's up - show modal
        const modal = document.getElementById('timesUpModal');
        if (modal) {
            modal.style.display = 'block';
            display.textContent = "00:00";
            isTimerExpired = true;
            // Store the score at time expiration, but don't show answers
            timedScore = calculateScoreWithoutFeedback(); // Use a new function that doesn't show answers
        }
    }
}

    
    // Start the timer
    timerInterval = setInterval(updateTimer, 1000);
}

// New function that calculates score without showing feedback
function calculateScoreWithoutFeedback() {
    let score = 0;

    // 1. Check radio button questions (TRUE/FALSE/NOT GIVEN, YES/NO/NOT GIVEN)
    document.querySelectorAll('.options[data-correct]').forEach(optionGroup => {
        if (optionGroup.querySelector('input[type="radio"]')) {
            const correctValue = optionGroup.getAttribute('data-correct');
            const selected = optionGroup.querySelector('input[type="radio"]:checked');
            
            if (selected && selected.value === correctValue) {
                score++;
            }
        }
    });

    // 2. Check checkbox questions (multiple correct answers)
    document.querySelectorAll('.options[data-correct]').forEach(optionGroup => {
        if (optionGroup.querySelector('input[type="checkbox"]')) {
            const correctValues = optionGroup.getAttribute('data-correct').split(',');
            const selected = Array.from(optionGroup.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value);
            
            // Award 1 point for EACH correct option selected
            selected.forEach(selectedValue => {
                if (correctValues.includes(selectedValue)) {
                    score++;
                }
            });
        }
    });

    // 3. Check text input questions
    document.querySelectorAll('input[type="text"].blank-input').forEach(input => {
        const correctAnswers = input.getAttribute('data-correct').split('|');
        const userAnswer = input.value.trim().toLowerCase();
        const isCorrect = correctAnswers.some(ans => 
            userAnswer === ans.trim().toLowerCase());
        
        if (isCorrect) {
            score++;
        }
    });

    // 4. Check dropdown questions
    document.querySelectorAll('select.dropdown[data-correct]').forEach(select => {
        const isCorrect = select.value === select.getAttribute('data-correct');
        if (isCorrect) {
            score++;
        }
    });

    // 5. Check drag and drop questions
    document.querySelectorAll('.drop-box[data-correct]').forEach(box => {
        const draggable = box.querySelector('.draggable');
        const correctValues = box.getAttribute('data-correct').split(',');

        if (draggable && correctValues.some(correct =>
            draggable.textContent.trim().startsWith(correct))) {
            score++;
        }
    });

    return score;
}