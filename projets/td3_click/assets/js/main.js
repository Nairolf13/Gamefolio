let scores = document.querySelector("#score")
let resultat = document.querySelector("#result")
let level = document.querySelector("#level")
let levelCount = 1
let score = 0
let counter = false
const startTimer = 1
let temps = startTimer * 60
let timerInterval = null
const timerElement = document.querySelector("#timer")
const gameContainer = document.querySelector("#gamecontainer")
let inter = null;
let homer = document.querySelector("#homer")
let barney = document.querySelector("#barney")
let nelson = document.querySelector("#nelson")
let music = document.querySelector("#music")
let musicPlayed = true


function randomize(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function moveBarney() {
    let randomY = randomize(0, gameContainer.clientHeight - barney.clientHeight)
    let randomX = randomize(0, gameContainer.clientWidth - barney.clientWidth)
    barney.style.top = randomY + "px"
    barney.style.left = randomX + "px"
}

function moveHomer() {
    let randomY = randomize(0, gameContainer.clientHeight - homer.clientHeight)
    let randomX = randomize(0, gameContainer.clientWidth - homer.clientWidth)
    homer.style.top = randomY + "px"
    homer.style.left = randomX + "px"
}

function moveNelson() {
    let randomY = randomize(0, gameContainer.clientHeight - nelson.clientHeight)
    let randomX = randomize(0, gameContainer.clientWidth - nelson.clientWidth)
    nelson.style.top = randomY + "px"
    nelson.style.left = randomX + "px"
}

function soundStart(sound) {
    if (!counter) return
    moveBarney()
    moveHomer()
    moveNelson()
    let audio = document.querySelector(`#${sound}`)
    audio.volume = 1
    audio.play()
    score++
    scores.innerHTML = "Score : " + score;
    if (score > 10 && score < 20) {
       
        level.innerHTML = "LEVEL : " + 2
        clearInterval(inter)
        inter = setInterval(function () {
            moveBarney()
        }, 1000)
    }
    if (score > 20 && score < 30) {
        levelCount = 3
        level.innerHTML = "LEVEL : " + 3
        clearInterval(inter)
        homer.classList.remove("hidden")
        inter = setInterval(function () {
            moveBarney()
            moveHomer()
        }, 800)
    }
    if (score > 30 && score < 40) {
        levelCount++
        level.innerHTML = "LEVEL : " + 4
        clearInterval(inter)
        inter = setInterval(function () {
            moveBarney()
            moveHomer()
        }, 700)
    } if (score > 40 && score < 50) {
        levelCount++
        level.innerHTML = "LEVEL : " + 5
        clearInterval(inter)
        inter = setInterval(function () {
            nelson.classList.remove("hidden")
            moveBarney()
            moveHomer()
            moveNelson()
        }, 500)
    }
    if (score > 50) {
        levelCount++
        level.innerHTML = "LEVEL : " + 5
        clearInterval(inter)
        inter = setInterval(function () {
            moveBarney()
            moveHomer()
            moveNelson()
        }, 300)
    }
}

function timer() {
    timerInterval = setInterval(() => {
        let minutes = parseInt(temps / 60, 10)
        let secondes = parseInt(temps % 60, 10)
        minutes = minutes < 10 ? "0" + minutes : minutes
        secondes = secondes < 10 ? "0" + secondes : secondes
        timerElement.innerText = `Time : ${minutes}:${secondes}`

        if (temps > 0) {
            temps--;
        } else {
            stop();
            resultat.innerHTML = "Le temps est écoulé";
        }
    }, 1000);
}

function stop() {
    
    document.querySelector('#start').style.display = 'flex'
    counter = false
    scores.innerHTML = "Score :" + score
    score = 0
    clearInterval(inter);
    clearInterval(timerInterval)
    levelCount = 0
    
}

function playAll() {
    homer.classList.add("hidden")
    nelson.classList.add("hidden")
    level.innerHTML = "LEVEL : " + levelCount
    temps = startTimer * 60
    document.querySelector('#start').style.display = 'none'
    counter = true
    inter = setInterval(function () {  
        moveBarney()
        moveHomer()
        moveNelson()
        resultat.innerHTML = "";
    }, 1000), timer()
}

function playMusic() {
    if (musicPlayed == false) {
        music.pause(`#${music}`);

    }else{
        music.play(`#${music}`);
        }
    musicPlayed = !musicPlayed

}
