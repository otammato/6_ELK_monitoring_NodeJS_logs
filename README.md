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

The architecture entails the following:

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
<img width="1000" alt="Screenshot 2023-08-21 at 22 32 05" src="https://github.com/otammato/ELK_monitoring_NodeJS_logs/assets/104728608/a7b6560f-a7bd-47a2-8133-1eca1d896830">
<img width="1000" alt="Screenshot 2023-08-21 at 22 31 08" src="https://github.com/otammato/ELK_monitoring_NodeJS_logs/assets/104728608/3a90234d-7a5f-4533-bd5c-a072047f0528">


1.  

## Steps:
1. `sudo apt update`
2. `sudo apt  install docker-compose`
3. `docker-compose up`
4. `sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' logstash`
5. `sudo apt install nodejs`
6. `sudo apt install npm`


(the page is currently under development)

<img width="1000" alt="Screenshot 2023-08-21 at 22 23 27" src="https://github.com/otammato/ELK_monitoring_NodeJS_logs/assets/104728608/d8bea94a-3de3-4614-a172-0fea507a1994">
<img width="1000" alt="Screenshot 2023-08-21 at 22 24 01" src="https://github.com/otammato/ELK_monitoring_NodeJS_logs/assets/104728608/efaa83da-1589-4737-9b2c-f5652b5c7e6d">
<img width="1000" alt="Screenshot 2023-08-21 at 22 24 38" src="https://github.com/otammato/ELK_monitoring_NodeJS_logs/assets/104728608/a750f1bc-6d5c-4203-be1a-ed6bd11c74a8">
<img width="1000" alt="Screenshot 2023-08-21 at 22 25 47" src="https://github.com/otammato/ELK_monitoring_NodeJS_logs/assets/104728608/681b3406-f5a8-4e0d-bf3d-f7457e33a778">
<img width="1000" alt="Screenshot 2023-08-21 at 22 26 04" src="https://github.com/otammato/ELK_monitoring_NodeJS_logs/assets/104728608/465dd78a-3c17-4fd4-bcc6-2cb5347375e5">



<img width="1000" alt="Screenshot 2023-08-21 at 22 25 07" src="https://github.com/otammato/ELK_monitoring_NodeJS_logs/assets/104728608/067dccea-11cd-49f7-b61c-efdc6c588e4c">
<img width="1000" alt="Screenshot 2023-08-21 at 22 25 26" src="https://github.com/otammato/ELK_monitoring_NodeJS_logs/assets/104728608/95e1e230-56c7-40fa-9417-b45559421d51">
<img width="1000" alt="Screenshot 2023-08-21 at 22 25 37" src="https://github.com/otammato/ELK_monitoring_NodeJS_logs/assets/104728608/a50b9bac-aba0-4492-ba0b-d677bcd98826">

<img width="1000" alt="Screenshot 2023-08-21 at 22 24 24" src="https://github.com/otammato/ELK_monitoring_NodeJS_logs/assets/104728608/56b8f390-011f-469c-b756-69ee23829557">


