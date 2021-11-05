
import { Container, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'

const Table = (props) => {

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
        position: Array.from([]),
        founded: 0,
    })

    var ships = {
        'patrolship': {
            alive: true,
            length: 2
        },
        'submarine': {
            alive: true,
            length: 3
        },
        'destroyer': {
            alive: true,
            length: 3
        },
        'battleship': {
            alive: true,
            length: 4
        },
        'aircraft-carrier': {
            alive: true,
            length: 5
        },
    }

    var randomness = 3

    var positions = []
    for (var i = 0; i < 100; i++) {
        var row = Math.floor(i / 10)
        var col = i % 10

        positions[i] = {
            index: i,
            probability: 0,
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

    // function setPositions() {
    //     for (var i = 1; i <= 100; i++) {
    //         var row = Math.floor(i / 10)
    //         var col = i % 10
    
    //         positions[i] = {
    //             index: i,
    //             probability: 0,
    //             fired: false,
    //             row: row,
    //             col: col
    //         }
    //     }
    
    //     for (var i = 1; i <= 100; i++) {
    //         positions[i].w = (positions[i - 1] && positions[i - 1].row === positions[i].row) ? positions[i - 1] : null;
    //         positions[i].e = (positions[i + 1] && positions[i + 1].row === positions[i].row) ? positions[i + 1] : null;
    //         positions[i].n = positions[i - 10] ? positions[i - 10] : null;
    //         positions[i].s = positions[i + 10] ? positions[i + 10] : null;
    //     }
    // }

    function tryShip(ship, position, direction) {
        var check_position = positions[position]
        var flag = true

        for (var i = 1; i <= ship.length; i++) {
            if (!check_position || check_position.fired) {
                flag = false
                break
            }
            // if (direction == 'e') {
            //     check_position = positions[position + i]
            // }
            // if (direction == 's') {
            //     check_position = positions[position + (i * 10)]
            // }
            check_position = check_position[direction]
        }

        return flag
    }

    function calculateDensity() {
        var current_position
        var directions = { 'w': null, 'n': null, 'e': null, 's': null };
        for (var i = 0; i < 100; i++) {
            positions[i].probability = 0
        }
        for (var shipName in ships) {
            var ship = ships[shipName]
            if (ship.alive) {
                for (var i = 0; i < 100; i++) {
                    if (tryShip(ship, i, 'e')) {
                        current_position = positions[i]
                        for (var j = 0; j < ship.length; j++) {
                            current_position.probability++

                            current_position = current_position['e']
                        }
                    }
                    if (tryShip(ship, i, 's')) {
                        current_position = positions[i]
                        for (var j = 0; j < ship.length; j++) {
                            current_position.probability++
                            current_position = current_position['s']
                        }
                    }
                }
            }
        }

        for (var i = 0; i < 100; i++) {
            if (positions[i].probability > 0) {
                positions[i].probability +=  Math.floor(Math.random() * randomness)
            }

            if (positions[i].fired) {
                if (positions[i].hit && !positions[i].sunk) {
                    for (var direction in directions) {
                        var hitStreak = 1
                        var checked_position = positions[i]
                        while (checked_position[direction] && checked_position[direction].hit && !checked_position[direction].confirmed) {
                            hitStreak++
                            checked_position = checked_position[direction]
                        }
                        checked_position = checked_position[direction]
                        if (checked_position && !checked_position.fired) {
                            checked_position.probability += hitStreak * 10
                        }
                    }
                }
                positions[i].probability = -1
            }
        }
    }

    // setPositions()
    calculateDensity()
    // for (var i = 1; i <= 100; i++) {
    //     var text
    //     if (i % 10 == 0) {
    //         console.log(text, "\n")
    //     }
    //     text += positions[i].probability + ' '

    // }
    console.log("After re-cal ")
    console.table(positions)

    //สร้าง plyer state โดยใช้รูปแบบ player
    const [playerState, setPlayerState] = useState(player)

    var gameover = false

    function allowDrop(ev) {
        ev.preventDefault();
    }

    async function drop(ev) {
        var cell_id = ev.target.id
        var row = parseInt(cell_id.slice(0, 1))
        var col = parseInt(cell_id.slice(2))

        let prow = []
        prow[0] = row;
        prow[1] = col;

        let isPlaceable
        // console.log(row + ' ' + col)
        // console.log(cell_id)
        ev.preventDefault();

        var data = ev.dataTransfer.getData("text");
        var ship = document.getElementById(data)

        console.log(ship.id)
        // console.log(ship.childNodes)
        var ship_size = ship.childElementCount

        isPlaceable = placeable(prow, ship_size)
        if (isPlaceable) {
            for (var i = 0; i < ship_size; i++) {
                // console.log(i)
                cell_id = (document.getElementById(row + ',' + (col + i)));
                cell_id.parentElement.classList.add('parent')

                if (ship.id === 'DD') {
                    playerState.board[row + 1][col + i + 1] = 'DD'
                } else if (ship.id === 'CU') {
                    playerState.board[row + 1][col + i + 1] = 'CU'
                } else if (ship.id === 'BS') {
                    playerState.board[row + 1][col + i + 1] = 'BS'
                } else {
                    playerState.board[row + 1][col + i + 1] = 'AC'
                }


                // console.log('Target cell '+ i + ':' + cell_id.id)
                // console.log('ship part '+ i + ':' + ship.childNodes[i].id)
                var ship_part = ship.childNodes[0]
                // ship_part.classList.add("image2");
                // ship_part.classList.add('hidden');
                ship_part.classList.remove("part");
                // cell_id.appendChild(ship.childNodes[i])
                cell_id.insertAdjacentElement('afterend', (ship_part))

                // console.log('Target cell after insert '+ i + ':' + cell_id)

            }
            console.log(playerState.board)
        } else
            console.log("not placeable")

    }

    function set() {
        var ships = document.getElementsByClassName('parent')
        var part_id = [];

        for (let index = 0; index < ships.length; index++) {
            console.log(ships[index].childNodes[1].id)
            ships[index].childNodes[1].classList.add('hidden')
            part_id.push(ships[index].childNodes[1].id.slice(0, 2));

        }
        console.log(playerState.board)
        console.log(part_id)

    }

    function check_boom() {
        var ships = document.getElementsByClassName('parent')
        var part_id = [];

        for (let index = 0; index < ships.length; index++) {
            part_id.push(ships[index].childNodes[1].id.slice(0,2));

        }
        console.log (part_id)

    }

    // ฟังก์ชั่นสุ่มเลขโดยรับค่า min max
    function getRandomInt(min, max) {
        const minimum = Math.ceil(min);
        const maximum = Math.floor(max);

        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    // ฟังก์ชั่นสุ่มตำแหน่งหัวเรือโดยรับ min max และ arrayไว้เก็บตำแหน่งเรือ
    function randomShip(min, max, excludeArrayNumbers) {
        let randomNumber;

        // เช็คว่า excludeArrayNumbers เป็น array หรือไม่???
        if (!Array.isArray(excludeArrayNumbers)) {
            randomNumber = getRandomInt(min, max);
            return randomNumber;
        }

        // ให้สุ่มตำแหน่งหัวเรือเรื่อยๆ จนกว่าตำแหน่งที่ได้ไม่ซ้ำกับตำแหน่งที่มี หรือเมื่อเป็น array ว่าง
        do {
            randomNumber = getRandomInt(min, max);
        } while ((excludeArrayNumbers || []).includes(randomNumber));

        return randomNumber;
    }

    // ฟั่งชั่นที่ทำงานเมื่อผู้เล่นกดช่องตาราง 
    function play(e) {
        //เช็คว่ามีเรือรึเปล่า
        var found = checkShip(e)

        // เมื่อเจอเรือให้บวกแต้มฝั่งผู้เล่นที่เจอ
        if (found) {
            // foundShip(e)

            setPlayerState({
                ...playerState,
                founded: playerState.founded + 1
            })
            // เมื่อแต้มครบ จบเกม
            if (playerState.founded === 10) {
                gameover = true
            }
        }
        else {
            notFound(e)
        }

        //เช็คว่าเกมจบรึยัง
        if (gameover) {
            //เมื่อจบแล้วไปแสดงหน้าจบเกม
            end()
        }
    }

    // ฟังก์ชั่นสุ่มสำหรับเซ็กว่าผู้เล่นยิงโดนเรือตรงข้ามหรือไม่
    function checkShip(e) {
        // ให้ตัวแปล clicked เก็บตำแหน่งที่ผู้เล่นกด
        var clicked = [parseInt(e.target.id[0]), parseInt(e.target.id[2])]
        console.log("Clicked at " + clicked)
        // เช็คว่าเจอเรือไหม (เรือ: "O")
        if (!(playerState.board[clicked[0] + 1][clicked[1] + 1] === "-")) {
            playerState.board[clicked[0] + 1][clicked[1] + 1] = "x"
            console.log("Position at " + positions[parseInt(e.target.id[0]+e.target.id[2])].index)
            positions[parseInt(e.target.id[0]+e.target.id[2])].fired = true 
            positions[parseInt(e.target.id[0]+e.target.id[2])].hit = true
            console.log('After hit')
            console.table(positions)
            calculateDensity()
            var cells = document.getElementsByClassName("image2")
            for (var i = 0; i < 100; i++) {
                cells[i].innerHTML = positions[i].probability
            }

            return true
        } else {
            positions[parseInt(e.target.id[0]+e.target.id[2])].fired = true 
            console.log('After fired ')
            console.table(positions)
            calculateDensity()
            var cells = document.getElementsByClassName("image2")
            for (var i = 0; i < 100; i++) {
                cells[i].innerHTML = positions[i].probability
            }

            return false
        }
    }

    function notFound(e) {
        console.log(playerState.name + ': nothing here...')
        e.target.src = 'https://tmsvalue.co.uk/wp-content/uploads/2017/03/Square-500x500-red.png'
    }

    // function foundShip(e) {

    //     // var ships = document.getElementsByClassName('parent')
    //     // var part_id = [];

    //     // for (let index = 0; index < ships.length; index++) {
    //     //     part_id.push(ships[index].childNodes[1].id.slice(0,2)); 
    //     // }
    //     var is_DD_Alive = true
    //     for (var i = 0; i < 12; i++) {
    //         console.log(playerState.board[i])
    //         if ((playerState.board[i].includes("DD"))) {
    //             is_DD_Alive = true
    //             break;
    //         } else is_DD_Alive = false
    //     }

    //     console.log(playerState.name + ': FOUND SHIP!!!')
    //     if (!is_DD_Alive) {
    //         console.log('Destroyer Ship Sunk!')
    //     }
    //     // if(!(part_id.includes("DD"))){
    //     //     console.log('Destroyer Ship Sunk!')
    //     // }

    //     e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9qcrQeLufxv61jZ194tG5CJvux0p4U4-r2g&usqp=CAU'
    //     console.log(playerState.board)
    // }

    function end() {
        console.log(playerState.name + 'WIN!!!')
    }

    /* ต้องลงได้ทั้ง 4 ทิศ ถึงจะผ่าน */
    function placeable(head, length) {

        try {
            for (let axis = 0; axis < 2; axis++) {
                for (let i = head[axis] - (length - 1); i < head[axis] + (length - 1); i++) {
                    let temp

                    if (axis === 0)
                        temp = playerState.board[i][head[1]]
                    else
                        temp = playerState.board[head[0]][i]

                    if (temp === '-') {
                        continue
                    }
                    else {
                        /* ถ้าวางไม่ได้ ยกเลิกทันที */
                        return false
                    }
                }
            }

            return true

        } catch (TypeError) {
            /* โค้ดไม่ได้แยกแยะเรื่องหลุดแมพ ทำให้ TypeError ถ้าเลือกขอบแมพแล้วขนาดยาวจนเกิน Board (เกิน Length array ของ board) ซึ่งถ้าเป็นแบบนี้มันลงไม่ได้อยู่แล้ว return false ไปเลย*/
            return false
        }
    }

    /* Algo's test case
    let prow1 = [1, 10]
    let prow2 = [4, 6]
    let prow3 = [8, 3]
    */

    /* Algo's test case
    let isPlaceable1 = placeable(prow1, shipLength, board)
    let isPlaceable2 = placeable(prow2, shipLength, board)
    let isPlaceable3 = placeable(prow3, shipLength, board)
    console.log("Map's edge case : ", isPlaceable1)
    console.log("Board occupied case (By other ship) : ", isPlaceable2)
    console.log("No case : ", isPlaceable3)
    */

    function generateShip(shipLength) {
        let prow = []
        let isPlaceable

        do {
            for (let axis = 0; axis < 2; axis++) {
                prow[axis] = getRandomInt(0, 10)
            }
            isPlaceable = placeable(prow, shipLength)
        } while (!isPlaceable)

        playerState.board[prow[0]][prow[1]] = 'O'
        /* วางเรือ แบบสุ่มทิศ */
        switch (getRandomInt(1, 4)) {
            case 1:
                for (let i = prow[0]; i < prow[0] + shipLength; i++) {
                    playerState.board[i][prow[1]] = 'O';
                }
                break;
            case 2:
                for (let i = prow[1]; i < prow[1] + shipLength; i++) {
                    playerState.board[prow[0]][i] = 'O';
                }
                break;
            case 3:
                for (let i = prow[0] - (shipLength - 1); i < prow[0]; i++) {
                    playerState.board[i][prow[1]] = 'O';
                }
                break;
            case 4:
                for (let i = prow[1] - (shipLength - 1); i < prow[1]; i++) {
                    playerState.board[prow[0]][i] = 'O';
                }
                break;
        }
    }

    useEffect(() => {
        generateShip(2)
        generateShip(3)
        // generateShip(3)
        // generateShip(4)
        // generateShip(5)
        console.log(playerState.name + " board: ")
        console.log(playerState.board)
    }, [setPlayerState])

    // สร้างตารางโดยรับค่า id และ src
    const createCell = (id, src) => {

        // ถ้าเป็นแถวแรกให้สร้าง header ระบุเลขช่องด้วยนอกจากนั้นก็สร้างแค่ช่องปกติ
        if (id[0] === 0) {
            return (
                <th>
                    {id[1] + 1}
                    <td className='cell parent' onDrop={drop} onDragOver={allowDrop} >
                        <img class="image1" id={id} src={src} onClick={play} draggable='false' />
                        <div class="image2"> {positions[id[1]].probability} </div>
                    </td>
                </th>
            )
        }
        return (
            <td className='cell parent' onDrop={drop} onDragOver={allowDrop} >
                <img class="image1" id={id} src={src} onClick={play} draggable='false' />
                <div class="image2"> {positions[(parseInt(id[0].toString())+(id[1].toString()))].probability} </div>
            </td>
        )
    }

    return (
        <Container>
            <h2>{props.player}</h2>
            <table>

                {Array.from({ length: 10 }).map((_, row) => {

                    var ascii = 65
                    return (
                        <tr>
                            <th>
                                {String.fromCharCode(ascii + row)}
                            </th>
                            {Array.from({ length: 10 }).map((_, col) => {
                                var index = ((10 - row - 1) * 10) + (10 - col)
                                var id = [row, col]
                                var src = 'map/' + index + '.jpg'
                                return (
                                    createCell(id, src)
                                )

                            })}
                        </tr>
                    )
                })}
            </table>
            {/* <Button variant="success" onClick={set}>Set Ship</Button>
            <Button variant="warning">Reset</Button> */}
        </Container>
    )
}

export default Table
