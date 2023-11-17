#!/bin/bash

#chmod +x start-apps.sh


# 프론트엔드 애플리케이션 시작
cd front/limited-edition-market
yarn start &
echo $! > ../frontend.pid
cd -

# 백엔드 애플리케이션 시작
cd back/myauthapp
go run main.go &
echo $! > ../backend.pid
cd -

echo "애플리케이션들이 시작되었습니다."
