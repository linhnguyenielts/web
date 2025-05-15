document.addEventListener('DOMContentLoaded', function () {
    const colorHighlights = document.querySelectorAll('.answer-highlight-colors');

    colorHighlights.forEach(span => {
        // Save original HTML
        span.dataset.originalContent = span.innerHTML;
        // Show plain text by default
        span.innerHTML = span.textContent;

        // Hover effect
        span.addEventListener('mouseenter', () => {
            span.innerHTML = span.dataset.originalContent;
            span.style.backgroundColor = 'rgba(144, 238, 144, 0.4)';
            span.style.border = '1px solid #90EE90';
        });

        span.addEventListener('mouseleave', () => {
            span.innerHTML = span.textContent;
            span.style.backgroundColor = 'transparent';
            span.style.border = 'none';
        });
    });
});

// Modified function to show answer highlights after submission
function showAnswerHighlights() {
	
    // Define custom tooltip messages for each question number
    const tooltipMessages = {
        '1': 'Reference for identifying if the claim has evidence. Reference for identifying if the claim has evidence. Reference for identifying if the claim has evidence. Reference for identifying if the claim has evidence. ',
        '2': 'Key passage describing the experiment methodology',
        '3': 'Statement about the control group',
        '4': 'Information about statistical significance',
    };
    
    // Default message for any question number not explicitly defined
    const defaultTooltip = 'Answer reference for question';
    
    // Make all answer highlights visible
    document.querySelectorAll('.answer-highlight').forEach(highlight => {
        highlight.classList.add('show-highlight');
        highlight.style.display = 'inline';
        highlight.style.backgroundColor = '';
        highlight.style.border = '';

        const coloredSpan = highlight.querySelector('.answer-highlight-colors');
        if (coloredSpan) {
    // Store original content but show as plain text
        coloredSpan.innerHTML = coloredSpan.textContent;
    coloredSpan.style.fontWeight = 'normal';
    coloredSpan.style.color = 'inherit';
    coloredSpan.style.textDecoration = 'none';
    coloredSpan.style.backgroundColor = 'transparent';
    coloredSpan.style.border = 'none';
}
        
        // Get the question number from data attribute
        const questionNumber = highlight.dataset.question;
        
        // Create a number indicator element
        const numberIndicator = document.createElement('span');
        numberIndicator.className = 'answer-number-indicator';
        numberIndicator.textContent = questionNumber;
		numberIndicator.id = `answer-marker-${questionNumber}`;
        
        // Insert the number indicator before the highlight
        highlight.parentNode.insertBefore(numberIndicator, highlight);
        
        // Add hover effects
        highlight.addEventListener('mouseenter', function(e) {
            if (coloredSpan && coloredSpan.dataset.originalContent) {
    // Restore original HTML with all styles on hover
    coloredSpan.innerHTML = coloredSpan.dataset.originalContent;
    coloredSpan.style.backgroundColor = 'rgba(144, 238, 144, 0.4)';
    coloredSpan.style.border = '1px solid #90EE90';
}
            
            // Create and position tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'answer-tooltip';
            tooltip.textContent = tooltipMessages[questionNumber] || 
                                 `${defaultTooltip} ${questionNumber}`;
            
            const rect = highlight.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
            tooltip.style.zIndex = '1000';
            
document.body.appendChild(tooltip);
            // Remove tooltip and reset styling when mouse leaves
            highlight.addEventListener('mouseleave', function() {
                if (coloredSpan) {
                    // Remove styling and restore plain text
                    coloredSpan.innerHTML = coloredSpan.textContent;
                    coloredSpan.style.fontWeight = 'normal';
                    coloredSpan.style.color = 'inherit';
                    coloredSpan.style.textDecoration = 'none';
                    coloredSpan.style.backgroundColor = 'transparent';
                    coloredSpan.style.border = 'none';
                    coloredSpan.style.padding = '0';
                    coloredSpan.style.margin = '0';
                }
                if (tooltip && tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, { once: true });
        });
    });
	}
