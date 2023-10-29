import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import AddProduct from './components/AddProductModal';
import LoginModal from './components/LoginModal';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute component

function App() {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));


  const handleOpenLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const isLoggedIn = !!token;

  return (
    <Router>
      <div className="app-container">
        {/* 타이포그래피 로고 */}
        <header className="app-header d-flex justify-content-between align-items-center">
          <h1 className="logo-text mx-auto">한정판</h1>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn btn-danger">로그아웃</button>
          ) : (
            <button onClick={handleOpenLoginModal} className="btn btn-primary">로그인</button>
          )}
        </header>

        {/* 로그인 모달 */}
        <LoginModal show={showLoginModal} handleClose={handleCloseLoginModal} onLogin={handleLogin} />


        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/add-product" element={<PrivateRoute isLoggedIn={isLoggedIn} handleOpenLoginModal={handleOpenLoginModal} />}>
            <Route index element={<AddProduct />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
