pipeline {
    agent any
    // parameters {
    //     string(name: 'Greeting', defaultValue: 'Hello', description: 'How should I greet the world?')
    // }
    environment {
        OUTPUT_PATH = 'dist/' // 如果只是想上传dist目录下编译出来的文件，建议加上正斜杠（/）
        STAGING_SERVER = '192.168.1.111'
        PRODUCTION_SERVER = '192.168.1.111'

        // Global Tool Configuration > SonarQube Scanner 中配置一个scanner并命名为SonarQube3.3，勾选自动安装
        // pipeline tool指令会引用命名为SonarQube3.3的scanner，并自动安装已设置的版本
        // 前端代码扫描工具SonarJS文档 @see https://github.com/SonarSource/SonarJS
        // SONAR_SCANNER_HOME = tool 'SonarQube3.3'
        // NODEJS_HOME = tool 'NodeJS10'
    }
    // tools {
        // 通过Snippet Generator > steps > Sample Step > tool 或tool type字段 @see https://jenkins.shinvey.com/pipeline-syntax/
        // tool name 是从Global Tool Configuration中工具配置好后使用的name名称 @see https://jenkins.shinvey.com/configureTools/
        // 语法格式为 <tool type> <tool name>
        // jdk 'JDK9'
        // "hudson.plugins.sonar.SonarRunnerInstallation" "SonarQube3.3"
        // hudson.plugins.sonar.SonarRunnerInstallation "SonarQube3.3"
        // nodejs "NodeJS10" // https://medium.com/@gustavo.guss/jenkins-starting-with-pipeline-doing-a-node-js-test-72c6057b67d4
    // }
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
        // stage('Install tools') {
        //     steps {
        //     }
        // }
        stage('SonarQube analysis') {
            steps {
                // script {
                //     env.PATH="${env.NODEJS_HOME}/bin:${env.SONAR_SCANNER_HOME}/bin:${env.PATH}"
                // }
                // sh "yarn --version"

                // Jenkins NodeJS Plugin @see https://wiki.jenkins.io/display/JENKINS/NodeJS+Plugin
                nodejs('NodeJS10') {
                    // 配置全局SonarQube Server
                    // Configure System > SonarQube servers > add SonarQube
                    // 配置好后，使用withSonarQubeEnv会自动注入服务器url和登录信息
                    // 单独项目使用场景，可以采用命令行参数、sonar-project.properties配置文件等
                    // sonar scanner 参数说明 @see https://docs.sonarqube.org/latest/analysis/analysis-parameters/
                    withSonarQubeEnv('SonarQube') {
                        // 使用jenkins Global Tool Configuration 中配置好的工具
                        // sonar-project.properties 文件中配置好所需参数
                        // sh "${SONAR_SCANNER_HOME}/bin/sonar-scanner"

                        // 使用npm包 @see https://github.com/bellingard/sonar-scanner-npm
                        // 全局安装npm包sonarqube-scanner
                        // 从package.json读取部分参数实现逻辑 @see https://github.com/bellingard/sonar-scanner-npm/blob/master/dist/sonarqube-scanner-params.js
                        sh "sonar-scanner -Dsonar.sources=src"
                    }
                }
                // nodejs(nodeJSInstallationName: 'NodeJS11') {
                // }
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
                    // 删除60天前的老文件 https://unix.stackexchange.com/questions/194863/delete-files-older-than-x-days
                    // sh "find /path/to/directory/ -mindepth 1 -mtime +60 -delete"
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
