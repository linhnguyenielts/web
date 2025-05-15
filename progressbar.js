// Function to update the progress bars and completion ticks
function updateProgressBars() {
    const parts = document.querySelectorAll('.part-section');
    
    parts.forEach((part, index) => {
        const partNumber = index + 1;
        let startQuestion, endQuestion;
        
        // Define the question range for each part
        if (partNumber === 1) {
            startQuestion = 1;
            endQuestion = 13;
        } else if (partNumber === 2) {
            startQuestion = 14;
            endQuestion = 26;
        } else if (partNumber === 3) {
            startQuestion = 27;
            endQuestion = 40;
        }
        
        // Count answered questions
        let answeredCount = 0;
        for (let i = startQuestion; i <= endQuestion; i++) {
            const status = document.getElementById(`q${i}-status`);
            if (status && status.classList.contains('answered')) {
                answeredCount++;
            }
        }
        
        // Update the progress bar
        const totalQuestions = endQuestion - startQuestion + 1;
        const progressPercentage = (answeredCount / totalQuestions) * 100;
        
        const progressFill = part.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        // Check if all questions are answered and part is not active
        const isCompleted = answeredCount === totalQuestions;
        const isActive = part.classList.contains('active');
        
        // Find the part title element
        const partTitle = part.querySelector('.part-title');
        
        // Remove any existing tick first
        const existingTick = part.querySelector('.completed-tick');
        if (existingTick) {
            existingTick.remove();
        }
        
        if (isCompleted && !isActive && partTitle) {
			partTitle.style.textAlign = 'center';
    // Clear the partTitle and create a container for the name and tick
    const nameSpan = document.createElement('span');
    nameSpan.textContent = partTitle.textContent;

    const tickIcon = document.createElement('div'); // using div to stack below
    tickIcon.className = 'completed-tick';
    tickIcon.textContent = '✓';

    // Clear the original title and append both name and tick
    partTitle.textContent = '';
    partTitle.appendChild(nameSpan);
    partTitle.appendChild(tickIcon);
}

    });
}

// Call this function whenever questions are answered
function updateQuestionTracking(questionNumber, isAnswered) {
    // Update the status in the navigation
    if (typeof updateQuestionStatus === 'function') {
        updateQuestionStatus(questionNumber, isAnswered);
    }
    
    // Update the part counts
    if (typeof updatePartCounts === 'function') {
        updatePartCounts();
    }
    
    // Update the progress bars and completion ticks
    updateProgressBars();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initial update
    updateProgressBars();
	updateBookmarkedParts();
    
    // Set up mutation observer to watch for part active state changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                updateProgressBars();
            }
        });
    });
    
    // Observe all part sections for class changes
    document.querySelectorAll('.part-section').forEach(part => {
        observer.observe(part, { attributes: true });
    });
});

// Ensure this runs after any part activation/deactivation
if (typeof yourPartActivationFunction === 'function') {
    const originalActivatePart = yourPartActivationFunction;
    yourPartActivationFunction = function() {
        originalActivatePart.apply(this, arguments);
        updateProgressBars();
    };
}
/**
 * Updates part sections to show a red border if they contain bookmarked questions.
 */
function updateBookmarkedParts() {
    const parts = document.querySelectorAll('.part-section');
    const bookmarks = JSON.parse(localStorage.getItem('ieltsBookmarks')) || {};

    parts.forEach((part, index) => {
        const partNumber = index + 1;
        let startQuestion, endQuestion;

        // Define the question range for each part (same as in updateProgressBars)
        if (partNumber === 1) {
            startQuestion = 1;
            endQuestion = 13;
        } else if (partNumber === 2) {
            startQuestion = 14;
            endQuestion = 26;
        } else if (partNumber === 3) {
            startQuestion = 27;
            endQuestion = 40;
        }

        // Check if any question in this part is bookmarked
        let hasBookmark = false;
        for (let i = startQuestion; i <= endQuestion; i++) {
            if (bookmarks[`question${i}`] || bookmarks[`blank${i}`] || bookmarks[i]) {
                hasBookmark = true;
                break;
            }
        }

        if (hasBookmark) {
    part.classList.add('bookmarked');
} else {
    part.classList.remove('bookmarked');
}
    });
}