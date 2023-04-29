import React, { useState, useEffect } from 'react';
import { ListGroup, Modal, Table, Button } from 'react-bootstrap';

const StudentDetails = () => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
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
  
    fetch(`/projectsByType/${selectedType}`)
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error(error));
  };

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
          <div className="d-flex justify-content-between align-items-center">
            <h4>Project Types:</h4>
            <select className="form-select" onChange={handleProjectTypeSelect}>
              <option value="">Select a project type</option>
              {projectTypes.map((projectType) => (
                <option key={projectType} value={projectType}>{projectType}</option>
              ))}
            </select>
          </div>
          <br/><br/>
          <Table striped bordered hover>
            <thead>
              <tr>
              <th>Team Members</th>
              <th>Registration No</th>
                <th>Team No</th>
                <th>Supervisor Name</th>
                <th>Project Name</th>
              </tr>
            </thead>
            <tbody>
              {projects && projects.map((project) => (
                <tr key={project._id}>
                  
                  <td>
                    {project.members.map(member => (
                      <div key={member._id}>
                        {member.userType === 'student' ? (
                          <div>{member.name}</div>
                        ) : (
                          <div>{project.projectCreatorName}</div>
                        )}
                      </div>
                    ))}
                  </td>
                  <td>
                    {project.members.map(member => (
                      <div key={member._id}>
                        {member.userType === 'student' ? (
                          <div>{member.registrationNo}</div>
                        ) : (
                          <div>{project.projectCreatorRegistrationNo}</div>
                        )}
                      </div>
                    ))}
                  </td>
                  <td>{project.teamNo}</td>
                  <td>
                    {project.members.map(member => (
                      <div key={member._id}>
                        {member.userType === 'supervisor' ? (
                          <div>{member.name}</div>
                        ) : null}
                      </div>
                    ))}
                  </td>
                 
                  
                  <td>{project.projectTitle}</td>
                  
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
