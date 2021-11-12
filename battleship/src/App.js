import './App.css';
import Table1 from './components/TableTeam1';
import Table2 from './components/TableTeam2';
import { useState } from 'react';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap'
// import { startPlaying } from './components/Table';

// function allowDrop(ev) {
//   ev.preventDefault();
// }

// function drag(ev) {
//   console.log(ev.target)
//   ev.dataTransfer.setData("text", ev.target.id);

// }

// function drop(ev) {
//   ev.preventDefault();
//   var data = ev.dataTransfer.getData("text");
//   console.log(data)
//   ev.target.appendChild(document.getElementById(data));
// }




const App = () => {

  const player1 = 'Team 1'
  const player2 = 'Team 2'
  const [turn, setTurn] = useState(player2)
  const [player1pick, setPlayer1pick] = useState([])
  const [player2pick, setPlayer2pick] = useState([])
  return (
    <Container>
      <h1>Battleship</h1>

      <Alert variant="success" className="text-center">
        <Alert.Heading>Player {turn} turn</Alert.Heading>
      </Alert>

      <Row className='justify-content-center'>
        <Col >
          <Table1 player={player1} enemy={player2} setTurn={setTurn} turn={turn} alreadypick={player1pick} setAlreadypick={setPlayer1pick}/>
        </Col>
        <Col>
          <Table2 player={player2} enemy={player1} setTurn={setTurn} turn={turn} alreadypick={player2pick} setAlreadypick={setPlayer2pick}/>
        </Col>
      </Row>
{/* 
      <Row className='justify-content-center'>

        <Col>
          <Row className='justify-content-center'>
            <Card style={{ width: '30rem', height: '10rem' }}>
              <Card.Body>
              
                <Container className='ship-container' id='CU-unit' draggable='false' >

                  <div className='ship' id='CU' draggable='true' onDragStart={drag}>
                    <img id='CU-1' class="part" src="img/cu/3.png" draggable='false' />
                    <img id='CU-2' class="part" src="img/cu/2.png" draggable='false' />
                    <img id='CU-3' class="part" src="img/cu/1.png" draggable='false' />
                  </div>

                  <div className='ship' id='DD' draggable='true' onDragStart={drag}>
                    <img id='DD-1' class="part" src="img/cu/3.png" draggable='false' />
                    <img id='DD-2' class="part" src="img/cu/1.png" draggable='false' />
                  </div>

                  <div className='ship' id='BS' draggable='true' onDragStart={drag}>
                    <img id='BS-1' class="part" src="img/cu/3.png" draggable='false' />
                    <img id='BS-2' class="part" src="img/cu/2.png" draggable='false' />
                    <img id='BS-3' class="part" src="img/cu/2.png" draggable='false' />
                    <img id='BS-4' class="part" src="img/cu/1.png" draggable='false' />
                  </div>

                  <div className='ship' id='AC' draggable='true' onDragStart={drag}>
                    <img id='AC-1' class="part" src="img/cu/3.png" draggable='false' />
                    <img id='AC-2' class="part" src="img/cu/2.png" draggable='false' />
                    <img id='AC-3' class="part" src="img/cu/2.png" draggable='false' />
                    <img id='AC-4' class="part" src="img/cu/2.png" draggable='false' />
                    <img id='AC-5' class="part" src="img/cu/1.png" draggable='false' />
                  </div>

                </Container>
              </Card.Body>
            </Card>
          </Row>
        </Col>

        <Col>
          <Row className='justify-content-center'>
            <Card style={{ width: '30rem', height: '10rem' }}>
              <Card.Body>
                <Card.Text draggable='true'>
                  <div id="div1" onDrop={drop} onDragOver={allowDrop}>

                  </div>
                  <div id="div2" onDrop={drop} onDragOver={allowDrop}>
                  </div>
                  <img id="drag1" src="img\cu\1.png" draggable="true" onDragStart={drag} width="250" height="40"></img>


                </Card.Text>

              </Card.Body>
            </Card>
          </Row>
        </Col>

      </Row> */}


    </Container>
  )
}

export default App
