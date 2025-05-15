function addLocateButtons() {
    // 1. Handle multiple-choice and true/false questions
    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {
        const questionNumber = question.id.replace('question', '');
        const marker = document.getElementById(`answer-marker-${questionNumber}`);

        if (!marker) return;

        const locateBtn = document.createElement('button');
        locateBtn.className = 'locate-btn';
        locateBtn.textContent = 'Locate';
        locateBtn.onclick = () => highlightMarker(marker);

        const questionText = question.querySelector('.question-text');
        if (questionText && !questionText.querySelector('.locate-btn')) {
            questionText.appendChild(document.createElement('br'));
            questionText.appendChild(locateBtn);
        }
    });

    // 2. Handle fill-in-the-blank questions
const blankInputs = document.querySelectorAll('.blank-input');
blankInputs.forEach(input => {
    const questionNumber = input.id.replace('question', '');
    const marker = document.getElementById(`answer-marker-${questionNumber}`);

    if (!marker) return;

    const locateBtn = document.createElement('button');
    locateBtn.className = 'locate-btn';
    locateBtn.textContent = 'Locate';
    locateBtn.onclick = () => highlightMarker(marker);

    // Add margin to create spacing
    locateBtn.style.marginLeft = '5px';

    // Insert the button right after the input
    input.insertAdjacentElement('afterend', locateBtn);
});

    // 3. Handle dropdown questions (like Q14)
    const dropdownContainers = document.querySelectorAll('.statement-with-dropdown');
    dropdownContainers.forEach(container => {
        const statementText = container.querySelector('.statement-text');
        if (!statementText) return;
        
        const questionNumberMatch = statementText.id.match(/question(\d+)/);
        if (!questionNumberMatch) return;
        
        const questionNumber = questionNumberMatch[1];
        const marker = document.getElementById(`answer-marker-${questionNumber}`);

        if (!marker) return;

        const locateBtn = document.createElement('button');
        locateBtn.className = 'locate-btn';
        locateBtn.textContent = 'Locate';
        locateBtn.onclick = () => highlightMarker(marker);
		locateBtn.style.marginLeft = '5px';

        container.appendChild(document.createElement('br'));
        container.appendChild(locateBtn);
    });

    // 4. Handle drag-and-drop questions (like Q31)
    const dropBoxes = document.querySelectorAll('.drop-box');
    dropBoxes.forEach(dropBox => {
        const questionNumber = dropBox.id.replace('question', '');
        const marker = document.querySelector(`.answer-highlight[data-question="${questionNumber}"]`);

        if (!marker) return;

        const locateBtn = document.createElement('button');
        locateBtn.className = 'locate-btn';
        locateBtn.textContent = 'Locate';
        locateBtn.onclick = () => highlightMarker(marker);
		locateBtn.style.marginLeft = '5px';

        // Place the button after the drop box
        dropBox.insertAdjacentElement('afterend', locateBtn);
    });
}

// Helper function to highlight the marker
function highlightMarker(marker) {
    marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
    marker.style.backgroundColor = '#ffeb3b';
    setTimeout(() => {
        marker.style.backgroundColor = '';
    }, 2000);
}