canvas = null;
ctx = null;
camX = 0;
camY = 0;
camW = 100;
camH = 100;
camDrag = false;
camDragX = 0;
camDragY = 0;

function gameStart(){
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext('2d');
  gameLoop();

  $(document).on('keydown',function(e){
    inputDownKeys[e.keyCode] = true;
    inputPressKeys[e.keyCode] = true;
  });
  $(document).on('keyup',function(e){
    delete inputDownKeys[e.keyCode];
    inputReleaseKeys[e.keyCode] = true;
  })
  $(document).on('mousedown',function(e){
    inputDownKeys["M"+e.button] = true;
    inputPressKeys["M"+e.button] = true;
  });
  $(document).on('mouseup',function(e){
    delete inputDownKeys["M"+e.button];
    inputReleaseKeys["M"+e.button] = true;
  });
  $(canvas).on('mousemove',function(e){
    mouseVX = e.clientX;
    mouseVY = e.clientY;
  });
  document.getElementById("gameCanvas").addEventListener('contextmenu', function(evt) { 
    evt.preventDefault();
  }, false);

}
function draw(){

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  camW = canvas.width;

  if(ctx == null){
    return false;
  }
  //background
  var grd = ctx.createLinearGradient(0,0,0,canvas.height);
  grd.addColorStop(0,"#404040");
  grd.addColorStop(1,"#121212");
  ctx.fillStyle = grd;

  ctx.fillRect(0,0,canvas.width,canvas.height)

  //terrain
  ctx.beginPath();
  ctx.moveTo(0,canvas.height);
  ctx.lineTo(0,y);
  for(var i=Math.floor(camX/terrain.ppn); i<Math.ceil((camX+camW)/terrain.ppn)+1; i++){
    var x = i * terrain.ppn - camX;
    var y = canvas.height-terrain.nodes[i]*terrain.amplitude;
    ctx.lineTo(x,y);
  }
  ctx.lineTo(terrain.nodes.length*terrain.ppn,canvas.height);
  ctx.lineWidth = 5;
  ctx.strokeStyle= "#ffffff";
  ctx.stroke();

  var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grd.addColorStop(0, "#121250");
  grd.addColorStop(1, "#404050");
  ctx.fillStyle = grd;
  ctx.fill();

  //ctx.fillStyle = "#121250";

  ctx.fillStyle = "#ff0000"
  drawCircle(mouseX,terrain.getY(mouseX),4);

}
function gameLoop(){

  mouseX = mouseVX + camX;
  mouseY = mouseVY + camY;

  if(keyCheckDown(39)){
    camX += 3;
  }
  if(keyCheckDown(37)){
    camX -= 3;
  }
  if(keyCheckPressed("M2")){ //right click
    camDrag = true;
    camDragX = mouseX;
  }
  if(keyCheckReleased("M2")){ //right click
    camDrag = false;
  }
  if(camDrag){
    camX = camDragX - (mouseX - camX); //drag view
  }
  camX = Math.min(Math.max(camX,0),(terrain.nodes.length*terrain.ppn)-camW);

  draw();

  inputNext();
  requestAnimationFrame(gameLoop);
}
terrain = {
  nodes: [],
  ppn: 8, //pixel per node
  amplitude: 400,
  getHeight: function(x){
    var node1 = terrain.nodes[Math.floor(x/terrain.ppn)];
    var node2 = terrain.nodes[Math.ceil(x/terrain.ppn)];
    var l = x % terrain.ppn;
    return node1+((l/8) * (node2 - node1));
  },
  getY: function(x){
    return canvas.height - (terrain.getHeight(x))*terrain.amplitude;
  }
}

//input
var inputDownKeys = {};
var inputPressKeys = {};
var inputReleaseKeys = {};
var mouseX = 0;
var mouseY = 0;
var mouseVX = 0;
var mouseVY = 0;

function keyCheckDown(code){
  if(inputDownKeys[code] != undefined){
    return true;
  }else{
    return false;
  }
}

function keyCheckPressed(code){
  if(inputPressKeys[code] != undefined){
    return true;
  }else{
    return false;
  }
}

function keyCheckReleased(code){
  if(inputReleaseKeys[code] != undefined){
    return true;
  }else{
    return false;
  }
}

function inputNext(){
  inputPressKeys = {};
  inputReleaseKeys = {};
}

//extra draw stuff
function drawCircle(x,y,radius){
  ctx.beginPath();
  ctx.arc(x-camX, y-camY, radius, 0, 2 * Math.PI, false);
  ctx.fill();
}