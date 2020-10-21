
//// DOM ELEMENTS
const api = new GameApi;
const ui = new UI;
const ls = new GameStorage;

ui.getGames(ls.storedGames);
const array = ui.getArrayOfPlatformTagElements();


const addButtonEL = document.querySelector('.add-game');
const background = document.querySelector('.background');
const gameItemRemoveBtnsEL = document.querySelectorAll('.game-item-remove');
const gameListImages = document.querySelectorAll('#list-image')
const gameItems = document.querySelectorAll('.game-item');
const filterTagContainer = document.querySelector('#filter-tags');

array.forEach((element) => {
    filterTagContainer.appendChild(element.tagEL);
    filterTagContainer.appendChild(element.label);
})


// Timer for keyinput delay when using searchbar inside modal,
const timer = '';

const testBTN = document.querySelector('.test-button');
testBTN.addEventListener('click', () => {
    const SelectedBTNS = document.querySelectorAll('.nintendo-switch');
    SelectedBTNS.forEach( (button) => {
        button.style.display = 'none'
    })
})

// Loading core event listeners, for main page of the app
domLoadedEventListeners();


//All event listeners that need to be loaded immediately
function domLoadedEventListeners(){
    //const filterRadios = document.get('filter-tag');
    console.log(filterTagContainer.children);
    // Button modal toggle
    addButtonEL.addEventListener('click', (e) => toggleModal(e))

    // Event listeners for deleting each of the game from list 
    gameItemRemoveBtnsEL.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            ls.removeGame(e);
            e.stopPropagation();
        })
    })

    // Event for every game item button click to open modal
    gameItems.forEach((game, index) => {
        game.addEventListener('click', (e) => {
                //Exclude delete button before opening modal
                if(!e.target.classList.contains('game-item-remove')){
                    toggleModal(e);
                    loadModal(ls.storedGames[index]);
                    loadModalContentEventListeners(ls.storedGames[index]);
                }
        })
    })

    //Filter games by tags



}

// All event listeners that require modal to be inside of the viewport to work. 
function loadModalEventListeners(){

    // Searching games through search bar and adding modal content. setTimeout used to avoid making HTTP Requests each keyup (for better performance)
    ui.searchbarEL.addEventListener('keyup', (e) => {
        searchGame(e)
            .then((gameDetails) => loadModalContentEventListeners(gameDetails))
    })

    // Toggling modal off by clicking in background
    ui.modalBackground.addEventListener('click', (e) => toggleModal(e));

    // Toggling modal off by clicking in background
    ui.modalCloseBtn.addEventListener('click', (e) => toggleModal(e));
}

function loadModalContentEventListeners(gameDetails){

    //Modal Content Elements
    const widgetSeeMoreBtn = document.querySelector('#modal-see-more');
    const addGameForm = document.querySelector('#platform-form');

    if(widgetSeeMoreBtn !== null){
        //Toggle full description Btn
        widgetSeeMoreBtn.addEventListener('click', (e) => autoContainerHeight(e, '#modal-widget-description'));
    }

    //ADD game modal event listener
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
        
        //Check if the user checked any of the buttons, if not set alert
        if(checkedPlatform !== undefined){
            gameDetails.checkedPlatform = checkedPlatform;
            console.log(gameDetails.checkedPlatform);
            ls.addGame(gameDetails);
        }else {
            alert('Please select your platform');
        }
    })
}


/////////// FUNCTIONS FOR EVENT LISTENERS

// Set widget description container height to auto
function autoContainerHeight(e, elementID) {
    const descriptionContainer = document.querySelector(elementID);
    descriptionContainer.classList.add('show-full');
    e.target.remove();
}

//Toggle modal
function toggleModal(e) {

    //If event target is modal wrapper or close btn, then we are togglingOff Modal - otherwise opening
    if(e.currentTarget.dataset.modal === 'close'){
        clearTimeout(this.timer)
        ui.modalAnimate();
        setTimeout(() => {
            ui.deleteModal();
        }, 200);
    }
    if (e.currentTarget.dataset.modal === 'open') {
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
    gameListImages.forEach((image) => {
        const canvas = ui.imageResize(250, image);
        canvas.classList.add('list-image');
        image.parentElement.appendChild(canvas);
        image.remove();
    })
}

ls.checkPlatforms();