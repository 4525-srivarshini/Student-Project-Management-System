import React, { useState,useEffect } from 'react'
import { ListGroup, Modal, Table,Button } from 'react-bootstrap';

const StudentDetails = () => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [projectFiles, setProjectFiles] = useState([]);

  const handleShow = () => {
    setShow(true);
    setShowAlert(true);
  };

  useEffect(() => {
    fetch('/projectFiles')
      .then(response => response.json())
      .then(data => setProjectFiles(data))
      .catch(error => console.error(error));
  }, []);



  return (
    <>
      <ListGroup.Item className='navList' onClick={handleShow}>
        {' '}
        Project Files
      </ListGroup.Item>

      <Modal fullscreen={fullscreen} show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Project Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <br/><br/>
        <Table striped bordered hover>
            <thead>
              <tr>
                <th>Team No</th>
                <th>Project Title</th>
                <th>Project Files</th>
                <th>Project File Url</th>
              </tr>
            </thead>
            <tbody>
            {projectFiles.map((project) => (
            <tr key={project._id}>
                <td>{project.teamNo}</td>
                <td>{project.projectTitle}</td>
                <td>
                {project.projectFiles.map((file) => (
                    <div key={file._id}>{file.fileName}</div>
                ))}
                </td>
                <td>
                    <ul>
                        {project.projectFiles.map((file) => (
                        <li key={file._id}>
                            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                            {file.fileName}
                            </a>
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