/*!
 * Space Invaders - Made with ♥ by ---
 *
 * Use arrow keys to move (← or →)
 * Use spacebar to shoot
 */
////////////////////////////////////////////////////
/** Time **/
var time = 5000;
const temporizador = document.getElementById("temporizador");

/** Variáveis do score **/
var actualPlayer;
var actualScore = 0;
var playerScore = {name : "", score : 0};
var ranking;

var mySound = new sound("point.aac");
var bgSound = new sound("bg.mp3");

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}
/** Pontos **/
var pontos = 0;
const pontuacao = document.getElementById("pontuacao");


/** Constants **/
const canvas_width = 1024;
const canvas_height = 620;

/** Objects **/
var spaceship = new Spaceship();
var enemies = new Array();
var keys = new Keys();
var collision = new Collision();

/** Canvas **/
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = canvas_width;
canvas.height = canvas_height;


var drawCanvas = function() {
  // Draw the canvas
  ctx.fillStyle = '#0000';
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  ctx.beginPath();
  ctx.rect(0, 0, canvas_width, canvas_height);
  ctx.closePath();
  ctx.fill();
}

/** Key events **/
document.onkeydown = function(e) {
  keys.keyDown(e);
}
document.onkeyup = function(e) {
  keys.keyUp(e);
}


/** Função Time **/
function atttime(){
	if (time > 0){ /** Se o tempo for maior que zero **/
		time = time - 1000; /** Ele vai adicionar 1000, que vale a 1 segundo **/
	} else if (time < 0){ /** Se o tempo for menor que zero **/
		time = 0; /** Ele vai deixar sempre em zero, para não ficar numero negativo (não existe tempo negativo) **/
	}
	
	temporizador.innerHTML = formatTime (atttime); /** Mostrar o tempo no jogo **/
	return time;
}


/** Spaceship **/
function Spaceship() {

  // Object size
  this.width = 65;
  this.height = 73;

  // Verify move direction
  this.isLeft = false;
  this.isRight = false;
  this.isUp = false;
  this.isDown = false;

  //"Speed" that the spaceships moves
  const speed = 5;

  // Initial position
  this.x = (canvas_width / 2) - (this.width / 2);
  this.y = canvas_height - 73;

  // Show object on screen
  this.render = function() {
    this.image = new Image();
    this.image.src = 'images/spaceship.png';
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  // Drive spaceship to left
  this.goLeft = function() {
    this.updatePosition(this.x - speed, this.y);
  }

  // Drive spaceship to right
  this.goRight = function() {
    this.updatePosition(this.x + speed, this.y);
  }

    // Drive spaceship to up
  this.goUp = function() {
    this.updatePosition(this.x, this.y - speed);
  }

    // Drive spaceship to down
  this.goDown = function() {
    this.updatePosition(this.x, this.y + speed);
  }
  

  // Update the object position
  this.updatePosition = function(posX, posY) {
    if ((posX > 0) && (posY > 0) && (posX < canvas_width - this.width) && (posY < canvas_height - this.height)) {
      this.x = posX;
      this.y = posY;
    }
  }

}

/** Enemy **/
function Enemy() {

    // Object size
    this.width = 41;
    this.height = 49;

    // Random position
    this.x = (Math.floor(Math.random() * ((canvas_width - 40) - 40)) + 40);
    this.y = (Math.floor(Math.random() * ((canvas_height - 250) - 20)) + 20);

    // Show object on screen
    this.render = function() {
      this.image = new Image();
      this.image.src = 'images/enemy.png';
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

  }


/** Keys **/
function Keys() {

    this.leftKey = 37;
    this.rightKey = 39;
	this.upKey = 38;
	this.downKey = 40;
    this.spaceKey = 32;

    // Check key pressed (onkeydown)
    this.keyDown = function(e) {
      //In Firefox, the keyCode property does not work on the onkeypress event (will only return 0). For a cross-browser solution, use the which property together with keyCode
      keyPressed = e.which ? e.which : window.event.keyCode;

      switch (keyPressed) {
        case this.leftKey:
          spaceship.isLeft = true;
          break;
        case this.rightKey:
          spaceship.isRight = true;
          break;
		case this.upKey:
          spaceship.isUp = true;
          break;
		case this.downKey:
          spaceship.isDown = true;
          break;
      }
    }

    // Check key pressed (onkeyup)
    this.keyUp = function(e) {
      keyPressed = e.which ? e.which : window.event.keyCode;

      switch (keyPressed) {
        case this.leftKey:
          spaceship.isLeft = false;
          break;
        case this.rightKey:
          spaceship.isRight = false;
          break;
		case this.upKey:
          spaceship.isUp = false;
          break;
		case this.downKey:
          spaceship.isDown = false;
          break;
      }
    }
}

// ---- End Objects

/** First enemies **/
var firstEnemies = function() {
    // Five first enemies
    for (var i = 0; i < 1; i++) {
      enemies[enemies.length] = new Enemy();
    }
  }

 /** Collision **/
function Collision() {

  // Check if has a collision
  this.hasCollision = function(spaceship, enemy) {
    if ((spaceship.y) < enemy.y) {
      return false;
    } else if (spaceship.y > (enemy.y + enemy.height)) {
      return false;
    } else if ((spaceship.x + spaceship.width) < enemy.x) {
      return false;
    } else if (spaceship.x > (enemy.x + enemy.width)) {
      return false;
    }
    return true;
  }
}

var checkColisions = function() {

    for (idEnemy in enemies) {
      if (collision.hasCollision(spaceship, enemies[idEnemy])) { /** Se tiver colisão entre o jogador e o inimigo e vai o que tem em baixo **/

        // Dead enemy
		mySound.play(); /** Tocar o som de ponto **/
        enemies.splice(idEnemy, 1); /** Matar o inimigo **/
		pontos = pontos + 1; /** Adicionar 1 ponto **/
		time = 5000; /** Deixar 5 segundos para você pegar o proximo inimigo **/
		temporizador.innerHTML = formatTime(atttime); /** Mostrar na tela do jogo o tempo **/
		if (pontos == 1){
			pontuacao.innerHTML = pontos + " ponto";
		} else {
			pontuacao.innerHTML = pontos + " pontos";
		}
        // Resurrect enemy
        enemies.push(new Enemy()); /** Adicionar um novo inimigo na tela **/
		
        break;
    }
  }
}

/** Render **/
var render = function() {


    // Enemies
    for (index in enemies) {
      enemies[index].render();
    }

    // Spaceship moves
    if (spaceship.isLeft && time > 0)
        spaceship.goLeft();
    else if (spaceship.isRight && time > 0)
        spaceship.goRight();
	else if (spaceship.isUp && time > 0)
        spaceship.goUp();
	else if (spaceship.isDown && time > 0)
        spaceship.goDown();

}

/** Mostrar ranking **/
function showRanking() {
    var text = "<h2> Ranking: </h2>";
    var pontuacoes = ranking.players;

    for (i in pontuacoes) {
        text = text + "Nome: " + pontuacoes[i].name + " - Pontos: " + pontuacoes[i].score + "<br>";
    }

    document.getElementById("ranking").innerHTML = text;
}

/** Salvar score **/
function saveScore() {

    // Retrieving data:
    var jsonFile = localStorage.getItem("rankingJSON4");
    playerScore.name = actualPlayer
    playerScore.score = actualScore;

    if (jsonFile != null) {
        ranking = JSON.parse(jsonFile);
    } else { //Qdo ainda não existe ranking
        ranking = {players:[]};
    }
    var pontuacoes = ranking.players;
    pontuacoes.push(playerScore);
    ranking.players = pontuacoes;

    var objJSON = JSON.stringify(ranking);
    localStorage.setItem("rankingJSON4", objJSON);

}

/** Formatar o tempo **/
function formatTime (atttime) {
  var tmp = Math.floor(time / 1000);
  var second = tmp % 60;
  if (second < 20) {second};
  return second;
}

/** Checar o tempo **/
var checkTiming = function() {
	if (time == 0){ /** Se o tempo chegar em 0 segundos **/
		saveScore(); /** Vai salvar a pontuação **/
		showRanking(); /** E vai mostrar o ranking **/
		document.getElementById("game").style.display ="none"; /** E apagar o jogo, deixando só o ranking **/
	}
}
/* O método window.requestAnimationFrame() fala para o navegador que deseja-se realizar
    uma animação e pede que o navegador chame uma função específica para atualizar um
    quadro de animação antes da próxima repaint (repintura).
    O método tem como argumento uma callback que deve ser invocado antes da repaint.
  Essa função funciona em diversos brownsers e caso o brownser não suporte HTML5
    ele usa o setTimeout
*/
window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 80);
    };
})();


/** Main **/
var main = function() {
  drawCanvas();
  spaceship.render();
  render();
  checkColisions();
	checkTiming(); /** Checar se o tempo chegou a 0 **/
  requestAnimationFrame(main);
}

/** Iniciar jogo **/
function start(){
actualPlayer = document.getElementById("player").value; /** Pegar o nome que o jogador escreveu **/
document.getElementById("player").value = ""; /** Não sei peguei do código dela **/
document.getElementById("iniciar").disabled = true; /** Não sei peguei do código dela **/
document.getElementById("inicio").style.display ="none"; /** Vai apagar as coisas do inicio **/
document.getElementById("hud").style.display ="block"; /** Vai mostrar o hud do jogo **/
document.getElementById("game").style.display ="block"; /** Vai mostrar o jogo **/
setInterval(atttime, 1000); /** Chamar a função atttime a cada 1 segundo **/
firstEnemies(); /** vai adicionar o inimigo **/
main(); /** Chamar a função main **/
bgSound.play(); /** Musica de fundo **/
}