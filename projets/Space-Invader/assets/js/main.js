let gameContainer = document.querySelector('#gamecontainer');
document.querySelector("#gamecontainer").style.display = 'none';
let scoreContainer = document.querySelector('#scoreContainer');
document.querySelector("#scoreContainer").style.display= 'none'
let ennemyIterval = null;
let intervalShoot = null;
let map = []
const ennemyOne = 2
const ennemyTwo = 3
const shooter = 4
const canon = 1
let score = 0
let scored = document.createElement("p")
scoreContainer.appendChild(scored)
scored.classList.add("score")
scored.innerHTML = "Score : " + score
console.log(scored);
let sound = new Audio("./assets/sound/LASRGun_Blaster star wars 5 (ID 1761)_LS.mp3")

function newGame() {
    map = [
        [2, 2, 2, 2, 2, 2, 2, 0 ,0],
        [3, 3, 3, 3, 3, 3, 3, 0 ,0],
        [2, 2, 2, 2, 2, 2, 2, 0 ,0],
        [3, 3, 3, 3, 3, 3, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0 ,0],
        [0, 0, 0, 0, 0, 0, 0, 0,0 ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0 ,0],
        [0, 0, 0, 0, 1, 0, 0, 0 ,0]
    ]
    displayMap()
    intervalShoot = setInterval(() => {
        shoot()
    }, 100)
    ennemyIterval = setInterval(() => {
        mooveEnemy()
    }, 1000)
}

window.addEventListener('keyup', (key) => {
    actionPlayer(key)
})
function startGame(){
    document.querySelector("#presentation").style.display = 'none'
    document.querySelector("#gamecontainer").style.display = 'flex';
    document.querySelector("#scoreContainer").style.display= 'flex'
    document.querySelector("#gameOver").style.display = 'none';
    document.querySelector("#win").style.display = 'flex'
    clearInterval(intervalShoot)
    clearInterval(ennemyIterval)
    newGame()
    
}
// fonction d'affichage de ma map
function displayMap() {
    gameContainer.innerHTML = "" //la ligne qui raffraichis le game containeur, a montrer a la fin
    //On parcourt la map
    map.forEach((el) => {
        let rowContainer = document.createElement('div') // on creer la div qui contiendra mes cell
        rowContainer.classList.add('row') // Je lui passe une classe .row, utile pour le CSS
        gameContainer.appendChild(rowContainer)// j'insere ma div dans mon game container
        el.forEach((value) => {
            //je parcours le tableau de mes cellules 
            let cell = document.createElement('div')// je creer une div qui sera ma cellule
            cell.classList.add('cell') // Je lui ajoute la classe cell utile pour le css
            rowContainer.appendChild(cell) // j'insere ma cellule a l'interieur de ma row
            //je switch sur la cellule en cours pour deffinir ce qui va etre afficher
            switch (value) {
                case canon:
                    cell.innerHTML = '<img src=./assets/imgs/vaisseau.png>'
                    break;
                case ennemyOne:
                    cell.innerHTML = '<img src=./assets/imgs/meduse.gif>' 
                    break;
                case ennemyTwo:
                    cell.innerHTML = '<img src=./assets/imgs/space_invader_ennemy.gif>'
                    break;
                case shooter:
                    cell.innerHTML = '<img src=./assets/imgs/fire.png>'
                    break;  
            }
        })
    })
}

//fonction qui active les actions que le vaisseau peux faire: bouger a droite et a gauche, et tirer
function actionPlayer(key) {
    let ground = map[map.length - 1] // variable qui defini le sol "la derniere row"
    let indexPlayer = ground.indexOf(1) // l'index de la position du joueur
    //switch sur le key code, qui permet de verifier la touche que le joueur aura utiliser
    switch (key.keyCode) {
        case 39: // le code 39 correspond a la fleche de droite (on trouve le code correspondant a chaque touche dans la doc)
            // si le vaisseau ne se trouve pas a l'extreme droit de la grille
            if (indexPlayer < map.length) {
                ground[indexPlayer] = 0;
                ground[indexPlayer + 1] = canon
            }
            break;
        case 37: // le code 32 correspond a la fleche de gauche
            //si le joueur ne se trouve pas a l'extreme gauche de la grille
            if (indexPlayer > 0) {
                ground[indexPlayer] = 0;
                ground[indexPlayer - 1] = canon
            }
            break;
        case 32: // le code 39 correspond a la touche espace le tir 
            map[map.length - 2][indexPlayer] = shooter
            sound.play()
            break;
    }
    displayMap()
}

// mouvement des ennemies, expliquer pourquoi on doit parcourir le tableau a l'envers
function mooveEnemy() {
let memory = null
    // on boucle sur le tableau mutli a l'envers
    for (let i = map.length - 1; i >= 0; i--) {
        //on boucle sur le tableau a l'interieur, a l'envers
        for (let j = map[i].length - 1; j >= 0; j--) {
            //Si la cellule contiens un ennemi
            if (map[i][j] == 2 || map[i][j] == 3) {
                // Si les ennemi arrive une cellule avant le joueur
                if (i == map.length - 2) {
                    //c'est perdu
                    gameOver()
                    return
                }
                memory =  map[i][j] 
                //Si un enemie touche le bord droit de l'ecran
                if (j == map[i].length - 1) {
                    //on fait passer l'ennemi en dessous a gauche
                    map[i][j] = 0
                    map[i + 1][0] = memory
                } else {
                    //on fait passer l'ennemi un cellule a gauche
                    map[i][j] = 0
                    map[i][j + 1] = memory
                }
            }
        }
    }
    //quand la boucle est terminer, on affiche la map
    displayMap()
}

// fonction permettant de verifier si un tir a été fait, elle parcourt les tableau, et fera se deplacer verticalement le tir 
function shoot() {
    //parcours du tableau a l'envers
    for (let i = 0; i < map.length; i++) {
        //pareil mais sur la row
        for (let j = 0; j < map[i].length; j++) {
            //si on trouve un tir
            if (map[i][j] === shooter) {
                map[i][j] = 0; //on efface le tir
                //si le tir ne se situe pas sur la premier ligne
                if (i > 0) {
                    //si le tir est juste devant un  ennemie
                    if (map[i - 1][j] === 2 || map[i - 1][j] === 3){
                        //on detrui l'ennemi
                        map[i][j] = 0;    
                        map[i - 1][j] = 0;
                        score += 100
                        scored.innerHTML = "Score : " + score
                        if (score == 2800){
                            win()
                        }
                        //on affiche la map pour que l'enemie disparaisse
                        displayMap();
                        // on met fin a la fonction
                        return;
                    } else {
                        map[i][j] = 0;
                        if (i > 0) {
                            map[i - 1][j] = shooter;// on affiche le tir sur la ligne plus haute
                        }
                    }
                }
                displayMap();
            }
        }
    }
}

function win (){
    clearInterval(intervalShoot)
    clearInterval(ennemyIterval)
    score = 0
    scored.innerHTML = score
    document.querySelector("#win").style.display = 'flex';
    document.querySelector("#gamecontainer").style.display = 'none';
    document.querySelector("#gameOver").style.display = 'none';
    document.querySelector("#scoreContainer").style.display= 'none'
}

function gameOver() {
    clearInterval(intervalShoot)
    clearInterval(ennemyIterval)
    score = 0
    scored.innerHTML =  score
    document.querySelector("#gamecontainer").style.display = 'none';
    document.querySelector("#gameOver").style.display = 'flex';
    document.querySelector("#scoreContainer").style.display= 'none'
    document.querySelector("#win").style.display = 'none'
}








