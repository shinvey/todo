pipeline {
    agent { docker { image 'node:9-alpine' } }
    environment {
        WHO = 'world'
    }
    stages {
        stage('example') {
            environment {
                GREET = 'Hello'
            }
            steps {
                echo '${env.GREET} ${en.WHO}!'
            }
        }
        stage('build') {
            steps {
                sh 'npm --version'
            }
        }
        stage('test') {
            steps {
                sh 'npm --version'
            }
        }
        stage('deploy') {
            steps {
                sh 'npm --version'
            }
        }
    }
}
