 class GameStorage {
    constructor(){
        this.storedGames = [];
        if(localStorage.getItem('games') !== null){
            this.storedGames = JSON.parse(localStorage.getItem('games'));
        }
    }

    //Adds game to local storage
    addGame(game){
        this.storedGames.push(game);
        localStorage.setItem('games', JSON.stringify(this.storedGames));
    }

    removeGame(e){
        const gameNameNode = e.currentTarget.parentNode.children[0].children[0].textContent;
        const thisTarget = e.currentTarget;
        alertify.confirm(`DELETE PROMPT`, `Do you want to delete ${gameNameNode} from your library?`,
                () => {
                    alertify.error(`${gameNameNode} successfully deleted!`);
                    this.storedGames.forEach((game, index) => {
                        if(gameNameNode === game.name){
                            this.storedGames.splice(index, 1);
                        }
                    })
                    localStorage.setItem('games', JSON.stringify(this.storedGames));
                    thisTarget.parentNode.remove();
                    },
                () => {
                });
    }

    loadTestData(){
        const dataObj = new DummyData
        localStorage.setItem('games', JSON.stringify(dataObj.data))
    }

    // Helper methods

    checkForDuplicates(value, property, array) {
        return array.some((object) => object[property] === value);
    }
 }