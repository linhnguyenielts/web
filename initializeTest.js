function initializeTest() {
    // Your existing initialization code
    const parts = document.querySelectorAll('.part-section');
    
    parts.forEach((part, index) => {
        part.addEventListener('click', function() {
            // Your existing part switching code
        });
    });
    
    // Initialize first part
    parts[0].click();
    
    // Initialize drag and drop
    initializeDragAndDrop();
}