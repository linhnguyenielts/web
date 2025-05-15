function initializeDragAndDrop() {
    // Clear existing event listeners
    document.querySelectorAll('.draggable').forEach(item => {
        item.removeEventListener('dragstart', handleDragStart);
        item.removeEventListener('dragend', handleDragEnd);
    });
    
    document.querySelectorAll('.drop-box').forEach(box => {
        box.removeEventListener('dragover', handleDragOver);
        box.removeEventListener('dragleave', handleDragLeave);
        box.removeEventListener('drop', handleDrop);
    });

    const dragItemsContainer = document.querySelector('.drag-items');
    dragItemsContainer.removeEventListener('dragover', handleDragOver);
    dragItemsContainer.removeEventListener('drop', handleDropToSource);

    // Set up draggable items
    document.querySelectorAll(".draggable").forEach(item => {
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragend", handleDragEnd);
    });

    // Set up drop zones (only for drop-boxes)
    document.querySelectorAll(".drop-box").forEach(box => {
        box.addEventListener("dragover", handleDragOver);
        box.addEventListener("dragleave", handleDragLeave);
        box.addEventListener("drop", handleDrop);
    });

    // Set up drag items container as drop zone too
    dragItemsContainer.addEventListener("dragover", handleDragOver);
    dragItemsContainer.addEventListener("drop", handleDropToSource);
}