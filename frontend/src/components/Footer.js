import React from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';

function Footer() {
  return (
    <Navbar bg="light">
      <Container>
        <Row>
          <Col>
            <Navbar.Text>
              Change My Banner, Inc. Copyright &copy; {new Date().getFullYear()}
            </Navbar.Text>
          </Col>
          {/* <Col className="text-right">
            <Navbar.Text>
              
            </Navbar.Text>
          </Col> */}
        </Row>
      </Container>
    </Navbar>
  );
}

export default Footer;