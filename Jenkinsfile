pipeline {
    agent { docker { image 'node:9-alpine' } }
    parameters {
        string(name: 'Greeting', defaultValue: 'Hello', description: 'How should I greet the world?')
    }
    environment {
        who = 'world'

        SFTP_CACHE_SERVER = credentials('sftp_cache_server')
        SFTP_CACHE_PORT = credentials('sftp_cache_port')
        SFTP_CACHE_PATH = credentials('sftp_cache_path')
        SFTP_CACHE_USERNAME = credentials('sftp_cache_username')
        SFTP_CACHE_PASSWORD = credentials('sftp_cache_password')
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
//        stage('restore_cache') {
//            environment {
//                PLUGIN_RESTORE = 'true'
//                PLUGIN_MOUNT = '[node_modules, yarn.lock]'
//                // PLUGIN_REBUILD =
//            }
//            agent {
//                docker {
//                    image 'appleboy/drone-sftp-cache'
//                    args '-e '
//                }
//            }
//        }
//        stage('build') {
//            steps {
//                sh 'npm --version'
//            }
//        }
//        stage('test') {
//            steps {
//                sh 'npm --version'
//            }
//        }
//        stage('deploy') {
//            steps {
//                sh 'npm --version'
//            }
//        }
    }
}
