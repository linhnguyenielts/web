// Learning Mode Functions
let currentWordIndex = 0;
let wordsToLearn = [];
let wrongAnswers = [];
const NUM_OPTIONS = 4;
let autoAdvance = true; // Toggle for auto-advancing

function startLearningMode() {
    const flashcardContainer = document.querySelector('.flashcard-container');
    const overlay = document.querySelector('.flashcard-overlay');
    
    if (vocabularyList.length === 0) {
        showNotification('No vocabulary words added yet!');
        return;
    }
    
    // Create a copy of the vocabulary list to work with
    wordsToLearn = [...vocabularyList];
    wrongAnswers = [];
    currentWordIndex = 0;
    autoAdvance = true; // Reset to default
    
    // Shuffle the words to learn in random order
    shuffleArray(wordsToLearn);
    
    overlay.style.display = 'block';
    flashcardContainer.style.display = 'block';
    flashcardContainer.style.maxHeight = '80vh';
    flashcardContainer.style.overflowY = 'auto';
    
    showCurrentWord();
}

function showCurrentWord() {
    if (currentWordIndex >= wordsToLearn.length) {
        // If we've gone through all words once, check if there were any wrong answers
        if (wrongAnswers.length > 0) {
            // Move to wrong answers for another round
            wordsToLearn = [...wrongAnswers];
            wrongAnswers = [];
            currentWordIndex = 0;
            shuffleArray(wordsToLearn);
            showNotification(`Review ${wordsToLearn.length} words you missed!`);
        } else {
            // All done!
            showCompletionScreen();
            return;
        }
    }
    
    const flashcardContainer = document.querySelector('.flashcard-container');
    const currentWord = wordsToLearn[currentWordIndex];
    
    // Get options for the quiz (1 correct, 3 incorrect)
    const options = generateOptions(currentWord);
    shuffleArray(options);
    
    // Set the container to be scrollable
    flashcardContainer.style.maxHeight = '80vh';
    flashcardContainer.style.overflowY = 'auto';
    
    let content = `
        <div class="learning-header" style="position: sticky; top: 0; background: white; padding: 10px 0; z-index: 1; border-bottom: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0;">Learning Mode (${currentWordIndex + 1}/${wordsToLearn.length})</h2>
                <button class="exit-learning" style="padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Exit Learning</button>
            </div>
            <p style="margin: 10px 0 0; font-style: italic; text-align: center;">Choose the correct meaning:</p>
        </div>
        
        <div class="learning-content" style="margin: 20px 0; padding-bottom: 20px;"">
            
            <div class="word-display" style="text-align: center; margin-bottom: 30px;">
    <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
        <h2 style="font-size: 2em; margin: 0;">${currentWord.baseWord || currentWord.word}</h2>
        <span style="font-size: 0.7em; color: #666;">${currentWord.partOfSpeech}</span>
        ${currentWord.ipa ? `<span>${currentWord.ipa}</span>` : ''}
        ${currentWord.audio ? `<button class="play-audio-btn" data-audio="${currentWord.audio}" title="Play pronunciation" style="background: none; border: none; cursor: pointer; font-size: 1.2em;">🔊</button>` : ''}
    </div>
    ${currentWord.baseWord && currentWord.baseWord.toLowerCase() !== currentWord.word.toLowerCase() ? 
        `<p style="font-style: italic; margin: 5px 0 10px 0; font-size: 1.2em;">${currentWord.word} ${currentWord.grammaticalTag ? `<span style="color: grey;">(${currentWord.grammaticalTag})</span>` : ''}</p>` : ''}
</div>
            
            <div class="options-container" style="display: flex; flex-direction: column; gap: 15px;">
    `;
    
    options.forEach((option, idx) => {
        content += `
                <button class="answer-option" data-correct="${option.isCorrect}" style="padding: 15px; text-align: left; background: white; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; transition: all 0.3s;">
                    <span style="font-weight: bold; margin-right: 10px;">${String.fromCharCode(65 + idx)}.</span> ${option.text}
                </button>
        `;
    });
    
    // Add auto-advance toggle
    content += `
            </div>
            
            <div style="margin-top: 30px; display: flex; justify-content: center; align-items: center; gap: 15px;">
                <label style="cursor: pointer;">
                    <input type="checkbox" id="auto-advance-toggle" ${autoAdvance ? 'checked' : ''} style="margin-right: 8px;">
                    Auto-advance
                </label>
                <button class="continue-btn" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; display: none;">Continue</button>
            </div>
        </div>
    `;

    flashcardContainer.innerHTML = content;
    
    // Attach event listeners
    flashcardContainer.querySelectorAll('.answer-option').forEach(btn => {
        btn.addEventListener('click', function() {
            handleAnswerSelection(this);
        });
    });
    
    flashcardContainer.querySelector('.exit-learning').addEventListener('click', function() {
    // Reset container styles before showing flashcards
    flashcardContainer.style.maxHeight = '';
    flashcardContainer.style.overflowY = '';
    showFlashcards();
});
    
    flashcardContainer.querySelector('.play-audio-btn')?.addEventListener('click', function() {
        const audioSrc = this.getAttribute('data-audio');
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play();
        }
    });
    
    // Auto-advance toggle handler
    const toggle = flashcardContainer.querySelector('#auto-advance-toggle');
    toggle.addEventListener('change', function() {
        autoAdvance = this.checked;
        const continueBtn = flashcardContainer.querySelector('.continue-btn');
        continueBtn.style.display = autoAdvance ? 'none' : 'block';
    });

    // Continue button handler
    const continueBtn = flashcardContainer.querySelector('.continue-btn');
    continueBtn.addEventListener('click', function() {
        currentWordIndex++;
        showCurrentWord();
    });

    // Initially hide continue button based on auto-advance setting
    continueBtn.style.display = autoAdvance ? 'none' : 'block';
}
// Remove the second handleAnswerSelection function completely and keep only this modified version:
function handleAnswerSelection(selectedBtn) {
    const isCorrect = selectedBtn.getAttribute('data-correct') === 'true';
    const currentWord = wordsToLearn[currentWordIndex];
    const allOptions = document.querySelectorAll('.answer-option');
    const flashcardContainer = document.querySelector('.flashcard-container');

    // Disable all options
    allOptions.forEach(btn => {
        btn.style.pointerEvents = 'none';
        if (btn.getAttribute('data-correct') === 'true') {
            btn.style.backgroundColor = '#d4f7d4';
            btn.style.borderColor = '#4CAF50';
        }
    });

    // Show feedback
    if (isCorrect) {
        selectedBtn.style.backgroundColor = '#d4f7d4';
        selectedBtn.style.borderColor = '#4CAF50';
    } else {
        selectedBtn.style.backgroundColor = '#ffd2d2';
        selectedBtn.style.borderColor = '#f44336';
        wrongAnswers.push(currentWord);
    }

    // Create and show feedback message centered in panel
    const feedback = document.createElement('div');
feedback.textContent = isCorrect ? '✓ Correct' : '✗ Incorrect';
feedback.style.position = 'absolute';
feedback.style.top = '20%';
feedback.style.left = '50%';
feedback.style.transform = 'translate(-50%, -50%)';
feedback.style.padding = '10px 15px'; // Reduced padding
feedback.style.borderRadius = '4px'; // Reduced border radius
feedback.style.backgroundColor = isCorrect ? '#4CAF50' : '#f44336';
feedback.style.color = 'white';
feedback.style.fontSize = '12px'; // Reduced font size
feedback.style.fontWeight = 'bold';
feedback.style.zIndex = '1000';
feedback.style.opacity = '0';
feedback.style.transition = 'opacity 0.3s';
feedback.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; // Reduced shadow
flashcardContainer.appendChild(feedback);


    // Fade in
    setTimeout(() => {
        feedback.style.opacity = '0.7';
    }, 10);

    // Fade out and remove after 1 second
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            feedback.remove();
            if (autoAdvance) {
                currentWordIndex++;
                showCurrentWord();
            } else {
                // Show continue button if auto-advance is off
                const continueBtn = flashcardContainer.querySelector('.continue-btn');
                if (continueBtn) {
                    continueBtn.style.display = 'block';
                }
            }
        }, 300);
    }, 1000);
}

function generateOptions(currentWord) {
    const options = [];
    const allWords = parseVocabData();
    
    // Add the correct answer
    options.push({
        text: `<strong>${currentWord.vietnameseMeaning}</strong> - ${currentWord.definition || 'No definition available'}`,
        isCorrect: true
    });
    
    // Filter out words with empty definitions/meanings
    const validWords = allWords.filter(word => {
        return word.VietnameseMeaning && 
               word.VietnameseMeaning.trim() !== '' && 
               word.VietnameseMeaning !== currentWord.vietnameseMeaning;
    });
    
    // Get random incorrect options
    const shuffledWords = [...validWords];
    shuffleArray(shuffledWords);
    
    for (let i = 0; i < NUM_OPTIONS - 1 && i < shuffledWords.length; i++) {
        options.push({
            text: `<strong>${shuffledWords[i].VietnameseMeaning}</strong> - ${shuffledWords[i].Definition || 'No definition available'}`,
            isCorrect: false
        });
    }
    
    // If we don't have enough options (rare case), generate some placeholder options
    while (options.length < NUM_OPTIONS) {
        options.push({
            text: `<strong>Không có nghĩa</strong> - No definition available (placeholder option)`,
            isCorrect: false
        });
    }
    
    return options;
}

function showCompletionScreen() {
    const flashcardContainer = document.querySelector('.flashcard-container');
    
    // Keep the scrollable settings
    flashcardContainer.style.maxHeight = '80vh';
    flashcardContainer.style.overflowY = 'auto';
    
    let content = `
        <div style="text-align: center; padding: 40px 20px;">
            <h2 style="color: #4CAF50; font-size: 2em;">Learning Complete! 🎉</h2>
            <p style="font-size: 1.2em; margin: 20px 0;">You've successfully learned all the vocabulary words!</p>
            
            <div style="margin: 30px 0;">
                <button class="restart-learning" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 15px;">Start Again</button>
                <button class="return-to-flashcards" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Return to Flashcards</button>
            </div>
        </div>
    `;
    
    flashcardContainer.innerHTML = content;
    
    flashcardContainer.querySelector('.restart-learning').addEventListener('click', function() {
        startLearningMode();
    });
    
    flashcardContainer.querySelector('.return-to-flashcards').addEventListener('click', function() {
    // Reset container styles before showing flashcards
    flashcardContainer.style.maxHeight = '';
    flashcardContainer.style.overflowY = '';
    showFlashcards();
});
}

// Utility function to shuffle an array in place
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Add Learn button to the flashcard display function
function addLearnButtonToFlashcards() {
    const originalShowFlashcards = showFlashcards;
    
    // Override the original showFlashcards function
    showFlashcards = function() {
        // Call the original function first
        originalShowFlashcards();
        
        // Add the learn button to the actions section
        const actionsDiv = document.querySelector('.flashcard-actions');
        if (actionsDiv) {
            const learnBtn = document.createElement('button');
            learnBtn.className = 'start-learning-btn';
            learnBtn.textContent = 'Learn Words';
            learnBtn.style.padding = '8px 15px';
            learnBtn.style.background = '#2196F3';
            learnBtn.style.color = 'white';
            learnBtn.style.border = 'none';
            learnBtn.style.borderRadius = '4px';
            learnBtn.style.cursor = 'pointer';
            learnBtn.style.marginLeft = '10px';
            
            learnBtn.addEventListener('click', startLearningMode);
            
            actionsDiv.appendChild(learnBtn);
        }
    };
}

// Initialize the learning mode enhancements
document.addEventListener('DOMContentLoaded', function() {
    addLearnButtonToFlashcards();
});