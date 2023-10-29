# AWS S3 버킷 및 IAM 사용자를 위한 테라폼 구성

이 저장소에는 Amazon S3 버킷, IAM(Identity and Access Management) 사용자, 및 IAM 사용자에게 S3에 대한 전체 액세스 권한을 부여하는 정책을 프로비저닝하는 테라폼 구성 파일이 포함되어 있습니다. 아래는 테라폼 파일의 각 섹션에 대한 설명입니다.

## 프로바이더 구성

```hcl
provider "aws" {
  region = "us-east-1"  # 또는 리전을 선택하세요
}
```
프로바이더 블록은 명명된 프로바이더, 이 경우 `aws`를 구성합니다. `region` 필드는 리소스를 생성하려는 AWS 리전을 지정하는 곳입니다.

## S3 버킷 구성

```hcl
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-bucket-name"
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}
```
이 블록은 지정된 이름(`my-bucket-name`)으로 S3 버킷을 생성합니다. `acl` 필드는 누구나 버킷 내용을 읽을 수 있도록 `public-read`로 설정됩니다. `website` 블록은 버킷이 웹사이트로 구성될 때 인덱스 문서와 오류 문서를 지정합니다.

## IAM 사용자 구성

```hcl
resource "aws_iam_user" "my_user" {
  name = "my-user-name"
}
```
이 블록은 지정된 이름(`my-user-name`)으로 IAM 사용자를 생성합니다.

## IAM 사용자 정책 구성

```hcl
resource "aws_iam_user_policy" "s3_full_access" {
  name = "S3FullAccessPolicy"
  user = aws_iam_user.my_user.name

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "*"
    }
  ]
}
EOF
}
```
이 블록은 이전 블록에서 생성한 IAM 사용자에게 정책을 연결합니다. 정책은 IAM 사용자에게 모든 S3 리소스(`Resource: "*"`)에 대한 전체 액세스(`s3:*`) 권한을 부여합니다.

## 구성 적용

1. 테라폼이 설치되어 있는지 확인하세요.
2. 구성 파일이 포함된 디렉토리에서 테라폼을 초기화합니다:
   ```
   terraform init
   ```
3. 구성을 적용합니다:
   ```
   terraform apply
   ```

위 단계를 실행하면 테라폼은 구성 파일에 따라 지정된 AWS 리소스를 생성합니다.