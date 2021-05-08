let btns = document.getElementsByClassName("btn")
let score = document.getElementById("score")
let body = document.getElementById("body")
let canvasSize = 500
let snakeSize = 10
let frameInterval 
const DIRECTION = {
    ArrowUp:[0,-1],
    ArrowDown:[0,1],
    ArrowLeft:[-1,0],
    ArrowRight:[1,0],
    W:[0,-1],
    S:[0,1],
    A:[-1,0],
    D:[1,0],
    w:[0,-1],
    s:[0,1],
    a:[-1,0],
    d:[1,0],
}
let keyPressed
let snakeColour = "black"
let foodColour = randomColor()
let controls = {direction:{x: 1, y: 0,}, snake:[{x:10,y:10}], food:{x: 20, y: 20}, playing: false, increase: 0, difucult: 0, score: 0, keyPressedOnThisLoop: false}
for (let index = 0; index < btns.length; index++) {
    btns[index].addEventListener("click", function() {
        let active = document.getElementsByClassName("active");
        if (active.length > 0) {
        active[0].className = active[0].className.replace(" active", "");
        }
        this.className += " active";
        if (active != undefined && controls.difucult != index+1){
            controls.difucult = index + 1
            controls.playing = false
            if (controls.difucult === 1){
                frameInterval = 100
            }else if (controls.difucult === 2){
                frameInterval = 75
            }else if (controls.difucult === 3){
                frameInterval = 50
            }
            startGame()
        }
    });
}
const snakeHead = controls.snake[0]
const food = controls.food
let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")
let screenWidth = innerWidth
if (screenWidth < 500){
    canvasSize = screenWidth - 10
    snakeSize = screenWidth/50
    canvas.width = canvasSize
    canvas.height = canvasSize
}else{
    canvas.width = 500
    canvas.height = 500
}

let looper = ()=>{
    if (controls.playing){
        controls.keyPressedOnThisLoop = false
        let tail = {}
        Object.assign(tail,controls.snake[controls.snake.length-1])
        let fullSnake = controls.snake.length-1
        let dx = controls.direction.x
        let dy = controls.direction.y
            for (let index = fullSnake; index > -1; index--) {
                let snakePart = controls.snake[index];
                if (index === 0){
                    snakeHead.x += dx
                    snakeHead.y += dy
                }else{
                    snakePart.x = controls.snake[index-1].x
                    snakePart.y = controls.snake[index-1].y
                }
            }
        let hunted = snakeHead.x === food.x && snakeHead.y === food.y
        if (hunted){
            controls.increase += 1
            controls.score ++
            foodNewPosition()
            snakeColour = foodColour
            foodColour = randomColor()
        }
        if (controls.increase > 0) {
            controls.snake.push(tail)
            controls.increase -= 1
        }
        requestAnimationFrame(drawingCanvas)
        body.style.background = foodColour
        score.innerHTML= `score: ${controls.score}`
        if(collision()){
            controls.playing = false
            startGame()
        }
    }
    setTimeout( looper, frameInterval)
}
let drawingCanvas = ()=>{
    ctx.clearRect(0,0,canvasSize,canvasSize)
    //draw("red", food.x,food.y)
    draw(foodColour, food.x,food.y)
    for (let index = 0; index < controls.snake.length; index++) {
        const {x,y} = controls.snake[index]
        draw(snakeColour , x , y)
    }
}
let draw = (colour, x, y)=>{
    ctx.fillStyle = colour
    ctx.fillRect(x*snakeSize,y*snakeSize,snakeSize,snakeSize)
}
let randomNumber = ()=>{
    let d = Object.values(DIRECTION)
    return{
        x: Math.round(Math.random() * ((canvasSize- snakeSize)/snakeSize)),
        y: Math.round(Math.random() * ((canvasSize- snakeSize)/snakeSize)),
        d: d[Math.round(Math.random()*3)]
    }
}
let foodNewPosition = ()=>{
    let newPosition = randomNumber()
    food.x = newPosition.x
    food.y = newPosition.y
}
let collision = ()=>{
    if (snakeHead.x < 0 || snakeHead.x >= canvasSize/snakeSize || snakeHead.y < 0 || snakeHead.y >= canvasSize/snakeSize){
        return true
    }
    for (let index = 1; index < controls.snake.length; index++) {
        let snakeTail = controls.snake[index]
        let {x,y} = snakeTail
        if (snakeHead.x === x && snakeHead.y === y){
            return true
        }
    }
}
let startGame = ()=>{
    controls.snake = [snakeHead]
    controls.increase = 0
    controls.score = 0
    snakeColour = randomColor()
    foodNewPosition()
    foodColour = randomColor()
    let randomPosition = randomNumber()
    snakeHead.x = randomPosition.x
    snakeHead.y = randomPosition.y
    let [x, y] = randomPosition.d
    controls.direction.x = x
    controls.direction.y = y
    controls.playing = true
}
document.onkeydown = (e)=>{
    keyPressed = DIRECTION[e.key]
    let [x, y] = keyPressed
    if (controls.keyPressedOnThisLoop == false){
        if(x !== controls.direction.x && y !== controls.direction.y){
            controls.direction.x = x
            controls.direction.y = y
            controls.keyPressedOnThisLoop = true
        }
    }
}
let directinalBtn = document.getElementsByClassName("directionalBTN")
for (let index = 0; index < directinalBtn.length; index++) {
    const btn = directinalBtn[index];
    btn.addEventListener("click", ()=>{
        keyPressed = DIRECTION[btn.id]
        let [x, y] = keyPressed
        if (controls.keyPressedOnThisLoop == false){
            if(x !== controls.direction.x && y !== controls.direction.y){
                controls.direction.x = x
                controls.direction.y = y
                controls.keyPressedOnThisLoop = true
            }
        }
    })
}
window.onload = ()=>{
    //startGame()
    looper()
}
function randomColor() {
    let disapprove = true
    while (disapprove){
        let r = Math.round(Math.random() * 255)
        let g = Math.round(Math.random() * 255)
        let b = Math.round(Math.random() * 255)
        disapprove = r + g + b
        if (disapprove < 160  || disapprove > 600){
            disapprove = true
        }else {
            disapprove = false
            return `rgb(${r},${g},${b})`
        }
    }
}

//randomColor = ()=>{
//    let disapprove = true
//    while (disapprove){
//        let r = Math.round(Math.random() * 255)
//        let g = Math.round(Math.random() * 255)
//        let b = Math.round(Math.random() * 255)
//        disapprove = r + g + b
//        if (disapprove < 400  || disapprove > 700){
//            disapprove = true
//        }else {
//            disapprove = false
//            return `rgb(${r},${g},${b})`
//        }
//    }
//}