class GameApi {
    constructor(){
        this.user_agent = 'Gaming Library Portfolio Junior Dev Project';
        this.rapidapi_host = 'rawg-video-games-database.p.rapidapi.com';
        this.rapidapi_key = 'a21d916badmsh7e6f374d5e3d426p168996jsne111dfc69e19';
    }
    
    async searchGameInfo (searchTerm){

        //ID's for platforms that this app supports
        const platforms = '4,187,1,18,186,7,3,21,8,9,14,80,16,27,15,105,83'
        //Search for game given the searchTerm
        const gameInfoResponse = await fetch(`https://rawg-video-games-database.p.rapidapi.com/games?search=${searchTerm}&platforms=${platforms}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": this.rapidapi_host,
                "x-rapidapi-key": this.rapidapi_key,
                "User_Agent" : this.user_agent
            }
        });
        const game = await gameInfoResponse.json();

        //Get the first item with first id (this api sorts by relevance by default)
        return  game.results[0].id
    }

    async getDetails(gameId){

        //Get full details about the game by providing gameId
        const gameDetailsResponse = await fetch(`https://rawg-video-games-database.p.rapidapi.com/games/${gameId}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": this.rapidapi_host,
                "x-rapidapi-key": this.rapidapi_key,
                "User_Agent" : this.user_agent
        }});
        const gameDetails = await gameDetailsResponse.json();

        //Filter through poorly documented games that are not worth showing up
        if(gameDetails.background_image === null || gameDetails.description_raw == ''){
            return undefined;
        }else {
            return gameDetails;
        }
    }
}