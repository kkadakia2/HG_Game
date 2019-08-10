document.getElementById("guessSpace").style.display = "none";
document.getElementById("resetButton").innerHTML = "Reset";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); 
var spots = [];
var guessLetter = "";
var guessNumber = 0;
var guessIncorrect = 0; 
var guessCorrect = 0;
var answer = "";
var paused = true;
var guessedLetters = [];
var duplicate = false;
var win = false;
var count = 0;
var finished = false;
var check = false;


function answerHold(){
	return answer;
}

 function getDifficulty() {
  let x = document.getElementById("difficulty");
  difficulty = x.options[x.selectedIndex].value;
  return difficulty;
}

function initiateBoard(){
	document.getElementById("difficultySelect").style.display = "none";
	document.getElementById("guessSpace").style.display = "initial";
	getAnswer();
}

 async function getAnswer() {
	difficulty = getDifficulty();
    let response = await fetch("https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=" + difficulty, {});
    let json = await response.json();
	word = json.word;
	answer = JSON.stringify(word);
  answerValidate(answer);
  console.log(answer);
    return answer;
}

function answerValidate(answer) {
	if(answer != ""){
		paused = false;
		start(answer);
		answerHold();
	}
	else {
		console.log("no answer input");
		paused = true;
	}
}

function start(answer) {
	if(!paused){
		getInitialSpots(answer);
		paused = true;
	}
	drawNext(guessNumber);
}

function getInitialSpots(answer){
    let letters = answer.split("");
    letters.pop();
    letters.shift();
    for (let i = 0; i < letters.length; i++){
		  spots[i] = " _ ";
     }
	printSpots(spots);
	return spots;
}

function printSpots(spots){
    document.getElementById("places").innerHTML = spots;
}

function guess(){
	guessNumber ++;
	guessLetter = document.getElementById("guessInput").value;
  guessLetter.toLowerCase;
  letterValidate(guessLetter, guessedLetters);
  if(!duplicate){
	  guessedLettersBox(guessLetter);
	  if(answer.includes(guessLetter)) {
		  guessCorrect ++;
		  answer = answerHold();
      correctGuessFill(answer, guessLetter);
      console.log(answer + " does inlcude " + guessLetter);
  	}
  	else{
		  guessIncorrect ++;
		  drawNext();
		  console.log(answer + " does not inlcude " + guessLetter);
	  }
	  document.getElementById("guessInput").value = "";
  }
}

function correctGuessFill(answer, guessLetter) {
	let letters = answer.split("");
    letters.pop();
    letters.shift();
  let duplicates = letters.reduce(function(acc, el, i, arr) {
    if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
    }, []);

  if(duplicates!=""){
    for(let i = 0; i < letters.length; i++){     
      let duplicateGLI = [];
      let sGLI = letters.indexOf(guessLetter, i);
      if(duplicateGLI != -1){
        duplicateGLI.push(sGLI);
        spots[duplicateGLI] = letters[duplicateGLI];
        }
    }
  }
	let GLI = letters.findIndex(letter => letter === guessLetter);
  spots[GLI] = letters[GLI];
  printSpots(spots);
  determineWin(spots);
  }

function guessedLettersBox(guessLetter){
	guessedLetters.push(guessLetter);
	document.getElementById("guessedLettersBox").innerHTML = guessedLetters;
}

function letterValidate(guessLetter, guessedLetters){
  if(guessedLetters.includes(guessLetter)){
    alert("You've already tried that one!");
    duplicate = true;
  }
  else{
    duplicate = false;
  }
}

function determineWin(spots){
  let u = [];
  let wordLength = answerHold().length - 2;
  let x = spots.length;

  let uCount = 0;
  let xCount = 0;
  for(let i = 0; i < spots.length; i++){
    u[i] = spots[i];
    let p = u[i];
    if(p.includes("_")){
      uCount++;
    }
    else if(!p.includes("_")){
      xCount++;
    }
  }
  if(uCount == 0){
    let winz = true;
    gameOver(winz);
    console.log("game over! win? " + winz);
  }
}

function gameOver(win){
  if(win){
    document.getElementById("guessText").style.display = "none";
    document.getElementById("gameResult").innerHTML = "You won!";
  }
  else if(!win){
    document.getElementById("guessText").style.display = "none";
    document.getElementById("gameResult").innerHTML = "You lost :(";
  }
  finished = true;
}

function revealAnswer(){
  a = answerHold();
  if(finished){
    document.getElementById("answer").innerHTML = "The word was " + a + ".";
  }
  else{
    alert("Please finish your game first!")
  }
}

function reset() { 
  if(check){
  document.getElementById("difficultySelect").style.display = "initial";
  document.getElementById("guessSpace").style.display = "none";
  document.getElementById("guessText").style.display = "initial";
  document.getElementById("guessInput").value = "";
  document.getElementById("guessedLettersBox").innerHTML = "";
  document.getElementById("gameResult").innerHTML = "";
  document.getElementById("resetButton").innerHTML = "Reset";
  difficulty = "";
  answer = "";
  guessedLetters = [];
  guessNumber = 0;
  guessCorrect = 0;
  guessIncorrect = 0;
  win = false;
  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  if(finished){
    check = true;
  }
  else if(!check){
      alert("This will end your game. Are you sure?")
      document.getElementById("resetButton").innerHTML = "Yes I'm sure. Reset";
      check = true;
      console.log(check);
  }
}


//draw functions
function drawNext(guessNumber) {
	switch (guessIncorrect) {
	case 0:
		drawBase();
		break;
	case 1:
		drawHead();
		break;
	case 2:
		drawBody();
		break;
	case 3:
		drawLeftArm();
		break;
	case 4:
		drawRightArm();
		break;
	case 5:
		drawLeftLeg();
		break;
	case 6:
    drawRightLeg();
    win = false;
    gameOver(win);
		break;
  }
}

function drawBase() {
    ctx.fillStyle = 'black';
    ctx.fillRect(50, 5, 10, 300); //left
    ctx.fillRect(5, 5, 340, 10); //top
    ctx.fillRect(10, 295, 100, 5); //bottom
    ctx.fillRect(195, 10, 10, 10); //little head square 
}
function drawHead() {
    ctx.beginPath();
    ctx.arc(200, 50, 30, 0, Math.PI * 2, true); 
    ctx.stroke();
}
function drawBody() {
    ctx.beginPath();
    ctx.moveTo(200, 80);
    ctx.lineTo(200, 180);
    ctx.stroke();
}
function drawLeftArm() {
    ctx.beginPath();
    ctx.moveTo(200, 80);
    ctx.lineTo(250, 130);
    ctx.stroke();
}
function drawRightArm() {
    ctx.beginPath();
    ctx.moveTo(200, 80);
    ctx.lineTo(150, 130);
    ctx.stroke();
}
function drawLeftLeg(){
    ctx.beginPath();
    ctx.moveTo(200, 180);
    ctx.lineTo(250, 280);
    ctx.stroke();
}
function drawRightLeg() {
    ctx.beginPath();
    ctx.moveTo(200, 180);
    ctx.lineTo(150, 280);
    ctx.stroke();
}
