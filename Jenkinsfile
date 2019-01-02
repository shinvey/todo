pipeline {
//    agent { docker { image 'node:9-alpine' } }
    agent none
//    parameters {
//        string(name: 'Greeting', defaultValue: 'Hello', description: 'How should I greet the world?')
//    }
    environment {
        who = 'world'

        SFTP_CACHE_SERVER = credentials('sftp_cache_server')
        SFTP_CACHE_PORT = credentials('sftp_cache_port')
        SFTP_CACHE_PATH = credentials('sftp_cache_path')
        SFTP_CACHE_USERNAME = credentials('sftp_cache_username')
        SFTP_CACHE_PASSWORD = credentials('sftp_cache_password')
    }
    stages {
//        stage('example') {
//            environment {
//                GREET = 'Hello'
//            }
//            steps {
//                echo "${env.GREET} ${env.WHO}! The server is ${env.SFTP_CACHE_SERVER}"
//                sh 'printenv'
//            }
//        }
        stage('restore_cache') {
            environment {
                PLUGIN_RESTORE = 'true'
                PLUGIN_MOUNT = '[node_modules, yarn.lock]'
                // PLUGIN_REBUILD =
            }
            agent {
                docker {
                    image 'appleboy/drone-sftp-cache'
                    args "-e SFTP_CACHE_SERVER=${env.SFTP_CACHE_SERVER} " +
                            "-e SFTP_CACHE_PORT=${env.SFTP_CACHE_PORT} " +
                            "-e SFTP_CACHE_PATH=${env.SFTP_CACHE_PATH} " +
                            "-e SFTP_CACHE_USERNAME=${env.SFTP_CACHE_USERNAME} " +
                            "-e SFTP_CACHE_PASSWORD=${env.SFTP_CACHE_PASSWORD} " +
                            "-e PLUGIN_RESTORE=${env.PLUGIN_RESTORE} " +
                            "-e PLUGIN_MOUNT=${env.PLUGIN_MOUNT} "
                }
            }
            steps {
                sh 'printenv'
            }
        }
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
