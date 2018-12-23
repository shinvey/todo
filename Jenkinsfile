pipeline {
    agent { docker { image 'node:6.3' } }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
            }
        }
        stage('test') {
            steps {
                sh 'npm help install'
            }
        }
        stage('deploy') {
            steps {
                sh 'npm config ls'
            }
        }
    }
}
