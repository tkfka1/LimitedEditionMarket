import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // TODO: 서버로부터 데이터 가져오기
    setProducts([{ id: 1, name: '한정판 아이템 1', price: 10000 }]);
  }, []);

  return (
    <div className="container mt-5">
      <h2>상품 목록</h2>
      <ul className="list-group">
        {products.map(product => (
          <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <Link to={`/product/${product.id}`}>{product.name}</Link> - {product.price}원
            </div>
            <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />  {/* 이미지 추가 */}
          </li>
        ))}
      </ul>
      <Link to="/add-product" className="btn btn-primary mt-3">상품 추가</Link>
    </div>
  );
}

export default ProductList;
