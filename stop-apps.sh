#!/bin/bash

# chmod +x stop-apps.sh

# 프론트엔드 애플리케이션 종료
if [ -f frontend.pid ]; then
    kill $(cat frontend.pid)
    rm frontend.pid
fi

# 백엔드 애플리케이션 종료
if [ -f backend.pid ]; then
    kill $(cat backend.pid)
    rm backend.pid
fi

echo "애플리케이션들이 종료되었습니다."
