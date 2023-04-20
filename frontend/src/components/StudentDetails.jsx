import React, { useState,useEffect } from 'react'
import { ListGroup, Modal, Table,Button } from 'react-bootstrap';

const StudentDetails = () => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [students, setStudents] = useState([]);

  const handleShow = () => {
    setShow(true);
    setShowAlert(true);
  };

  useEffect(() => {
    fetch('/students')
      .then(response => response.json())
      .then(data => setStudents(data))
      .catch(error => console.error(error));
  }, []);


  const handleEdit = (id) => {
    // add logic to edit the student with the specified id
  };

  const handleDelete = (id) => {
    // add logic to delete the student with the specified id
  };
  const handleDownload = (id) => {
    // add logic to delete the student with the specified id
  };



  return (
    <>
      <ListGroup.Item className='navList' onClick={handleShow}>
        {' '}
        Student Details
      </ListGroup.Item>

      <Modal fullscreen={fullscreen} show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Button variant="primary" onClick={handleDownload}>Download</Button>
          <br/><br/>
        <Table striped bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>CGPA</th>
                <th>Registration No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.cgpa}</td>
                  <td>{student.registrationNo}</td>
                  <td>
                    <Button variant="success" onClick={() => handleEdit(student._id)}>Edit</Button>{' '}
                    <Button variant="danger" onClick={() => handleDelete(student._id)}>Delete</Button>
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