// src/components/ProductList.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';  // 위에서 추가한 CSS를 여기에 임포트

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProductId(null);
  };

  useEffect(() => {
    // TODO: 서버로부터 데이터 가져오기
    setProducts([
      { id: 1, name: '한정판 아이템 1', price: 10000, imageUrl: 'https://cdn.aitimes.kr/news/photo/202303/27617_41603_044.jpg' },
      { id: 1, name: '한정판 아이템 1', price: 10000, imageUrl: 'https://cdn.aitimes.kr/news/photo/202303/27617_41603_044.jpg' },
      { id: 1, name: '한정판 아이템 1', price: 10000, imageUrl: 'https://cdn.aitimes.kr/news/photo/202303/27617_41603_044.jpg' },
      { id: 1, name: '한정판 아이템 1', price: 10000, imageUrl: 'https://cdn.aitimes.kr/news/photo/202303/27617_41603_044.jpg' },
      { id: 1, name: '한정판 아이템 1', price: 10000, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpt6tG3bO1TboWi10aNG9nCA8OXyJCsoUmIDy2Keg59SYo8l3twWfCJIKJ7rM-5v3z3ok&usqp=CAU' },
      // ... 다른 상품들
    ]);
  }, []);

  return (
      <div className="container mt-5">
        <h2>상품 목록</h2>
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <div onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>

    
    <div className="container mt-5">
      <h2>상품 목록</h2>
      <div className="row">
        {products.map(product => (
          <div key={product.id} className="col-md-4 mb-4">
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card">
                <div className="aspect-ratio">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.price}원</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <Link to="/add-product" className="btn btn-primary mt-3">상품 추가</Link>
    </div>
  );
}

export default ProductList;
