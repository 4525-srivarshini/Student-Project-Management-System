import React, { useState,useEffect } from 'react'
import { ListGroup, Modal, Table,Button } from 'react-bootstrap';

const StudentDetails = () => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [projects, setProjects] = useState([]);

  const handleShow = () => {
    setShow(true);
    setShowAlert(true);
  };

  useEffect(() => {
    fetch('/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error(error));
  }, []);



  return (
    <>
      <ListGroup.Item className='navList' onClick={handleShow}>
        {' '}
        Project Details
      </ListGroup.Item>

      <Modal fullscreen={fullscreen} show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <br/><br/>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Team No</th>
              <th>Project Title</th>
              <th>Project Members</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>{project.teamNo}</td>
                <td>{project.projectTitle}</td>
                <td>
                  <ul>
                    {project.members.map((member) => (
                      <li key={member._id}>
                         {member.name} ({member.registrationNo})
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>

      </Modal>
    </>
  );    
};

export default StudentDetails;