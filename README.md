(the page is under development)


# ELK (Elastic search, Logstash, Kibana) for monotoring of logs of a Node.js Application


In this demo we create a logs' monitoring solution based on ELK stack for a sample NodeJS app used in a series of previous projects.

The Node.js application is based on two microservices: the frontend interface performing CRUD operations on the backend (MySQL database) and rendering the results.

<details markdown=1><summary markdown="span">Details of the Coffee suppliers sample app</summary>

# Coffee suppliers sample app

## Summary
This is a simple CRUD app built with Express.

## Running locally

### 1. Build the local Db
```sql
create DATABASE COFFEE;
use coffee;
create table suppliers(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  PRIMARY KEY ( id )
);
```

### 2. Install and run the server
```zsh
npm install

# define your db vars at start
APP_DB_HOST=localhost \
APP_DB_USER=root \
APP_DB_PASSWORD="" \
APP_DB_NAME=COFFEE \
npm start
```
If you do not set the env vars when starting the app the values 
from `app/config/config.js` will be used

### 3. The app files' structure:

<img width="718" alt="Screenshot 2023-07-10 at 22 07 30" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/a637f395-fc50-4a20-a9b8-a9f93498cce7">

</details>

<br>

## Technologies used

- ELK stack (Elastic Search + Logstash + Kibana)
- NodeJS
- MySQL
- Docker
- Docker-compose
- NodeJS
- bunyan (a logging library for Node.js that provides structured and extensible logging capabilities)
- AWS Cloud
- AWS EC2 (Linux Ubuntu 22.04)

<br>

## Prerequisites

To launch this Jenkins pipeline, you need the following prerequisites:

- Linux workstation with Node.js, Git and Docker installed (I'm using Ubuntu 22.04)
- Valid GitHub account
- Valid DockerHub account (create a repository called "jenkins_nodejs_app_demo")
- Jenkins server with a public IP
- Kubernetes cluster (I'm using AWS EKS)

<br>

## Architecture

<img width="1000" alt="Screenshot 2023-08-06 at 22 26 34" src="https://github.com/otammato/ELK2/assets/104728608/df9b12dd-3c35-4259-9e52-aad3b621c89c">

<br><br>

The architecture entails several items:

1. **An AWS EC2 instance**: With installed Docker, Git, Node, npm.

2. **A NodeJS app**: Performs simple CRUD operations on the database(MySQL). Entails "bunyan" library for logging.

3. **A Docker-compose file**: Launches containers:
   - Elastic Search
   - Logstash
   - Kibana

<br>



<br>
<br>

## Final result

1. Based on the output of the Jenkins deployment as well as ```kubectl get all``` command, Kubernetes deployment and services are running successfully. The ```my-deployment``` deployment has two pods, and both pods are running without any restarts. <br><br> Additionally, there are two services: mysql-service and node-app-service. The mysql-service is a ClusterIP service with the IP 10.100.66.111 and exposes port 3306 for MySQL. The node-app-service is a LoadBalancer service with an external IP (af8f35f31190b44878e991cf07db6ec9-63904463.us-east-1.elb.amazonaws.com) and forwards traffic from port 80 to my Node.js application.

<img width="1000" alt="Screenshot 2023-07-04 at 19 31 56" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/cf47a74d-ac54-4b68-bc82-d9888d81b31e">

<br>
<br>

2. The app is built on two microservices (a node.js and a MySQL database) and deployed to the Kubernetes cluster is available under the load-balancer DNS name:

<br>

<img width="1000" alt="Screenshot 2023-07-04 at 19 28 25" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/df3db4ce-5a88-40c6-a6d9-cf482b5cb4ff">

<br>
<br>


<img width="1000" alt="Screenshot 2023-07-04 at 19 36 16" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/77eaf4fc-8922-46c7-9410-1d12520729d8">

<br>
<br>

<img width="1000" alt="Screenshot 2023-07-04 at 19 21 15" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/27f7291a-f796-44e1-b69b-6628a9102b7c">

<br>
<br>

3. The Docker images are built and pushed to the DockerHub

<img width="1000" alt="Screenshot 2023-07-23 at 20 15 10" src="https://github.com/otammato/4_Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/af8dd75e-ff7c-4c78-9cf5-ea9e6774ea7c">


## Test stages description

Test stages involve the following test cases:

1. Test the NodeJS app:
<br><br>
Mocha test script for testing the application running on port 3000. It uses the Chai assertion library and the Chai HTTP plugin for making HTTP requests and asserting the response.
<br><br>
This test case ensures that when an HTTP GET request is made to 'http://localhost:3000/', the response has a status code of 200 and there are no errors. If any of the assertions fail, the test case will be marked as failed.

```js
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

describe('App', function() {
  it('should be running on port 3000', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
    });
  });
});
```

2. Test MySQL database to send a request from within the NodeJS app

```js
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

describe('App', function() {
  it('should return all entries in the database as JSON', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/entries')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
   });

  it('should return the response is an array', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/entries')
      .end(function(err, res) {
        expect(res.body).to.be.an('array'); // Ensure the response is an array
        done();
      });
   });

   it('ensure the response array is not empty', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/entries')
      .end(function(err, res) {
        expect(res.body.length).to.be.greaterThan(0); // Ensure the response array is not empty
        done();
      });
   });

   it('returned object contains the necessary properties: "id" (and it is the number)', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/entries')
      .end(function(err, res) {
        const supplier = res.body[0]; // Assuming the response contains an array of supplier objects
        expect(supplier).to.have.property('id');
        expect(supplier.id).to.be.a('number');
        done();
      });
   });
});
```

Mocha test cases for testing an API that returns id's of entries from a database. The tests as well use Chai assertions and the Chai HTTP plugin for making HTTP requests and asserting the response.

These test cases verify various aspects of the API's response, including the status code, response format, array structure, non-empty response, and the presence and data types of specific properties in the response objects.

- The first test case is named 'should return all entries in the database as JSON'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response has a status code of 200 and is in JSON format.

- The second test case is named 'should return the response is an array'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response body is an array.

- The third test case is named 'ensure the response array is not empty'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response array has a length greater than 0.

- The fourth test case is named 'returned object contains the necessary properties: "id" (and it is the number)'. It sends an HTTP GET request to 'http://localhost:3000/entries', assumes the response contains an array of objects, and asserts that the first object in the array has the propertiy 'id'. It further asserts that the 'id' property is a number.

To test the MySQL database connection from within the NodeJS app we add one more endpoint `/entries' in index.js file:

<img width="700" alt="Screenshot 2023-07-05 at 20 33 36" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/4455d9b7-283b-49a6-a73d-5044ead6cff2">

The call to this endpoint just returns the array of suppliers 'id'

<img width="700" alt="Screenshot 2023-07-05 at 20 48 45" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/a1d0bf74-ce03-4a6a-aaf1-7afa3428a432">

<br>
<br>

## Steps to follow:

### 1. Install Jenkins:

https://varunmanik1.medium.com/devops-jenkins-aws-series-part-1-how-to-install-jenkins-on-aws-ubuntu-22-04-cb0c3cdb055

1. Install Java: Jenkins requires Java to run, so the first step is to install Java on the Ubuntu instance. You can do this by running the following command:

```sh
sudo apt-get update
sudo apt-get install openjdk-11-jdk
```

2. Add Jenkins repository: Next, you need to add the Jenkins repository to the instance by running the following commands:

```sh
sudo curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee   /usr/share/keyrings/jenkins-keyring.asc > /dev/null
sudo echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]   https://pkg.jenkins.io/debian-stable binary/ | sudo tee   /etc/apt/sources.list.d/jenkins.list > /dev/null
```
3. Install Jenkins: Now you can install Jenkins by running the following command:

```sh
sudo apt-get update
sudo apt-get install jenkins
```
4. Start Jenkins: Once Jenkins is installed, start & enable the Jenkins service using the following command:

```sh
sudo systemctl start jenkins

sudo systemctl status jenkins

sudo systemctl enable jenkins
```

5. Configure Jenkins:

```
cat /var/lib/jenkins/secrets/initialAdminPassword
```

<img width="700" alt="Screenshot 2023-07-09 at 14 15 15" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/524b21c0-2078-4abb-a041-faf5b76747bc">
<img width="700" alt="Screenshot 2023-07-09 at 14 20 35" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/c52f3abd-9538-4332-9c52-09fd00d3bf74">

6. Create the pipeline

<img width="700" alt="Screenshot 2023-07-09 at 14 22 25" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/3373fc50-a5e8-4592-91b8-b2d742bf7ae1">
<img width="700" alt="Screenshot 2023-07-09 at 14 23 43" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/2784771c-ff58-4c1a-88dc-3bc69ca80b23">

7. Install NodeJS plugin

<img width="700" alt="Screenshot 2023-07-09 at 14 27 48" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/7d60d4d4-cf66-44e2-a709-706de9d38cde">
<img width="700" alt="Screenshot 2023-07-09 at 14 32 01" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/1f2a7724-1700-45dc-abb5-ebc550f42551">

8. Activate and configure NodeJS plugin

<img width="700" alt="Screenshot 2023-07-09 at 14 32 29" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/784955ad-375d-4427-8596-a6db8abaa54b">
<img width="700" alt="Screenshot 2023-07-09 at 14 34 20" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/ee4ea1f7-164a-44d1-a382-2f267299753b">

<br>
<br>

###  2. Install Docker:

1. Install Docker to the Linux workstation

```sh
sudo apt-get update
sudo apt install gnupg2 pass -y
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl status docker
```
<br>
<br>

2. Install Docker plugins to Jenkins


<img width="700" alt="Screenshot 2023-07-10 at 21 16 16 1" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/09837d61-60f1-4d57-981f-f2ababedf9d4">
<img width="700" alt="Screenshot 2023-07-10 at 21 17 25" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/e29bd21b-4bca-46e0-8342-071167f52ba5">
<br>
<br>

3. Set up DockerHub credentials

<img width="700" alt="Screenshot 2023-07-10 at 22 15 29" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/f2cee7d0-5901-4257-a196-873e8a85e977">
<img width="700" alt="Screenshot 2023-07-10 at 22 14 54" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/6481f4b7-35df-43b8-a95e-0009c06b479d">

<br>
<br>


### 3. Restart services:

```sh
newgrp docker
sudo usermod -aG docker $USER
sudo usermod -aG docker jenkins
sudo service jenkins restart
sudo systemctl daemon-reload
sudo service docker restart
```

<br>
<br>


### 4. Install MySQL:

```sh
sudo apt-get install mysql-server
sudo systemctl start mysql
```

```sh
mysql
```

```sh
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
ALTER USER 'root'@'localhost' IDENTIFIED BY '12345678';
```

<details markdown=1><summary markdown="span">Resolving 'access denied' issue </summary>

The output of the `SELECT user, host, plugin FROM mysql.user WHERE user = 'root';` command shows that there are two 'root' user entries with different authentication plugins: 'caching_sha2_password' and 'auth_socket'.

The 'caching_sha2_password' plugin is associated with the 'root' user when connecting from any host ('%'), while the 'auth_socket' plugin is associated with the 'root' user specifically when connecting from the 'localhost' host.

The 'caching_sha2_password' plugin is the default authentication plugin introduced in MySQL 8.0, which uses SHA-256 hashing algorithm. On the other hand, the 'auth_socket' plugin uses the operating system's socket-based authentication mechanism.

To resolve the access denied issue, you have a couple of options:

1. Update the authentication method for the 'root' user with the 'localhost' host to use the password-based authentication plugin ('caching_sha2_password'). Run the following command to update the plugin:

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'your_password';
   ```

   Replace 'your_password' with the desired password for the 'root' user. This will set the password and update the authentication plugin.

2. Connect to MySQL using the 'auth_socket' plugin. Since you have the 'auth_socket' plugin associated with the 'root' user for 'localhost', you can connect without providing a password using the following command:

   ```bash
   mysql -h localhost -P 3306 -u root
   ```

   This command will use the operating system's authentication to verify your credentials. Note that you must run the command from the same host where MySQL is installed.

</details>

```sh
sudo mysql -h localhost -u root -p -e "CREATE DATABASE COFFEE;"
```
```
cd /var/lib/jenkins/workspace/nodejs_app_pipeline/mysql_container
```

```sh
sudo mysql -h localhost -u root -p COFFEE < my_sql.sql
```

<br>
<br>

<br><br>

### 5. Create EKS cluster

Install the AWS CLI version 2 on EC2

```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" 

sudo apt install unzip

sudo unzip awscliv2.zip  

sudo ./aws/install

aws --version
```

Configure aws cli using your Access key and Secret access key

```
aws configure
```

Install eksctl on EC2 Instance

```
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp

sudo mv /tmp/eksctl /usr/local/bin

eksctl version
```

Install kubectl on EC2 Instance

```
sudo curl --silent --location -o /usr/local/bin/kubectl   https://s3.us-west-2.amazonaws.com/amazon-eks/1.22.6/2022-03-09/bin/linux/amd64/kubectl

sudo chmod +x /usr/local/bin/kubectl 

kubectl version --short --client
```
For the smooth testing create IAM Role with Administrator Access. Later the privileges must be limited according to the "least privilege" principle.

<br>
<img width="700" alt="Screenshot 2023-03-22 at 08 30 45" src="https://user-images.githubusercontent.com/104728608/226843952-8aa6336f-4dfa-4d1b-9f00-caa9fac1e53d.png">

<img width="700" alt="Screenshot 2023-03-22 at 08 40 16" src="https://user-images.githubusercontent.com/104728608/226847236-76b88323-f6f2-45b0-b360-bab57292de6c.png">


<br>

```
sudo su - jenkins
```
```
eksctl create cluster --name demo-eks --region us-east-1 --nodegroup-name my-nodes --node-type t3.small --managed --nodes 2 

eksctl get cluster --name demo-eks --region us-east-1

aws eks update-kubeconfig --name demo-eks --region us-east-1

cat  /var/lib/jenkins/.kube/config
```
<img width="700" alt="Screenshot 2023-03-21 at 14 57 03" src="https://user-images.githubusercontent.com/104728608/226848177-38710c6a-3b2d-460b-9331-a718d0ef07db.png">

save /var/lib/jenkins/.kube/config content at your local machine in kubeconfig_mar2023.txt file and upload it as global credentials to  Jenkins

<img width="700" alt="Screenshot 2023-03-21 at 14 57 52" src="https://user-images.githubusercontent.com/104728608/226848957-044c701a-8bf6-4b51-be46-49411fb4d0e5.png">

<img width="700" alt="Screenshot 2023-03-22 at 08 51 00" src="https://user-images.githubusercontent.com/104728608/226849926-e84e642c-3245-4c90-a363-d7eff1243920.png">

Troubleshoot: 

https://stackoverflow.com/questions/75702017/my-kubernetes-deployment-keeps-failing-in-jenkins

### 6. Configure and launch the declarative Jenkins Pipeline script 

<details markdown=1><summary markdown="span">Jenkinsfile</summary>

```js
pipeline {
    agent any
    
    environment {
        dockerregistry = 'https://registry.hub.docker.com'
        dockerhuburl = "montcarotte/jenkins_nodejs_app_demo"
        githuburl = "otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes"
        dockerhubcrd = 'dockerhub'
    }
 
    tools {nodejs "node"}
 
    stages {
 
        stage('Check out') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes.git']])
            }
        }    
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Start the app') {
            steps {
                sh 'node index.js &'
            }
        }
        
        stage('Test the app') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build NodeJS image') {
          steps{
            script {
              dockerImage = docker.build(dockerhuburl + ":$BUILD_NUMBER")
            }
          }
        }
        
        stage('Build MySQL image') {
          steps {
            dir('/var/lib/jenkins/workspace/nodejs_app_pipeline/mysql_container') { 
              script {
                dockerImageMySQL = docker.build(dockerhuburl + ":${BUILD_NUMBER}_mysql")
              }
            }
          }
        }
        
        stage('Test NodeJS image') {
            steps {
                script {
                    // Start the Docker container
                    def container = docker.image("${dockerhuburl}:$BUILD_NUMBER").run("-d")
                    try {
                        // Wait for the container to start running
                        sh 'sleep 10'
                        
                        // Run the test command outside the container
                        sh "npx mocha test/test.js"
                    } finally {
                        // Stop the container
                        container.stop()
                    }
                }
            }
        }
        
        stage('Test MySQL image') {
          steps {
            script {
              // Start the MySQL Docker container
              def mysqlContainer = docker.image("${dockerhuburl}:${BUILD_NUMBER}_mysql").run("-d")
              try {
                // Wait for the container to start running
                sh 'sleep 10'
        
                // Run the test script outside the MySQL container
                sh "npx mocha test/test_mysql.js"
              } finally {
                // Stop the MySQL container
                mysqlContainer.stop()
              }
            }
          }
        }

        
        stage('Deploy images') {
          steps{
            script {
              docker.withRegistry(dockerregistry, dockerhubcrd ) {
                dockerImage.push("${env.BUILD_NUMBER}")
                dockerImage.push("latest")
                dockerImageMySQL.push("${env.BUILD_NUMBER}_mysql")
                dockerImageMySQL.push("mysql_latest")
              }
            }
          }
        }
 
        stage('Remove images') {
          steps{
            sh "docker rmi ${dockerhuburl}:${BUILD_NUMBER}"
            sh "docker rmi ${dockerhuburl}:${BUILD_NUMBER}_mysql"
          }
        }
        
        stage('K8s Deploy') {
            steps{
                withKubeConfig(caCertificate: '', clusterName: '', contextName: '', credentialsId: 'kubern_config', namespace: '', restrictKubeConfigAccess: false, serverUrl: '') {
                    sh "aws eks update-kubeconfig --name demo-eks"
                    sh "kubectl apply -f deployment.yaml"
                }
            }
        }
    }
}
```

</details>

<img width="700" alt="Screenshot 2023-07-30 at 14 24 45" src="https://github.com/otammato/4_Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/fbbfcbef-20f6-45f6-984a-4b6961704b5e">
