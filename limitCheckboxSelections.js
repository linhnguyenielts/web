// Improved checkbox limit handler
document.addEventListener('DOMContentLoaded', function() {
  function setupCheckboxLimits() {
    // Find all option groups with data-limit attribute
    document.querySelectorAll('.options[data-limit]').forEach(container => {
      const limit = parseInt(container.getAttribute('data-limit'));
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      
      // Find or create counter element
      let counterEl = container.querySelector('.counter');
      if (!counterEl) {
        counterEl = document.createElement('div');
        counterEl.className = 'counter';
        container.appendChild(counterEl);
      }
      
      // Function to update the counter and limit selections
      function updateCheckboxState() {
        const checkedBoxes = container.querySelectorAll('input[type="checkbox"]:checked');
        const selected = checkedBoxes.length;
        
       
        
        // Disable unchecked boxes if limit is reached
        if (selected >= limit) {
          checkboxes.forEach(cb => {
            if (!cb.checked) {
              cb.disabled = true;
              cb.parentElement.classList.add('disabled');
            }
          });
        } else {
          // Enable all boxes if under limit
          checkboxes.forEach(cb => {
            cb.disabled = false;
            cb.parentElement.classList.remove('disabled');
          });
        }
        
        // Update question status
        const questionId = container.closest('.question')?.id;
        if (questionId) {
          const number = questionId.replace('question', '');
          const statusEl = document.getElementById(`q${number}-status`);
          if (statusEl) {
            if (selected > 0) {
              statusEl.classList.add('answered');
              statusEl.style.backgroundColor = '#2196F3';
              statusEl.style.color = 'white';
              statusEl.style.borderColor = '#2196F3';
            } else {
              statusEl.classList.remove('answered');
              statusEl.style.backgroundColor = '';
              statusEl.style.color = '';
              statusEl.style.borderColor = '';
            }
          }
        }
      }
      
      // Add event listeners to all checkboxes in this group
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCheckboxState);
      });
      
      // Initialize state
      updateCheckboxState();
    });
  }
  
  // Run the setup
  setupCheckboxLimits();
  
  // Also run when switching sections
  document.querySelectorAll('.part-section').forEach(section => {
    section.addEventListener('click', function() {
      // Wait for DOM to update with new content
      setTimeout(setupCheckboxLimits, 100);
    });
  });
});