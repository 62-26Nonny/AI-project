import { Container, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { AI, calculateDensity } from '../AI/AI_team1'
import { AI2 } from '../AI/AI_team2'

const Table = (props) => {

    const randomness = 3
    var positions = []
    for (var i = 0; i < 100; i++) {
        var row = Math.floor(i / 10)
        var col = i % 10

        positions[i] = {
            index: i,
            probability: 0,
            occupied: false,
            fired: false,
            hit: false,
            sunk: false,
            row: row,
            col: col
        }
    }

    for (var i = 0; i < 100; i++) {
        positions[i].w = (positions[i - 1] && positions[i - 1].row === positions[i].row) ? positions[i - 1] : null;
        positions[i].e = (positions[i + 1] && positions[i + 1].row === positions[i].row) ? positions[i + 1] : null;
        positions[i].n = positions[i - 10] ? positions[i - 10] : null;
        positions[i].s = positions[i + 10] ? positions[i + 10] : null;
    }

    //สร้างรูปแบบ state ของ player
    const player = Object.freeze({
        name: props.player,
        board: [
            ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
            ['X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
            ['X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
            ['X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
            ['X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
            ['X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
            ['X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
            ['X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
            ['X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
            ['X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
            ['X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']
        ],
        positions: Array.from(positions),
        founded: 0,
        ships: {
            'battleship': {
                alive: true,
                length: 4,
                position: 0,
                orientation: 'vertical',
                life: 4
            },
            'destroyer': {
                alive: true,
                length: 3,
                position: 0,
                orientation: 'vertical',
                life: 3
            },
            'aircraftcarrier': {
                alive: true,
                length: 5,
                position: 0,
                orientation: 'vertical',
                life: 5
            },
            'submarine': {
                alive: true,
                length: 3,
                position: 0,
                orientation: 'vertical',
                life: 3
            },
            'patrolboat': {
                alive: true,
                length: 2,
                position: 0,
                orientation: 'vertical',
                life: 2
            },
        }
    })

    //สร้าง plyer state โดยใช้รูปแบบ player
    const [playerState, setPlayerState] = useState(player)

    function tryShip(ship, position, direction, propertyToTest) {
        var check_position = playerState.positions[position]
        var flag = true

        for (var i = 1; i <= ship.length; i++) {
            if (!check_position || check_position[propertyToTest]) {
                flag = false;
                break;
            }
            check_position = check_position[direction]
        }

        return flag
    }

    // ฟั่งชั่นที่ทำงานเมื่อผู้เล่นกดช่องตาราง 
    function play(e) {
        if (props.alreadypick.includes(e.target.id)) {
            console.log('you choose the same position');
        }
        else {
            if(props.turn === props.player){
                var allDead = true

                //เช็คว่ามีเรือรึเปล่า
                props.setAlreadypick(arr => [...arr, e.target.id])
                checkShip(e)
                //เช็คว่าเกมจบรึยัง
                for (var ship in playerState.ships) {
                    if (playerState.ships[ship].alive) {
                        allDead = false
                    }
                }
                
                if (allDead) {
                    end()
                    clearInterval(setInterval(AI, 1000))
                    // clearInterval(setInterval(AI2, 1000, playerState)) to stop Nut's AI
                    console.log('GAME OVER')
                }
            }
            else if(props.turn !== props.player){
                console.log('You can not play')
            }
            else {
                console.log('bug')
            }

        }

    }

    // ฟังก์ชั่นสุ่มสำหรับเซ็กว่าผู้เล่นยิงโดนเรือตรงข้ามหรือไม่
    function checkShip(e) {
        // ให้ตัวแปล clicked เก็บตำแหน่งที่ผู้เล่นกด
        var row = playerState.positions[e.target.id].row
        var col = playerState.positions[e.target.id].col
        // console.log("Clicked at " + clicked)
        var flag = false
        // เช็คว่าเจอเรือไหม (เรือ: "O")
        var check_cell = playerState.board[row + 1][col + 1]
        if (!(check_cell === "-")) {
            switch (check_cell) {
                case 'B':
                    playerState.ships['battleship'].life--
                    if (playerState.ships['battleship'].life === 0) {
                        playerState.ships['battleship'].alive = false
                        var prow_position = playerState.ships['battleship'].position
                        var directions = (playerState.ships['battleship'].orientation == 'e') ? 1 : 10
                        for (var i=0; i < playerState.ships['battleship'].length; i++) {
                            playerState.positions[prow_position + (i * directions)].sunk = true
                        }
                        console.log(playerState.name + "'s Battleship is sunk!!")
                    }
                    break
                case 'D':
                    playerState.ships['destroyer'].life--
                    if (playerState.ships['destroyer'].life === 0) {
                        playerState.ships['destroyer'].alive = false
                        var prow_position = playerState.ships['destroyer'].position
                        var directions = (playerState.ships['destroyer'].orientation == 'e') ? 1 : 10
                        for (var i=0; i < playerState.ships['destroyer'].length; i++) {
                            playerState.positions[prow_position + (i * directions)].sunk = true
                        }
                        console.log(playerState.name + "'s Destroyer is sunk!!")
                    }
                    break
                case 'A':
                    playerState.ships['aircraftcarrier'].life--
                    if (playerState.ships['aircraftcarrier'].life === 0) {
                        playerState.ships['aircraftcarrier'].alive = false
                        var prow_position = playerState.ships['aircraftcarrier'].position
                        var directions = (playerState.ships['aircraftcarrier'].orientation == 'e') ? 1 : 10
                        for (var i=0; i < playerState.ships['aircraftcarrier'].length; i++) {
                            playerState.positions[prow_position + (i * directions)].sunk = true
                        }
                        console.log(playerState.name + "'s Aircraftcarrier is sunk!!")
                    }
                    break
                case 'S':
                    playerState.ships['submarine'].life--
                    if (playerState.ships['submarine'].life === 0) {
                        playerState.ships['submarine'].alive = false
                        var prow_position = playerState.ships['submarine'].position
                        var directions = (playerState.ships['submarine'].orientation == 'e') ? 1 : 10
                        for (var i=0; i < playerState.ships['submarine'].length; i++) {
                            playerState.positions[prow_position + (i * directions)].sunk = true
                        }
                        console.log(playerState.name + "'s Submarine is sunk!!")
                    }
                    break
                case 'P':
                    playerState.ships['patrolboat'].life--
                    if (playerState.ships['patrolboat'].life === 0) {
                        playerState.ships['patrolboat'].alive = false
                        var prow_position = playerState.ships['patrolboat'].position
                        var directions = (playerState.ships['patrolboat'].orientation == 'e') ? 1 : 10
                        for (var i=0; i < playerState.ships['patrolboat'].length; i++) {
                            playerState.positions[prow_position + (i * directions)].sunk = true
                        }
                        console.log(playerState.name + "'s Patrolboat is sunk!!")
                    }
                    break
            }
            console.log("Position at " + e.target.id)
            playerState.positions[e.target.id].fired = true
            playerState.positions[e.target.id].hit = true
            // console.log('After hit')
            e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9qcrQeLufxv61jZ194tG5CJvux0p4U4-r2g&usqp=CAU'
            flag = true
            props.setTurn(props.player)
        } else {
            props.setTurn(props.enemy)
            playerState.positions[e.target.id].fired = true
            // console.log('After fired ')
            console.log(playerState.name + ': nothing here...')
            e.target.src = 'https://tmsvalue.co.uk/wp-content/uploads/2017/03/Square-500x500-red.png'
            flag = false
        }

        // console.table(playerState.positions)
        calculateDensity(playerState)
        var cells = document.getElementsByClassName(playerState.name + ' image2')
        for (var i = 0; i < 100; i++) {
            cells[i].innerHTML = playerState.positions[i].probability
        }

        return flag
    }

    function end() {
        console.log(playerState.name + 'Lose!!!')
    }

    function placeShips() {
        var index, row, col, orientation, validPosition = false, lastPosition;
        for (var ship in playerState.ships) {
            while (!validPosition) {
                index = getRandomPosition();
                row = Math.floor(index / 10) + 1
                col = (index % 10) + 1
                orientation = (Math.random() * 2 > 1) ? 'e' : 's';
                if (tryShip(playerState.ships[ship], index, orientation, 'occupied')) {
                    validPosition = true;
                }
            }
            playerState.ships[ship].orientation = orientation
            lastPosition = playerState.positions[index];
            for (var i = 0; i < playerState.ships[ship].length; i++) {
                switch (ship) {
                    case 'battleship':
                        if (playerState.ships[ship].orientation == 'e') {
                            playerState.board[row][col + i] = 'B'
                        }
                        else if (playerState.ships[ship].orientation == 's') {
                            playerState.board[row + i][col] = 'B'
                        }
                        break
                    case 'destroyer':
                        if (playerState.ships[ship].orientation == 'e') {
                            playerState.board[row][col + i] = 'D'
                        }
                        else if (playerState.ships[ship].orientation == 's') {
                            playerState.board[row + i][col] = 'D'
                        }
                        break
                    case 'aircraftcarrier':
                        if (playerState.ships[ship].orientation == 'e') {
                            playerState.board[row][col + i] = 'A'
                        }
                        else if (playerState.ships[ship].orientation == 's') {
                            playerState.board[row + i][col] = 'A'
                        }
                        break
                    case 'submarine':
                        if (playerState.ships[ship].orientation == 'e') {
                            playerState.board[row][col + i] = 'S'
                        }
                        else if (playerState.ships[ship].orientation == 's') {
                            playerState.board[row + i][col] = 'S'
                        }
                        break
                    case 'patrolboat':
                        if (playerState.ships[ship].orientation == 'e') {
                            playerState.board[row][col + i] = 'P'
                        }
                        else if (playerState.ships[ship].orientation == 's') {
                            playerState.board[row + i][col] = 'P'
                        }
                        break
                }
                lastPosition.occupied = true;
                lastPosition = lastPosition[orientation];
            }
            playerState.ships[ship].position = index;
            validPosition = false;
        }
    }

    function getRandomPosition() {
        return Math.floor(Math.random() * 100);
    }

    function startPlaying() {
        setInterval(AI, 1000)
        // setInterval(AI2, 1000, playerState) to use Nut's AI
    }

    calculateDensity(playerState)

    useEffect(() => {
        placeShips()
        console.log(playerState.name + " board: ")
        console.log(playerState.board)
        console.log(playerState.ships)
    }, [setPlayerState])

    // สร้างตารางโดยรับค่า id และ src
    const createCell = (id, src) => {

        // ถ้าเป็นแถวแรกให้สร้าง header ระบุเลขช่องด้วยนอกจากนั้นก็สร้างแค่ช่องปกติ
        if (id < 10) {
            return (
                <th>
                    {id}
                    <td className='cell parent'>
                        <img class="image1" id={id} src={src} onClick={play} />
                        <div class={playerState.name + ' image2'}> {Math.floor(playerState.positions[id].probability)} </div>
                    </td>
                </th>
            )
        }
        return (
            <td className='cell parent'>
                <img class="image1" id={id} src={src} onClick={play} />
                <div class={playerState.name + ' image2'}> {Math.floor(playerState.positions[id].probability)} </div>
            </td>
        )
    }

    return (
        <Container>
            <h2>{props.player}</h2>
            <table id={playerState.name}>

                {Array.from({ length: 10 }).map((_, row) => {

                    var ascii = 65
                    return (
                        <tr>
                            <th>
                                {String.fromCharCode(ascii + row)}
                            </th>
                            {Array.from({ length: 10 }).map((_, col) => {
                                var index = ((10 - row - 1) * 10) + (10 - col)
                                var id = (row * 10) + col
                                var src = 'map/' + index + '.jpg'
                                return (
                                    createCell(id, src)
                                )
                            })}
                        </tr>
                    )
                })}
            </table>
            <Button onClick={startPlaying}>Start</Button>
        </Container>
    )
}

export default Table
