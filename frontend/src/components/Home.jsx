import React, { useContext, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../stylesheets/home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Navbar, Fade, Button, ListGroup, Badge, Modal } from 'react-bootstrap';
import { UserContext } from '../App';
import MainNavbar from './MainNavbar';
import Signup from './Signup';
import Projects from './Projects';


const Home = () => {
  const { state } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false); // add state variable
  
  const toggleModal = () => { // add function to toggle the modal
    setShowModal(!showModal);
  }

  return (
    <>
      {state ? (
        <Container className="background " fluid>
          <MainNavbar toggleModal={toggleModal}/> {/* pass toggleModal function to MainNavbar */}
          <Modal show={showModal} fullscreen={true} onHide={toggleModal}> {/* render modal component */}
            <Projects/>
          </Modal>
        </Container>
      ) : (
        <Container className="background2 " fluid>
          <Signup />
        </Container>
      )}
    </>
  );
};

export default Home;
