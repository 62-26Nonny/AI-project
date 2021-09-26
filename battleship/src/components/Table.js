import Container from 'react-bootstrap/Container'
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

    //สร้าง plyer state โดยใช้รูปแบบ player
    const [playerState, setPlayerState] = useState(player)

    var gameover = false

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
            foundShip(e)
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

        // เช็คว่าเจอเรือไหม (เรือ: "O")
        if (playerState.board[clicked[0] + 1][clicked[1] + 1] === "O") {
            return true
        } else {
            return false
        }
    }

    function notFound(e) {
        console.log(playerState.name + ': nothing here...')
        e.target.src = 'https://tmsvalue.co.uk/wp-content/uploads/2017/03/Square-500x500-red.png'
    }

    function foundShip(e) {
        console.log(playerState.name + ': FOUND SHIP!!!')
        e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9qcrQeLufxv61jZ194tG5CJvux0p4U4-r2g&usqp=CAU'
    }

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
        generateShip(5)
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
                    <td className='cell'>
                        <img id={id} src={src} onClick={play} />
                    </td>
                </th>
            )
        }
        return (
            <td className='cell'>
                <img id={id} src={src} onClick={play} />
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
        </Container>
    )
}

export default Table
