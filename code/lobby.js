Game = require('./game.js');

module.exports = function(host,name){

  this.clients = []; //list with clients in the lobby
  this.host = host; //host of the lobby (client object)
  this.name = name; //name of the lobby

  this.maxClients = 2;
  this.teamNumber = 1;
  this.gamemode = "DM"; //DM: Deathmatch

  this.game = null;

  //this.teams = [["Spieler A","Spieler B"],["Spieler C","Spieler D"],["Spieler E","Spieler F"]]; //for debugging
  this.teams = [[]];

  this.addClient = function(client){ //Add a client to the lobby
    if (this.game != null){
      return false;
    }
    this.clients.push(client);
    client.lobby = this;

    this.checkTeams();//reorder teams
    this.sync(); //Synchronize with everyone so they know there is someone new in the lobby
  }

  this.removeClient = function(client){ //Removes a client from the lobby
    var index = this.clients.indexOf(client);
    client.lobby = null;
    this.clients.splice(index,1);

    this.checkTeams(); //reorder teams
    this.sync(); //Synchronize with everyone so they know there has someone left the game

    if(this.clients.length <= 0){
      delete lobbies[this.name]; //remove the lobby if no player is in
    }
  }

  this.checkReady = function(){
    var ready = this.clients.every(function(index){
      return (index.isReady);
    });
    if(ready && this.clients.length >= 1){ //for debugging. In real situation only "> 1"
      if(this.game == null){
        this.game = new Game(this,{gamemode: this.gamemode});
      }
    }
  }

  this.sync = function(){ //Synchronize the lobby between all players in the lobby
    for(var i=0; i<this.clients.length; i++){
      this.clients[i].socket.emit("lobby",{teams: this.teams, name: this.name});
    }
  }

  this.broadcast = function(msg,data){ //send a message to everyone in the lobby
    for(var i=0; i<this.clients.length; i++){
      this.clients[i].socket.emit(msg,data);
    }
  }

  this.checkTeams = function(){ //refreshes the teams array
    this.teams = [];
    for(var i=0; i<this.teamNumber; i++){
      this.teams[i] = [];
    }
    for(var i=0; i<this.clients.length; i++){
      var client = this.clients[i];
      var team = client.team;
      if (team >= this.teamNumber){ //if the team of the player don't exists
        client.team = 0;
        team = 0;
      }
      this.teams[team].push(client.name);
    }
  }

  this.addClient(host); //add the host to the lobby, so he know he is this lobby
}