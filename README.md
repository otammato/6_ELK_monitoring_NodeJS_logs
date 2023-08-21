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

1.  (the page is currently under development)

## Steps:
1. sudo apt update
2. sudo apt  install docker-compose
3. docker-compose up
4. sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' logstash
