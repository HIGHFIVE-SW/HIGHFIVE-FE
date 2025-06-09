#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 환경 변수 설정 (필요에 따라 수정)
REGISTRY_URL="your-registry.com"  # 실제 레지스트리 URL로 변경
IMAGE_NAME="trendist-frontend"
TAG="latest"

echo -e "${YELLOW}🚀 TRENDIST 프론트엔드 배포를 시작합니다...${NC}"

# 1. 애플리케이션 빌드
echo -e "${YELLOW}📦 애플리케이션을 빌드 중...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 빌드에 실패했습니다.${NC}"
    exit 1
fi

# 2. Docker 이미지 빌드
echo -e "${YELLOW}🐳 Docker 이미지를 빌드 중...${NC}"
docker build -t ${REGISTRY_URL}/${IMAGE_NAME}:${TAG} .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker 이미지 빌드에 실패했습니다.${NC}"
    exit 1
fi

# 3. Docker 이미지 푸시
echo -e "${YELLOW}📤 Docker 이미지를 레지스트리에 푸시 중...${NC}"
docker push ${REGISTRY_URL}/${IMAGE_NAME}:${TAG}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker 이미지 푸시에 실패했습니다.${NC}"
    exit 1
fi

# 4. Kubernetes에 배포
echo -e "${YELLOW}☸️  Kubernetes에 배포 중...${NC}"
kubectl apply -f k8s/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Kubernetes 배포에 실패했습니다.${NC}"
    exit 1
fi

# 5. 배포 상태 확인
echo -e "${YELLOW}⏳ 배포 상태를 확인 중...${NC}"
kubectl rollout status deployment/trendist-frontend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 배포가 성공적으로 완료되었습니다!${NC}"
    echo -e "${GREEN}🌐 서비스 정보:${NC}"
    kubectl get pods -l app=trendist-frontend
    kubectl get svc trendist-frontend-service
else
    echo -e "${RED}❌ 배포 확인에 실패했습니다.${NC}"
    exit 1
fi 