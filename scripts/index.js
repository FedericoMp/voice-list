// Global variables
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'es-ES';

//----------------------------------------------------

// Check if list has items
const checkEmptyList = () => {
    if(outputList.childElementCount === 0) {
        const li = document.createElement('li');
        li.setAttribute('id', 'noItem')
        li.classList.add('mdl-list__item');
        const noItem = `<p class="mdl-typography--font-light">Oprima el botón para listar...</p>`;
        li.innerHTML = noItem;
        outputList.appendChild(li);
        badge.setAttribute('data-badge', 0);
    }
}

// Add event to list item
const addEventLi = (i) => {
    let item = document.getElementById(`item-${i}`);
    item.addEventListener('click', () => {
        item.classList.add('fade-out');
        setTimeout(() => {
            outputList.removeChild(item);
            badge.setAttribute('data-badge', outputList.childElementCount - 1);
            checkEmptyList();
        }, 1500);
    });
}

//----------------------------------------------------

// SpeechRecognition Init
const runSpeechRecognition = () => {
    recognition.start();
};

// SpeechRecognition onstart
recognition.onstart = () => {
    progressContainer.classList.remove('hide');
    progressContainer.classList.add('show');
};

// SpeechRecognition onspeechend
recognition.onspeechend = () => {
    recognition.stop();
};

// SpeechRecognition onresult
recognition.onresult = (e) => {
    // delete first item
    if(outputList.childElementCount === 1 && outputList.firstElementChild.id === 'noItem') {
        const noItem = document.getElementById('noItem');
        outputList.removeChild(noItem);
    }
    
    // capture transcript and create new item
    const index = outputList.childElementCount;
    const transcript = e.results[0][0].transcript;
    const li = document.createElement('li');
    li.classList.add('mdl-list__item');
    li.setAttribute('id', `item-${index}`);
    const newItem = `
        <span class="mdl-list__item-primary-content">
            <i class="material-icons article">article</i>
            ${transcript}
        </span>`;
    li.innerHTML = newItem;

    // remove progress bar
    progressContainer.classList.remove('show');
    progressContainer.classList.add('hide');

    badge.setAttribute('data-badge', outputList.childElementCount + 1);
    let mainTag = document.getElementsByClassName('mdl-layout__content')[0];
    mainTag.scrollTop = mainTag.scrollHeight;
    
    // add new item to list
    outputList.appendChild(li);
    addEventLi(index);
};

//----------------------------------------------------

// DOM Elements
const badge = document.getElementById('badge');
const progressContainer = document.getElementById('progressContainer');
const outputList = document.getElementById('outputList');
const speakerBtn = document.getElementById('speakerBtn');
checkEmptyList();

//----------------------------------------------------

// Event Listeners
speakerBtn.addEventListener('click', runSpeechRecognition);