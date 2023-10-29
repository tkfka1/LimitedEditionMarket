provider "aws" {
  region = "us-east-1"  # or your preferred region
}

resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-bucket-name"
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "aws_iam_user" "my_user" {
  name = "my-user-name"
}

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