import React, { useState, useLayoutEffect,useContext, useReducer, useEffect } from 'react';
import '../stylesheets/navbar.css';
import { Row, Col, Container, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';
import Todos from "./Todos";
import SearchMembers from './SearchMembers';
import Messages from './Messages';
import { UserContext } from '../App'
import DisplayProjects from './DisplayProjects';
import Eventscalendar from './Eventscalendar';
import MyNotes from './MyNotes';
import Profile from './Profile';
import Notifications from './Notifications';
import UploadFiles from './UploadFiles';
import StudentDetails from './StudentDetails';
import SupervisorDetails from './SupervisorDetails';
import ProjectDetails from './ProjectDetails';
import ProjectFile from './ProjectFiles';
import { initialState, reducer } from "../reducer/UseReduser"

const MainNavbar = ({ userType }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_USER_TYPE', payload: userType });
  }, [userType]);

  return (
    <Navbar expand="md" fixed="top" className="navbarMain justify-content-end">
      <Container>
        <Navbar.Brand className="title" href="#home">
          Student Project Management System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="toggleBtn1" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto navItems">
            {state.userType === 'student' || state.userType === 'supervisor' ? (
              <>
                <Nav.Link href="#searchMembers" className="navLinks">
                  <Notifications />
                </Nav.Link>
                <Nav.Link href="#projects" className="navLinks">
                  <DisplayProjects />
                </Nav.Link>
                <Nav.Link href="#todos" className="navLinks">
                  <Todos />
                </Nav.Link>
                <Nav.Link href="#todos" className="navLinks">
                  <MyNotes />
                </Nav.Link>
                <Nav.Link href="#messages" className="navLinks">
                  <Messages />
                </Nav.Link>
                <Nav.Link href="#calendar" className="navLinks">
                  <Eventscalendar />
                </Nav.Link>
                
                <Nav.Link href="#searchMembers" className="navLinks">
                  <Profile />
                </Nav.Link>
              </>
            ) :state.userType === 'admin' ? (
              <>
              <Nav.Link href="#uploadFiles" className="navLinks">
                <UploadFiles />
              </Nav.Link>
              <Nav.Link href="#studentDetails" className="navLinks">
                 <StudentDetails/>
              </Nav.Link>
              <Nav.Link href="#supervisorDetails" className="navLinks">
                 <SupervisorDetails/>
              </Nav.Link>
              <Nav.Link href="#searchMembers" className="navLinks">
                  <ProjectDetails/>
              </Nav.Link>
              <Nav.Link href="#searchMembers" className="navLinks">
                  <ProjectFile/>
              </Nav.Link>
              <Nav.Link href="#searchMembers" className="navLinks">
                  <Notifications />
                </Nav.Link>
              <Nav.Link href="#searchMembers" className="navLinks">
                  <Profile />
              </Nav.Link>
              </>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;