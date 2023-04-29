import React, { useState, useEffect } from 'react';
import { ListGroup, Modal, Table, Button } from 'react-bootstrap';
import { CSVLink } from 'react-csv';

const StudentDetails = () => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchStudents, setBatchStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleShow = () => {
    setShow(true);
    setShowAlert(true);
  };

  useEffect(() => {
    fetch('/students')
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = () => {
    const ids = selectedStudents.map((student) => student._id);
    fetch('/students/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids })
    })
      .then(response => {
        if (response.ok) {
          if (selectedBatch) {
            setBatchStudents(prevBatchStudents =>
              prevBatchStudents.filter(student => !ids.includes(student._id))
            );
          } else {
            setStudents(prevStudents =>
              prevStudents.filter(student => !ids.includes(student._id))
            );
          }
          setSelectedStudents([]);
        } else {
          throw new Error('Error deleting students');
        }
      })
      .catch(error => console.error(error));
  };

  const handleBatchClick = (batchNo) => {
    setSelectedBatch(batchNo);
    fetch(`/students/${batchNo}`)
      .then((response) => response.json())
      .then((data) => setBatchStudents(data))
      .catch((error) => console.error(error));
  };

  const handleDeleteAll = () => {
    setSelectedStudents(batchStudents.length > 0 ? [...batchStudents] : [...students]);
  };

  const handleSelectStudent = (student) => {
    const isSelected = selectedStudents.some((s) => s._id === student._id);
    if (isSelected) {
      setSelectedStudents(selectedStudents.filter((s) => s._id !== student._id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const resetBatchSelection = () => {
    setSelectedBatch(null);
    setSelectedStudents([]);
  };

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'CGPA', key: 'cgpa' },
    { label: 'Registration No', key: 'registrationNo' },
  ];

  const csvData = students ? students.map((student) => ({
    name: student.name,
    email: student.email,
    cgpa: student.cgpa,
    registrationNo: student.registrationNo,
  })) : [];

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
          <div>
            <Button variant='secondary' onClick={resetBatchSelection} className='mb-3'>
              Home
              </Button>
              <Button variant='primary' className='mb-3' style={{ marginLeft: '10px' }}>
              <CSVLink data={csvData} headers={headers} style={{ color: 'white' }}>
              Download
              </CSVLink>
              </Button>
              {selectedBatch && batchStudents.length > 0 && (
              <Button variant='danger' className='mb-3' onClick={() => handleDeleteAll()} style={{ marginLeft: '10px' }}>
              Select All & Delete
              </Button>
              )}
          </div>
              <Table striped bordered>
                <thead>
                  {selectedBatch ? (
                    <tr>
                      <th colSpan={6}>Batch No: {selectedBatch} </th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Batch No</th>
                    </tr>
                  )}
                </thead>
        <tbody>
          {selectedBatch ? (
            batchStudents.length > 0 ? (
              <>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Registration No</th>
                  <th>Email</th>
                  <th>CGPA</th>
                  <th>Action</th>
                </tr>
                {batchStudents.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <input
                        type='checkbox'
                        value={student._id}
                        checked={selectedStudents.includes(student._id)}
                        onChange={(e) => handleSelectStudent(e.target.checked, student._id)}
                      />
                    </td>
                    <td>{student.name}</td>
                    <td>{student.registrationNo}</td>
                    <td>{student.email}</td>
                    <td>{student.cgpa}</td>
                    <td>
                      <Button variant='danger' onClick={() => handleDelete(student._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={6}>No students found in batch {selectedBatch}</td>
              </tr>
            )
          ) : (
            students.map((student) => (
              <tr key={student._id} onClick={() => handleBatchClick(student._id)}>
                <td>{student._id}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Modal.Body>
  </Modal>
</>
);
};

export default StudentDetails;







