 class GameStorage {
    constructor(){
        this.storedGames = [];
        if(localStorage.getItem('games') !== null){
            this.storedGames = JSON.parse(localStorage.getItem('games'));
        }
        this.storedPlatforms = [];
    }

    checkPlatforms(){
        const array = [];
        this.storedGames.forEach((game) => {
            if(!array.includes(game.checkedPlatform)){
                array.push(game.checkedPlatform);
                console.log(`pushed ${game.name}`)
            }
        })
        return array;
    }

    getGames(){


    
    }

    //Adds game to local storage
    addGame(game){

        if(this.checkForDuplicates(game.id, 'id', this.storedGames) !== true ){
            this.storedGames.push(game);
            localStorage.setItem('games', JSON.stringify(this.storedGames));
            location.reload();
        }else{
            alert('This game is already on the list');
        }
    }

    removeGame(e){
        const gameNameNode = e.currentTarget.parentNode.children[0].children[0].textContent;
        if(confirm(`Are you sure you want do delete ${gameNameNode} ?`))
        {
            this.storedGames.forEach((game, index) => {
                if(gameNameNode === game.name)
                {
                    this.storedGames.splice(index, 1);
                }
            })
            localStorage.setItem('games', JSON.stringify(this.storedGames));
            e.currentTarget.parentNode.remove();
        }
    }

    // Helper methods

    checkForDuplicates(value, property, array) {
        return array.some((object) => object[property] === value);
    }
 }