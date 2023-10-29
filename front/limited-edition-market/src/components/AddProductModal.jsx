import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function AddProductModal({ show, handleClose, userId }) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImageUrl] = useState(''); // Changed from setImage
  const [errorMessage, setErrorMessage] = useState('');
  const [saleStart, setSaleStart] = useState('');
  const [saleEnd, setSaleEnd] = useState('');
  const [expectedPurchase, setExpectedPurchase] = useState('1~10');
  const [popularity, setPopularity] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      productName,
      description,
      price: Number(price),
      image,
      userId: userId,
      saleStart: new Date(saleStart).toISOString(),
      saleEnd: new Date(saleEnd).toISOString(),
      expectedPurchase: expectedPurchase,
      popularity: Number(popularity)
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/add-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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

  // 별 선택을 처리하기 위한 함수
  const handleStarClick = (rating) => {
    setPopularity(rating);
  }

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
            <Form.Label>상품 이미지 URL:</Form.Label>
            <Form.Control
              type="text"
              value={image} // Changed from image
              onChange={(e) => setImageUrl(e.target.value)} // Changed from setImage
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>판매 시작 시간:</Form.Label>
            <Form.Control
              type="datetime-local"
              value={saleStart}
              onChange={(e) => setSaleStart(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>판매 종료 시간:</Form.Label>
            <Form.Control
              type="datetime-local"
              value={saleEnd}
              onChange={(e) => setSaleEnd(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>예상 구매 인원:</Form.Label>
            <Form.Control
              as="select"
              value={expectedPurchase}
              onChange={(e) => setExpectedPurchase(e.target.value)}
              required
            >
              <option value="1-10">1~10</option>
              <option value="10-100">10~100</option>
              <option value="100-1000">100~1000</option>
              <option value="1000+">1000 이상</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>예상 인기도:</Form.Label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={star <= popularity ? 'star-active' : ''}
                >
                  {star <= popularity ? '★' : '☆'}
                </span>
              ))}
            </div>
          </Form.Group>
          <br>
          </br>
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
  handleClose: PropTypes.func.isRequired,
  userId: PropTypes.number
};


export default AddProductModal;
