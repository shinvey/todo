pipeline {
    agent { docker { image 'node:9-alpine' } }
    parameters {
        string(name: 'Greeting', defaultValue: 'Hello', description: 'How should I greet the world?')
    }
    environment {
        WHO = 'world'
    }
    stages {
        stage('example') {
            environment {
                GREET = 'Hello'
            }
            steps {
                echo "${env.GREET} ${env.WHO}!"
                sh 'printenv'
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
