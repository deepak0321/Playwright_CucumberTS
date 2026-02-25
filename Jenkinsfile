pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.58.2-noble'
        }
    }

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

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh '''
                  export EMAIL=$EMAIL
                  export PASSWORD=$PASSWORD
                  npx playwright test
                '''
            }
        }
    }
}