import Container from 'react-bootstrap/Container'
import { useEffect, useState } from 'react'

const Table = (props) => {

    //สร้างรูปแบบ state ของ player
    const player = Object.freeze({
        name: props.player,
        ship: Array.from([]),
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
        if(!Array.isArray(excludeArrayNumbers)) {
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
        checkShip(e)
        //เช็คว่าเกมจบรึยัง
        if(gameover){
            //เมื่อจบแล้วไปแสดงหน้าจบเกม
            end()
        }
    }

    // ฟังก์ชั่นสุ่มสำหรับเซ็กว่าผู้เล่นยิงโดนเรือตรงข้ามหรือไม่
    function checkShip(e) {
         // ให้ตัวแปล clicked เก็บตำแหน่งที่ผู้เล่นกด
        var clicked = [parseInt(e.target.id[0]), parseInt(e.target.id[2])]
        console.log(clicked)
        console.log(playerState.ship[0])
         // ให้ตัวแปล found เก็บค่า boolean ว่าเจอเรือหรือไม่
        var found = playerState.ship.find(ship => {
            if((ship[0] === clicked[0]) && (ship[1] === clicked[1])){
                return true
            }
            else return false
        })
        // เมื่อเจอเรือให้บวกแต้มฝั่งผู้เล่นที่เจอ
        if(found){
            setPlayerState({
                ...playerState,
                founded: playerState.founded + 1
            })
            // เมื่อแต้มครบ จบเกม
            if(playerState.founded === 10) {
                gameover = true
            }
            foundShip(e)
        }
        else {
            notFound(e)
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

    // ฟังก์ชั่นสุ่มสำหรับสร้างเรือ
    function generateShip(size) {
        // Random => Check available => random available
        // If not available => Random again
        var randomIndex = []
        var checkAvailable = []
        var ship = []

        // Random Ship HEAD
        do {
            randomIndex.splice(0, randomIndex.length)
            for(let i = 0;i < 2;i++){
                randomIndex.push(randomShip(0, 9, randomIndex))
            }
        } while ((randomIndex[0] + size > 9) && (randomIndex[0] - size < 0) && 
        (randomIndex[1] + size > 9) && (randomIndex[1] - size < 0))

        // Check available เช็คพื้นที่พอไหม 4 ทาง first num: row, y axis second num: col, x axis
        for(let i = 1;i < size;i++){
            if(!(randomIndex[0] + size > 9)){
                checkAvailable.push([randomIndex[0] + i, randomIndex[1]])
            }
            if(!(randomIndex[0] - size < 0)){
                checkAvailable.push([randomIndex[0] - i, randomIndex[1]])
            }
            if(!(randomIndex[1] + size > 9)){
                checkAvailable.push([randomIndex[0], randomIndex[1] + i])
            }
            if(!(randomIndex[1] - size < 0)){
                checkAvailable.push([randomIndex[0], randomIndex[1] - i])
            }
        }

        // เช็คว่าระหว่างทางมีเรือไหม ถ้ามี ลบทางนั้นทิ้ง 
        checkAvailable.forEach(path => {
            playerState.ship.find(positioned => {
                if(positioned[0] === path[0]){

                }
                
            })
        })
        
        ship.push(randomIndex)
        setPlayerState({
            ...playerState,
            ship: ship
        })
        console.log(randomIndex)
        console.log(checkAvailable)
    }

    useEffect(() => {
        generateShip(2)
    }, [setPlayerState])

    // สร้างตารางโดยรับค่า id และ src
    const createCell = (id, src) => {

        // ถ้าเป็นแถวแรกให้สร้าง header ระบุเลขช่องด้วยนอกจากนั้นก็สร้างแค่ช่องปกติ
        if (id[0] === 0){
            return( 
                    <th>
                        {id[1] + 1} 
                        <td className='cell'>
                            <img id={id} src={src} onClick={play} />
                        </td>
                    </th>
            )
        }
        return( 
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
                                return(
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
