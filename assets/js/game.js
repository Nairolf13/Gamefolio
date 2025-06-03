maxScale = 6;
document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character');
    const container = document.getElementById('gameContainer');
    const modal = document.getElementById('modal');
    const textDisplay = document.getElementById('text-display');
    const paragraphs = [
        "Bienvenue dans mon gamefolio !",
        "Je m'appelle Bricchi Florian.",
        "Développeur web et web mobile passionné,",
        "Je crée des expériences numériques innovantes et intuitives.",
        "Je vous invite à explorer mes projets et compétences.",
        "Découvrez mon parcours et ma passion pour le développement.",
        "N'hésitez pas à me contacter pour discuter de vos projets.",
        "Utilisez les flèches du clavier pour vous déplacer et explorer.",
        "Bonne visite et à bientôt !"
    ];
    
    const pages = ["index.html", "pages/page2.html", "pages/page3.html", "pages/contact.html"];
    const cadres = document.querySelectorAll('#Cadre img');
    const doors = document.querySelectorAll('.door');
    const shrinkDistance = 510;

    const doorArea = document.getElementById('door-area');
    const doorAreaone = document.getElementById('door-area-two');
    const doorAreatwo = document.getElementById('door-area-three');

    const step = 13;
    const jumpHeight = 100;
    const jumpDistance = 150;
    const jumpDuration = 700;

    const framesPerDirection = 4;
    const frameWidth = 48;
    const frameHeight = 48;
    const scale = 2;
    const minScale = 0;
    const scaledWidth = frameWidth * scale;
    const scaledHeight = frameHeight * scale;

    let horizontalSpeed = step;
    let currentDirection = null;
    let frameIndex = 0;
    let animationInterval = null;

    let currentParagraph = 0;
    let currentChar = 0;
  
    let currentPageIndex = 0;
    let isJumping = false;
    let jumpStartTime = null;
    let currentHorizontalDirection = null;
    let currentVerticalDirection = null;
    currentPageIndex = parseInt(localStorage.getItem('currentPageIndex')) || 0;

    const player = {
        x: 100,
        y: 840
    };

    window.addEventListener('resize', () => {
        const widthWindow = window.innerWidth;
    
        if (widthWindow <= 1600 && widthWindow >= 1400){
            maxScale = 6
        }
        else if (widthWindow <=1401 && widthWindow >= 1200){
            maxScale = 5
        }
        else if( widthWindow <=1201 && widthWindow >=1024){
            maxScale = 4
        }
        updateCharacterPosition();
    })

    function typeWriter() {
        if (currentParagraph < paragraphs.length) {
            if (currentChar < paragraphs[currentParagraph].length) {
                textDisplay.innerHTML += paragraphs[currentParagraph].charAt(currentChar);
                currentChar++;
                setTimeout(typeWriter, 50);
            } else {
                textDisplay.innerHTML += '<br>';
                currentParagraph++;
                currentChar = 0;
                setTimeout(typeWriter, 500);
            }
        }
    }

    function positionModal() {
        const characterRect = character.getBoundingClientRect();
        const modalRect = modal.getBoundingClientRect();

        const topOffset = -modalRect.height - 180;
        const leftOffset = 250;

        modal.style.left = `${characterRect.left + leftOffset}px`;
        modal.style.top = `${characterRect.top + topOffset}px`;
    }

    function showModal() {
        modal.style.display = 'block';
        positionModal();
        typeWriter();
    }

    function hideModal() {
        modal.style.display = 'none';
    }

    function checkCharacterPosition() {
        const characterRect = character.getBoundingClientRect();

        if (doorArea) {
            const doorRect = doorArea.getBoundingClientRect();
            if (characterRect.top < doorRect.bottom &&
                characterRect.right > doorRect.left &&
                characterRect.left < doorRect.right &&
                characterRect.top > doorRect.top) {
                console.log("Le personnage est entré dans la porte 2!");
                window.open('../projets/td3_click', '_blank');
            }
        }

        if (doorAreaone) {
            const doorRectone = doorAreaone.getBoundingClientRect();
            if (characterRect.top < doorRectone.bottom &&
                characterRect.right > doorRectone.left &&
                characterRect.left < doorRectone.right &&
                characterRect.top > doorRectone.top) {
                console.log("Le personnage est entré dans la porte 1 !");
                window.open('../projets/Le-Pendu', '_blank');
            }
        }

        if (doorAreatwo) {
            const doorRecttwo = doorAreatwo.getBoundingClientRect();
            if (characterRect.top < doorRecttwo.bottom &&
                characterRect.right > doorRecttwo.left &&
                characterRect.left < doorRecttwo.right &&
                characterRect.top > doorRecttwo.top) {
                console.log("Le personnage est entré dans la porte 3 !");
                window.open('../projets/Space-Invader', '_blank');
            }
        }
    }

    function changePage(direction) {
        if (direction === 'right') {
            currentPageIndex = (currentPageIndex + 1) % pages.length;
        } else if (direction === 'left') {
            currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
        }

        localStorage.setItem('playerPosition', JSON.stringify({ x: direction === 'right' ? 30 : container.clientWidth - scaledWidth - 30, y: player.y }));
        localStorage.setItem('currentPageIndex', currentPageIndex);
        console.log(currentPageIndex);
        window.location.href = pages[currentPageIndex];
    }

    function updateCharacterPosition() {
        character.style.left = `${player.x}px`;
        character.style.top = `${player.y}px`;

        if (player.x + scaledWidth >= container.clientWidth) {
            changePage('right');
            return;
        }

        if (player.x <= 0) {
            changePage('left');
            return;
        }

        if (modal && modal.style.display == 'none') {
            positionModal();
        }

        cadres.forEach((cadre, index) => {
            const cadreRect = cadre.getBoundingClientRect();
            if (player.x > cadreRect.right && !cadre.classList.contains('falling')) {
                setTimeout(() => {
                    cadre.classList.add('falling');
                }, index * 350);
            }
        });

        checkCharacterPosition();

        character.style.transform = `scale(${updateCharacterSize()})`;
    }

    function updatePosition(direction) {
        if (currentDirection !== direction) {
            currentDirection = direction;
            frameIndex = 0;

            if (animationInterval) clearInterval(animationInterval);

            let directionIndex;
            switch (direction) {
                case 'up': directionIndex = 3; break;
                case 'down': directionIndex = 0; break;
                case 'left': directionIndex = 2; break;
                case 'right': directionIndex = 1; break;
                default: directionIndex = 0;
            }

            animationInterval = setInterval(() => {
                frameIndex = (frameIndex + 1) % framesPerDirection;
                character.style.backgroundPosition = `-${frameIndex * frameWidth}px -${directionIndex * frameHeight}px`;
            }, 100);
        }
    }

    function updateCharacterSize() {

        const characterRect = character.getBoundingClientRect();
        const characterCenter = {
            x: characterRect.left + characterRect.width / 2,
            y: characterRect.top + characterRect.height / 2
        };

        let closestDistance = Infinity;

        doors.forEach(door => {
            const doorRect = door.getBoundingClientRect();
            const doorCenter = {
                x: doorRect.left + doorRect.width / 2,
                y: doorRect.top + doorRect.height / 2
            };

            const distance = Math.sqrt(
                Math.pow(characterCenter.x - doorCenter.x, 2) +
                Math.pow(characterCenter.y - doorCenter.y, 2)
            );

            if (distance < closestDistance) {
                closestDistance = distance;
            }
        });

        let scale;
        if (closestDistance >= shrinkDistance) {
            scale = maxScale;
        } else {
            scale = minScale + (maxScale - minScale) * (closestDistance / shrinkDistance);
        }
        return scale

    }

    function checkCollision(character, block, direction) {
        const charRect = character.getBoundingClientRect();
        const blockRect = block.getBoundingClientRect();
        const right = direction === "right" ? charRect.right + step : charRect.right
        const left = direction === "left" ? charRect.left - step : charRect.left
        const bottom = direction === "down" ? charRect.bottom + step : charRect.bottom
        const top = direction === "up" ? charRect.top - step : charRect.top
        return ((right >= blockRect.left) &&
            (left <= blockRect.right) &&
            (bottom >= blockRect.top) &&
            (top <= blockRect.bottom));
    }

    function handleCollisions(direction) {
        const character = document.getElementById('character');
        const collisionBlocks = document.querySelectorAll('.collision-block');
        let collisionDetected = false;
        collisionBlocks.forEach(block => {
            if (checkCollision(character, block, direction)) {
                console.log('Collision détectée !');
                collisionDetected = true;
            }
        });
        return collisionDetected;
    }

    function stopAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
        currentDirection = null;
        frameIndex = 0;
        character.style.backgroundPosition = '0px 0px';
    } 

    function jump() {
        if (isJumping) return;
    
        isJumping = true;
        jumpStartTime = Date.now();
        const startX = player.x;
        const startY = player.y;
        let jumpDirection = currentHorizontalDirection || currentVerticalDirection || 'stationary';
    
        function animateJump() {
            const elapsedTime = Date.now() - jumpStartTime;
            const progress = elapsedTime / jumpDuration;
            const verticalDisplacement = jumpHeight * 4 * progress * (1 - progress);
    
            if (jumpDirection === 'left') {
                player.x = Math.max(0, startX - jumpDistance * progress);
            } else if (jumpDirection === 'right') {
                player.x = Math.min(container.clientWidth - scaledWidth, startX + jumpDistance * progress);
            }
    
            player.y = startY - verticalDisplacement;
            player.y = Math.max(0, Math.min(player.y, container.clientHeight - scaledHeight));
    
            updateCharacterPosition();
    
            if (progress < 1) {
                requestAnimationFrame(animateJump);
            } else {
         
                player.y = startY; 
                isJumping = false;
                updateCharacterPosition(); 
                stopAnimation(); 
            }
        }
    
        animateJump();
    }
    
    document.addEventListener('keydown', (event) => {
        if (modal) hideModal();
        let collisionDetected = false;
    
        switch (event.key) {
            case 'ArrowUp':
                currentVerticalDirection = 'up';
                player.y = Math.max(0, player.y - step);
                collisionDetected = handleCollisions("up");
                updatePosition('up');
                if (collisionDetected) player.y += step; 
                break;
            case 'ArrowDown':
                currentVerticalDirection = 'down';
                player.y = Math.min(container.clientHeight - scaledHeight, player.y + step);
                updatePosition('down');
                collisionDetected = handleCollisions("down");
                if (collisionDetected) player.y -= step; 
                break;
            case 'ArrowLeft':
                currentHorizontalDirection = 'left';
                player.x = Math.max(0, player.x - horizontalSpeed);
                updatePosition('left');
                collisionDetected = handleCollisions("left");
                if (collisionDetected) player.x += step; 
                break;
            case 'ArrowRight':
                currentHorizontalDirection = 'right';
                player.x = Math.min(container.clientWidth - scaledWidth, player.x + horizontalSpeed);
                updatePosition('right');
                collisionDetected = handleCollisions("right");
                if (collisionDetected) player.x -= step; 
                break;
            case ' ':
                jump();
                break;
            case 'e':
            case 'E':
                enterHouse();
                break;
        }
    
        updateCharacterPosition();
    });
    

    document.addEventListener('keyup', (event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            stopAnimation();
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            currentHorizontalDirection = null;
        }
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            currentVerticalDirection = null;
        }
    });
    
    const savedPosition = JSON.parse(localStorage.getItem('playerPosition'));
   
    if (savedPosition) {
        
        player.x = savedPosition.x;
        player.y = savedPosition.y;
        updateCharacterPosition();
    }
    localStorage.removeItem('playerPosition');

    if (modal) showModal();
    updateCharacterPosition();
    window.dispatchEvent(new Event('resize'));
});
