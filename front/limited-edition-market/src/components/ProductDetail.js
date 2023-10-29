import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function ProductDetail({ productId, onClose }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // TODO: 서버에서 해당 id의 상품 정보를 가져오기
    // 예시 데이터:
    // 실제 서버와 통신하는 로직에 따라 아래 코드는 바뀔 수 있습니다.
    setProduct({
      id: 1, 
      name: '한정판 아이템 1', 
      price: 10000, 
      description: '이것은 한정판 아이템입니다.'
    });

  }, [productId]);  // productId를 dependency로 추가

  const handleClose = () => {
    if (onClose) onClose();
  };

  if (!product) return <div>Loading...</div>;

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>가격: {product.price}원</p>
        <p>설명: {product.description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductDetail;
