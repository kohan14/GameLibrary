//// Instantiate objects
const api = new GameApi;
const ui = new UI;
const ls = new GameStorage;

// Load games from memory and insert them into the DOM
ui.getGames(ls.storedGames);

//Dom Elements
const addButtonEL = document.querySelector('.add-game');
const background = document.querySelector('.background');
const gameItemRemoveBtnsEL = document.querySelectorAll('.game-item-remove');
const gameListImages = document.querySelectorAll('#list-image')
const gameItems = document.querySelectorAll('.game-item');
const filterTagContainer = document.getElementsByName('filter-tag');
const gameList = document.querySelector('.game-list');
const testBtn = document.querySelector('.test-button');
const searchInput = document.querySelector('.filter-bar');

// Timer for keyinput delay when using searchbar inside modal,
const timer = '';

// Loading core event listeners, for main page of the app
domLoadEventListeners();


//All event listeners that need to be loaded immediately
function domLoadEventListeners(){

    // Button modal toggle
    addButtonEL.addEventListener('click', (e) => toggleModal(e.target))

    // Test data to try out app
    testBtn.addEventListener('click', () => {
        ls.loadTestData();
        location.reload();
    })

    //Filter radio buttons
    filterTagContainer.forEach( (radio) => {
        radio.addEventListener('click', (e) => {
            if(e.target.value !== 'show-all')
            {
                const filteredGames = ls.storedGames.filter( (game) => {
                    return game.checkedPlatform === e.target.value;
                })
                if(filteredGames != ''){
                    gameList.innerHTML = ``;
                    ui.getGames(filteredGames);
                    convertToCanvas();
                }else {
                    alertify.alert('STORAGE ERROR','There\'s no game matching this platform in your library');
                }

            }else {
                gameList.innerHTML = ``;
                ui.getGames(ls.storedGames);
                convertToCanvas();
            }

        })
    })

    //Search through games on library list
    searchInput.addEventListener('keyup', (e) => {
        const gameItems = document.querySelectorAll('.game-item');
        const filteredPhrase = e.target.value.toLowerCase();
        gameItems.forEach((game) => {
            const gameName = game.children[0].firstElementChild.textContent;
            if(gameName.toLowerCase().indexOf(filteredPhrase) != -1) {
                game.style.display = 'block';
            }
            else{
                game.style.display = 'none';
            }
        })
    })
}

// All event listeners that require modal to be inside of the viewport to work.
function loadModalEventListeners(){

    // Searching games through search bar and adding modal content. setTimeout used to avoid making HTTP Requests each keyup (for better performance)
    ui.searchbarEL.addEventListener('keyup', (e) => {
        searchGame(e)
            .then((gameDetails) => loadModalContentEventListeners(gameDetails))
    })

    // Toggling modal off by clicking in background
    ui.modalBackground.addEventListener('click', (e) => toggleModal(e.target));

    // Toggling modal off by clicking in background
    ui.modalCloseBtn.addEventListener('click', (e) => toggleModal(e.target));
}

function loadModalContentEventListeners(gameDetails){

    //Modal Content Elements
    const widgetSeeMoreBtn = document.querySelector('#modal-see-more');
    const addGameForm = document.querySelector('#platform-form');

    //Check game platform feature in modal
    addGameForm.addEventListener('submit', (e) => {

        //Get radio buttons
        const platformRadios = document.getElementsByName('platforms');
        let checkedPlatform;
        e.preventDefault();

        //Loop through and find checked button, then assing it to other variable
        platformRadios.forEach((radio) =>{
            if(radio.checked){
                checkedPlatform = radio.value;
            }
        });

        //Check if the user checked any of the buttons, or the game is already on the list (provide alerts)
        if(checkedPlatform === undefined){
            if(ls.checkForDuplicates(gameDetails.id, 'id', ls.storedGames)){
                alertify.alert('STORAGE ERROR', 'The game is already on the list, please pick another title');
            }else {
                alertify.alert('PLATFORM ERROR', 'Please check platform before adding game to the library');
            }
        }else {
            if(!ls.checkForDuplicates(gameDetails.id, 'id', ls.storedGames))
            {
            //Add property checked for further styling
            gameDetails.checkedPlatform = checkedPlatform;
            ls.addGame(gameDetails);
            toggleModal(e.submitter);
            ui.getGames(ls.storedGames)
            alertify.success(`${gameDetails.name} successfully added!`);
            convertToCanvas(gameList.lastElementChild.children[0].children[1])
            }else{
                alertify.alert('STORAGE ERROR', 'The game is already on the list, please pick another title')
            }
        }
    })
}


/////////// FUNCTIONS FOR EVENT LISTENERS

//Toggle modal
function toggleModal(e) {

    //If event target is modal wrapper or close btn, then we are togglingOff Modal - otherwise opening
    if(e.dataset.modal === 'close'){
        clearTimeout(this.timer)
        ui.modalAnimate();
        setTimeout(() => {
            ui.deleteModal();
        }, 200);
    }
    if (e.dataset.modal === 'open') {
        ui.createModal(background);
        ui.refreshSelectors();
        setTimeout(() => {
            ui.modalAnimate();
        }, 1);
        loadModalEventListeners();
    }
}

//Get search api data from input
function searchGame(e) {
    return new Promise ((resolve, reject) => {
    ui.spinnerLoader(e.target.value)
    clearTimeout(this.timer);
    if(e.target.value != 0){
        this.timer = setTimeout(() =>{
            api.searchGameInfo(e.target.value)
              .then(gameId => {
                    api.getDetails(gameId)
                      .then((gameDetails => {
                            loadModal(gameDetails);
                            resolve(gameDetails);
                        }))
                      //If api has no image or description catch undefined (to filter through some less quality results)
                      .catch(() => ui.createGameNotFound())
              })
              //Catch errors if api returns undefined
              .catch(() => ui.createGameNotFound())
        }, 1000);
    }})}


// Creating modal in UI with components
function loadModal(gameDetails) {
    ui.createModalContent(gameDetails);
    ui.addTopTags(gameDetails);
    ui.addPlatformTags(gameDetails);
}

// Not very elegant fix for canvas pictures sometimes not loading ...
window.onload = function() {
    //get each photo for games in library, then resize them and insert in the place of those fetched by api
    convertToCanvas();
}

function convertToCanvas(param){
    if(param === undefined){
        const images = document.querySelectorAll('#list-image')
        images.forEach((image) => {
            const canvas = ui.imageResize(250, image);
            canvas.classList.add('list-image');
            image.parentElement.appendChild(canvas);
            image.remove();
        })
    }else{
        const canvas = ui.imageResize(250, param);
        canvas.classList.add('list-image');
        param.parentElement.appendChild(canvas);
        param.remove();
    }
}