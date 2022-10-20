
let puzzle = document.createElement('div');
puzzle.className = "puzzle";
document.body.append(puzzle);

let game = document.createElement('div');
game.className = "game";
puzzle.append(game);

let menu = document.createElement('div');
menu.className = "menu";
game.append(menu);

let submenu = document.createElement('div');
submenu.className = "submenu";
game.append(submenu);

    let Moves = document.createElement('div');
    Moves.className = "moves";
    Moves.appendChild(document.createTextNode('Moves: '));
    submenu.append(Moves);

        let counter = document.createElement('div');
        counter.className = "counter";
        counter.appendChild(document.createTextNode(0));
        Moves.append(counter);

    let time = document.createElement('div');
    time.className = "time";
    time.appendChild(document.createTextNode('Time:'));
    submenu.append(time);

        let timerClock = document.createElement('div');
        timerClock.className = "timerClock";
        timerClock.appendChild(document.createTextNode(0));
        time.append(timerClock);

let container = document.createElement('div');
container.className = "container";
game.append(container);

let sizes = document.createElement('div');
sizes.className = "sizes";
game.append(sizes);

    let frameSize = document.createElement('div');
    frameSize.className = "frameSize";
    frameSize.appendChild(document.createTextNode('Frame size: ' + '4x4'));
    sizes.append(frameSize);

    let otherSize = document.createElement('div');
    otherSize.className = "Time";
    otherSize.appendChild(document.createTextNode('Other sizes: ' + '3x3 ' + '4x4 ' + '5x5 ' + '6x6 ' + '7x7 ' + '8x8'));
    sizes.append(otherSize);


let buttonShuffele = document.createElement('button');
buttonShuffele.className = "buttonShuffele";
buttonShuffele.appendChild(document.createTextNode('Shuffle and start'));
menu.append(buttonShuffele);

let stop = document.createElement('button');
stop.className = "buttonShuffele";
stop.appendChild(document.createTextNode('Stop'));
menu.append(stop);

let save = document.createElement('button');
save.className = "buttonShuffele";
save.appendChild(document.createTextNode('Save'));
menu.append(save);

let results = document.createElement('button');
results.className = "buttonShuffele";
results.appendChild(document.createTextNode('Results'));
menu.append(results);

// buttons ----^

let fifteen = document.createElement('div');
fifteen.className = "fifteen";

let value = new Array(16).fill(0).map((item, index) => index + 1);


for(let i = 1; i <= value.length; i++){
    let button = document.createElement('button');
    button.className = "item";
    button.dataset.matrixId = i;
    button.appendChild(document.createTextNode(i));
    fifteen.append(button);
}
container.append(fifteen);

// blocks ---^

const itemNodes = Array.from(fifteen.querySelectorAll('.item'));
const countItems = 16;

//  1. position

itemNodes[countItems - 1].style.display = 'none';
let matrix = getMatrix(
    itemNodes.map((item) => +(item.dataset.matrixId))
);

setPositionItems(matrix);

//  2. Shuffle

// buttonShuffele.addEventListener('click', () => {

//     const shuffledArray = shuffleArray(matrix.flat());
//     console.log(shuffledArray);
//     matrix = getMatrix(shuffledArray);
//     setPositionItems(matrix);
// })
const MaxShuffleCount = 100;
let timer;
let shuffled = false;
const shuffledClassName = 'gameShauffle'
let sumMovesResult = 0;

buttonShuffele.addEventListener('click', () => {
    // 1. Реализация randomSwap
    // randomSwap(matrix);
    // setPositionItems(matrix);
    // 1. Вызов randomSwap n-раз
    
    shuffled = true;
    let shuffleCount = 0;
    clearInterval(timer);
    game.classList.add(shuffledClassName);

    if(shuffleCount === 0) {
        timer = setInterval(() => {
            
            randomSwap(matrix);
            setPositionItems(matrix);
            resetCounter();
            
            shuffleCount+=1;
            if(shuffleCount >= MaxShuffleCount){
                game.classList.remove(shuffledClassName);
                clearInterval(timer);
                shuffled = false;
            }
        }, 20) 
    }
})

document.addEventListener('keydown', function(event) {
    if (event.code == 'KeyR') {
        shuffled = true;
        let shuffleCount = 0;
        clearInterval(timer);
        game.classList.add(shuffledClassName);

        if(shuffleCount === 0) {
            timer = setInterval(() => {
                
                randomSwap(matrix);
                setPositionItems(matrix);
                resetCounter();
                shuffleCount+=1;
                if(shuffleCount >= MaxShuffleCount){
                    game.classList.remove(shuffledClassName);
                    clearInterval(timer);
                    shuffled = false;
                }
            }, 20) 
        }
    }
  });

    
//  3. Change position by click
const blankNumber = 16;
fifteen.addEventListener('click', (event) => {
    if(shuffled){
        return
    };
    const buttonNode = event.target.closest('button');
    if(!buttonNode){
        return
    }
    const buttonNumber = +buttonNode.dataset.matrixId;
    
    const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix);
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
    const isValid = isValidForSwap(buttonCoords, blankCoords);


    if(isValid){
      swap(blankCoords, buttonCoords, matrix);
      setPositionItems(matrix); 
      sumMoves()
    }
})

//  4. Change position by keydown

    window.addEventListener('keydown', (event) => {
        if(shuffled){
            return
        }
        if(!event.key.includes('Arrow')) {
            return
        }

        const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
        const buttonCoords = {
            x: blankCoords.x,
            y: blankCoords.y, 
        };
        const direction = event.key.split('Arrow')[1].toLowerCase();
        const maxIndexMatrix = matrix.length;

        switch(direction){
            case 'up':
                buttonCoords.y +=1;
                break;
            case 'down':
                buttonCoords.y -=1;
                break;
            case 'left':
                buttonCoords.x +=1;
                break;
            case 'right':
                buttonCoords.x -=1;
                break;
            
        }
        if(buttonCoords.y >= maxIndexMatrix || buttonCoords.y < 0 || buttonCoords.x >= maxIndexMatrix || blankCoords.x < 0){
            return;
        }
        swap(blankCoords, buttonCoords, matrix);
        setPositionItems(matrix); 
        sumMoves()
    })

//  5. Show winner

// Helpers
let blockedCoords = null
function randomSwap(matrix) {
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
    const validCoords = FindValidCoords({
        blankCoords,
        matrix,
        blockedCoords,
    });

        
    const swapCoords = validCoords[
        Math.floor(Math.random() * validCoords.length)
    ];
    swap(blankCoords, swapCoords, matrix);
    blockedCoords = blankCoords;
}

function FindValidCoords({ blankCoords, matrix, blockedCoords}) {
    const validCoords = [];

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++){
            if(isValidForSwap({x, y}, blankCoords)){
                if(!blockedCoords || !(
                    blockedCoords.x === x && blockedCoords.y === y
                )) {
                    validCoords.push({x, y})
                }
            }
        }
    }
    return validCoords;
}

function getMatrix(arr) {
    const matrix = [[], [], [], []];
    let y = 0;
    let x = 0;

    for (let j = 0; j < arr.length; j++){
        if(x >= 4){
            y++;
            x = 0;
        };
        matrix[y][x] = arr[j];
        x++;
    }
    return matrix
}

function setPositionItems(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++){
            const val = matrix[y][x];
            const node = itemNodes[val - 1];
            setNodeStyles(node, x, y);
        }
    }
}

function setNodeStyles(node, x, y) {
    const shiftPs = 100;
    node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`
}

function shuffleArray(arr) {
    return arr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

function findCoordinatesByNumber(number, matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if(matrix[y][x] === number) {
                return {x, y};
            }
        }
    } return null;
}

function isValidForSwap(coords1, coords2) {
    const diffX = Math.abs(coords1.x - coords2.x);
    const diffY = Math.abs(coords1.y - coords2.y);
    return (diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y);
}

function swap(coords1, coords2, matrix){
    const coords1Number = matrix[coords1.y][coords1.x];
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x]
    matrix[coords2.y][coords2.x] = coords1Number;

    if(isWon(matrix)){
        addWonClass();
    }
}

let winFlatArray = new Array(16).fill(0).map((item, index) => index + 1);

function isWon(matrix) {
    const flatMatrix = matrix.flat();
    for(let i = 0; i < winFlatArray.length; i++){
        if(flatMatrix[i] !== winFlatArray[i]) {
            return false
        }
    }
    return true;
}

const wonClass = 'fifteenWon'
function addWonClass() {
    setTimeout(() => {
        fifteen.classList.add(wonClass);

        setTimeout(() => {
            fifteen.classList.remove(wonClass);
            resetCounter();
        }, 1000);
    }, 200)
}

function sumMoves(){

    // Moves.appendChild(document.createTextNode(sumMovesResult));
        sumMovesResult+=1;
        document.querySelector(".counter").innerHTML = sumMovesResult;
        
}

function resetCounter() {
    sumMovesResult = 0;
    document.querySelector(".counter").innerHTML = sumMovesResult;
}


function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (++timer < 0) {
            timer = duration;
        }
    }, 1000);
}

window.onload = function () {
    var Minutes = 0,
        display = document.querySelector('.timerClock');
    startTimer(Minutes, display);
};


    

