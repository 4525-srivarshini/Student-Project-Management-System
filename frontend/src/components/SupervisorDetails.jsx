import React, { useState, useEffect } from 'react'
import { ListGroup, Modal ,Button, Table} from 'react-bootstrap';

const  SupervisorDetails = () => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [supervisor, setsupervisor] = useState([]);

  useEffect(() => {
    fetch('/supervisors')
      .then(response => response.json())
      .then(data => setsupervisor(data))
      .catch(error => console.error(error));
  }, []);

  const handleEdit = (id) => {
    // add logic to edit the student with the specified id
  };

  const handleDelete = (id) => {
    // add logic to delete the student with the specified id
  };

  const handleShow = () => {
    setShow(true);
    setShowAlert(true);
  };

  const handleDownload = () => {
    
  }

  return (
    <>
      <ListGroup.Item className='navList' onClick={handleShow}>         
        {' '}
        Supervisor Details
      </ListGroup.Item>

      <Modal fullscreen={fullscreen} show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Supervisor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Button variant="primary" onClick={handleDownload}>Download</Button>
          <br/><br/>
        <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>specialization</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {supervisor.map((supervisor) => (
                <tr key={supervisor._id}>
                  <td>{supervisor.name}</td>
                  <td>{supervisor.email}</td>
                  <td>{supervisor.specialization}</td>
                  <td>
                    <Button variant="success" onClick={() => handleEdit(supervisor._id)}>Edit</Button>{' '}
                    <Button variant="danger" onClick={() => handleDelete(supervisor._id)}>Delete</Button>
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

export default SupervisorDetails;