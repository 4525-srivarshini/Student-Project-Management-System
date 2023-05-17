import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal} from 'react-bootstrap';
import image_S1 from '../images/abstract10.png';
import {UserContext} from '../App';

function Profile() {
    const {state, setState} = useContext(UserContext); 
    const [showAlert, setShowAlert] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const navigate = useNavigate();
  const handleSavePassword = () => {
    if (oldPassword === state.password && newPassword === confirmPassword) {
      setState(prevState => ({ ...prevState, password: newPassword }));
      handleCloseModal();
    } else {
      alert('Passwords do not match');
    }
  };

  const handleSignOut = async () =>{

    try{
        const response = await fetch("/userSignOut", {
            method: "GET",
        });
        let data = await response.json();

        if(response.status === 201 && data){
            localStorage.removeItem("User")      
            navigate("/login");
        }
    } catch(error){
        console.log(error)
    }

}

  const handleChangePassword = async () => {
    try {
        const response = await fetch("/changePassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: state.email,
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        });
        const data = await response.json();
        if (response.status === 201 && data) {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            alert(data.message);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.log(error);
    }
}
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };
  return (
<>
  <ListGroup.Item className='navList' onClick={() => setShowAlert(true)}>
    <i className='fa fa-user-circle'>&nbsp;</i>
    {' '}
    Profile
  </ListGroup.Item>
  <Modal size="sm" show={showAlert} onHide={() => setShowAlert(false)} aria-labelledby="example-modal-sizes-title-sm">
    <Modal.Header closeButton className="modalHeader">
      <Modal.Title id="example-modal-sizes-title-sm">Profile</Modal.Title>
    </Modal.Header>
    <Modal.Body className="modalBodyStatic">
  {state ? (
    <Container className="profileCont">
      <Row>
        <Col>
          <img
            src={state.image}
            onError={(e) => {
              e.target.onError = null;
              e.target.src = image_S1;
            }}
            className="profileImages"
          />
        </Col>

        <Col>
          <Row>
            <h6 className="profileTitle">Name: {state.name}</h6>
          </Row>

          <Row>
            <h6 className="profileTitle">Email: {state.email}</h6>
          </Row>

          {state.userType === "student" && (
            <>
              <Row>
                <h6 className="profileTitle">Registration No: {state.registrationNo}</h6>
              </Row>
              <Row>
                <h6 className="profileTitle">CGPA: {state.cgpa}</h6>
              </Row>
              <Row>
                <h6 className="profileTitle">Batch No: {state.batchNo}</h6>

              </Row>
              <Row>
                <h6 className="profileTitle">Section : {state.section}</h6>
              </Row>
            </>
          )}
          {state.userType === "supervisor" && (
            <Row>
              <h6 className="profileTitle">Specialization: {state.specialization}</h6>
            </Row>
          )}
          <Row>
            <Col>
              <Button variant="primary" onClick={handleShowModal}>
                Change Password
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  ) : null}
</Modal.Body>

    
    <Modal.Footer className='modalFooter'>
      <Button className='saveBtn' onClick={handleSignOut}>SignOut</Button> 
    </Modal.Footer>
  </Modal>
  
  <Modal show={showModal} onHide={handleCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title>Change Password</Modal.Title>
    </Modal.Header>
    
    <Modal.Body>
      <Form>
        <Form.Group controlId="oldPassword">
          <Form.Label>Old Password</Form.Label>
          <Form.Control type="password" placeholder="Enter old password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </Form.Group>
        
        <Form.Group controlId="newPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </Form.Group>
        
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </Form.Group>
      </Form>
    </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant ="primary" onClick={handleChangePassword}>
            Change Password
</Button>
</Modal.Footer>
</Modal>
</>
);
}

export default Profile;
