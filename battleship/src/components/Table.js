import Image from './Image'
import Container from 'react-bootstrap/Container'
import { useEffect, useState } from 'react'

const Table = (props) => {

    const player = Object.freeze({
        name: props.player,
        ship: Array.from([]),
        founded: 0,
    })
    const [playerState, setPlayerState] = useState(player)

    var gameover = false

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

    function play(e) {
        checkShip(e)
        if(gameover){
            end()
        }
    }

    function checkShip(e) {
        console.log(parseInt(e.target.id))
        console.log(playerState)
        if(playerState.ship.includes(parseInt(e.target.id))){
            setPlayerState({
                ...playerState,
                founded: playerState.founded + 1
            })
            if(playerState.founded == 10) {
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

    function generateShip() {
        var temp = []
        for(let i = 0;i < 10;i++){
            temp.push(randomShip(0, 99, temp))
        }
        setPlayerState({
            ...playerState,
            ship: temp
        })
        console.log(playerState.ship)
    }

    useEffect(() => {
        generateShip()
    }, [setPlayerState])

    const createCell = (id, src) => {


        if (id < 10){
            return( 
                    <th>
                        {id + 1} 
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
                                var id = (row * 10) + col
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
