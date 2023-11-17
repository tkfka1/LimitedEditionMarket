#!/bin/bash

# chmod +x pkill-apps.sh

# 프론트엔드 애플리케이션 종료
pkill -f 'yarn start'

# 백엔드 애플리케이션 종료
pkill -f 'go run main.go'

echo "애플리케이션들이 종료되었습니다."
