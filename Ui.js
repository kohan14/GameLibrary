class UI {
    constructor (){
        this.modalBackground = document.querySelector('.modal-background');
        this.modalContent = document.querySelector('.modal-content');
        this.modalBody = document.querySelector('.modal-body');
        this.modalCloseBtn = document.querySelector('.modal-close');
        this.searchbarEL = document.querySelector('.search-bar');
        this.gameListEL = document.querySelector('.game-list');
    }

    //Reassign selectors 
    refreshSelectors(){
        this.modalBackground = document.querySelector('.modal-background');
        this.modalContent = document.querySelector('.modal-content');
        this.modalBody = document.querySelector('.modal-body');
        this.modalCloseBtn = document.querySelector('.modal-close');
        this.searchbarEL = document.querySelector('.search-bar');
        this.gameListEL = document.querySelector('.game-list');
    }

    //////////////////// MODAL METHODS //////////////////////

    //Create modal element
    createModal(beforeEL) {
        
        const modalEL = document.createElement('div');
        modalEL.classList.add('modal-content');
        modalEL.innerHTML = `
           <div class="modal-header">
               <div class="title">Search:</div>
               <input type="text" class="search-bar">
               <button class="modal-close" data-modal="close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
            </div>`
        const modalBackgroundEL = document.createElement('div');
        modalBackgroundEL.classList.add('modal-background');
        modalBackgroundEL.dataset.modal = 'close';
        document.body.insertBefore(modalEL, beforeEL);
        document.body.insertBefore(modalBackgroundEL, modalEL);
        this.refreshSelectors();
    }

    //Toggle classes for animation
    modalAnimate(){
        this.modalBackground.classList.toggle('is-visible');
        this.modalContent.classList.toggle('modal-show');
    }
    //remove modal from DOM
    deleteModal(){
        this.modalContent.remove();
        this.modalBackground.remove();

    }

    // Add platform tags for specified amount of platforms
    addPlatformTags(game){
        
        // The platforms that we want tags for
        const platformsSlugs = ["pc","playstation5","xbox-one","playstation4",
        "xbox-series-x","nintendo-switch","ios","android",
        "nintendo-3ds","nintendo-ds","xbox360","xbox-old",
        "playstation3","playstation1","playstation2","gamecube",
        "nintendo-64"]
        const { platforms } = game;
        if(platforms !== undefined)
        {
            // Target info bar cointainer and make container for tags
            const widgetInfoBarEL = document.querySelector('#modal-info-bar');
            const platformTagContainerEL = document.createElement('form');
            platformTagContainerEL.classList.add('widget-platform-tags');
            platformTagContainerEL.id = 'platform-form'
            platformTagContainerEL.innerHTML = `<div></div>`
            widgetInfoBarEL.appendChild(platformTagContainerEL);

            // create counter to calculate hits form api platforms and local array of slugs
            var counter = 0;

            //Loop through each platform for given game and create tag with proper styling
            platforms.forEach((platformObj) =>{
                if(platformsSlugs.includes(platformObj.platform.slug))
                {
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = 'platforms';
                    radio.id = platformObj.platform.slug;
                    radio.value = platformObj.platform.slug;
                    const label = document.createElement('label');
                    label.htmlFor = platformObj.platform.slug;
                    label.textContent = platformObj.platform.slug.toUpperCase();
                    label.className = `platform-tag ${platformObj.platform.slug}`
                    platformTagContainerEL.appendChild(radio);
                    platformTagContainerEL.appendChild(label);
                    counter++;
                }
            })

            // Check if the api platforms data has at least one platform in common with my local slugs array, otherwise delete whole section
            if (counter === 0){
                const container = document.querySelector('.widget-info-bar');
                container.remove();
            }
        }
    }

    // Adding top tags on image including reddit subforum and main webpage if the API provides those for given game
    addTopTags(game){

        const topTagContainerEL = document.createElement('div')
        topTagContainerEL.className = 'widget-img-tags'

        //Add reddit button-tag if api provides reddit subforum link
        if(game.reddit_url) {
            const redditTagEl = document.createElement('a');
            redditTagEl.href = game.reddit_url;
            redditTagEl.title = 'Visit Reddit subforum'
            redditTagEl.innerHTML =`<i class="fab fa-reddit-square"></i>`;
            topTagContainerEL.appendChild(redditTagEl);
        }

        //Add official website button-tag if api provides link
        if(game.website) {
            const websiteTagEL = document.createElement('a');
            websiteTagEL.href = game.website;
            websiteTagEL.title = 'Visit game\'s official website'
            websiteTagEL.innerHTML = `<i class="fas fa-bookmark"></i>`;
            topTagContainerEL.appendChild(websiteTagEL);
        }

        //Insert into the dom if there is atleast one of them
        if(game.reddit_url || game.website){
            document.querySelector('#modal-widget-img').appendChild(topTagContainerEL);      
        }
    }

    //Create popup modal with search bar for searching through games
    createModalContent(game) {

        //Game info fetched from json object
        const backgroundImg = game.background_image;
        const name = game.name;
        const description = game.description_raw;
        const released = game.released;

        //Search engine shows name UNDEFINED if cannot find any matching result, show error when that happens
        this.modalBody.innerHTML = `
            <div class="widget-img" id="modal-widget-img">
                <div class="widget-title" id="modal-widget-title">${name}
                    <div class="widget-info-release">Release Date : ${released ? released : 'Release date missing'}</div>
                </div>
                <img src="${backgroundImg}"></img>
            </div>
            <div class="widget-info-bar" id="modal-info-bar">
            </div>
            <div class="widget-description" id="modal-widget-description">
                <p class="description-content" id="modal-description-content">${description}</p>
            </div>
            <button class="add-to-list" type="submit" data-modal="close" form="platform-form">ADD GAME TO LIST</button>`;     
    }

    //If api returns undefined, game not found
    createGameNotFound(){
        this.modalBody.innerHTML = '<div class="title" style="text-align:center">Sorry, game not found, try something else</div>'
    }

    // Insterting spinner graphic into the dom when loading  search results, check for input value to cancel loader
    spinnerLoader(param){
        if(param === ''){
            this.modalBody.innerHTML = ''
        }else{
            this.modalBody.innerHTML = '<div class="loader">Loading...</div>'
        }
        
    }

    //////////////////// GAME LIST METHODS //////////////////////

    //Get all of the games from local storage and append them to game list
    getGames(array){
        this.gameListEL.innerHTML ='';
        array.forEach((game) => {
            const gameEL = this.createGameElement(game);
            this.gameListEL.appendChild(gameEL);

            gameEL.addEventListener('click', (e) => {
                //Exclude delete button before opening modal
                if(!e.target.classList.contains('game-item-remove')){
                    toggleModal(e.currentTarget);
                    loadModal(game);
                    loadModalContentEventListeners(game);
                }
            })

            //Add delete button
            gameEL.children[1].addEventListener('click', (e) => {
                ls.removeGame(e);
                e.stopPropagation();
            })
        })
    }
    

    // Create element for game-list on main page
    createGameElement(game){
        const element = document.createElement('div');
        element.classList.add('game-item');
        element.classList.add(game.checkedPlatform);
        element.dataset.modal = "open";
        element.innerHTML = 
            `
            ${game.checkedPlatform.toUpperCase()}
            <div class="widget-img" style="height:250px;" id="list-game-img">
                <div class="widget-title"">${game.name}</div>
                <img src="${game.background_image}" id="list-image">
            </div>
            <button class="game-item-remove"><i class="fas fa-trash-alt"></i></button>`
        return element;
    }

    //Creates canvas element and sets height given the img source, made to deal with the lagging problem in main page
    imageResize(containerHeight, image) {
        
        //Create canvas 
        const canvas = document.createElement('canvas');
        const aspectRatio = image.naturalWidth / image.naturalHeight;

        //create canvas element
        const ctx = canvas.getContext('2d');
        canvas.height = containerHeight;
        canvas.width = containerHeight * aspectRatio;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        return canvas;
    }
}