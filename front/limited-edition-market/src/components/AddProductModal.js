import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function AddProductModal({ show, handleClose }) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/add-product`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.status === 200) {
        handleClose();
      } else {
        setErrorMessage(data.message || '요청 실패');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('서버 에러');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>상품 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>상품 이름:</Form.Label>
            <Form.Control 
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>상품 설명:</Form.Label>
            <Form.Control 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>상품 가격:</Form.Label>
            <Form.Control 
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>상품 이미지:</Form.Label>
            <Form.Control 
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </Form.Group>
          <Button type="submit" className="btn btn-primary w-100 mb-2">
            상품 추가
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

AddProductModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddProductModal;
