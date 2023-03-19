const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const counter = document.getElementById("counter");

const pacmanImg = new Image();
pacmanImg.src = "img/pacman.png";
const pacmanProtImg = new Image();
pacmanProtImg.src = "img/pacmanprotect.png";


const obstImg = [new Image(), new Image(), new Image()];
obstImg[0].src = "img/obstacle1.png";
obstImg[1].src = "img/obstacle2.png";
obstImg[2].src = "img/obstacle3.png";

//const obstImg1 = new Image();
//const obstImg2 = new Image();
//const obstImg3 = new Image();
const coinImg = [new Image(), new Image()];
coinImg[0].src = "img/coin1.png";
coinImg[1].src = "img/coin2.png";
const coinBackImg = new Image();
coinBackImg.src = "img/coinbackground.png";
//const coinImg1 = new Image();
//const coinImg2 = new Image();
const protImg = new Image();
protImg.src = "img/protection.png";

const rareness = [0, 0, 860 * 4]
const levels = [40, 90, 140, 190, 240]

const pacman_width = 50;
const pacman_height = 50;

const groundY = 230;

const startspeed = 5;

const jumpspeed = -9;

let pacmanX = 10;
let pacmanY = groundY;
let pacmanVel = 0;
let pacmanAcc = 0.2;
let pacmanDiveSpeed = 1;
//let jumpAbility = true
let dive = false;
let jump = false;
let protection = false;

let gameSpeed = startspeed;
let gameAcc = 0.2;

let time = new Date().getTime(); 
const timed = 16;
let timeMod = 1;

let entities = []
const entSize = 30;
const coinBackSize = 50;
const leftBorder = -entSize;
const rightBorder = canvas.width + entSize;


let session = false
let coins = 0

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Entity
{
    constructor(obstX, obstY, type) {
        this.X = obstX;
        this.Y = obstY;
        this.type = type;
        this.randImg()
    }
    
    reSpawn() {
        this.X = rightBorder + this.X + rareness[this.type]// + getRandomArbitrary(0, rareness[this.type])
        this.Y = levels[getRandomInt(0,5)];
        this.randImg()
    }

    randImg() {
        if (this.type == 0)
        {
            this.img = coinImg[getRandomInt(0,1)]
        }
        else if (this.type == 1)
        {
            this.img = obstImg[getRandomInt(0,2)]
        }
        else if (this.type == 2)
        {
            this.img = protImg
        }
    }
}


/*entities.push(new Entity(coinImg[0], rightBorder + getRandomArbitrary(0, rareness[0]), levels[getRandomInt(0,5)], 0))
entities.push(new Entity(coinImg[0], rightBorder + getRandomArbitrary(800, 800 + rareness[0]), levels[getRandomInt(0,5)], 0))
entities.push(new Entity(obstImg[0], rightBorder + getRandomArbitrary(0, rareness[1]), levels[getRandomInt(0,5)], 1))
entities.push(new Entity(obstImg[0], rightBorder + getRandomArbitrary(500, 500 + rareness[1]), levels[getRandomInt(0,5)], 1))
entities.push(new Entity(obstImg[0], rightBorder + getRandomArbitrary(1000, 1000 + rareness[1]), levels[getRandomInt(0,5)], 1))
entities.push(new Entity(obstImg[0], rightBorder + getRandomArbitrary(1500, 1500 + rareness[1]), levels[getRandomInt(0,5)], 1))
entities.push(new Entity(obstImg[0], rightBorder + getRandomArbitrary(2000, 2000 + rareness[1]), levels[getRandomInt(0,5)], 1))
entities.push(new Entity(protImg, rightBorder + getRandomArbitrary(0, rareness[2]), levels[getRandomInt(0,5)], 2))
*/


document.body.onkeydown = function(e) {
    if (e.code == "ArrowUp" || e.code == "Space") {// && jumpAbility){
        /*jumpAbility = false
        pacmanY -= 1
        pacmanVel = jumpspeed*/

        jump = true;
    }
    if (e.code == "ArrowDown")
    {
        dive = true;
    }

}

document.body.onkeyup = function(e) {
    if (e.code == "ArrowUp" || e.code == "Space")
    {
        if (session == false)
        {
            startGame();
        }
        jump = false;
    }
    if (e.code == "ArrowDown")
    {
        dive = false;
    }
}

canvas.onmousedown = function(e) {
    if (session == false)
    {
        startGame();
    }
    jump = true;
}

canvas.onmouseup = function(e) {
    jump = false;
}

canvas.ontouchstart = function(e) {
    if (session == false)
    {
        startGame();
    }
    jump = true;
}

canvas.ontouchend = function(e) {
    jump = false;
}

function increaseScore() {
    coins += 1;
    counter.textContent=coins
}

function startGame()
{
    counter.textContent="0"
    session = true;
    gameSpeed = startspeed
    time = new Date().getTime();
    entities.push(new Entity(rightBorder, levels[getRandomInt(0,5)], 0));
    entities.push(new Entity(rightBorder + 430, levels[getRandomInt(0,5)], 0));
    entities.push(new Entity(rightBorder + 215, levels[getRandomInt(0,5)], 1))
    entities.push(new Entity(rightBorder + 640, levels[getRandomInt(0,5)], 1))
    entities.push(new Entity(rightBorder + 720, levels[getRandomInt(0,5)], 1))
    entities.push(new Entity(rightBorder + 800, levels[getRandomInt(0,5)], 2))
    loop()
}

function endGame()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    entities = [];
    session = false;
    coins = 0
    gameSpeed = startspeed
    pacmanY = groundY
    pacmanVel = 0
    ctx.drawImage(pacmanImg, pacmanX, pacmanY, pacman_width, pacman_height);
}

function jumpF()
{
    jumpAbility = false;
    pacmanY -= 1;
    pacmanVel = jumpspeed;
}

function protect()
{
    protection = true;
}

window.onload = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(pacmanImg, pacmanX, pacmanY, pacman_width, pacman_height);
}

function collisionCheck(entity) {
    if ((entity.X < pacmanX + pacman_height && entity.X + entSize > pacmanX) && (entity.Y < pacmanY + pacman_width && entity.Y + entSize > pacmanY))
    {
        if (entity.type == 0)
        {
            increaseScore()
        }
        else if (entity.type == 1)
        {
            if (protection == false)
            {
                endGame()
            }
            else
            {
                protection = false
            }
        }
        else if (entity.type == 2)
        {
            protection = true
        }
        entity.reSpawn()
        //console.log(true)
    }
}

function loop() {

    dt = new Date().getTime() - time;
    //console.log(time, new Date().getTime(), dt, timeMod)
    time = new Date().getTime();
    timeMod = dt/timed;

    if (document.hasFocus())
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (protection)
        {
            ctx.drawImage(pacmanProtImg, pacmanX, pacmanY, pacman_width, pacman_height);
        }
        else
        {
            ctx.drawImage(pacmanImg, pacmanX, pacmanY, pacman_width, pacman_height);
        }


        if (pacmanY + pacmanVel * timeMod < groundY) {
            pacmanVel += pacmanAcc * timeMod;
            pacmanY += pacmanVel * timeMod;

            if (dive)
            {
                pacmanVel += pacmanDiveSpeed * timeMod;
            }
        }
        else {
            pacmanY = groundY;
            jumpAbility = true;
            if (jump) {// && jumpAbility) {
                /*jumpAbility = false;
                pacmanY -= 1;
                pacmanVel = jumpspeed;*/
                jumpF()
            }
        }

        gameSpeed += startspeed * 0.2 / 30000 * dt 

        for (var i=0;i<entities.length;i++)
        {
            ent = entities[i]
            if (ent.type == 0)
            {
                ctx.drawImage(coinBackImg, ent.X+entSize/2-coinBackSize/2, ent.Y+entSize/2-coinBackSize/2, coinBackSize, coinBackSize)
            }
            ctx.drawImage(ent.img, ent.X, ent.Y, entSize, entSize);

            ent.X -= gameSpeed * timeMod;
            if (ent.X < leftBorder)
            {
                ent.reSpawn()
            }
            collisionCheck(ent)
        }
    }

    if (session)
    {
        requestAnimationFrame(loop);
    }
}


//loop();