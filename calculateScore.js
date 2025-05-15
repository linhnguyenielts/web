// Global variable to store highlights that will be shown after submission
let pendingHighlights = [];
// Global variable to store answer highlights that will be shown after submission
let pendingAnswerHighlights = [];

document.addEventListener('DOMContentLoaded', function() {
    // Create note display panel at top left
    const noteDisplayPanel = document.createElement('div');
    noteDisplayPanel.id = 'note-display-panel';
    noteDisplayPanel.style.position = 'fixed';
    noteDisplayPanel.style.top = '10px';
    noteDisplayPanel.style.right = '10px';
    noteDisplayPanel.style.backgroundColor = 'white';
    noteDisplayPanel.style.border = '1px solid #ccc';
    noteDisplayPanel.style.borderRadius = '4px';
    noteDisplayPanel.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    noteDisplayPanel.style.padding = '12px';
    noteDisplayPanel.style.width = '300px';
    noteDisplayPanel.style.maxHeight = '400px';
    noteDisplayPanel.style.overflowY = 'auto';
    noteDisplayPanel.style.zIndex = '2000';
    noteDisplayPanel.style.display = 'none';
    noteDisplayPanel.innerHTML = '<div id="note-content"></div><button id="close-note" style="margin-top:8px;padding:4px 8px;border:none;background:#f0f0f0;border-radius:4px;cursor:pointer;">Close</button>';
    document.body.appendChild(noteDisplayPanel);
    
    document.getElementById('close-note').addEventListener('click', function() {
        noteDisplayPanel.style.display = 'none';
    });
    
    // Add context menu for text selection
    const passageColumns = document.querySelectorAll('.passage-column');
    
    passageColumns.forEach(passage => {
        passage.addEventListener('mouseup', function(e) {
            const selection = window.getSelection();
            if (!selection.isCollapsed && selection.rangeCount > 0) {
                // Check if selection is within the passage content
                const range = selection.getRangeAt(0);
                if (passage.contains(range.commonAncestorContainer)) {
                    showSelectionMenu(e, selection);
                }
            }
        });
    });
    
    // Create context menu for text selection
    // In the showSelectionMenu function, modify the menu creation part:

function showSelectionMenu(e, selection) {
    // Remove any existing menu
    const existingMenu = document.getElementById('selection-menu');
    if (existingMenu) existingMenu.remove();
    
    // Create menu
    const menu = document.createElement('div');
    menu.id = 'selection-menu';
    menu.style.position = 'absolute';
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '4px';
    menu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    menu.style.zIndex = '1000';
    menu.style.display = 'flex';
    menu.style.padding = '4px';
    menu.style.gap = '4px';
    
    // Add learn button (first/left)
    const learnBtn = document.createElement('button');
    learnBtn.innerHTML = 'Learn';
    learnBtn.style.padding = '6px 10px';
    learnBtn.style.border = 'none';
    learnBtn.style.background = 'none';
    learnBtn.style.cursor = 'pointer';
    learnBtn.style.borderRadius = '4px';
    learnBtn.addEventListener('mouseenter', () => learnBtn.style.backgroundColor = '#f0f0f0');
    learnBtn.addEventListener('mouseleave', () => learnBtn.style.backgroundColor = 'transparent');
    learnBtn.addEventListener('click', function() {
        const selectedText = selection.toString().trim();
        if (selectedText && /^\w+$/.test(selectedText)) {
            addWordToVocabularyList(selectedText);
        }
        menu.remove();
    });
    const selectedText = selection.toString().trim();
if (/^[\p{L}]+(-[\p{L}]+)*$/u.test(selectedText)) {
    menu.appendChild(learnBtn);
}

    
    // Add note button (middle)
    const noteBtn = document.createElement('button');
    noteBtn.innerHTML = 'Note';
    noteBtn.style.padding = '6px 10px';
    noteBtn.style.border = 'none';
    noteBtn.style.background = 'none';
    noteBtn.style.cursor = 'pointer';
    noteBtn.style.borderRadius = '4px';
    noteBtn.addEventListener('mouseenter', () => noteBtn.style.backgroundColor = '#f0f0f0');
    noteBtn.addEventListener('mouseleave', () => noteBtn.style.backgroundColor = 'transparent');
    noteBtn.addEventListener('click', function() {
        addNoteToSelection(selection);
        menu.remove();
    });
    menu.appendChild(noteBtn);
    
    // Add highlight button (right)
    const highlightBtn = document.createElement('button');
    highlightBtn.innerHTML = 'Highlight';
    highlightBtn.style.padding = '6px 10px';
    highlightBtn.style.border = 'none';
    highlightBtn.style.background = 'none';
    highlightBtn.style.cursor = 'pointer';
    highlightBtn.style.borderRadius = '4px';
    highlightBtn.addEventListener('mouseenter', () => highlightBtn.style.backgroundColor = '#f0f0f0');
    highlightBtn.addEventListener('mouseleave', () => highlightBtn.style.backgroundColor = 'transparent');
    highlightBtn.addEventListener('click', function() {
        applyUserHighlight(selection);
        menu.remove();
    });
    menu.appendChild(highlightBtn);
    
    document.body.appendChild(menu);
    
    // Close menu when clicking elsewhere
    const closeMenu = function() {
        menu.remove();
        document.removeEventListener('click', closeMenu);
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 100);
}
    // Function to apply user highlight immediately
    function applyUserHighlight(selection) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        const span = document.createElement('span');
        span.className = 'user-highlight'; // Changed class name to distinguish from answer highlights
        span.style.backgroundColor = 'rgba(255, 255, 0, 0.4)';
        span.style.cursor = 'pointer';
        span.style.position = 'relative';
        
        // Store original text
        span.dataset.originalText = selectedText;
        
        try {
            range.surroundContents(span);
            selection.removeAllRanges();
        } catch(e) {
            console.error("Could not apply highlight:", e);
        }
    }
    
    // Store highlight selection for later application (no longer used for user highlights)
    function storeHighlightSelection(selection) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        const container = range.commonAncestorContainer;
        
        // Create a unique identifier for this selection
        const id = 'highlight-' + Date.now();
        
        // Store information about the selection
        pendingHighlights.push({
            id: id,
            text: selectedText,
            container: container,
            range: range.cloneRange()
        });
    }
    
    // Add note to selected text
    function addNoteToSelection(selection) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        // Create input panel in top left
        const noteDisplayPanel = document.getElementById('note-display-panel');
        const noteContent = document.getElementById('note-content');
        
        // Create text area for note input
        const textArea = document.createElement('textarea');
        textArea.style.width = '100%';
        textArea.style.minHeight = '100px';
        textArea.style.padding = '8px';
        textArea.style.marginBottom = '10px';
        textArea.style.border = '1px solid #ccc';
        textArea.style.borderRadius = '4px';
        textArea.placeholder = 'Enter your note for: "' + 
            (selectedText.length > 30 ? selectedText.substring(0, 30) + '...' : selectedText) + '"';
        
        // Create save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Note';
        saveButton.style.padding = '6px 12px';
        saveButton.style.backgroundColor = '#4bacc6';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.marginRight = '8px';
        
        // Create cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '6px 12px';
        cancelButton.style.backgroundColor = '#f0f0f0';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        
        // Clear the display panel and add new elements
        noteContent.innerHTML = '';
        noteContent.appendChild(textArea);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        noteContent.appendChild(buttonContainer);
        
        // Hide the close button while in note entry mode
        document.getElementById('close-note').style.display = 'none';
        
        // Show the note panel
        noteDisplayPanel.style.display = 'block';
        
        // Focus the text area
        textArea.focus();
        
        // Handle save button click
        saveButton.addEventListener('click', function() {
            const noteText = textArea.value.trim();
            if (noteText) {
                const span = document.createElement('span');
                span.className = 'text-note';
                span.style.backgroundColor = 'rgba(173, 216, 230, 0.4)';
                span.style.cursor = 'pointer';
                span.style.position = 'relative';
                
                // Store note and original text
                span.dataset.note = noteText;
                span.dataset.originalText = selectedText;
                
                range.surroundContents(span);
                selection.removeAllRanges();
                
                // Hide the note entry panel
                noteDisplayPanel.style.display = 'none';
                
                // Restore the close button
                document.getElementById('close-note').style.display = 'block';
            }
        });
        
        // Cancel button click
        cancelButton.addEventListener('click', function() {
            // Hide the note entry panel
            noteDisplayPanel.style.display = 'none';
            
            // Restore the close button
            document.getElementById('close-note').style.display = 'block';
        });
    }
    
    // Handle clicks on highlights and notes
    document.addEventListener('click', function(e) {
        const highlight = e.target.closest('.user-highlight, .text-highlight');
        const note = e.target.closest('.text-note');
        
        // Remove any existing action menus
        const existingActionMenu = document.getElementById('highlight-action-menu');
        if (existingActionMenu) existingActionMenu.remove();
        
        if (highlight) {
            e.preventDefault();
            e.stopPropagation();
            
            // Create action menu for highlight
            const actionMenu = document.createElement('div');
            actionMenu.id = 'highlight-action-menu';
            actionMenu.style.position = 'absolute';
            actionMenu.style.left = `${e.pageX}px`;
            actionMenu.style.top = `${e.pageY}px`;
            actionMenu.style.backgroundColor = 'white';
            actionMenu.style.border = '1px solid #ccc';
            actionMenu.style.borderRadius = '4px';
            actionMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            actionMenu.style.zIndex = '1000';
            actionMenu.style.padding = '4px';
            
            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'Remove highlight';
            deleteBtn.style.padding = '6px 10px';
            deleteBtn.style.border = 'none';
            deleteBtn.style.background = 'none';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.borderRadius = '4px';
            deleteBtn.style.display = 'flex';
            deleteBtn.style.alignItems = 'center';
            deleteBtn.style.gap = '6px';
            deleteBtn.addEventListener('mouseenter', () => deleteBtn.style.backgroundColor = '#f0f0f0');
            deleteBtn.addEventListener('mouseleave', () => deleteBtn.style.backgroundColor = 'transparent');
            deleteBtn.addEventListener('click', function() {
                removeHighlight(highlight);
                actionMenu.remove();
            });
            actionMenu.appendChild(deleteBtn);
            
            document.body.appendChild(actionMenu);
            
            // Close menu when clicking elsewhere
            const closeMenu = function() {
                actionMenu.remove();
                document.removeEventListener('click', closeMenu);
            };
            
            setTimeout(() => {
                document.addEventListener('click', closeMenu);
            }, 100);
        }
        else if (note) {
            e.preventDefault();
            e.stopPropagation();
            
            // Display the note in the top-left panel
            const noteContent = document.getElementById('note-content');
            noteContent.innerHTML = '';
            
            // Create a div to show the highlighted text
            const highlightedTextDiv = document.createElement('div');
            highlightedTextDiv.style.fontStyle = 'italic';
            highlightedTextDiv.style.color = '#666';
            highlightedTextDiv.style.marginBottom = '8px';
            highlightedTextDiv.style.padding = '4px';
            highlightedTextDiv.style.backgroundColor = '#f9f9f9';
            highlightedTextDiv.style.borderLeft = '3px solid #ccc';
            highlightedTextDiv.textContent = '"' + note.dataset.originalText + '"';
            
            // Create a div for the note content
            const noteTextDiv = document.createElement('div');
            noteTextDiv.style.whiteSpace = 'pre-wrap';
            noteTextDiv.textContent = note.dataset.note;
            
            // Add both to the note panel
            noteContent.appendChild(highlightedTextDiv);
            noteContent.appendChild(noteTextDiv);
            
            // Show the note panel
            noteDisplayPanel.style.display = 'block';
            
            // Create action menu for note
            const actionMenu = document.createElement('div');
            actionMenu.id = 'highlight-action-menu';
            actionMenu.style.position = 'absolute';
            actionMenu.style.left = `${e.pageX}px`;
            actionMenu.style.top = `${e.pageY}px`;
            actionMenu.style.backgroundColor = 'white';
            actionMenu.style.border = '1px solid #ccc';
            actionMenu.style.borderRadius = '4px';
            actionMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            actionMenu.style.zIndex = '1000';
            actionMenu.style.padding = '4px';
            actionMenu.style.display = 'flex';
            actionMenu.style.flexDirection = 'column';
            actionMenu.style.gap = '4px';
            
            // Add view/edit button
            const editBtn = document.createElement('button');
            editBtn.innerHTML = 'Edit note';
            editBtn.style.padding = '6px 10px';
            editBtn.style.border = 'none';
            editBtn.style.background = 'none';
            editBtn.style.cursor = 'pointer';
            editBtn.style.borderRadius = '4px';
            editBtn.style.display = 'flex';
            editBtn.style.alignItems = 'center';
            editBtn.style.gap = '6px';
            editBtn.addEventListener('mouseenter', () => editBtn.style.backgroundColor = '#f0f0f0');
            editBtn.addEventListener('mouseleave', () => editBtn.style.backgroundColor = 'transparent');
            editBtn.addEventListener('click', function() {
                // Remove the action menu
                actionMenu.remove();
                
                // Clear the note content area
                noteContent.innerHTML = '';
                
                // Create text area for note input
                const textArea = document.createElement('textarea');
                textArea.style.width = '100%';
                textArea.style.minHeight = '100px';
                textArea.style.padding = '8px';
                textArea.style.marginBottom = '10px';
                textArea.style.border = '1px solid #ccc';
                textArea.style.borderRadius = '4px';
                textArea.value = note.dataset.note;
                
                // Create save button
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save Changes';
                saveButton.style.padding = '6px 12px';
                saveButton.style.backgroundColor = '#4CAF50';
                saveButton.style.color = 'white';
                saveButton.style.border = 'none';
                saveButton.style.borderRadius = '4px';
                saveButton.style.cursor = 'pointer';
                saveButton.style.marginRight = '8px';
                
                // Create cancel button
                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel';
                cancelButton.style.padding = '6px 12px';
                cancelButton.style.backgroundColor = '#f0f0f0';
                cancelButton.style.border = 'none';
                cancelButton.style.borderRadius = '4px';
                cancelButton.style.cursor = 'pointer';
                
                // Add the elements to the note panel
                noteContent.appendChild(textArea);
                
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.appendChild(saveButton);
                buttonContainer.appendChild(cancelButton);
                noteContent.appendChild(buttonContainer);
                
                // Hide the close button while in edit mode
                document.getElementById('close-note').style.display = 'none';
                
                // Show the note panel
                noteDisplayPanel.style.display = 'block';
                
                // Focus the text area
                textArea.focus();
                
                // Handle save button click
                saveButton.addEventListener('click', function() {
                    const newNote = textArea.value.trim();
                    if (newNote) {
                        note.dataset.note = newNote;
                        
                        // Update the note display panel
                        const highlightedTextDiv = document.createElement('div');
                        highlightedTextDiv.style.fontStyle = 'italic';
                        highlightedTextDiv.style.color = '#666';
                        highlightedTextDiv.style.marginBottom = '8px';
                        highlightedTextDiv.style.padding = '4px';
                        highlightedTextDiv.style.backgroundColor = '#f9f9f9';
                        highlightedTextDiv.style.borderLeft = '3px solid #ccc';
                        highlightedTextDiv.textContent = '"' + note.dataset.originalText + '"';
                        
                        const noteTextDiv = document.createElement('div');
                        noteTextDiv.style.whiteSpace = 'pre-wrap';
                        noteTextDiv.textContent = newNote;
                        
                        noteContent.innerHTML = '';
                        noteContent.appendChild(highlightedTextDiv);
                        noteContent.appendChild(noteTextDiv);
                        
                        // Restore the close button
                        document.getElementById('close-note').style.display = 'block';
                    }
                });
                
                // Handle cancel button click
                cancelButton.addEventListener('click', function() {
                    // Restore the note display
                    const highlightedTextDiv = document.createElement('div');
                    highlightedTextDiv.style.fontStyle = 'italic';
                    highlightedTextDiv.style.color = '#666';
                    highlightedTextDiv.style.marginBottom = '8px';
                    highlightedTextDiv.style.padding = '4px';
                    highlightedTextDiv.style.backgroundColor = '#f9f9f9';
                    highlightedTextDiv.style.borderLeft = '3px solid #ccc';
                    highlightedTextDiv.textContent = '"' + note.dataset.originalText + '"';
                    
                    const noteTextDiv = document.createElement('div');
                    noteTextDiv.style.whiteSpace = 'pre-wrap';
                    noteTextDiv.textContent = note.dataset.note;
                    
                    noteContent.innerHTML = '';
                    noteContent.appendChild(highlightedTextDiv);
                    noteContent.appendChild(noteTextDiv);
                    
                    // Restore the close button
                    document.getElementById('close-note').style.display = 'block';
                });
            });
            actionMenu.appendChild(editBtn);
            
            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'Remove note';
            deleteBtn.style.padding = '6px 10px';
            deleteBtn.style.border = 'none';
            deleteBtn.style.background = 'none';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.borderRadius = '4px';
            deleteBtn.style.display = 'flex';
            deleteBtn.style.alignItems = 'center';
            deleteBtn.style.gap = '6px';
            deleteBtn.addEventListener('mouseenter', () => deleteBtn.style.backgroundColor = '#f0f0f0');
            deleteBtn.addEventListener('mouseleave', () => deleteBtn.style.backgroundColor = 'transparent');
            deleteBtn.addEventListener('click', function() {
                removeHighlight(note);
                actionMenu.remove();
                // Hide the note display panel
                noteDisplayPanel.style.display = 'none';
            });
            actionMenu.appendChild(deleteBtn);
            
            document.body.appendChild(actionMenu);
            
            // Close menu when clicking elsewhere
            const closeMenu = function() {
                actionMenu.remove();
                document.removeEventListener('click', closeMenu);
            };
            
            setTimeout(() => {
                document.addEventListener('click', closeMenu);
            }, 100);
        }
    });
    
    // Remove highlight or note
    function removeHighlight(element) {
        const parent = element.parentNode;
        const textNode = document.createTextNode(element.dataset.originalText);
        parent.replaceChild(textNode, element);
        normalizeTextNodes(parent);
    }
    
    // Helper function to normalize text nodes after modifications
    function normalizeTextNodes(element) {
        element.normalize();
    }

    // Store all answer highlights to be shown after submission
    // Initially hide all answer highlights
    document.querySelectorAll('.answer-highlight').forEach(highlight => {
        pendingAnswerHighlights.push(highlight);
        
        // Remove highlight styling but keep text visible
        highlight.style.backgroundColor = 'transparent';
        highlight.style.border = 'none';
        highlight.style.boxShadow = 'none';
        highlight.style.padding = '0';
        highlight.style.margin = '0';
    });
});

// Function to apply answer highlights after submission
function applyPendingHighlights() {
    // Show all answer highlights
    pendingAnswerHighlights.forEach(highlight => {
        highlight.style.backgroundColor = 'rgba(144, 238, 144, 0.4)'; // Light green
        highlight.style.border = '1px solid #90EE90';
        highlight.style.padding = '0 2px';
        highlight.style.margin = '0 1px';
    });
    
    // Clear the pending highlights
    pendingAnswerHighlights = [];
}

// Modify the calculateScore function to apply highlights after submission
function calculateScore(isTimedScore = false) {
    // Only stop timer and disable button for final submission
    if (!isTimedScore) {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        document.querySelector('.submit-button').disabled = true;
    }

    let score = 0;

    // 1. Check radio button questions (TRUE/FALSE/NOT GIVEN, YES/NO/NOT GIVEN)
    document.querySelectorAll('.options[data-correct]').forEach(optionGroup => {
        if (optionGroup.querySelector('input[type="radio"]')) {
            const correctValue = optionGroup.getAttribute('data-correct');
            const selected = optionGroup.querySelector('input[type="radio"]:checked');

            // Highlight all options
            optionGroup.querySelectorAll('input[type="radio"]').forEach(radio => {
                const label = radio.parentElement;

                // Highlight correct answer in green
                if (radio.value === correctValue) {
                    label.classList.add('correct-answer');
                }

                // If this was selected but incorrect, highlight in red
                if (selected && radio === selected && radio.value !== correctValue) {
                    label.classList.add('incorrect-answer');
                }
            });

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
            const allChecked = optionGroup.querySelectorAll('input[type="checkbox"]');

            // Highlight all checkbox options
            allChecked.forEach(checkbox => {
                const label = checkbox.parentElement;

                // Highlight correct answers in green
                if (correctValues.includes(checkbox.value)) {
                    label.classList.add('correct-answer');
                }

                // Highlight incorrect selections in red
                if (checkbox.checked && !correctValues.includes(checkbox.value)) {
                    label.classList.add('incorrect-answer');
                }

                // Highlight missed correct answers (correct but not selected)
                if (!checkbox.checked && correctValues.includes(checkbox.value)) {
                    label.classList.add('missed-answer');
                }
            });

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
    // Skip if this input has already been processed (to prevent duplicates)
    if (input.classList.contains('processed')) {
        return;
    }
    
    const correctAnswers = input.getAttribute('data-correct').split('|');
    const userAnswer = input.value.trim().toLowerCase();
    const isCorrect = correctAnswers.some(ans => 
        userAnswer === ans.trim().toLowerCase());
    
    if (isCorrect) {
        input.classList.add('correct-answer-blank');
        score++;
    } else {
        input.classList.add('incorrect-answer-blank');
        
        // Only add the hint if it doesn't already exist
        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('correct-answer-hint')) {
            // Show all correct answers (including alternatives) next to the input
            const correctHint = document.createElement('span');
            correctHint.className = 'correct-answer-hint';
            
            // Format the correct answers display
            if (correctAnswers.length > 1) {
                correctHint.textContent = `Correct: ${correctAnswers.join('/')}`;
            } else {
                correctHint.textContent = `Correct: ${correctAnswers[0]}`;
            }
            
            // Create a container span to keep input and hint on same line
            const container = document.createElement('span');
            container.className = 'answer-container';
            input.parentNode.insertBefore(container, input);
            container.appendChild(input);
            container.appendChild(correctHint);
        }
    }
    
    // Mark this input as processed
    input.classList.add('processed');
});

    // 4. Check dropdown questions
document.querySelectorAll('select.dropdown[data-correct]').forEach(select => {
    // Skip if already processed
    if (select.classList.contains('processed')) return;

    const isCorrect = select.value === select.getAttribute('data-correct');

    if (isCorrect) {
        select.classList.add('correct-answer');
        score++;
    } else {
        select.classList.add('incorrect-answer');
        // Only add hint if it doesn't exist
        if (!select.nextElementSibling || !select.nextElementSibling.classList.contains('correct-hint')) {
            const correctOption = select.querySelector(`option[value="${select.getAttribute('data-correct')}"]`);
            if (correctOption) {
                const correctHint = document.createElement('span');
                correctHint.className = 'correct-hint';
                correctHint.textContent = `Correct: ${correctOption.textContent}`;
                select.insertAdjacentElement('afterend', correctHint);
            }
        }
    }
    select.classList.add('processed');
});

   // 5. Check drag and drop questions
document.querySelectorAll('.drop-box[data-correct]').forEach(box => {
    // Skip if already processed
    if (box.classList.contains('processed')) return;

    const draggable = box.querySelector('.draggable');
    const correctValues = box.getAttribute('data-correct').split(',');

    if (draggable && correctValues.some(correct =>
        draggable.textContent.trim().startsWith(correct))) {
        box.classList.add('correct-answer');
        score++;
    } else {
        box.classList.add('incorrect-answer');
        // Only add hint if it doesn't exist
        if (!box.nextElementSibling || !box.nextElementSibling.classList.contains('correct-hint')) {
            const correctHint = document.createElement('span');
            correctHint.className = 'correct-hint';
            correctHint.textContent = ` Correct: ${correctValues[0]}`;
            correctHint.style.display = 'inline';
            correctHint.style.marginLeft = '0.5em';
            box.insertAdjacentElement('afterend', correctHint);
        }
    }
    box.classList.add('processed');
});
    // Disable all input fields, radio buttons, checkboxes, and dropdowns
    disableAllInputs();
    // Display the score
    if (!isTimedScore) {
        // Only disable inputs and show highlights for final submission
        disableAllInputs();
        applyPendingHighlights();
        showAnswerHighlights();
		addLocateButtons();
createTranslationButton();
showColorsStyle();
showLearnVocabButton();
enableWordSelection();
window.isSubmitted = true;
        const scoreDisplay = document.querySelector('.score-display');

if (scoreDisplay) {
    if (isTimerExpired) {
        // Check if "Submit Now" was clicked (without extra time)
        if (window.submitNowClicked) {
            scoreDisplay.innerHTML = `
                <div class="scores-container">
                    <div>Standard time Score: ${timedScore}/40</div>
                </div>
            `;
        } else {
            // User used extra time
            const extraTime = window.extraTimeUsed || { minutes: 0, seconds: 0 };
            const formattedMinutes = extraTime.minutes < 10 ? "0" + extraTime.minutes : extraTime.minutes;
            const formattedSeconds = extraTime.seconds < 10 ? "0" + extraTime.seconds : extraTime.seconds;
            
            scoreDisplay.innerHTML = `
    <div class="scores-container" style="display: flex; flex-direction: row; gap: 20px; align-items: center;">
        <div>Standard time Score: ${timedScore}/40</div>
        <div>Extended time Score: ${score}/40</div>
    </div>
`;
        }
    } else {
        scoreDisplay.innerHTML = `
            <div>Score: ${score}/40</div>
        `;
    }
    scoreDisplay.style.display = 'block';
} else {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        const newScoreSpan = document.createElement('span');
        newScoreSpan.id = 'score';
        
        if (isTimerExpired) {
            // Check if "Submit Now" was clicked (without extra time)
            if (window.submitNowClicked) {
                newScoreSpan.textContent = `Standard time Score: ${timedScore}/40`;
            } else {
                // User used extra time
                const extraTime = window.extraTimeUsed || { minutes: 0, seconds: 0 };
                const formattedMinutes = extraTime.minutes < 10 ? "0" + extraTime.minutes : extraTime.minutes;
                const formattedSeconds = extraTime.seconds < 10 ? "0" + extraTime.seconds : extraTime.seconds;
                
                newScoreSpan.innerHTML = `
                    <span style="margin-right: 20px;">Standard time: ${timedScore}/40</span>
                    <span style="margin-right: 20px;">Extra time: ${formattedMinutes}:${formattedSeconds}</span>
                    <span>Final: ${score}/40</span>
                `;
            }
        } else {
            newScoreSpan.textContent = `${score}/40`;
        }
        
        scoreElement.parentNode.replaceChild(newScoreSpan, scoreElement);
    }
}
    }
    if (!isTimedScore) {
        sendResultsToFormspree(score, isTimedScore);
    }
    return score;
	
}

// Function to disable all input fields, radio buttons, checkboxes, and dropdowns
function disableAllInputs() {
    // Disable text inputs
    document.querySelectorAll('input[type="text"].blank-input').forEach(input => {
        input.disabled = true;
    });

    // Disable radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.disabled = true;
    });

    // Disable checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.disabled = true;
    });

    // Disable dropdowns
    document.querySelectorAll('select.dropdown').forEach(select => {
        select.disabled = true;
    });

    // Disable drag and drop items if necessary
    document.querySelectorAll('.draggable').forEach(draggable => {
        draggable.draggable = false; // Disable dragging
    });
}

