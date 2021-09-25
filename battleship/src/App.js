import './App.css';
import Table from './components/Table';
import { Container, Row, Col, Alert, Button, } from 'react-bootstrap'

const App = () => {
  return (
    <Container>
      <h1>Battleship</h1>

      <Alert variant="success" className="text-center">
        <Alert.Heading>Player _ turn</Alert.Heading>
      </Alert>

      <Row>
        <Col>
          <Table player='Gurumi' />
        </Col>
        <Col>
          <Table player='Pre Boss' />
        </Col>
      </Row>

    </Container>
  )
}

export default App
