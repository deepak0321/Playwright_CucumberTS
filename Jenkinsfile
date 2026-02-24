pipeline {
   agent { dockerContainer { image 'mcr.microsoft.com/playwright:v1.58.2-noble' } }
    environment {
      WEB = credentials('WEB_LOGIN')
      EMAIL = "${WEB_USR}"
      PASSWORD = "${WEB_PSW}"
   }
   stages {
      stage('playwright-tests') {
         steps {
            sh 'npm ci'
            sh 'npx playwright test'
         }
      }
   }
}