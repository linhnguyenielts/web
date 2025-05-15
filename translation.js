let translationInitialized = false;

function createTranslationButton() {
    // Check if button already exists
    if (document.querySelector('.translation-button')) {
        return;
    }

    // Create the button
    const translationBtn = document.createElement('button');
    translationBtn.className = 'translation-button'; // Using CSS class

    // Set button text
    translationBtn.textContent = 'See Translation';
    translationBtn.onclick = toggleTranslation;
    
    // Add button to DOM
    const submitContainer = document.querySelector('.submit-container');
    if (submitContainer) {
        submitContainer.appendChild(translationBtn);
        console.log('Translation button added to DOM');
    } else {
        console.error('Could not find submit container');
    }
}

function toggleTranslation() {
    const translationBtn = document.querySelector('.translation-button');
    const vietnameseColumn = document.querySelector('.vietnamese-column');
    const passageColumn = document.querySelector('.passage-column');
    const questionsColumn = document.querySelector('.questions-column');
    
    // Check if the Vietnamese translations have been initialized
    if (!translationInitialized) {
        // If translations are not initialized, create Vietnamese translations for each passage
        createVietnameseTranslations();
        translationInitialized = true; // Mark translations as initialized
        
        // Show the Vietnamese column
        const newVietnameseColumn = document.querySelector('.vietnamese-column');
        if (newVietnameseColumn) {
            newVietnameseColumn.style.display = 'block';
            
            // Adjust columns width when Vietnamese column is visible
            passageColumn.style.width = '37%';
            newVietnameseColumn.style.width = '37%';
            questionsColumn.style.width = '26%';
        }
        
        translationBtn.textContent = 'Hide Translation';
translationBtn.classList.add('hide-translation');
    } else {
        if (vietnameseColumn) {
            // Toggle the entire Vietnamese column visibility
            if (vietnameseColumn.style.display === 'none') {
    vietnameseColumn.style.display = 'block';

    // Adjust columns width when Vietnamese column is visible
    passageColumn.style.width = '37%';
    vietnameseColumn.style.width = '37%';
    questionsColumn.style.width = '26%';

    translationBtn.textContent = 'Hide Translation';
    translationBtn.classList.add('hide-translation');
} else {
    vietnameseColumn.style.display = 'none';

    // Return passage and questions columns to original state
    passageColumn.style.width = '55%';
    questionsColumn.style.width = '45%';

    translationBtn.textContent = 'See Translation';
    translationBtn.classList.remove('hide-translation');
}

        }
    }
}

// Function to show only the active part's translation
function showActivePartTranslation() {
    // Get the Vietnamese column and make it visible
    const vietnameseColumn = document.querySelector('.vietnamese-column');
    if (vietnameseColumn) {
        vietnameseColumn.style.display = 'block';
    }
}

function createVietnameseTranslations() {
    console.log('Creating Vietnamese translations');

    // Find the columns in the existing layout
    const passageColumn = document.querySelector('.passage-column');
    const questionsColumn = document.querySelector('.questions-column');

    // Create a container for Vietnamese translations
    const vietnameseColumn = document.createElement('div');
vietnameseColumn.className = 'vietnamese-column passage-column'; // Added passage-column class to match styling
vietnameseColumn.style.display = 'none';
    
    
    // Create content for Vietnamese passages - specific content for each part
// HTML content can be included directly in these variables
const vietnamesePassage1 = `<div><b>READING PASSAGE 1</b></div><div style="text-align: center;"><b>How tennis rackets have changed
</b></div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div><div>Năm 2016, tay vợt chuyên nghiệp người Anh Andy Murray được xếp hạng là số một thế giới. Đó là một thành tựu phi thường theo bất kỳ tiêu chuẩn nào – càng đáng chú ý hơn bởi thực tế rằng anh đã đạt được điều này trong một thời kỳ được coi là một trong những giai đoạn mạnh mẽ nhất trong lịch sử của môn thể thao này, cạnh tranh với những tên tuổi như Rafael Nadal, Roger Federer và Novak Djokovic, chỉ kể đến một vài cái tên. Tuy nhiên, năm năm trước đó, anh được coi là một tay vợt tài năng nhưng nằm ngoài cuộc đua, tham gia nhưng không bao giờ thắng các giải đấu lớn.</div>`;
const vietnamesePassage2 = `<div>hai con vit</div>`;
const vietnamesePassage3 = `<div>ba con vit</div>`;

    // Find the active part
    const activePart = document.querySelector('.part-section.active');
    const activePartNumber = activePart ? 
        Array.from(document.querySelectorAll('.part-section')).indexOf(activePart) + 1 : 1;
    
    // Create a div for each part, but only add it to the DOM if it's the active part
    for (let i = 1; i <= 3; i++) {
        const passageVn = document.createElement('div');
passageVn.className = 'passage-vn passage-content'; // Added passage-content class to match styling
        passageVn.setAttribute('data-part', i);
        
        // Only create and append content for the active part
        if (i === activePartNumber) {
            const passages = document.createElement('div');
            passages.className = 'passage-content';
            
            // Set the appropriate content based on part number
if (i === 1) {
    passages.innerHTML = vietnamesePassage1;
} else if (i === 2) {
    passages.innerHTML = vietnamesePassage2;
} else if (i === 3) {
    passages.innerHTML = vietnamesePassage3;
}
            
            passageVn.appendChild(passages);
            vietnameseColumn.appendChild(passageVn);
            
                    }
    }
    
    // Insert the Vietnamese column between the passage and questions columns
    passageColumn.parentNode.insertBefore(vietnameseColumn, questionsColumn);
}

// Function to update the progress bars and completion ticks
function updateProgressBars() {
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
        
        // Update the progress bar
        const totalQuestions = endQuestion - startQuestion + 1;
        const progressPercentage = (answeredCount / totalQuestions) * 100;
        
        const progressFill = part.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        // Check if all questions are answered and part is not active
        const isCompleted = answeredCount === totalQuestions;
        const isActive = part.classList.contains('active');
        
        // Find the part title element
        const partTitle = part.querySelector('.part-title');
        
        // Remove any existing tick first
        const existingTick = part.querySelector('.completed-tick');
        if (existingTick) {
            existingTick.remove();
        }
        
        if (isCompleted && !isActive && partTitle) {
            partTitle.style.textAlign = 'center';
            // Clear the partTitle and create a container for the name and tick
            const nameSpan = document.createElement('span');
            nameSpan.textContent = partTitle.textContent;

            const tickIcon = document.createElement('div'); // using div to stack below
            tickIcon.className = 'completed-tick';
            tickIcon.textContent = '✓';

            // Clear the original title and append both name and tick
            partTitle.textContent = '';
            partTitle.appendChild(nameSpan);
            partTitle.appendChild(tickIcon);
        }
    });
}

// Function to handle part switching
function handlePartSwitch() {
    // If translations are initialized
    const translationBtn = document.querySelector('.translation-button');
    if (translationInitialized) {
        // Remove existing Vietnamese column
        const existingVieColumn = document.querySelector('.vietnamese-column');
        if (existingVieColumn) {
            const wasVisible = existingVieColumn.style.display === 'block';
            existingVieColumn.remove();
            
            // If translations were visible, recreate them for the active part
            if (wasVisible) {
                createVietnameseTranslations();
                
                const newVieColumn = document.querySelector('.vietnamese-column');
                if (newVieColumn) {
                    newVieColumn.style.display = 'block';
                    
                    // Adjust column widths
                    const passageColumn = document.querySelector('.passage-column');
                    const questionsColumn = document.querySelector('.questions-column');
                    
                    if (passageColumn && questionsColumn) {
                        passageColumn.style.width = '37%';
                        newVieColumn.style.width = '37%';
                        questionsColumn.style.width = '26%';
                    }
                }
            } else {
                // Translations were hidden, ensure original column widths
                const passageColumn = document.querySelector('.passage-column');
                const questionsColumn = document.querySelector('.questions-column');
                
                if (passageColumn && questionsColumn) {
                    passageColumn.style.width = '55%';
                    questionsColumn.style.width = '45%';
                }
            }
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initial update
    updateProgressBars();
    if (typeof updateBookmarkedParts === 'function') {
        updateBookmarkedParts();
    }
    
    // Set up mutation observer to watch for part active state changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                updateProgressBars();
                
                // If the class change is related to active state, handle part switching
                const target = mutation.target;
                if (target.classList.contains('part-section')) {
                    if (target.classList.contains('active')) {
                        handlePartSwitch();
                    }
                }
            }
        });
    });
    
    // Observe all part sections for class changes
    document.querySelectorAll('.part-section').forEach(part => {
        observer.observe(part, { attributes: true });
    });
});