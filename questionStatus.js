// Function to update question status in navigation
function updateQuestionStatus(questionNumber, isAnswered) {
    const statusElement = document.getElementById(`q${questionNumber}-status`);
    if (statusElement) {
        if (isAnswered) {
            statusElement.classList.add('answered');
            statusElement.style.backgroundColor = '#2196F3';
            statusElement.style.color = 'white';
            statusElement.style.borderColor = '#2196F3';
        } else {
            statusElement.classList.remove('answered');
            statusElement.style.backgroundColor = '';
            statusElement.style.color = '';
            statusElement.style.borderColor = '';
        }
    }
}

// Update part section question count
function updatePartCounts() {
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
        
        // Update the count display
        const countDisplay = part.querySelector('.question-count');
        if (countDisplay) {
            countDisplay.textContent = `${answeredCount} of ${endQuestion - startQuestion + 1} questions`;
        }
    });
}

// Setup event listeners for all question types
function setupQuestionStatusTracking() {
    // 1. Radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const questionNumber = this.name.replace('q', '');
            updateQuestionStatus(questionNumber, true);
            updatePartCounts();
        });
    });
    
    // 2. Checkboxes (for multiple choice questions)
    const checkboxGroups = {};
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        const name = checkbox.name;
        if (!checkboxGroups[name]) {
            checkboxGroups[name] = [];
        }
        checkboxGroups[name].push(checkbox);
        
        checkbox.addEventListener('change', function() {
            const questionNumber = this.name.replace('q', '');
            // Check if any checkbox in this group is checked
            const isAnswered = checkboxGroups[name].some(cb => cb.checked);
            updateQuestionStatus(questionNumber, isAnswered);
            updatePartCounts();
        });
    });
    
    // 3. Text inputs
    document.querySelectorAll('.blank-input').forEach(input => {
        input.addEventListener('input', function() {
            const questionNumber = this.id.replace('question', '');
            updateQuestionStatus(questionNumber, this.value.trim() !== '');
            updatePartCounts();
        });
        
        // Check initial state
        if (input.value.trim() !== '') {
            const questionNumber = input.id.replace('question', '');
            updateQuestionStatus(questionNumber, true);
        }
    });
    
    // 4. Dropdowns
    document.querySelectorAll('select.dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            const questionElement = this.closest('.statement-with-dropdown');
            if (questionElement) {
                const questionId = questionElement.querySelector('.statement-text').id;
                const questionNumber = questionId.replace('question', '');
                updateQuestionStatus(questionNumber, this.value !== '');
                updatePartCounts();
            }
        });
        
        // Check initial state
        if (dropdown.value !== '') {
            const questionElement = dropdown.closest('.statement-with-dropdown');
            if (questionElement) {
                const questionId = questionElement.querySelector('.statement-text').id;
                const questionNumber = questionId.replace('question', '');
                updateQuestionStatus(questionNumber, true);
            }
        }
    });
    
// 5. Drag and drop boxes
    document.querySelectorAll('.drop-box').forEach(dropBox => {
        // Use a MutationObserver to detect when items are dropped
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const questionNumber = dropBox.id.replace('question', '');
                    updateQuestionStatus(questionNumber, true);
                    updatePartCounts();
                }
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0 && dropBox.children.length === 0) {
                    const questionNumber = dropBox.id.replace('question', '');
                    updateQuestionStatus(questionNumber, false);
                    updatePartCounts();
                }
            });
        });
        
        observer.observe(dropBox, { childList: true });
        
        // Check initial state
        if (dropBox.children.length > 0) {
            const questionNumber = dropBox.id.replace('question', '');
            updateQuestionStatus(questionNumber, true);
        }
    });
    
    // Initial update of part counts
    updatePartCounts();
}

// Add CSS styles for the answered state
function addAnsweredStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .page-number.answered {
            background-color: #2196F3;
            color: white;
            border-color: #2196F3;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    addAnsweredStyles();
    setupQuestionStatusTracking();
    
    // Check if any questions are already answered (page refresh)
    checkInitialAnswers();
});

// Check for answers that might already be filled in
function checkInitialAnswers() {
    // Check radio buttons
    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        const questionNumber = radio.name.replace('q', '');
        updateQuestionStatus(questionNumber, true);
    });
    
    // Check checkboxes
    const checkboxGroups = {};
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        const name = checkbox.name;
        if (!checkboxGroups[name]) {
            checkboxGroups[name] = [];
        }
        checkboxGroups[name].push(checkbox);
    });
    
    for (const name in checkboxGroups) {
        const isAnswered = checkboxGroups[name].some(cb => cb.checked);
        if (isAnswered) {
            const questionNumber = name.replace('q', '');
            updateQuestionStatus(questionNumber, true);
        }
    }
    
    // Check text inputs
    document.querySelectorAll('.blank-input').forEach(input => {
        if (input.value.trim() !== '') {
            const questionNumber = input.id.replace('question', '');
            updateQuestionStatus(questionNumber, true);
        }
    });
    
    // Check dropdowns
    document.querySelectorAll('select.dropdown').forEach(dropdown => {
        if (dropdown.value !== '') {
            const questionElement = dropdown.closest('.statement-with-dropdown');
            if (questionElement) {
                const questionId = questionElement.querySelector('.statement-text').id;
                const questionNumber = questionId.replace('question', '');
                updateQuestionStatus(questionNumber, true);
            }
        }
    });
    
    // Check drag and drop boxes
    document.querySelectorAll('.drop-box').forEach(dropBox => {
        if (dropBox.children.length > 0) {
            const questionNumber = dropBox.id.replace('question', '');
            updateQuestionStatus(questionNumber, true);
        }
    });
    
    // Update part counts after checking all questions
    updatePartCounts();
}
// Add this to your questionStatus.js file or your main script
// This function specifically handles the checkbox questions (20-21 and 22-23)
function updateCheckboxQuestionStatus() {
    // Handle questions 20-21
    const q20Checkboxes = document.querySelectorAll('input[name="q20"]');
    let q20CheckedCount = 0;
    
    q20Checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            q20CheckedCount++;
        }
    });
    
    // Update question 20 status
    const q20Status = document.getElementById('q20-status');
    if (q20CheckedCount >= 1) {
        q20Status.classList.add('answered');
        q20Status.style.backgroundColor = '#2196F3';
        q20Status.style.color = 'white';
        q20Status.style.borderColor = '#2196F3';
    } else {
        q20Status.classList.remove('answered');
        q20Status.style.backgroundColor = '';
        q20Status.style.color = '';
        q20Status.style.borderColor = '';
    }
    
    // Update question 21 status (marked as complete only when 2 checkboxes are selected)
    const q21Status = document.getElementById('q21-status');
    if (q20CheckedCount >= 2) {
        q21Status.classList.add('answered');
        q21Status.style.backgroundColor = '#2196F3';
        q21Status.style.color = 'white';
        q21Status.style.borderColor = '#2196F3';
    } else {
        q21Status.classList.remove('answered');
        q21Status.style.backgroundColor = '';
        q21Status.style.color = '';
        q21Status.style.borderColor = '';
    }
    
    // Handle questions 22-23
    const q22Checkboxes = document.querySelectorAll('input[name="q22"]');
    let q22CheckedCount = 0;
    
    q22Checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            q22CheckedCount++;
        }
    });
    
    // Update question 22 status
    const q22Status = document.getElementById('q22-status');
    if (q22CheckedCount >= 1) {
        q22Status.classList.add('answered');
        q22Status.style.backgroundColor = '#2196F3';
        q22Status.style.color = 'white';
        q22Status.style.borderColor = '#2196F3';
    } else {
        q22Status.classList.remove('answered');
        q22Status.style.backgroundColor = '';
        q22Status.style.color = '';
        q22Status.style.borderColor = '';
    }
    
    // Update question 23 status (marked as complete only when 2 checkboxes are selected)
    const q23Status = document.getElementById('q23-status');
    if (q22CheckedCount >= 2) {
        q23Status.classList.add('answered');
        q23Status.style.backgroundColor = '#2196F3';
        q23Status.style.color = 'white';
        q23Status.style.borderColor = '#2196F3';
    } else {
        q23Status.classList.remove('answered');
        q23Status.style.backgroundColor = '';
        q23Status.style.color = '';
        q23Status.style.borderColor = '';
    }
    
    // Update the question count and progress bar for Part 2
    updatePartProgress(1);
}

// Add event listeners for checkbox changes
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all checkboxes for questions 20-21
    document.querySelectorAll('input[name="q20"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateCheckboxQuestionStatus);
    });
    
    // Add event listeners to all checkboxes for questions 22-23
    document.querySelectorAll('input[name="q22"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateCheckboxQuestionStatus);
    });
});

// Modify the updatePartProgress function to handle all questions
function updatePartProgress(partIndex) {
    const parts = document.querySelectorAll('.part-section');
    
    if (partIndex >= 0 && partIndex < parts.length) {
        const part = parts[partIndex];
        const startQuestion = partIndex === 0 ? 1 : (partIndex === 1 ? 14 : 27);
        const endQuestion = partIndex === 0 ? 13 : (partIndex === 1 ? 26 : 40);
        let answeredCount = 0;
        
        for (let i = startQuestion; i <= endQuestion; i++) {
            const status = document.getElementById(`q${i}-status`);
            if (status && status.classList.contains('active')) {
                answeredCount++;
            }
        }
        
        const totalQuestions = endQuestion - startQuestion + 1;
        const questionCount = part.querySelector('.question-count');
        questionCount.textContent = `${answeredCount} of ${totalQuestions} questions`;
        
        const progressFill = part.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${(answeredCount / totalQuestions) * 100}%`;
        }
    }
}