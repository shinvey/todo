pipeline {
    agent any
//    parameters {
//        string(name: 'Greeting', defaultValue: 'Hello', description: 'How should I greet the world?')
//    }
    environment {
        OUTPUT_PATH = 'dist/' // 如果只是想上传dist目录下编译出来的文件，建议加上正斜杠（/）
        STAGING_SERVER = '192.168.1.111'
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
                sh 'printenv'
                // 确定即将部署环境配置，ip，remote path
                script {
                    // @see http://groovy-lang.org/syntax.html#_maps
                    def NGINX_SERVER = [
                            master: [
                                    ip: env.PRODUCTION_SERVER,
                                    remote_path: '~/devops/nginx/www'
                            ],
                            release: [
                                    ip: env.STAGING_SERVER,
                                    remote_path: '~/devops/nginx/stg_www'
                            ]
                    ]
                    // @see http://mrhaki.blogspot.com/2009/09/groovy-goodness-matchers-for-regular.html
                    def matches = env.BRANCH_NAME =~ /^(\w+).*/
                    def BRANCH_NAME = matches ? matches[0][1] : 'Unknown'
                    if (NGINX_SERVER.containsKey(BRANCH_NAME)) {
                        def SERVER = NGINX_SERVER[BRANCH_NAME]
                        env.NGINX_SERVER = SERVER.ip
                        env.REMOTE_PATH = SERVER.remote_path
                    } else {
                        throw new Exception('Unknown branch name, can not decide where to deploy!')
                    }
                }
                withCredentials([sshUserPrivateKey(credentialsId: 'shinvey-ssh', keyFileVariable: 'SSH_KEY_FILE', passphraseVariable: '', usernameVariable: 'SSH_USERNAME')]) {
                    // ssh通道
                    sh "rsync -av -e 'ssh -i $SSH_KEY_FILE -o StrictHostKeyChecking=no' $OUTPUT_PATH $SSH_USERNAME@$NGINX_SERVER:$REMOTE_PATH"
                }
            }
        }
    }
}
