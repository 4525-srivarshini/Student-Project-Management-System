import React, { useState, useEffect } from 'react';
import { ListGroup, Modal ,Button, Table, Form} from 'react-bootstrap';
import { CSVLink } from 'react-csv';

const  SupervisorDetails = () => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [supervisor, setsupervisor] = useState([]);
  const [editSupervisor, setEditSupervisor] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSpecialization, setEditSpecialization] = useState("");

  useEffect(() => {
    fetch('/supervisors')
      .then(response => response.json())
      .then(data => setsupervisor(data))
      .catch(error => console.error(error));
  }, []);

  const handleEdit = (supervisor) => {
    setEditSupervisor(supervisor);
    setEditName(supervisor.name);
    setEditEmail(supervisor.email);
    setEditSpecialization(supervisor.specialization);
  };

 const handleDelete = (id) => {
  fetch(`/supervisors/deleteSupervisor/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      setsupervisor(prevSupervisors => prevSupervisors.filter(supervisor => supervisor._id !== id));
    } else {
      throw new Error('Error deleting supervisor');
    }
  })
  .catch(error => console.error(error));
};


  const handleShow = () => {
    setShow(true);
    setShowAlert(true);
  };

  const handleUpdate = () => {
    fetch(`/supervisors/${editSupervisor._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: editName, email: editEmail, specialization: editSpecialization})
    })
      .then(response => response.json())
      .then(data => {
        setsupervisor(prevSupervisors => prevSupervisors.map(supervisor => {
          if (supervisor._id === data._id) {
            return data;
          } else {
            return supervisor;
          }
        }));
        setEditSupervisor(null);
        setEditName("");
        setEditEmail("");
        setEditSpecialization("");
      })
      .catch(error => console.error(error));
  };

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Specialization', key: 'specialization' },
  ];

  const csvData = supervisor.map((supervisor) => ({
    name: supervisor.name,
    email: supervisor.email,
    specialization: supervisor.specialization,
  }));

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
          <Button variant='primary' className='mb-3'>
            <CSVLink data={csvData} headers={headers} style={{color: 'white'}}>
              Download
            </CSVLink>
          </Button>
          <br/><br/>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
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