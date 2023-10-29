# LimitedEditionMarket
# 한정판 웹사이트 프로젝트

이 프로젝트는 한정판 제품을 구매할 수 있는 웹 사이트를 구현합니다.

기본적인 기능 구현 이외에는 CICD, Monitoring, infra 자동화 작업에 초점을 두었습니다.

## 기능

### 사용자 인증

- 로그인
- 회원가입
- 사용자 프로필 조회

### 제품 관리

- 제품 추가
- 전체 제품 조회
- 제품 상세 조회
- 제품 삭제

## 프로젝트 구조

### 프론트엔드

React.js를 이용한 SPA(Single Page Application) 형태로 구성되어 있으며, 주요 컴포넌트로는 `ProductList`, `ProductDetail`, `LoginModal`, `AddProductModal` 등이 있습니다.

### 백엔드 API

RESTful API 스펙을 기반으로 한 백엔드 서비스로, 사용자 인증과 제품 관리 관련 엔드포인트를 제공하고 있습니다. 

Swagger 문서를 참고하여 API의 상세 사양을 확인할 수 있습니다.

## 개발 환경

- **프론트엔드**: React.js, react-router-dom, react-bootstrap
- **백엔드**: go (echo) (Swagger를 이용한 API 문서화)

## 로컬에서 실행하기

1. 저장소를 클론합니다.

```bash
git clone [GitHub Repo URL]
```

2. 프로젝트 폴더로 이동합니다.

```bash
cd [Project Folder]
```

3. 필요한 패키지를 설치합니다.

```bash
yarn install
```

4. 프로젝트를 실행합니다.

```bash
yarn start
```