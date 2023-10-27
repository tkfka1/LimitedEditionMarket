// src/components/AddProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 사용

function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate(); // useHistory 대신 useNavigate를 사용

  const onSubmit = (e) => {
    e.preventDefault();

    // TODO: 서버에 상품 추가 요청하기
    console.log({ name, price, description });

    // 상품 추가 후 상품 목록 페이지로 리다이렉트
    navigate('/'); // 페이지 리디렉션
  };

  return (
    <div>
      <h2>상품 추가</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>상품 이름:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>가격:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>설명:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <button type="submit">상품 추가</button>
      </form>
    </div>
  );
}

export default AddProduct;
