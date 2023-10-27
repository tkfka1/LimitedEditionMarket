// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // TODO: 서버에서 해당 id의 상품 정보를 가져오기
    // 예시 데이터:
    setProduct({ id: 1, name: '한정판 아이템 1', price: 10000, description: '이것은 한정판 아이템입니다.' });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>가격: {product.price}원</p>
      <p>설명: {product.description}</p>
    </div>
  );
}

export default ProductDetail;
