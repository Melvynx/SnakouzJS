/** CONSTANTS **/
const mycanvas = document.getElementById('gameCanvas');
const ctx = mycanvas.getContext('2d');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
const restartButton = document.getElementById('restartButton');
const titlePoint = document.getElementById("point");
const imgGameOver = document.getElementById("imgGameOver");
const imgSnake = document.getElementById("imgSnake");
const contentHighScore = document.getElementById('contentHighScore');
const contentAbsoluteHighScore = document.getElementById('seeHighScore');
const page = document;
const snakeSize = 10; 
let snakePoint = [{x : 100, y : 100}, {x : 110, y : 100}, {x : 120, y : 100}]
const snakeColor = [{fill : "#300047", stroke : "#300047"},{fill : "#b691ff", stroke : "#36117e"}, {fill : "#002c57", stroke : "#003f7d"}, {fill : "#bfcfff", stroke : "#002db3"}]
let w = 100;
let h = 100;
let score = 0;
let snake;
let food;
//Settings
let direction = "-w";
let gameStart = false;
let snakeTouchSnakeActive = false;
let speed = 200;
let tours = 0;
let countLigne = 0;
let actualyColor = 0;
let actualyColorSe = 1;
let fillColorSnake = snakeColor[actualyColor].fill;
let strokeColorSnake = snakeColor[actualyColor].stroke;

let fillColorSnakeSe = snakeColor[actualyColor+1].fill;
let strokeColorSnakeSe = snakeColor[actualyColor+1].stroke;
//Apple
let appleExisting = false;
const appleSize = 10;
let xApple = getRandomIntOne(29);
let yApple = getRandomIntOne(29);

let pseudoSay = false;
//Default start

//Function 

const startPage = function () {
  createComponent();
  createSnake();
}
startButton.onclick = function(){
  gameStart = true;
  snakeTouchSnakeActive = true;
  imgSnake.style.display = "none";
  mycanvas.style.display = "block";
  pseudoSay = false;
  countLigne = 0;
  main();
}
endButton.onclick = function() {
  gameStart = false;
}
restartButton.onclick = function() {
  snakePoint = [{x : 100, y : 100}, {x : 110, y : 100}, {x : 120, y : 100}];
  gameStart = false;
  pseudoSay = true;
  imgGameOver.style.display = "none";
  imgSnake.style.display = "block";
  startButton.style.display = "inline";
  endButton.style.display = "inline";
  restartButton.style.display = "none";
  score = 0;
  speed = 200;
}
const main = function() {
  setTimeout(() => {
    createComponent();
    trySnakeTouchApple();
    trySnakeTouchWall();
    trySnakeTouchSnake();
    movingSnak();
    createSnake();
    generateApple();
    //countScore();
    titlePoint.innerHTML = "Point "+score;
    if(gameStart){
      main();
    }
  }, speed);
}


//Base
const createComponent = function () {
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,300,300);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0,0,300,300);
}
const createSnake = function() {
  for(let i = 0; i < snakePoint.length; i++){
    if (i % 2 == 0){
      ctx.fillStyle = fillColorSnake;
      ctx.strokeStyle = strokeColorSnake;
    } else {
      ctx.fillStyle = fillColorSnakeSe;
      ctx.strokeStyle = strokeColorSnakeSe;
    } 
    ctx.fillRect(snakePoint[i].x, snakePoint[i].y, snakeSize, snakeSize);
    ctx.strokeRect(snakePoint[i].x, snakePoint[i].y, snakeSize, snakeSize);
  }
  tours++;
}
const generateApple = function(){
  ctx.fillStyle = "orange";   
  ctx.strokeStyle = "red";

  ctx.fillRect(xApple*10, yApple*10, appleSize, appleSize);
  ctx.strokeRect(xApple*10, yApple*10, appleSize, appleSize);

  pommeExisting = true;
}
const trySnakeTouchApple = function() {
  if (snakePoint[0].x == xApple*10 && snakePoint[0].y == yApple*10){
    snakeTouchApple();
  }
}
const snakeTouchApple = function () {
  ctx.fillStyle = fillColorSnake;   
  ctx.strokeStyle = strokeColorSnake;
  ctx.fillRect(xApple*10, yApple*10, appleSize, appleSize);
  ctx.strokeRect(xApple*10, yApple*10, appleSize, appleSize);

  xApple = getRandomIntOne(28);
  yApple = getRandomIntOne(28);
  changeColorSnake();
  snakePoint.push({ x : 0, y : 0});
  score+= 100;
  if(speed > 100){
    speed-= 5;
  } else if(speed > 10){
    speed-= 1;
  }
}
const trySnakeTouchSnake = function() {
  for(let i = 0; i < snakePoint.length; i++){
    for(let l = 0; l<snakePoint.length; l++){
      if (i != l && snakePoint.length > 3){
        if(snakePoint[i].x == snakePoint[l].x && snakePoint[i].y == snakePoint[l].y){
          if (snakeTouchSnakeActive) {
            stopGame();
            snakeTouchSnakeActive = false;
          }
        }
      }
    }
  }
}
const stopGame = function() {
  gameStart = false;
  amimSnakeDead();
}
const amimSnakeDead = function() {
  ctx.fillStyle = "#231e20";
  ctx.fillRect(0,0,300,countLigne*10);
  countLigne++;
  setTimeout(() => {
    if(countLigne <= 30){
      amimSnakeDead();
    } else{
      gameOver();
    }
  }, 100);
}
const gameOver = function() {
  mycanvas.style.display = "none";
  imgGameOver.style.display = "block";
  restartButton.style.display = "inline";
  startButton.style.display = "none";
  endButton.style.display = "none";
  getScore()
}
const getScore = function() {
  if(!pseudoSay){
    pseudo = prompt("Vous avez réussi à collecter "+score+" point.\n Donnez votre pseudo !");
  }else{
    return;
  }
  pseudoSay = true;
  if (pseudo == "//revive"){
    commandeRevive();
    return;
  }
  if (pseudo == null || pseudo == ""){
    return;
  }
  let highScore;
  if (getScoreStorage() != null){
    highScore = getScoreStorage();
    highScore.push({ pseudo : pseudo, score : score});
    localStorage.setItem("high_score", JSON.stringify(highScore))
  } else {
    highScore = [{ pseudo : pseudo, score : score}]
    localStorage.setItem("high_score", JSON.stringify(highScore))
  }
}

function commandeRevive(){
  gameStart = true;
  pseudoSay = false;
  imgGameOver.style.display = "none";
  imgSnake.style.display = "none";
  startButton.style.display = "inline";
  endButton.style.display = "inline";
  restartButton.style.display = "none";
  imgSnake.style.display = "none";
  mycanvas.style.display = "block";
  countLigne = 0;
  setTimeout(() => {
   snakeTouchSnakeActive = true;
  }, 5000);
  main();
}
function getScoreStorage() {
  return JSON.parse(localStorage.getItem("high_score"));
}
const trySnakeTouchWall = function() {
  if (snakePoint[0].x >= 300){
    snakePoint[0].x = 0;
  }
  if (snakePoint[0].x < 0){
    snakePoint[0].x = 300;
  }
  if (snakePoint[0].y >= 300){
    snakePoint[0].y = 0;
  }
  if (snakePoint[0].y < 0){
    snakePoint[0].y = 300;
  }
}
const movingSnak = function(){
  const snakeJSON = JSON.stringify(snakePoint);
  const snakeCopie = JSON.parse(snakeJSON);

  for(let i = 0; i < snakePoint.length; i++){
    if(direction == "h"){
      if(i == 0){
        snakePoint[i].y = snakePoint[i].y + 10;
      } else{
        snakePoint[i] = snakeCopie[i-1];
      }
    }
    if(direction == "-h"){
      if(i == 0){
        snakePoint[i].y = snakePoint[i].y - 10;
      } else{
        snakePoint[i] = snakeCopie[i-1];
      }
    }
    if(direction == "-w"){
      if(i == 0){
        snakePoint[i].x = snakePoint[i].x - 10;
      } else{
        snakePoint[i] = snakeCopie[i-1];
      }
    }
    if(direction == "w"){
      if(i == 0){
        snakePoint[i].x = snakePoint[i].x + 10;
      } else{
        snakePoint[i] = snakeCopie[i-1];
      }
    }
  }
}

//key listener DIRECTION
page.addEventListener('keydown', (e) => {
  const nameKey = e.key;
  if(nameKey == "ArrowUp" || nameKey == "w"){
    if(direction != "h"){
      direction = "-h";
    }
  }
  if(nameKey == "ArrowDown" || nameKey == "s"){
    if(direction != "-h"){
      direction = "h";
    }
  }
  if(nameKey == "ArrowLeft" || nameKey == "a"){
    if(direction != "w"){
      direction = "-w"
    } 
  }
  if(nameKey == "ArrowRight" || nameKey == "d"){
    if(direction != "-w"){
      direction = "w"
    }
  }
});
const createHighScoreContent = function () {
  contentHighScore.innerHTML = "";
  const highScore = getScoreStorage();
  const highScoreBest = highScore.sort((a, b) => (a.score < b.score) ? 1 : ((b.score > a.score) ? -1 : 0));
  let highScoreLength;
  if (highScoreBest.length > 20){
    highScoreLength = 20;
  } else {
    highScoreLength = highScoreBest.length;
  }
  for(let i = 0; i<highScoreLength; i++){
    contentHighScoreValue = contentHighScore.innerHTML;
    newValue = "<div class='highScoreElement'>"+(i+1)+". <span class='pseudo'>"+highScoreBest[i].pseudo+"</span> à eu "+highScoreBest[i].score+"</div>";
    newContent = contentHighScoreValue + newValue;
    contentHighScore.innerHTML = newContent;
  }
}
const seeHighScore = function (bol) {
  if (bol){
    createHighScoreContent();
    contentAbsoluteHighScore.classList.remove("hideHighScoreDisplay");      
    setTimeout(() => {
      contentAbsoluteHighScore.classList.remove("hideHighScoreOpacity");
  }, 20);
  } else {
    contentAbsoluteHighScore.classList.add("hideHighScoreOpacity");
    setTimeout(() => {
      contentAbsoluteHighScore.classList.add("hideHighScoreDisplay");
    }, 500);
  }
}


//No change
startPage();



//Utils
function getRandomIntOne(num) {
  num++;
  random = Math.floor(Math.random() * Math.floor(num));
  return random;
}
const changeColorSnake = function () {
  actualyColor++;
  if (actualyColor >= snakeColor.length){
    actualyColor = 0;
  }
  fillColorSnake = snakeColor[actualyColor].fill;
  strokeColorSnake = snakeColor[actualyColor].stroke;
  changeSeColorSnake();
}
const changeSeColorSnake = function () {
  actualyColorSe++; 
  if (actualyColorSe >= snakeColor.length){
    actualyColorSe = 0;
  }
  fillColorSnakeSe = snakeColor[actualyColorSe].fill;
  strokeColorSnakeSe = snakeColor[actualyColorSe].stroke;
}


//Function test
resetHighScoreStorage = function (){
  highScore = [{ pseudo : "admin", score : -100}];
  localStorage.setItem("high_score", JSON.stringify(highScore));
}
setSnakeBig = function(large){
  addCount = large - snakePoint.length;
  for(let i = 0; i < addCount; i++){
    point = { x : i*300, y : i*300};
    snakePoint.push(point);
  }
}