pipeline {
    agent any

    environment {
        WEB = credentials('WEB_LOGIN')
        EMAIL = "${WEB_USR}"
        PASSWORD = "${WEB_PSW}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Playwright in Docker') {
            steps {
                script {
                    docker.image('mcr.microsoft.com/playwright:v1.58.2-noble')
                        .inside('--ipc=host') {

                        sh 'npm ci'
                        sh 'npx playwright test'
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}