const player1 = document.querySelector('#player1')
const player2 = document.querySelector('#player2')
const p1 = {
    name: 'player 1',
    cells: Array.from(player1.querySelectorAll('.cell')),
    ship: [],
    founded: 0,
    point: document.querySelector('#player1point')
}
const p2 = {
    name: 'player 2',
    cells: Array.from(player2.querySelectorAll('.cell')),
    ship: [],
    founded: 0,
    point: document.querySelector('#player2point')
}
var clicked = []
var gameover = false

p1.cells.forEach(cell => {
    cell.addEventListener('click', play)
});

function generateShip(player) {
    for(let i = 0;i < 10;i++){
        
        player.ship.push(randomShip(0, 24, player.ship))
        console.log(player.ship)
    }
}
generateShip(p1)
generateShip(p2)

function getRandomInt(min, max) {
    const minimum = Math.ceil(min);
    const maximum = Math.floor(max);
 
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
 }

function randomShip(min, max, excludeArrayNumbers) {
    let randomNumber;
  
    if(!Array.isArray(excludeArrayNumbers)) {
      randomNumber = getRandomInt(min, max);
      return randomNumber;
    }
  
    do {
      randomNumber = getRandomInt(min, max);
    } while ((excludeArrayNumbers || []).includes(randomNumber));
  
    return randomNumber;
}

function play() {
    checkShip(p1, this)
    if(gameover){
        end('player 1')
    }
    var randomPlay = randomShip(0, 24, clicked)
    clicked.push(randomPlay)
    checkShip(p2, p2.cells[randomPlay])
    if(gameover) {
        end('player 2')
    }
}

function checkShip(player, e) {
    if(player.ship.includes(player.cells.indexOf(e))){
        player.founded = player.founded + 1
        player.point.innerHTML = 'Founded ship: ' + player.founded
        if(player.founded == 10) {
            gameover = true
        }
        foundShip(e, player)
    }
    else {
        notFound(e, player)
    }
}

function notFound(e, player) {
    console.log(player.name + ': nothing here...')
    e.firstChild.src = 'https://tmsvalue.co.uk/wp-content/uploads/2017/03/Square-500x500-red.png'
    e.removeEventListener('click', play)
}

function foundShip(e, player) {
    console.log(player.name + ': FOUND SHIP!!!')
    e.firstChild.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9qcrQeLufxv61jZ194tG5CJvux0p4U4-r2g&usqp=CAU'
    e.removeEventListener('click', play)
}

function end(player) {
    console.log(player + 'WIN!!!')
}

