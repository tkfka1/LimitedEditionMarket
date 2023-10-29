import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function LoginModal({ show, handleClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    };

    let endpoint = isLogin ? '/auth/login' : '/auth/signup';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, requestOptions);
      const data = await response.json();

      if (response.status === 200 && isLogin) {
        onLogin(data.token, data.user); // data.user 를 추가로 전달합니다.
        handleClose();
      } else {
        setErrorMessage(data.message || '요청 실패');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('서버 에러');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isLogin ? '로그인' : '회원가입'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>아이디:</Form.Label>
            <Form.Control 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          { !isLogin && (
            <Form.Group>
              <Form.Label>이메일:</Form.Label>
              <Form.Control 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <Form.Group>
            <Form.Label>비밀번호:</Form.Label>
            <Form.Control 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="btn btn-primary w-100 mb-2">
            {isLogin ? '로그인' : '회원가입'}
          </Button>
          {isLogin ? (
            <Button variant="link" onClick={() => setIsLogin(false)}>계정이 없으신가요? 회원가입</Button>
          ) : (
            <Button variant="link" onClick={() => setIsLogin(true)}>이미 계정이 있으신가요? 로그인</Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
}

LoginModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired
};

export default LoginModal;
