import React, { useState, useEffect } from 'react';
import { Modal, Button, Form,ListGroup, Container } from 'react-bootstrap';

const UpdateNotes = ({ noteData }) => {
  const [modalShow, setModalShow] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteId, setNoteId] = useState('');

  useEffect(() => {
    if (noteData) {
      setNoteTitle(noteData.currentNote.noteTitle);
      setNoteText(noteData.currentNote.noteText);
      setNoteId(noteData.currentNote._id);
    }
  }, [noteData]);

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (noteTitle && noteText) {
      try {
        const response = await fetch('/updateCurrentNote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ noteTitle, noteText, noteId }),
        });

        const data = await response.json();

        if (response.status === 201 && data) {
          // Handle success
          console.log('Note updated successfully');
          setModalShow(false);
          // Add any additional logic here
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Handle form validation error
      console.log('Please fill the form correctly');
    }
  };

  return (
    <>
      <ListGroup.Item className="selectedListBtn" onClick={() => setModalShow(true)}>
        <i className="fa fa-edit"></i>
        <br></br>
        Edit Note
      </ListGroup.Item>

      <Modal
        size="lg"
        show={modalShow}
        onHide={() => setModalShow(false)}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="modalHeader">
          <Modal.Title id="contained-modal-title-vcenter">Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBodyStatic">
          <Container>
            <Form method="POST">
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" className="formInput" placeholder="Title" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control as="textarea" className="formInput" rows={3} value={noteText} onChange={(e) => setNoteText(e.target.value)} />
              </Form.Group>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer className="modalFooter">
          <Button className="saveBtn" variant="primary" type="submit" onClick={handleNoteSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateNotes;
