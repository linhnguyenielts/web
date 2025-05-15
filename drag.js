// Handle dragging start
function handleDragStart(e) {
    e.dataTransfer.setData("text", this.id);
    setTimeout(() => {
        this.style.opacity = "0.4";
    }, 0);
    this.classList.add('dragging');
}

// Handle dragging end
function handleDragEnd() {
    this.style.opacity = "1";
    this.classList.remove('dragging');
}

// Handle dragging over drop zones
function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('highlight');
}

// Handle leaving drop zone
function handleDragLeave() {
    this.classList.remove('highlight');
}

// Handle dropping into a drop box
function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('highlight');
    
    const data = e.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    
    // If dropping on an empty box
    if (!this.hasChildNodes()) {
        this.appendChild(draggedElement);
    } 
    // If dropping on an occupied box, swap the items
    else {
        const existingItem = this.firstChild;
        const dragItemsContainer = document.querySelector('.drag-items');
        
        // Move existing item back to source (in correct order)
        insertInAlphabeticalOrder(dragItemsContainer, existingItem);
        
        // Add the new item to the box
        this.appendChild(draggedElement);
    }
    
    draggedElement.style.opacity = "1";
    draggedElement.classList.remove('dragging');
}

// Handle dropping back to the source container (with alphabetical sorting)
function handleDropToSource(e) {
    e.preventDefault();
    this.classList.remove('highlight');
    
    const data = e.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    
    // Only process if not already in the container
    if (!this.contains(draggedElement)) {
        insertInAlphabeticalOrder(this, draggedElement);
    }
    
    draggedElement.style.opacity = "1";
    draggedElement.classList.remove('dragging');
}

// Helper function to insert items in alphabetical order
function insertInAlphabeticalOrder(container, item) {
    const items = Array.from(container.querySelectorAll('.draggable'));
    const newItemText = item.textContent.trim();
    
    // Find the correct position to insert
    let insertBefore = null;
    for (const existingItem of items) {
        if (existingItem.textContent.trim().localeCompare(newItemText) > 0) {
            insertBefore = existingItem;
            break;
        }
    }
    
    if (insertBefore) {
        container.insertBefore(item, insertBefore);
    } else {
        container.appendChild(item);
    }
}

// Call this when DOM is loaded and when switching parts
document.addEventListener('DOMContentLoaded', function() {
    // Your existing part switching code here
    
    // Initialize drag and drop
    initializeDragAndDrop();
    
    // Sort initial items alphabetically
    const dragItemsContainer = document.querySelector('.drag-items');
    const items = Array.from(dragItemsContainer.querySelectorAll('.draggable'));
    
    // Sort items alphabetically
    items.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));
    
    // Clear container
    while (dragItemsContainer.firstChild) {
        dragItemsContainer.removeChild(dragItemsContainer.firstChild);
    }
    
    // Re-add sorted items
    items.forEach(item => {
        dragItemsContainer.appendChild(item);
    });
});