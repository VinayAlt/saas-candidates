pipeline {
    agent any
    environment {
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "784074784226"
        ECR_FRONTEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/saas-frontend"
        ECR_BACKEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/saas-backend"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/VinayAlt/saas-candidates.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    dir('backend') {
                        sh '''
                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        docker build -t saas-backend:latest .
                        docker tag saas-backend:latest $ECR_BACKEND:latest
                        docker push $ECR_BACKEND:latest
                        '''
                    }
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    dir('frontend') {
                        sh '''
                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        docker build -t saas-frontend:latest .
                        docker tag saas-frontend:latest $ECR_FRONTEND:latest
                        docker push $ECR_FRONTEND:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                script {
                    sh '''
                    kubectl apply -f k8s/namespace.yaml || true
                    kubectl apply -f k8s/configmap.yaml || true
                    kubectl apply -f k8s/secretproviderclass-saas-rds.yaml
                    kubectl apply -f k8s/backend-deploy.yaml
                    kubectl apply -f k8s/frontend-deploy.yaml
                    kubectl apply -f k8s/backend-service.yaml
                    '''
                }
            }
        }
    }
}
