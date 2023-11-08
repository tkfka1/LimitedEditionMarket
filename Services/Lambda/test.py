import boto3

def lambda_handler(event, context):
    # AWS ECS 클라이언트 생성
    ecs_client = boto3.client('ecs')

    # ECS 서비스 이름과 클러스터 이름 설정
    service_name = 'my-ecs-service'
    cluster_name = 'my-ecs-cluster'
    desired_count = 5  # 조정하고자 하는 원하는 작업 수

    try:
        # ECS 서비스 업데이트
        response = ecs_client.update_service(
            cluster=cluster_name,
            service=service_name,
            desiredCount=desired_count
        )
        
        # 성공적으로 업데이트 되었는지 확인
        print(f"Service {service_name} updated to desired count {desired_count}")
        return response
    except Exception as e:
        print(e)
        raise e
