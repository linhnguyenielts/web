document.addEventListener('DOMContentLoaded', function() {
    initializeBookmarks();
});

function initializeBookmarks() {
    // Add click listeners to all questions
    document.querySelectorAll('.question, .blank-input, .statement-with-dropdown, .drop-box').forEach(item => {
        // For regular questions
        if (item.classList.contains('question')) {
            handleQuestionBookmark(item);
        } 
        // For fill-in-the-blank questions
        else if (item.classList.contains('blank-input')) {
            handleBlankBookmark(item);
        }
		// For dropdown questions
		else if (item.classList.contains('statement-with-dropdown')) {
        handleDropdownBookmark(item);
		}
		// For drag and drop questions
        else if (item.classList.contains('drop-box')) {
            handleDragDropBookmark(item);
        }
    });
    
    // Hide bookmark icons when clicking outside questions
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.question') && !event.target.closest('.blank-input')) {
            document.querySelectorAll('.bookmark-icon').forEach(icon => {
                icon.style.display = 'none';
            });
        }
    });
    
    // Restore bookmarked state from localStorage if any
    restoreBookmarks();
}
function handleQuestionBookmark(question) {
    // Get the question number from the id (e.g., "question1" -> "1")
    const questionId = question.id;
    if (!questionId) return;
    
    const questionNumber = questionId.replace('question', '');
    
    // Create bookmark icon if it doesn't exist
    if (!question.querySelector('.bookmark-icon')) {
        const bookmarkIcon = document.createElement('div');
        bookmarkIcon.className = 'bookmark-icon';
        bookmarkIcon.innerHTML = '&#9733;'; // Bookmark symbol
        bookmarkIcon.style.display = 'none'; // Initially hidden
        bookmarkIcon.dataset.questionNumber = questionNumber;
        
        // Add click event to toggle bookmark state
        bookmarkIcon.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the question click event from firing
            toggleBookmark(this, questionNumber);
        });
        
        // Append bookmark icon to question
        question.appendChild(bookmarkIcon);
    }
    
    // Add click event to question to show bookmark icon
    question.addEventListener('click', function(event) {
        // Hide all bookmark icons first
        document.querySelectorAll('.bookmark-icon').forEach(icon => {
            icon.style.display = 'none';
        });
        
        // Show this question's bookmark icon
        const bookmarkIcon = this.querySelector('.bookmark-icon');
        if (bookmarkIcon) {
            bookmarkIcon.style.display = 'block';
        }
    });
}

function handleBlankBookmark(blankInput) {
    const blankId = blankInput.id;
    if (!blankId) return;
    // Check if bookmark icon already exists
    if (!blankInput.nextElementSibling || !blankInput.nextElementSibling.classList.contains('bookmark-icon')) {
        const bookmarkIcon = document.createElement('div');
        bookmarkIcon.className = 'bookmark-icon blank-bookmark';
        bookmarkIcon.innerHTML = '&#9733;';
        bookmarkIcon.style.display = 'none';
        bookmarkIcon.dataset.questionNumber = blankId;
        // Style the bookmark icon
        bookmarkIcon.style.position = 'absolute';
        bookmarkIcon.style.right = '5px';
        bookmarkIcon.style.top = 'calc(50% - 16px)';
        bookmarkIcon.style.transform = 'translateY(-50%)';
        bookmarkIcon.style.cursor = 'pointer';
        bookmarkIcon.style.pointerEvents = 'auto';
        // Add right padding to input
        blankInput.style.paddingRight = '20px';
        // Create a wrapper to contain input and icon without affecting line height
        const wrapper = document.createElement('span');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.verticalAlign = 'middle';
        // Preserve original margins of the input
        wrapper.style.margin = window.getComputedStyle(blankInput).margin;
        blankInput.style.margin = '0'; // Reset margin for correct alignment inside wrapper
        // Insert wrapper before input and move input + icon inside it
        blankInput.parentNode.insertBefore(wrapper, blankInput);
        wrapper.appendChild(blankInput);
        wrapper.appendChild(bookmarkIcon);
        
        // Check if this input is in the same div as other inputs
        const parentDiv = wrapper.parentNode;
        const inputsInSameDiv = parentDiv.querySelectorAll('input').length;
        if (inputsInSameDiv > 1) {
            // Adjust the bookmark position up by 5px when in the same div as other inputs
            bookmarkIcon.style.top = 'calc(50% - 16px)';
        }
        
        // Click listener for the bookmark icon
        bookmarkIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleBookmark(this, blankId);
        });
    }
    // When input is clicked, show its bookmark icon and hide others
    blankInput.addEventListener('click', function(event) {
        document.querySelectorAll('.bookmark-icon').forEach(icon => {
            icon.style.display = 'none';
        });
        const bookmarkIcon = this.nextElementSibling;
        if (bookmarkIcon && bookmarkIcon.classList.contains('bookmark-icon')) {
            bookmarkIcon.style.display = 'block';
        }
    });
}

function toggleBookmark(bookmarkIcon, questionNumber) {
    // Toggle active class
    bookmarkIcon.classList.toggle('active');
    
    // Extract just the number part if questionNumber is like "question9"
    const numberOnly = questionNumber.replace(/\D+/g, '');
    
    // Update the corresponding question number in navigation
    const questionStatus = document.getElementById(`q${numberOnly}-status`);
    if (questionStatus) {
        questionStatus.classList.toggle('bookmarked', bookmarkIcon.classList.contains('active'));
    }
    
    // Save bookmark state to localStorage
    saveBookmarks();
	updateBookmarkedParts();
}

function saveBookmarks() {
    const bookmarks = {};
    document.querySelectorAll('.bookmark-icon.active').forEach(icon => {
        const questionNumber = icon.dataset.questionNumber;
        bookmarks[questionNumber] = true;
    });
    
    localStorage.setItem('ieltsBookmarks', JSON.stringify(bookmarks));
}

function restoreBookmarks() {
    const savedBookmarks = localStorage.getItem('ieltsBookmarks');
    if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        
        // For each saved bookmark, toggle the state
        Object.keys(bookmarks).forEach(questionNumber => {
            // Extract just the number part if questionNumber is like "question9"
            const numberOnly = questionNumber.replace(/\D+/g, '');
            
            // Could be either a regular question or a blank input
            const bookmarkIcon = document.querySelector(`.bookmark-icon[data-question-number="${questionNumber}"]`);
            const questionStatus = document.getElementById(`q${numberOnly}-status`);
            
            if (bookmarkIcon) {
                bookmarkIcon.classList.add('active');
            }
            
            if (questionStatus) {
                questionStatus.classList.add('bookmarked');
            }
        });
    }
}
function handleDropdownBookmark(dropdownContainer) {
    // Find the statement text element which contains the ID
    const statementText = dropdownContainer.querySelector('.statement-text');
    if (!statementText || !statementText.id) return;
    
    // Find the dropdown container where we'll place the bookmark icon
    const dropdownSelect = dropdownContainer.querySelector('.dropdown-container');
    if (!dropdownSelect) return;
    
    const questionId = statementText.id;
    const questionNumber = questionId.replace('question', '');
    
    // Create bookmark icon if it doesn't exist
    if (!dropdownSelect.querySelector('.bookmark-icon')) {
        const bookmarkIcon = document.createElement('div');
        bookmarkIcon.className = 'bookmark-icon dropdown-bookmark';
        bookmarkIcon.innerHTML = '&#9733;'; // Bookmark symbol
        bookmarkIcon.style.display = 'none'; // Initially hidden
        bookmarkIcon.dataset.questionNumber = questionId;
        
        // Style the bookmark icon for dropdown
        bookmarkIcon.style.position = 'absolute';
        bookmarkIcon.style.right = '-25px'; // Position it to the right of the dropdown
        bookmarkIcon.style.top = 'calc(50% - 15px)'; // Move 10px upward from center
        bookmarkIcon.style.transform = 'translateY(-50%)';
        bookmarkIcon.style.cursor = 'pointer';
        bookmarkIcon.style.zIndex = '10'; // Ensure it's above other elements
        
        // Add click event to toggle bookmark state
        bookmarkIcon.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the dropdown click event from firing
            toggleBookmark(this, questionId);
        });
        
        // Make the dropdown container position relative for absolute positioning of the icon
        dropdownSelect.style.position = 'relative';
        
        // Append bookmark icon to dropdown container
        dropdownSelect.appendChild(bookmarkIcon);
    }
    
    // Add click event to dropdown container to show bookmark icon
    dropdownContainer.addEventListener('click', function(event) {
        // Hide all bookmark icons first
        document.querySelectorAll('.bookmark-icon').forEach(icon => {
            icon.style.display = 'none';
        });
        
        // Show this dropdown's bookmark icon
        const bookmarkIcon = dropdownContainer.querySelector('.bookmark-icon');
        if (bookmarkIcon) {
            bookmarkIcon.style.display = 'block';
        }
    });
    
    // Also add click event to the dropdown itself to show bookmark icon
    dropdownSelect.addEventListener('click', function(event) {
        // Hide all bookmark icons first
        document.querySelectorAll('.bookmark-icon').forEach(icon => {
            icon.style.display = 'none';
        });
        
        // Show this dropdown's bookmark icon
        const bookmarkIcon = this.querySelector('.bookmark-icon');
        if (bookmarkIcon) {
            bookmarkIcon.style.display = 'block';
        }
        
        // Stop propagation to prevent the document click handler from hiding it
        event.stopPropagation();
    });
}

function handleDragDropBookmark(dropBox) {
    const questionId = dropBox.id;
    if (!questionId) return;
    
    // Create bookmark icon if it doesn't exist
    if (!dropBox.querySelector('.bookmark-icon')) {
        const bookmarkIcon = document.createElement('div');
        bookmarkIcon.className = 'bookmark-icon dragdrop-bookmark';
        bookmarkIcon.innerHTML = '&#9733;';
        bookmarkIcon.style.display = 'none';
        bookmarkIcon.dataset.questionNumber = questionId;
        
        // Style the bookmark icon to appear outside the drop box
        bookmarkIcon.style.position = 'absolute';
        bookmarkIcon.style.right = '-20px';
        bookmarkIcon.style.top = 'calc(50% - 32px)';
        bookmarkIcon.style.transform = 'translateY(-50%)';
        bookmarkIcon.style.cursor = 'pointer';
        bookmarkIcon.style.zIndex = '1000';
        bookmarkIcon.style.pointerEvents = 'auto';
        
        // Create a wrapper to contain both drop box and bookmark
        const wrapper = document.createElement('span');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        
        // Insert wrapper before drop box and move drop box inside it
        dropBox.parentNode.insertBefore(wrapper, dropBox);
        wrapper.appendChild(dropBox);
        wrapper.appendChild(bookmarkIcon);
        
        // Bookmark click handler
        bookmarkIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            toggleBookmark(this, questionId);
            return false;
        });
    }
    
    // Drop box click handler - shows bookmark regardless of content
    dropBox.addEventListener('click', function(event) {
        // Don't show during drag operations
        if (document.querySelector('.draggable.dragging')) {
            return;
        }
        
        // Don't show if clicking on the draggable content itself
        if (event.target !== this && event.target.classList.contains('draggable')) {
            return;
        }
        
        document.querySelectorAll('.bookmark-icon').forEach(icon => {
            icon.style.display = 'none';
        });
        
        const bookmarkIcon = this.parentNode.querySelector('.bookmark-icon');
        if (bookmarkIcon) {
            bookmarkIcon.style.display = 'block';
            event.stopPropagation();
        }
    }, true);
    
    // Hide bookmark when starting to drag from this box
    dropBox.addEventListener('dragstart', function() {
        const bookmarkIcon = this.parentNode.querySelector('.bookmark-icon');
        if (bookmarkIcon) {
            bookmarkIcon.style.display = 'none';
        }
    });
    
    // Keep bookmark visible after drop unless clicking elsewhere
    dropBox.addEventListener('drop', function(event) {
        // Only prevent hiding if this is the current drop box
        event.stopPropagation();
    });
}
