import React, {useState, useContext, useEffect, useRef  } from 'react'
import {useNavigate} from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import '../stylesheets/login.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, OverlayTrigger,Offcanvas, InputGroup,Tooltip, Modal } from 'react-bootstrap';
import { UserContext } from '../App';

const Signup = () => {

    const {state, dispatch} = useContext(UserContext);
    const fileInputRef = useRef();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const [showAlertForm, setShowAlertForm] = useState(false);
    const handleAlertFormClose = () =>{setShowAlertForm(false);}
    const [showAlert, setShowAlert] = useState(false);
    const handleAlertClose = () =>{setShowAlert(false);}
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userCnfrmPass, setUserCnfrmPass] = useState("");
    const [userImage, setUserImage] = useState();
    const [registrationNo, setRegistrationNo] = useState("");
    const [userType, setUserType] = useState('student');
    const [cgpa, setCgpa] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [showPassword, setShowPassword] = useState('');
    const [showCnfrmPass, setShowCnfrmPass] = useState('');

    const handleUserTypeChange = e => {
        setUserType(e.target.value);
    }

    const handleFiles = (e) =>{
        let myfile = e.target.files[0]; 
        let fileSize = parseFloat(myfile.size / (1024 * 1024)).toFixed(2); 
        if(myfile.type.match('image.*') && fileSize < 2){
            setUserImage(myfile);
        }
        else{
            fileInputRef.current.value = null;
            setAlertTitle("Alert")
            setAlertMessage("Please upload an image of 2 MB or less.");
            setShowAlert(true);
        }
        
        
    }


    const handleResponce = async (response) =>{
        const jwtIDToken = response.credential;

        try{
            const res = await fetch("/googleSignIn", { 
                method: "POST",
                headers:{
                    "Content-Type" : "application/json"                
                },
                body: JSON.stringify({
                    jwtIDToken
                })
            });
            
            const data = await res.json() 
            console.log(data)
            if(res.status === 201 && data){
                dispatch({type: "USER", payload: data});
                navigate("/");
                window.location.reload();
            }        
            
        } catch(error){
            console.log(error)
        }
    }

    useEffect( () => {
        /*global google*/
        google.accounts.id.initialize({
            client_id: "71679309628-pt4a93103j2iiiorhcqhkq9thcua5vvl.apps.googleusercontent.com",
            callback: handleResponce
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large"}
        );

    }, []);




    const handleSinginSubmit = async (e) =>{
        e.preventDefault();

        if(userEmail && userPassword){
            try {
                const response = await fetch('/signInUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({userEmail, userPassword}),
                });
    
                const data = await response.json();

                if(response.status === 201 && data){
                    console.log(data)
                    dispatch({type: "USER", payload: data});
                    navigate("/")
                    window.location.reload();
                }
                else{
                    setAlertTitle("Alert")
                    setAlertMessage(data.message);
                    setShowAlert(true);
                }
                
            } catch (error) {
                console.log(error);
                
            }
        }
        else{
            setAlertTitle("Alert")
            setAlertMessage("Please fill the form correctly");
            setShowAlert(true);
        }
       

    }




    const handleSingupSubmit = async (e) =>{
        e.preventDefault();
        const form = e.currentTarget;
    
        let nameRegEx = /^[A-Za-z\s]*$/.test(userName);
        let checkName = userName.length > 0 && userName.length < 15;
        let emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
        let checkPass = userPassword.length > 7;
        let checkCnfrmPass = userCnfrmPass.length > 7;
        let checkBothPass = userPassword === userCnfrmPass;
        
        let errorMessage = "";
    
        if(!checkName){
            errorMessage += "Name is incorrect. \n";
        }
        else if(!nameRegEx){
            errorMessage += "Name contains invalid characters.\n ";
        }
    
        if(!emailRegEx){
            errorMessage += "Email is invalid. \n";
        }
    
        if(!checkPass){
            errorMessage += "Password is incorrect. \n";
        }
    
        if(!checkCnfrmPass){
            errorMessage += "Confirmation password is incorrect.\n ";
        }
    
        if(!checkBothPass){
            errorMessage += "Passwords do not match.\n ";
        }
    
    
        if(errorMessage){
            setAlertTitle("Alert")
            setAlertMessage(errorMessage);
            setShowAlert(true);
            return;
        }
    
        let formData = new FormData();
                
        formData.append('userName', userName);
        formData.append('userEmail', userEmail);
        formData.append('userPassword', userPassword);
        formData.append('userCnfrmPass', userCnfrmPass);
        formData.append('registrationNo', registrationNo);
        formData.append('userImage', userImage);
        formData.append('userType', userType);
        formData.append('cgpa', cgpa);
        formData.append('specialization', specialization);
    
        try {
            const response = await fetch("/createNewUser", {
                method: "POST",
                body: formData
                      
            });
            const data = await response.json();
    
            if(response.status === 201 && data){
                setAlertTitle("Alert")
                setAlertMessage(data.message);
                setShowAlert(true);
    
                setUserName("");
                setUserEmail("");
                setUserPassword("");
                setUserCnfrmPass("");
                fileInputRef.current.value = null;
                form.reset();
                setShowModal(false);
            }
    
        } catch (error) {
            console.log(error);
        }
    
    }
    

    return (
        <>
            <Container  className='background2' fluid>
                <Container className='signInCont'>
                    <Row>
                    <Container className='headingCont'>
                            <h4>Student Project Management System</h4> 
                        </Container>
                        <br></br><br></br>
                        <Container className='headingCont'>
                            <h4>SignIn</h4> 
                        </Container>
                    </Row>
                    <Row>
                        <Container className='signinFormCont'>
                            <Form method='POST' onSubmit={handleSinginSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" className='formInput' value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} placeholder="Enter email" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" className='formInput' value={userPassword} onChange={(e)=>setUserPassword(e.target.value)} placeholder="Password" required />
                                </Form.Group>
                                <br></br>
                                <Form.Group className="mb-3" >
                                    <Button className='formSignInBtn' variant="primary" type="submit" >
                                        Signin
                                    </Button>
                            </Form.Group> 
                            </Form>
                        </Container>
                    </Row>
                    <br></br>
                    {/*<Row>
                        <Container className='googleBtnCont'>
                            <Row className="justify-content-md-center">
                                <Col sm lg="6">
                                    <h5>SignIn with Google</h5>
                                    <br></br>
                                </Col>
                                <Col sm lg="5">
                                    <div id='signInDiv'></div>
                                    <br></br>
                                </Col>
                            </Row>
                        </Container>
                    </Row>*/}
                    <Row>
                        <Container className='headingCont'>
                            <p className='accountTxt'>Need an account? <i className='signUpTxt' onClick={()=>setShowModal(true)}>Sign Up</i></p>
                        </Container>
                    </Row>
                    <br></br>
                </Container>



                <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton className='modalHeader'>
                        <Modal.Title>Student Project Management System</Modal.Title>
                    </Modal.Header>
                    <Modal.Header className='modalHeader'>
                        <Modal.Title>Signup</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='modalBody'>
                        <Form method='POST' onSubmit={handleSingupSubmit}>
                            <Form.Group className="mb-3" >
                                <Form.Label>Name *</Form.Label>
                                <Form.Control type="text" className='formInput' value={userName} onChange={(e)=>setUserName(e.target.value)}  placeholder="Enter your full name" required/>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label>Email *</Form.Label>
                                <Form.Control type="email" className='formInput' value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} placeholder="Enter email" required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                            <Form.Label>User Type *</Form.Label>
                            <br></br>
                                <Form.Check type="radio" label="Student" name="userTypeRadio" value="student" checked={userType === 'student'} onChange={handleUserTypeChange} className="form-check-inline" />
                                <Form.Check type="radio" label="Supervisor"  name="userTypeRadio" value="supervisor" checked={userType === 'supervisor'} onChange={handleUserTypeChange} className="form-check-inline"  />
                                <Form.Check type="radio" label="admin"  name="userTypeRadio" value="admin" checked={userType === 'admin'} onChange={handleUserTypeChange} className="form-check-inline"  />
                            </Form.Group>
                                {userType === 'student' && (
                                    <Form.Group controlId="mb-3">
                                        <Form.Label>CGPA</Form.Label>
                                        <Form.Control type="text" placeholder="Enter CGPA" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
                                        <Form.Label>Registration No</Form.Label>
                                        <Form.Control type="text" placeholder="Enter registration no." value={registrationNo} onChange={(e) => setRegistrationNo(e.target.value)} />
                                    </Form.Group>
                                )}
                                {userType === 'supervisor' && (
                                    <Form.Group controlId="mb-3">
                                        <Form.Label>Specialization *</Form.Label>
                                        <Form.Control type="text" placeholder="Enter specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                                    </Form.Group>
                                )}
                            <Form.Group className="mb-3">
                                <Form.Label>Profile image *</Form.Label>
                                <Form.Control type="file" name='profileImage' required className='formInput' id='profileImage' ref={fileInputRef} onChange={handleFiles}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password *</Form.Label>
                                <InputGroup>
                                    <Form.Control type={showPassword ? "text" : "password"} required className='formInput' value={userPassword} onChange={(e)=>setUserPassword(e.target.value)} placeholder="Password" />
                                    <OverlayTrigger
                                    placement="top"
                                    >
                                    <InputGroup.Text onClick={()=>setShowPassword(!showPassword)}>{showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}</InputGroup.Text>
                                    </OverlayTrigger>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label>Confirm Password *</Form.Label>
                                <InputGroup>
                                    <Form.Control type={showCnfrmPass ? "text" : "password"} className='formInput' value={userCnfrmPass} required onChange={(e)=>setUserCnfrmPass(e.target.value)} placeholder="Confirm Password" />
                                    <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-top`}>
                                        Please enter the same password again to confirm it.
                                        </Tooltip>
                                    }
                                    >
                                    <InputGroup.Text onClick={()=>setShowCnfrmPass(!showCnfrmPass)}>{showCnfrmPass ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}</InputGroup.Text>
                                    </OverlayTrigger>
                                </InputGroup>
                                </Form.Group>

                            <Form.Group className="mb-3" >
                                <Form.Text className="text-muted">
                                        Check Before Submitting details are not edited
                                </Form.Text>
                                <Button className='formSignInBtn' variant="primary" type="submit" >
                                    Signup
                                </Button>
                            </Form.Group> 
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>


             <Modal size="sm" show={showAlertForm} onHide={handleAlertFormClose} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm">Insturctions</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                <p>Please fill the form correctly.</p>
                <p>Name must be less then 15 characters.</p>
                <p>Image size should be less then 2 MB.</p>
                <p>Password should be atleast 8 characters.</p>
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                <Button className='saveBtn' onClick={handleAlertFormClose}>Ok</Button> 
            </Modal.Footer>
            </Modal>

            <Modal size="sm" show={showAlert} onHide={handleAlertClose} backdrop="static" keyboard={false} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm">{alertTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                <p>{alertMessage}</p>
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                <Button className='saveBtn' onClick={handleAlertClose}>Ok</Button> 
            </Modal.Footer>
            </Modal>
        </>
    )
}

export default Signup
