var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 5;
var ballY = 50;
var ballSpeedY = 5;
var Player1Score = 0;
var Player2Score = 0;

const WINNING_SCORE = 3;
var showWinScore = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

//Mouse controler
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var MouseX = evt.clientX - rect.left - root.scrollLeft;
  var MouseY = evt.clientY - rect.top - root.scrollTop;

  return {
    x: MouseX,
    y: MouseY,
  };
}

function handleMouseClick(evt) {
  if (showWinScore) {
    Player1Score = 0;
    Player2Score = 0;
    showWinScore = false;
  }
}

window.onload = function () {
  console.log("Hello JavaScript");
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);
  //mouse handler
  canvas.addEventListener("mousedown", handleMouseClick);
  //mouse handler
  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function ballReset() {
  if (Player1Score > WINNING_SCORE || Player2Score > WINNING_SCORE) {
    showWinScore = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

function moveEverything() {
  if (showWinScore) {
    return;
  }
  computerMovement();
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      Player2Score++; //add player score before resetting.
      ballReset();
    }
  }
  //right side paddle
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      Player1Score++; //add player score before resetting.
      ballReset();
    }
  }

  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "green");
  }
}

function drawEverything() {
  //this line blanks out the screen iwth black
  colorRect(0, 0, canvas.width, canvas.height, "black");

  //winscore display
  if (showWinScore) {
    canvasContext.fillStyle = "white";
    if (Player1Score > WINNING_SCORE) {
      canvasContext.fillText("Left player won!", 350, 200);
    } else if (Player2Score > WINNING_SCORE) {
      canvasContext.fillText("Right player won!", 350, 200);
    }

    canvasContext.fillText("click here to continue...", 350, 500);

    return;
  }
  drawNet();
  //this line draws left rectangle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, 100, "green");

  ////this line draws right rectangle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "green"
  );

  //this line draws the ball
  colorCircel(ballX, ballY, 10, "red");

  //Scoring
  canvasContext.fillText(Player1Score, 100, 100);
  canvasContext.fillText(Player2Score, canvas.width - 100, 100);
}

function colorCircel(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
