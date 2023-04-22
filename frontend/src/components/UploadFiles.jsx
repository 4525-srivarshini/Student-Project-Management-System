import React, { useState } from 'react';
import { ListGroup, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const UploadXlsx = () => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [file, setFile] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    axios.post('/upload', formData)
      .then((response) => {
        console.log('File uploaded successfully');
        setShowAlert(true);
      })
      .catch((error) => {
        console.error('Error uploading file', error);
      });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <>
      <ListGroup.Item className='navList' onClick={handleShow}>
        <i className='fas fa-tasks'>&nbsp;</i>
        {' '}
        Upload XLSX
      </ListGroup.Item>

      <Modal  fullscreen={fullscreen} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload XLSX</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='file'>Choose a file:</label>
              <input
                type='file'
                className='form-control-file'
                id='file'
                onChange={handleFileChange}
              />
            </div>
            <button type='submit' className='btn btn-primary'>Upload</button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal variant='success' show={showAlert} onHide={() => setShowAlert(false)}>
        File uploaded successfully!
      </Modal>
    </>
  );
};

export default UploadXlsx;
