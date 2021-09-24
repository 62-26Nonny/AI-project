import './App.css';
import Table from './components/Table';
import { Container, Row, Col } from 'react-bootstrap'

const App = () => {
  return (
    <Container>
      <h1>Battleship</h1>
      <Row>
        <Col>
          <Table player='Gurumi' />
        </Col>
        <Col>
          <Table player='Pre Aoo' />
        </Col>
      </Row>

    </Container>
  )
}

export default App
