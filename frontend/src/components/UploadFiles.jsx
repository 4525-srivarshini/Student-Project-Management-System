import React, { useState } from 'react'
import { ListGroup, Modal } from 'react-bootstrap';

const UploadFiles = () => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  const handleShow = () => {
    setShow(true);
    setShowAlert(true);
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    const file = event.target[0].files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      console.log('File uploaded successfully');
    })
    .catch(error => {
      console.error('Error uploading file', error);
    });
  }

  return (
    <>
      <ListGroup.Item className='navList' onClick={handleShow}>
        <i className='fas fa-tasks'>&nbsp;</i>         
        {' '}
        Upload Files
      </ListGroup.Item>

      <Modal fullscreen={fullscreen} show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={handleFileUpload}>
                <input type="file" name="file" multiple required/>
                <button type="submit">Upload</button>
            </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UploadFiles;