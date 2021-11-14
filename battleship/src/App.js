import './App.css';
import Table1 from './components/TableTeam1';
import Table2 from './components/TableTeam2';
import { useState } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'



const App = () => {

  const player1 = 'Team 1'
  const player2 = 'Team 2'
  var isShow = true
  const [turn, setTurn] = useState(player1)
  const [player1pick, setPlayer1pick] = useState([])
  const [player2pick, setPlayer2pick] = useState([])

  function startPlaying() {
    console.log("START")
    document.getElementById('button_AI1').click()
    document.getElementById('button_AI2').click()
  }

  function toggleNumber() {
    var team1_cells = Array.from(document.getElementsByClassName(player1 + ' image2'))
    var team2_cells = Array.from(document.getElementsByClassName(player2 + ' image2'))

    if(isShow){
      team1_cells.forEach(cell => {
        cell.classList.add('hidden')
      })
      team2_cells.forEach(cell => {
        cell.classList.add('hidden')
      })
      isShow = false
    }
    else {
      team1_cells.forEach(cell => {
        cell.classList.remove('hidden')
      })
      team2_cells.forEach(cell => {
        cell.classList.remove('hidden')
      })
      isShow = true
    }
  }

  return (
    <Container>
      <h1>Battleship</h1>

      <Alert variant="success" className="text-center">
        <Alert.Heading>{turn} turn </Alert.Heading>
      </Alert>

      <Row className='justify-content-center'>
        <Col >
          <Table1 player={player1} enemy={player2} setTurn={setTurn} turn={turn} alreadypick={player1pick} setAlreadypick={setPlayer1pick}/>
        </Col>
        <Col>
          <Table2 player={player2} enemy={player1} setTurn={setTurn} turn={turn} alreadypick={player2pick} setAlreadypick={setPlayer2pick}/>
        </Col>
      </Row>

      <Row className='justify-content-center'>
        <Col md={6} className="text-center">
          <Button className="px-5" variant="danger" onClick={startPlaying}> Start </Button>
          <Button onClick={toggleNumber}> Show/Hide Number </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default App
