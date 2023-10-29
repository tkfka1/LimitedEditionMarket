import React, { useState, useEffect } from 'react';
import ProductDetail from './ProductDetail';
import AddProduct from './AddProductModal';
import PropTypes from 'prop-types';
import '../App.css';

function calculateTimeLeft(endTime) {
  const difference = +new Date(endTime) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60)
    };
  }

  return timeLeft;
}

function ProductList({ token, userInfo }) {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // 상품을 가져오는 로직을 별도의 함수로 분리
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();  // 컴포넌트가 마운트될 때 상품을 가져옵니다.
    const intervalId = setInterval(fetchProducts, 5000); // 5초마다 상품 목록을 다시 가져옵니다.

    return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 인터벌을 정리합니다.
  }, []);

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProductId(null);
    fetchProducts();
  };

  const handleOpenAddProductModal = () => setShowAddProductModal(true);

  const handleCloseAddProductModal = () => {
    setShowAddProductModal(false);
    fetchProducts();  // 모달이 닫힐 때마다 상품을 새로고침합니다.
  };

  const selectedProduct = products.find(product => product.id === selectedProductId);

  return (
    <div className="container mt-5">
      <h2>상품 목록</h2>
      <div className="row">

        {products.map(product => {
          const currentTime = new Date();
          const saleStartTime = new Date(product.saleStart);
          const saleEndTime = new Date(product.saleEnd);

          const isSaleNotStarted = currentTime < saleStartTime;
          const isSaleOver = currentTime > saleEndTime;
          const timeLeft = calculateTimeLeft(product.saleEnd);
          const isNew = (currentTime - saleStartTime) < (10 * 60 * 1000); // 10분 이내인지 확인
          const isEndingSoon = !isSaleOver && (saleEndTime - currentTime) <= (10 * 60 * 1000);

          return (
            <div key={product.id} className="col-md-4 mb-4">
              <div onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>
                <div className="card">
                  <div className="aspect-ratio">
                    {/* 상태 라벨 추가 */}
                    {isSaleNotStarted && (
                      <span className="product-status-label badge badge-success">판매 대기 (판매 개시 시각: {saleStartTime.toLocaleString()})</span>
                    )}
                    {(!isSaleNotStarted && !isSaleOver) && (
                      <span className="product-status-label badge badge-primary">
                        판매 중 (남은 시간: {timeLeft.days ? `${timeLeft.days}일 ` : ''}{timeLeft.hours ? `${timeLeft.hours}시간 ` : ''}{timeLeft.minutes}분)
                      </span>
                    )}
                    {isSaleOver && (
                      <span className="product-status-label badge badge-danger">판매 종료</span>
                    )}
                    <img src={product.image} alt={product.productName} />
                  </div>
                  <div className="card-body">
                  <h5 style={{fontWeight: '200'}} className="card-title">{product.productName}</h5>

                    <strong><p className="card-text">{product.price} 원</p></strong>
                    <br></br>
                    {isNew && <span className="badge badge-success">NEW</span>}
                    {isEndingSoon && <span className="badge badge-danger">곧 마감!</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showModal && selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={handleCloseModal} userInfo={userInfo} token={token} />
      )}
      {token && userInfo?.userRank > 0 && (
        <button onClick={handleOpenAddProductModal} className="btn btn-success mt-3">
          상품 추가
        </button>
      )}
      <AddProduct show={showAddProductModal} handleClose={handleCloseAddProductModal} userId={userInfo?.id} />
    </div>
  );
}

// propTypes 추가
ProductList.propTypes = {
  token: PropTypes.string,
  userInfo: PropTypes.object
};

export default ProductList;
