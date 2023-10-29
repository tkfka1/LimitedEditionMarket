import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Badge } from 'react-bootstrap';
import CheckoutPage from './Checkout';


function formatNumberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isSaleStarted(saleStart) {
  const now = new Date();
  const start = new Date(saleStart);
  return now >= start;
}

function calculateTimeLeft(endTime) {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const distance = end - now;

  if (distance <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function ProductDetail({ product, onClose, userInfo, token }) {
  const [username, setUsername] = useState('');
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(product.saleEnd));
  const [showCheckout, setShowCheckout] = useState(false);

  const handleDelete = () => {
    fetch(`${process.env.REACT_APP_API_URL}/product/${product.id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response;
      })
      .then(() => {
        // 제품이 성공적으로 삭제된 후의 로직 (예: 모달 닫기, 제품 목록 새로 고침 등)
        if (onClose) onClose();
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    if (product && product.userId) {
      fetch(`${process.env.REACT_APP_API_URL}/auth/profile/${product.userId}`)
        .then((response) => response.json())
        .then((userData) => setUsername(userData.username))
        .catch((error) => console.error("Error fetching username:", error));
    }
  }, [product]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(product.saleEnd));
    }, 1000);

    return () => clearTimeout(timer);
  }, [product.saleEnd]);

  const isSaleOver = new Date() > new Date(product.saleEnd);
  const canPurchase = isSaleStarted(product.saleStart) && !isSaleOver;

  const handleClose = () => {
    if (onClose) onClose();
  };

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <Modal show={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{product.productName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Img variant="top" src={product.image} />
            <Card.Body>
              {/* 가격 */}
              <Card.Text className="mb-2" style={{ fontSize: '24px' }}>
                <strong>가격: </strong>
                <Badge variant="info">{formatNumberWithCommas(product.price)} 원</Badge>
              </Card.Text>

              {/* 설명 */}
              <Card.Text className="mb-2">
                <strong>설명: </strong>
                {product.description}
              </Card.Text>

              {/* 판매자 */}
              <Card.Text className="mb-2">
                <strong>판매자: </strong>
                {username}
              </Card.Text>

              {/* 판매 종료까지 남은 시간 또는 판매 개시까지 남은 시간 */}
              {!isSaleOver ? (
                isSaleStarted(product.saleStart) ? (
                  <Card.Text className="mb-2">
                    <strong>남은 시간:</strong> {timeLeft.hours}시간 {timeLeft.minutes}분 {timeLeft.seconds}초
                  </Card.Text>
                ) : (
                  <Card.Text className="mb-2">
                    <strong>판매 개시까지 남은 시간:</strong> {timeLeft.hours}시간 {timeLeft.minutes}분 {timeLeft.seconds}초
                  </Card.Text>
                )
              ) : (
                <Card.Text className="mb-2">
                  판매 종료
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          {token && (
            <Button variant="primary" disabled={!canPurchase} onClick={() => setShowCheckout(true)}>
              구매하기
            </Button>
          )}
          {token && userInfo?.userRank > 0 && (
            <Button variant="danger" onClick={handleDelete}>
              삭제
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
      {showCheckout && <CheckoutPage
        price={product.price}
        productName={product.productName}
        onClose={() => setShowCheckout(false)}
        userInfo={userInfo} // Add this line
      />}
    </>
  );
}


export default ProductDetail;
