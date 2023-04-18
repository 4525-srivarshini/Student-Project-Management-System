import React, { useState } from "react";
import axios from "axios";
import { Row, Col, Container, InputGroup, Button, Modal, FormControl, ListGroup, Badge } from 'react-bootstrap';
const UploadFiles = () => {
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const handleShow = () => {setFullscreen(true); setShow(true);}
function UploadCSV() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/upload-csv", formData);
      setMessage("CSV file uploaded successfully");
    } catch (error) {
      console.error(error);
      setMessage("Error uploading CSV file");
    }
  };

  return (
    <>
    <ListGroup.Item className='navList' onClick={handleShow}>
        <i className='fa fa-search'>&nbsp;</i>         
        {' '}
        Upload Files
      </ListGroup.Item>
    <div>
      <h1>Upload CSV</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
    </>
  );
}
};
export default UploadFiles;
