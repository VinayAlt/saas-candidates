pipeline {
  agent any
  environment {
    AWS_REGION = 'ap-south-1'
    ECR_ACCOUNT = '784074784226'
    BACKEND_REPO = "${ECR_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/saas-backend"
    FRONTEND_REPO = "${ECR_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/saas-frontend"
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    KUBE_NAMESPACE = 'saas'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Login to ECR') {
      steps {
        sh '''
          aws ecr get-login-password --region $AWS_REGION | \
          docker login --username AWS --password-stdin $ECR_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com
        '''
      }
    }
    stage('Build & Push Backend') {
      steps {
        sh '''
          docker build -t saas-backend ./backend
          docker tag saas-backend $BACKEND_REPO:${IMAGE_TAG}
          docker push $BACKEND_REPO:${IMAGE_TAG}
        '''
      }
    }
    stage('Build & Push Frontend') {
      steps {
        sh '''
          docker build -t saas-frontend ./frontend
          docker tag saas-frontend $FRONTEND_REPO:${IMAGE_TAG}
          docker push $FRONTEND_REPO:${IMAGE_TAG}
        '''
      }
    }
    stage('Deploy to EKS') {
      steps {
        sh '''
          sed -e "s|IMAGE_BACKEND_PLACEHOLDER|$BACKEND_REPO:${IMAGE_TAG}|g" \
              -e "s|IMAGE_FRONTEND_PLACEHOLDER|$FRONTEND_REPO:${IMAGE_TAG}|g" \
              k8s/backend-deploy.yaml > /tmp/backend.yaml

          sed -e "s|IMAGE_FRONTEND_PLACEHOLDER|$FRONTEND_REPO:${IMAGE_TAG}|g" \
              k8s/frontend-deploy.yaml > /tmp/frontend.yaml

          kubectl apply -f k8s/namespace.yaml
          kubectl apply -f k8s/secrets.yaml -n $KUBE_NAMESPACE
          kubectl apply -f k8s/configmap.yaml -n $KUBE_NAMESPACE
          kubectl apply -f /tmp/backend.yaml -n $KUBE_NAMESPACE
          kubectl apply -f /tmp/frontend.yaml -n $KUBE_NAMESPACE
          kubectl apply -f k8s/ingress.yaml -n $KUBE_NAMESPACE
        '''
      }
    }
  }
}
