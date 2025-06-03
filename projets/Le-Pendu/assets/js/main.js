function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let wordtofind = ["banane", "fraise", "panier", "poisson", "peche", "boisson", "alcool", "maison", "porte", "rideau", "jardin", "balancoir", "piscine", "bouee", "frite", "mayonnaise", "ketchup", "moutarde", "frigo", "fromage"]
let jeu = document.querySelector("#container")
let findWord = document.createElement("p")
findWord.classList.add("findWord")
jeu.appendChild(findWord)
let wordRandom = ""
let hiddenWord = ""
let pendu1 = document.querySelector("#pendu1")
let music =  new Audio("./assets/sounds/Cri de douleur .mp3")
let music1 = new Audio("./assets/sounds/you-win.mp3")

//NOMBRE DE TOURS

let letterUse = document.createElement("p")
letterUse.innerHTML = "Lettre déja utilisé : "
letterUse.classList.add("letterUse")
jeu.appendChild(letterUse)

//Nombre d'essai

let round = 5
let roundMax = round
let tryNumber = document.createElement("p")
tryNumber.innerHTML = "Nombre d'essai restant : " + round
tryNumber.classList.add("tryNumber")
jeu.appendChild(tryNumber)

//CHOIX DES LETTRES

let letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let possibility = document.createElement("p")
possibility.classList.add("possibility")

for (let i = 0; i < letter.length; i++) {
    let span = document.createElement("span");
    span.innerHTML = letter[i];
    span.classList.add("letter");
    possibility.appendChild(span);
    span.addEventListener('click', () => {
        if (round > 0) {
            findletter(letter[i])
        }
    })
}
jeu.appendChild(possibility)

//BOUTON JOUER

let btn = document.createElement("div")
btn.addEventListener("click", () => {
    randomWord()
})
btn.innerHTML = "Jouer"
btn.classList = ("btn-play")
jeu.appendChild(btn)

//AFFICHER RESULTAT

let result = document.createElement("div")
let seeResult = document.createElement("p")
result.appendChild(seeResult)
jeu.appendChild(result)


function findletter(lettre) {

    let finded = false
    let str = ""
    for (let i = 0; i < wordRandom.length; i++) {
        if (lettre.toLowerCase() == wordRandom[i].toLowerCase()) {
            finded = true
            hiddenWord[i] = wordRandom[i]
            str += wordRandom[i]

        } else {
            str += hiddenWord[i]
        }
    }
    if (finded == false) {
        letterUse.innerHTML += lettre
        round--
        document.querySelector("#pendu1").src = `./assets/imgs/pendu${roundMax - round}.png`

        tryNumber.innerHTML = "Nombre d'essai restant : " + round
        if (round == 0) {
            music.play()
            seeResult.innerHTML = "Vous avez perdu"
        }
    }
    hiddenWord = str
    findWord.innerHTML = "Mot à deviner : " + "<span id='hiddenWord'>" + hiddenWord + "</span>";

    if (hiddenWord == wordRandom) {
        music1.play()
        seeResult.innerHTML = "bravo vous avez gagné"
    }

}


function randomWord() {
    document.querySelector("#pendu1").src = ""
    let randomIndex = random(0, wordtofind.length - 1)
    wordRandom = wordtofind[randomIndex]
    hiddenWord = wordRandom.replace(/[a-zA-Z]/g, "_");
    findWord.innerHTML = "Mot à deviner : " + "<span id='hiddenWord'>" + hiddenWord + "</span>";;
    letterUse.innerHTML = "Lettre déja utilisé : "
    round = 5
    tryNumber.innerHTML = "Nombre d'essai restant : " + round
    seeResult.innerHTML = ""
}






randomWord()
