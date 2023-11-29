# LimitedEditionMarket
# 한정판 웹사이트 프로젝트

한정판 제품의 등록 및 구매를 위한 웹 플랫폼입니다.
사용자가 제품을 등록할 때 예상 인원 규모를 설정하고, 이에 따라 서버 용량을 자동으로 조절하여 트래픽 증가에 대비합니다.
CI/CD 파이프라인을 통해 개발 및 배포 과정을 자동화하고, 종합적인 모니터링 솔루션을 통해 시스템 성능을 실시간으로 모니터링합니다.

기본적인 기능 구현 이외에는 CICD, Monitoring, infra 자동화 작업에 초점을 두었습니다.

## 기술 스택

Frontend: React.js를 사용하여 사용자 친화적인 인터페이스를 구현하고 AWS S3를 통해 정적 웹 사이트를 배포합니다.

Backend: Go 언어 기반의 Echo 프레임워크를 사용하여 RESTful API를 개발하고 AWS ECS-Fargate를 통해 서버리스 환경에서 실행합니다.

Database: Amazon RDS에 호스팅된 MySQL을 사용하여 데이터를 안전하고 신뢰성 있게 관리합니다.

Infrastructure: AWS S3, AWS ECS-Fargate, AWS ECR을 통해 프론트엔드 및 백엔드 서비스를 운영합니다.

CI/CD: GitHub Actions와 AWS CodePipeline(CodeDeploy)를 통합하여 코드 변경 사항을 자동으로 감지하고 배포합니다.

Monitoring: Prometheus와 Loki(Promtail)를 통해 메트릭 및 로그를 수집하고, Grafana 및 AWS CloudWatch로 시스템을 모니터링합니다.

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

### DevOps

- 자동 스케일링: 등록된 인원 규모에 맞춰 AWS SDK를 이용하여 필요 시 ECS 서비스의 용량을 자동으로 조정합니다.
- CI/CD 파이프라인: GitHub Actions를 사용하여 프론트엔드 변경 사항을 S3에 자동으로 배포하고, 백엔드 코드 변경 시 AWS ECR에 이미지를 자동으로 빌드 및 푸시합니다.
- 모니터링: ECS와 연결된 프라이빗 서브넷에서 실행되는 EC2 인스턴스에 Grafana를 설치하여 시스템 모니터링을 구축합니다.
- 보안: AWS의 보안 기능과 통합하여 플랫폼의 모든 데이터를 안전하게 보호합니다.

## 프로젝트 구조

![한정판아키텍쳐](https://github.com/tkfka1/LimitedEditionMarket/assets/36651040/e7ab8715-eba0-495a-8cc3-44c9825202ae)

### 개발 환경

- **프론트엔드**: React.js, react-router-dom, react-bootstrap
- **백엔드**: go (echo) (Swagger를 이용한 API 문서화)
- **DB**: MySQL 5.7

### 프론트엔드

React.js를 이용한 SPA(Single Page Application) 형태로 구성되어 있으며, 주요 컴포넌트로는 `ProductList`, `ProductDetail`, `LoginModal`, `AddProductModal` 등이 있습니다.

### 백엔드 API

RESTful API 스펙을 기반으로 한 백엔드 서비스로, 사용자 인증과 제품 관리 관련 엔드포인트를 제공하고 있습니다. 

Swagger 문서를 참고하여 API의 상세 사양을 확인할 수 있습니다.




### 프로젝트 특징
- 통합 모니터링: Grafana와 Prometheus를 통해 시스템 및 애플리케이션의 실시간 모니터링이 가능합니다.
- 로그 관리: Loki와 Promtail을 활용하여 로그를 중앙 집중적으로 수집 및 조회합니다.
- 자동 배포: AWS CodeDeploy Github Action을 이용해 최신 변경사항을 자동으로 배포합니다.
- 확장성: Terraform 코드를 기반으로 하기 때문에, 클라우드 인프라의 수정 및 확장이 용이합니다.
<!-- 보안: 각 서비스의 네트워크 구성 및 보안 그룹 설정을 Terraform을 통해 세밀하게 관리합니다. -->
- AWS CodeDeploy 액션 사용:
CodeDeploy 애플리케이션 및 배포 그룹을 생성합니다.
GitHub 리포지토리와 연결하여 자동 배포 트리거를 설정합니다.
변경 사항이 push되면, AWS CodeDeploy 을 통해 자동 배포가 시작됩니다.



## 개발 과정

1. React를 사용하여 프론트엔드를 구현하고, S3 정적 배포한다.
2. Echo 프레임워크를 사용하여 RestAPI를 사용하여 백엔드 API를 구축하고, DB와 연결
3. Github Action 을 이용하여 repo변경 시 프론트 S3 에 자동배포, 백엔드 ECR에 이미지 생성
4. ECR 에 이미지 Push 시에 CodeDeploy 애플리케이션 및 배포 그룹을 생성ECS Fargate 서비스를 업데이트하는 Pipeline 구축
5. 필요할 때 ECS 서비스의 원하는 용량을 조정하는 AWS SDK 명령 만들기 (Lambda - echo)
6. ECS 와 같은 프라이빗 서브넷에 EC2 인스턴스 생성 후 Grafana 설치 후 모니터링 구축 

### [프론트 배포 자동화](https://trinityforce.tistory.com/entry/React-github-action-%EC%9D%B4%EC%9A%A9-S3-%EC%A0%95%EC%A0%81-%EB%B0%B0%ED%8F%AC-CICD-%EA%B5%AC%EC%B6%95)
https://trinityforce.tistory.com/entry/React-github-action-%EC%9D%B4%EC%9A%A9-S3-%EC%A0%95%EC%A0%81-%EB%B0%B0%ED%8F%AC-CICD-%EA%B5%AC%EC%B6%95
### [백엔드 배포 자동화](https://trinityforce.tistory.com/entry/github-action-Dockerizing-AWS-ECR-push-CICD-feat-go-echo-framework)
https://trinityforce.tistory.com/entry/github-action-Dockerizing-AWS-ECR-push-CICD-feat-go-echo-framework
### [모니터링](https://trinityforce.tistory.com/entry/PLG-Promtail-Loki-Grafana-Stack-%EA%B0%84%EB%8B%A8-%EC%8B%A4%ED%97%98%EC%9A%A9-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0)
https://trinityforce.tistory.com/entry/PLG-Promtail-Loki-Grafana-Stack-%EA%B0%84%EB%8B%A8-%EC%8B%A4%ED%97%98%EC%9A%A9-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0

## 환경 설정
### Secrets

![스크린샷 2023-11-08 오후 4 59 12](https://github.com/tkfka1/LimitedEditionMarket/assets/36651040/a4d02817-1f6f-478b-ad69-8c77420cb506)





AWS CLI
Terraform
