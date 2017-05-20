var socket = io();

socket.on('leave',function(){ //show the login thing again
  $('.panel').slideUp(100);
  $('#panelLogin').slideDown(100);
  isInLobby = false;
});

socket.on('start',function(){
  $('.panel').slideUp(100);
  $('#game').slideDown(100);
  gameStart();
});
socket.on('world',function(data){
  console.log('Got world data',data);
  terrain.nodes = data.nodes;
});
socket.on('placement',function(data){
  placement = data;
});
socket.on('build',function(data){
  ents[data.id] = {x: data.x, y: data.y, sprite: data.sprite, team: data.team, hp: data.hp, hpMax: data.hpMax, angle: data.angle, grounded: data.grounded};
});
socket.on('loginError',function(data){
  $('.loginError').html(data);
});
socket.on('lobbyStatus',function(data){
  $('#lobbyStatus').html(data);
});
socket.on('t',function(data){ //team data
  Object.assign(myTeam,data);
});
socket.on('selDat',function(data){ //data from selected object
  selectedEntUI = data;
  if (selectedEntUI.options == undefined){
    selectedEntUI.options = [];
  }
  selectedEntUI.options.forEach(function(option){
    option.hoverFrame = 0;
  });
});
socket.on('x',function(data){ //destroy entity
  delete ents[data];
});
socket.on('e',function(data){ //show effect
  spawnEffect(data[0],worldHeight-data[1],data[2],data[3]);
})
socket.on(1,function(data){ //entity change
  var ent = ents[data[0]];
  if(ent != undefined){
    ent.x = data[1];
    ent.y = data[2];
    ent.hp = data[3];
  }
});
socket.on(2,function(data){ //entity angle
  var ent = ents[data[0]];
  ent.angle = data[1];
});
socket.on(3,function(data){ //entity velocity
  var ent = ents[data[0]];
  ent.hspeed = data[1];
  ent.vspeed = data[2];
});
socket.on(4,function(data){ //entity target
  var ent = ents[data[0]];
  ent.target = data[1];
})