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
        alertify.confirm(`DELETE PROMPT`, `Do you want to delete ${gameNameNode} form your library?`,
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

        // if(confirm(`Are you sure you want do delete ${gameNameNode} ?`))
        // {
        //     this.storedGames.forEach((game, index) => {
        //         if(gameNameNode === game.name)
        //         {
        //             this.storedGames.splice(index, 1);
        //         }
        //     })
        //     localStorage.setItem('games', JSON.stringify(this.storedGames));
        //     e.currentTarget.parentNode.remove();
        // }
    }

    loadTestData(){
        fetch('/dummyData.json').then((data) => data.json()).then((games) => localStorage.setItem('games', JSON.stringify(games)))
    }

    // Helper methods

    checkForDuplicates(value, property, array) {
        return array.some((object) => object[property] === value);
    }
 }