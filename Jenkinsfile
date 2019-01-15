pipeline {
    agent any
//    parameters {
//        string(name: 'Greeting', defaultValue: 'Hello', description: 'How should I greet the world?')
//    }
    environment {
        OUTPUT_PATH = 'dist/' // 如果只是想上传dist目录下编译出来的文件，建议加上正斜杠（/）
        STAGING_SERVER = '192.168.1.111'
        PRODUCTION_SERVER = '192.168.1.111'

        SONAR_SCANNER_HOME = tool 'SonarQube'
    }
    // 向jenkins管理员请求使用gitlab plugin来与gitlab集成
    // 并获得GitLab connection name和对应连接gitlab所使用的gitlab user name(无需密码)
    // 与gitlab集成，Jenkin的gitlab插件 https://github.com/jenkinsci/gitlab-plugin
    options { gitLabConnection('Gitlab') }
    triggers {
        // 请管理员确保至少配置了一个Gitlab Connection，本次测试在gitlab中创建了jenkins用户，作为此次默认连接
        // jenkins连接gitlab授权配置参见 https://github.com/jenkinsci/gitlab-plugin#jenkins-to-gitlab-authentication
        gitlab(
                triggerOnPush: true,
                triggerOnMergeRequest: true,
                branchFilterType: 'All',
                // 请在Gitlab某个repo配置好web hook, 并使用此处定义的secret token， 参见 https://github.com/jenkinsci/gitlab-plugin#job-trigger-configuration
                // 然后将管理员创建专用于jenkins连接gitlab的账户（比如本次测试我在gitlab中创建了jenkins用户）添加到gitlab repo的members中，权限为Developer
                secretToken: "abcdefghijklmnopqrstuvwxyz0123456789ABCDEF" // secret token 可以自定义，并在配置gitlab里project设置web hook时使用
        )
    }

    stages {
        stage('SonarQube analysis') {
            steps {
//                script {
//                    // requires SonarQube Scanner 2.8+
//                    def SONAR_SCANNER_HOME = tool 'SonarQube'
//                }
                withSonarQubeEnv('SonarQube') {
                    sh "${SONAR_SCANNER_HOME}/bin/sonar-scanner"
                }
            }
        }
        stage('build') {
            agent {
                docker {
                    image 'kkarczmarczyk/node-yarn'
                    // Docs https://github.com/jenkinsci/pipeline-model-definition-plugin/wiki/Controlling-your-build-environment
                    reuseNode true
                }
            }

            steps {
                // updateGitlabCommitStatus use cases https://docs.gitlab.com/ce/api/pipelines.html
                updateGitlabCommitStatus name: 'build', state: 'running'

                sh 'yarn config set registry http://registry.npm.taobao.org/'
                sh 'yarn install'
                sh 'yarn run build'
            }
        }
        stage('test') {
            steps {
                updateGitlabCommitStatus name: 'test', state: 'running'

                echo 'No test suite'

                updateGitlabCommitStatus name: 'test', state: 'success'
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
                updateGitlabCommitStatus name: 'deliver', state: 'running'

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

                updateGitlabCommitStatus name: 'deliver', state: 'success'
            }
        }
    }

    post {
        aborted {
            updateGitlabCommitStatus name: 'build', state: 'canceled'
        }
        failure {
            updateGitlabCommitStatus name: 'build', state: 'failed'
        }
        success {
            updateGitlabCommitStatus name: 'build', state: 'success'
        }
    }
}
