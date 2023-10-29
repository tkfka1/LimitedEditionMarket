import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import LoginModal from './components/LoginModal';


function App() {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 로컬 스토리지에서 사용자 정보를 안전하게 가져오기
  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  }

  const [userInfo, setUserInfo] = useState(getUserFromLocalStorage());

  const handleOpenLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleLogin = (newToken, user) => {
    setToken(newToken);
    setUserInfo(user);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken(null);
    setUserInfo(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isLoggedIn = !!token;

  return (
    <Router>
      <div className="app-container">
        <header className="app-header d-flex justify-content-between align-items-center">
          <h1 className="logo-text mx-auto">
            <Link to="/" onClick={() => window.location.reload()} className="no-decoration">
              한정판
            </Link>
          </h1>
          {isLoggedIn ? (
            <div>
              <span className="user-info mr-3">
                환영합니다 <strong>{userInfo?.username || userInfo?.email}</strong> 님
              </span>
              <button onClick={handleLogout} className="btn btn-danger">로그아웃</button>
            </div>
          ) : (
            <button onClick={handleOpenLoginModal} className="btn btn-primary">로그인</button>
          )}
        </header>

        <LoginModal show={showLoginModal} handleClose={handleCloseLoginModal} onLogin={handleLogin} />

        <Routes>
          <Route path="/" element={<ProductList token={token} userInfo={userInfo} />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
