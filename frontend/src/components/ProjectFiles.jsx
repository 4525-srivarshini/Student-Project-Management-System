import React, { useState, useEffect } from 'react';
import { ListGroup, Modal, Table, Button } from 'react-bootstrap';

const StudentDetails = () => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [projectFiles, setProjectFiles] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [projects, setProjects] = useState([]);

  const handleShow = () => {
    setShow(true);
    setShowAlert(true);
  };

  useEffect(() => {
    fetch('/projectTypes')
      .then(response => response.json())
      .then(data => setProjectTypes(data))
      .catch(error => console.error(error));
  }, []);

  const handleProjectTypeSelect = (event) => {
    const selectedType = event.target.value;
    
    fetch(`/projectFilesByType/${selectedType}`)
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error(error));
  };
  
  

  return (
    <>
      <ListGroup.Item className="navList" onClick={handleShow}>
        Project Files
      </ListGroup.Item>

      <Modal
        fullscreen={fullscreen}
        show={showAlert}
        onHide={() => setShowAlert(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Project Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-end mb-3">
            <select className="form-select" value={selectedProjectType} onChange={handleProjectTypeSelect}>
              {projectTypes.map((projectType) => (
                <option key={projectType} value={projectType}>
                  {projectType}
                </option>
              ))}
            </select>
          </div>
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
                {projects.map((project) => (
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
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
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
