// Vocabulary Learning System
let vocabularyList = [];
let learnButton = null;

// Initialize vocabulary system
document.addEventListener('DOMContentLoaded', function() {
    createFlashcardContainer();
});

function showLearnVocabButton() {
    if (!learnButton) {
        const topContainer = document.querySelector('.header') || 
                            document.querySelector('.top-container') || 
                            document.querySelector('.quiz-container') ||
                            document.body; // Fallback to body if no suitable container found
        
        learnButton = document.createElement('button');
        learnButton.className = 'learn-vocab-button';
        learnButton.innerText = 'Learn Vocabulary';
        learnButton.onclick = showFlashcards;

        topContainer.appendChild(learnButton);
    }
    learnButton.style.display = 'inline-block';
}


function enableWordSelection() {
}
window.enableWordSelection = enableWordSelection; // Expose globally so calculateScore.js can call it

function removeLearnPopup() {
    const existingPopup = document.querySelector('.learn-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
}

// Vocabulary data embedded directly in the script
const VOCAB_DATA = `Word	Base Word	Part of Speech	Vietnamese Meaning	Definition (in context)	Grammatical Tags (if different)
a	a	determiner	một (mạo từ)	used before singular nouns	-
achievement	achievement	noun	thành tựu	a thing done successfully with effort	-
against	against	preposition	chống lại	in opposition to	-
an	a	determiner	một (mạo từ)	used before vowel sounds	-
and	and	conjunction	và	used to connect words	-
any	any	determiner	bất kỳ	one or some, no matter which	-
as	as	adverb/conjunction	như, khi	to the same degree / while	-
be	be	verb	là, bị, ở	to exist or occur	-
been	be	verb	(đã) là, bị, ở	past participle of "be"	past participle
but	but	conjunction	nhưng	used to introduce contrast	-
by	by	preposition	bởi	indicating the agent performing an action	-
changed	change	verb	thay đổi	past tense of "change"	past tense
competing	compete	verb	cạnh tranh	striving to win or gain something	present participle
considered	consider	verb	coi là, xem xét	regarded in a specified way	past participle
did	do	verb	làm	past tense of "do"	past tense
during	during	preposition	trong suốt	throughout the duration of	-
entered	enter	verb	tham gia, vào	went into (a competition)	past tense
even	even	adverb	thậm chí	used to emphasize something surprising	-
fact	fact	noun	sự thật	a thing known to be true	-
few	few	determiner	một vài	a small number of	-
five	five	numeral	năm (số)	the number 5	-
had	have	verb	(đã) có	past tense of "have"	past tense
have	have	verb	có	to possess or undergo	-
he	he	pronoun	anh ấy	male subject pronoun	-
history	history	noun	lịch sử	the study of past events	-
how	how	adverb	như thế nào	in what way or manner	-
incredible	incredible	adjective	đáng kinh ngạc	extremely good or unbelievable	-
it	it	pronoun	nó	used to refer to a thing	-
just	just	adverb	chỉ	simply; only	-
likes	like	noun	những người như	similar people/things	plural
made	make	verb	làm, tạo ra	past tense of "make"	past tense
major	major	adjective	chính, lớn	important or significant	-
more	more	adverb	hơn	comparative of "much/many"	-
name	name	verb	đặt tên	to identify by a title	-
never	never	adverb	không bao giờ	at no time in the past/future	-
number	number	noun	số, con số	a numerical value/rank	-
of	of	preposition	của	indicating possession/relation	-
one	one	numeral	một	the number 1	-
outsider	outsider	noun	người ngoài cuộc	someone not part of a group	-
period	period	noun	giai đoạn	a length of time	-
player	player	noun	người chơi	someone who participates in a game	-
previously	previously	adverb	trước đây	at an earlier time	-
professional	professional	adjective	chuyên nghiệp	engaged in a specified activity as a paid job	-
rackets	racket	noun	vợt (tennis)	equipment used to hit the ball	plural
ranked	rank	verb	xếp hạng	past tense of "rank"	past tense
regarded	regard	verb	coi là	past tense of "regard"	past tense
remarkable	remarkable	adjective	đáng chú ý	worthy of attention	-
sport	sport	noun	thể thao	a competitive physical activity	-
standard	standard	noun	tiêu chuẩn	a level of quality	-
strongest	strong	adjective	mạnh nhất	superlative of "strong"	superlative
talented	talented	adjective	tài năng	having natural skill	-
tennis	tennis	noun	quần vợt	a racket sport	-
that	that	determiner/pronoun	đó, cái đó	used to identify something specific	-
the	the	determiner	(mạo từ xác định)	used before specific nouns	-
this	this	determiner	này, cái này	referring to something near	-
to	to	preposition	đến, để	indicating direction/purpose	-
tournaments	tournament	noun	giải đấu	a series of contests	plural
was	be	verb	(đã) là, bị, ở	past tense of "be"	past tense
who	who	pronoun	người mà	referring to a person	-
won	win	verb	thắng	past tense of "win"	past tense
world	world	noun	thế giới	the earth or a domain of activity	-
years	year	noun	năm	a period of 12 months	plural
yet	yet	adverb	nhưng, tuy nhiên	despite what has been said	-


`;
// Function to parse the embedded CSV data
function parseVocabData() {
    const rows = VOCAB_DATA.split('\n').slice(1); // Skip header
    return rows.map(row => {
        const columns = row.split('\t');
        if (columns.length >= 4) {
            return { 
                Word: columns[0], 
                BaseWord: columns[1],
                PartOfSpeech: columns[2], 
                VietnameseMeaning: columns[3], 
                Definition: columns[4] || '',
                GrammaticalTag: columns[5] || ''  // Add grammatical tag
            };
        }
        return null;
    }).filter(item => item !== null);
}
async function addWordToVocabularyList(word) {
    if (vocabularyList.some(item => item.word.toLowerCase() === word.toLowerCase())) {
        showNotification(`"${word}" is already in your vocabulary list.`);
        return;
    }

    const context = getSentenceContext(word);

    // Parse the embedded vocabulary data
    const vocabData = parseVocabData();

    // Find the matching word in the vocabulary data
    const matchedWord = vocabData.find(item => 
        item.Word.toLowerCase() === word.toLowerCase()
    );

    // If word is found in vocab data, add detailed information
    if (matchedWord) {
        vocabularyList.push({
    word: matchedWord.Word,
    baseWord: matchedWord.BaseWord,
    context: context,
    definition: matchedWord.Definition,
    partOfSpeech: matchedWord.PartOfSpeech,
    vietnameseMeaning: matchedWord.VietnameseMeaning,
    grammaticalTag: matchedWord.GrammaticalTag,  // Add grammatical tag
    ipa: await lookupIPA(matchedWord.BaseWord || matchedWord.Word),
    audio: await lookupAudio(matchedWord.BaseWord || matchedWord.Word)
});
        
        showNotification(`"${word}" added with full details.`);
    } else {
        // Fallback to minimal info if word not found
        vocabularyList.push({
    word: word,
    baseWord: '',
    context: context,
    definition: '',
    partOfSpeech: '',
    vietnameseMeaning: '',
    grammaticalTag: '',  // Add grammatical tag
    ipa: '',
    audio: ''
});
        
        showNotification(`"${word}" added with minimal info.`);
    }
}
function getSentenceContext(word) {
    const passageContent = document.querySelector('.passage-content[style*="display: block"]');
    if (!passageContent) return '';
    
    const paragraphs = passageContent.querySelectorAll('div');
    for (const paragraph of paragraphs) {
        const text = paragraph.textContent;
        if (text.toLowerCase().includes(word.toLowerCase())) {
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
            for (const sentence of sentences) {
                if (sentence.toLowerCase().includes(word.toLowerCase())) {
                    return sentence.trim();
                }
            }
            return text; // Fallback to paragraph if sentence extraction fails
        }
    }
    return '';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'vocab-notification';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.background = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1001';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    
    document.body.appendChild(notification);
    
    setTimeout(() => { notification.style.opacity = '1'; }, 10);
    setTimeout(() => { 
        notification.style.opacity = '0'; 
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function createFlashcardContainer() {
    const flashcardContainer = document.createElement('div');
    flashcardContainer.className = 'flashcard-container';
    flashcardContainer.style.display = 'none';
    flashcardContainer.style.position = 'fixed';
    flashcardContainer.style.top = '50%';
    flashcardContainer.style.left = '50%';
    flashcardContainer.style.transform = 'translate(-50%, -50%)';
    flashcardContainer.style.width = '80%';
    flashcardContainer.style.maxWidth = '600px';
    flashcardContainer.style.maxHeight = '80vh';
    flashcardContainer.style.background = 'white';
    flashcardContainer.style.padding = '20px';
    flashcardContainer.style.borderRadius = '8px';
    flashcardContainer.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    flashcardContainer.style.zIndex = '1002';
    flashcardContainer.style.overflow = 'hidden';
    
    const overlay = document.createElement('div');
    overlay.className = 'flashcard-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '1001';
    overlay.style.display = 'none';
    
    document.body.appendChild(overlay);
    document.body.appendChild(flashcardContainer);
    
    overlay.addEventListener('click', function() {
        flashcardContainer.style.display = 'none';
        overlay.style.display = 'none';
    });
}

function showFlashcards() {
    const flashcardContainer = document.querySelector('.flashcard-container');
    const overlay = document.querySelector('.flashcard-overlay');
    
    if (vocabularyList.length === 0) {
        showNotification('No vocabulary words added yet!');
        return;
    }
    
    overlay.style.display = 'block';
    flashcardContainer.style.display = 'block';
    
    let content = `
        <div class="flashcards-header" style="position: sticky; top: 0; background: white; padding: 10px 0; z-index: 1; border-bottom: 1px solid #eee;">
            <h2 style="margin: 0;">Your Vocabulary List (${vocabularyList.length} words)</h2>
            <button class="close-flashcards" style="position: absolute; top: 10px; right: 10px; padding: 5px 10px; background: none; border: none; font-size: 1.2em; cursor: pointer;">✕</button>
        </div>
        <div class="flashcards-instructions" style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <p style="margin: 0;">Review your selected vocabulary. Click on a word to reveal its context.</p>
        </div>
        <div class="flashcards-list" style="overflow-y: auto; max-height: calc(80vh - 180px);">
    `;
    
    vocabularyList.forEach((item, index) => {
        if (item.baseWord) {
            displayWord = `${item.baseWord}`;
            // Show the original word on the next line if different from base word
            if (item.baseWord.toLowerCase() !== item.word.toLowerCase()) {
                displayWord += `<br><span style="font-style: italic; font-size: 0.9em;">${item.word}</span>`;
            }
        } else {
            displayWord = item.word;
        }
            
                content += `
<div class="flashcard" data-index="${index}" style="margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
<div class="flashcard-front">
    <button class="remove-word-btn" data-index="${index}" title="Remove word" style="float: right; background: none; border: none; cursor: pointer;">❌</button>
    <h3 style="margin-top: 0;">
    ${item.baseWord && item.baseWord.toLowerCase() !== item.word.toLowerCase() ? 
        `${item.baseWord} <span class="word-form">${item.partOfSpeech}</span> <span style="font-style: italic; font-size: 0.9em;">${item.word}${item.grammaticalTag ? ` <span class="grammatical-tag" style="color: grey; font-weight: normal; font-style: italic; font-size: 0.8em;">${item.grammaticalTag}</span>` : ''}</span>` : 
        `${item.word}${item.partOfSpeech ? ` <span class="word-form">${item.partOfSpeech}</span>` : ''}`
    }
</h3>
        <p>
            ${item.ipa ? `${item.ipa} <button class="play-audio-btn" data-audio="${item.audio}" title="Play pronunciation" style="margin-left: 5px;">🔊</button>` : ''}
        </p>
        
        <p class="flashcard-definition" contenteditable="true" title="Click to edit" style="cursor: text;">
            ${item.vietnameseMeaning ? `<strong>${item.vietnameseMeaning}</strong> - ` : ''}
            ${item.definition || 'Click to edit your definition'}
        </p>
        
        <button class="flashcard-flip-btn" style="padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">Show Context</button>
        <div class="flashcard-context" style="display: none; margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
            <h4 style="margin: 0 0 5px 0;">Context:</h4>
            <p>${item.context ? item.context.replace(new RegExp(item.word, 'gi'), match => `<strong>${match}</strong>`) : 'No context available'}</p>
        </div>
    </div>
</div>
`;
    });
    
    content += `
        </div>
        <div class="flashcard-actions" style="position: sticky; bottom: 0; background: white; padding: 10px 0; border-top: 1px solid #eee;">
            <button class="clear-vocab-btn" style="padding: 8px 15px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Clear All Words</button>
        </div>
    `;
    
    flashcardContainer.innerHTML = content;

    // Rest of the event listeners remain the same...
    flashcardContainer.querySelectorAll('.remove-word-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            if (!isNaN(index)) {
                const removedWord = vocabularyList[index].word;
                vocabularyList.splice(index, 1); // Remove the word
                showFlashcards(); // Re-render the flashcard list
                showNotification(`"${removedWord}" removed from vocabulary list.`);
            }
        });
    });

    flashcardContainer.querySelectorAll('.play-audio-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const audioSrc = this.getAttribute('data-audio');
            if (audioSrc) {
                const audio = new Audio(audioSrc);
                audio.play();
            }
        });
    });

    flashcardContainer.querySelector('.close-flashcards').addEventListener('click', function() {
        flashcardContainer.style.display = 'none';
        overlay.style.display = 'none';
    });
    
        flashcardContainer.querySelectorAll('.flashcard-flip-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const contextDiv = this.nextElementSibling;
            if (contextDiv.style.display === 'none') {
                contextDiv.style.display = 'block';
                this.textContent = 'Hide Context';
            } else {
                contextDiv.style.display = 'none';
                this.textContent = 'Show Context';
            }
        });
    });
    
    flashcardContainer.querySelectorAll('.flashcard-definition').forEach(def => {
        def.addEventListener('click', function() {
            const index = this.closest('.flashcard').dataset.index;
            const currentDef = vocabularyList[index].definition || '';
            const newDef = prompt('Enter your definition:', currentDef);
            
            if (newDef !== null) {
                vocabularyList[index].definition = newDef;
                this.textContent = newDef || 'Click to edit your definition';
            }
        });
    });
    
    flashcardContainer.querySelector('.clear-vocab-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all words from your vocabulary list?')) {
            vocabularyList = [];
            flashcardContainer.style.display = 'none';
            overlay.style.display = 'none';
            showNotification('Vocabulary list cleared!');
        }
    });
}
async function lookupIPA(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        return data[0]?.phonetics[0]?.text || '';
    } catch (error) {
        console.error('IPA lookup failed:', error);
        return '';
    }
}

async function lookupAudio(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        const audioUrl = data[0]?.phonetics?.find(p => p.audio)?.audio || '';
        if (audioUrl) {
            return audioUrl;
        } else {
            // Return the Google TTS URL as fallback
            // encodeURIComponent for safe URL usage
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=en&client=gtx`;
            return ttsUrl;
        }
    } catch (error) {
        console.error('Audio lookup failed:', error);
        // fallback to Google TTS URL on error as well
        return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=en&client=gtx`;
    }
}
