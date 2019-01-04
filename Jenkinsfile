pipeline {
    agent any
//    parameters {
//        string(name: 'Greeting', defaultValue: 'Hello', description: 'How should I greet the world?')
//    }
    environment {
        OUTPUT_PATH = 'dist/' // 如果只是想上传dist目录下编译出来的文件，建议加上正斜杠（/）
        REMOTE_PATH = '~/devops/nginx/www'
        STAGING_SERVER = '192.168.1.112'
        PRODUCTION_SERVER = '192.168.1.111'
    }
    stages {
        stage('build') {
            agent {
                docker {
                    image 'kkarczmarczyk/node-yarn'
                    // Docs https://github.com/jenkinsci/pipeline-model-definition-plugin/wiki/Controlling-your-build-environment
                    reuseNode true
                }
            }

            steps {
                sh 'yarn config set registry http://registry.npm.taobao.org/'
                sh 'yarn install'
                sh 'yarn run build'
            }
        }
        stage('test') {
            steps {
                echo 'No test suite'
            }
        }
        stage('deploy') {
            agent {
                docker {
                    image 'instrumentisto/rsync-ssh'
                    reuseNode true
                }
            }
            steps {
                script {
                    // DOCs http://groovy-lang.org/syntax.html#_maps
                    def NGINX_SERVER = [
                            master: env.STAGING_SERVER,
                            release: env.PRODUCTION_SERVER
                    ]
                    env.NGINX_SERVER = NGINX_SERVER[env.BRANCH_NAME] || env.STAGING_SERVER
                }
                withCredentials([sshUserPrivateKey(credentialsId: 'shinvey-ssh', keyFileVariable: 'SSH_KEY_FILE', passphraseVariable: '', usernameVariable: 'SSH_USERNAME')]) {
                    // ssh通道
                    sh "rsync -av -e 'ssh -i $SSH_KEY_FILE -o StrictHostKeyChecking=no' $OUTPUT_PATH $SSH_USERNAME@$NGINX_SERVER:$REMOTE_PATH"
                }
            }
        }
    }
}
