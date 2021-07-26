# Note Apps Demo

Note Apps is a demo app to present simple CI/CD. CI/CD covered in this project consists of 2 method of CI/CD:
- Using [Google Cloud Build](https://cloud.google.com/build)
- Using [Buddy Works](https://app.buddy.works/)

## Pre-requisite Project
1. Google Cloud Account with billing enabled
2. Buddy Works account
3. Github account
4. Node version 14 or latest (Author using npm version 6.13.4)
5. Google Cloud SDK (Author using Google Cloud SDK 348.0.0)
6. Terraform (Author using Terraform v1.0.3 - windows, Terraform v0.12.18 - linux)
7. [Cloud SQL Auth Proxy](https://cloud.google.com/sql/docs/mysql/sql-proxy)
8. MySQL (Author using mysql  version 15.1)

## Architecture
The project mainly using [google cloud run](https://cloud.google.com/run) a scalable containerized applications on a fully managed serverless Google Cloud Platform (GCP). The overview architecture can be seen below:

![alt text](https://github.com/jejual/task-apps/blob/master/docs/architecture.png)

## API Flow design
The underlayering API service design for this project as in the picture below.

![alt text](https://github.com/jejual/task-apps/blob/master/docs/api_sequence_diagram.png)

## Google Cloud Pipeline
The objective to use google cloud build is for ease of fast deployment with cons as it is not scalable on migration to other platform of CI/CD (IaaS).
The pipeline created in this project only cover manual pipeline (using local machine to deploy).

![alt text](https://github.com/jejual/task-apps/blob/master/docs/gcloud_build_pipeline.png)

### Step deployment
1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Initialize SDK using `gcloud init`
3. [deploy google cloud run](https://cloud.google.com/build/docs/deploying-builds/deploy-cloud-run) using `gcloud builds submit`

## Buddy Pipeline
[Buddy Works](https://app.buddy.works/) is one of CI/CD tools used and prefered by author in term of author knowledge and experience.

![alt text](https://github.com/jejual/task-apps/blob/master/docs/buddy_pipeline.png)

### Step deployment
1. Go to project in `Buddy Works` website
2. [Integrate repository with Buddy Works](https://buddy.works/docs/integrations/github)
3. Go to `Pipelines` there should be already pipeline with name `note-apps-cloud-run`
4. Click `Run` (this can be configured to listen trigger on github event)

## How to run the service locally?
1. Install dependencies
```sh
npm install
```
2. Setup/create `.env` file with the following variables:
```sh
PORT=<port>
NODE_ENV=production
LOG_LOCATION=<folder name where you want to save server log>
JWT_KEY=1234
DB_HOST=127.0.0.1
DB_PORT=<PORT>
DB_USER=<databse username>
DB_PASSWORD=<database password>
DB_NAME=note
DB_DIALECT=<database dialect>
DB_URI_DEV=mysql://<user>:<password>@localhost:<port>/note
```
3. Run the SQL cloud proxy (in windows, don't forget to move the cloud_sql_proxy in this project or setup environment variable path)
```sh
cloud_sql_proxy -instances=<connection_instance_name>=tcp:127.0.0.1:<PORT>
```
4. If you are using `Visual Studio Code` you can just press `F5` to run the server locally

5. If you are using non `Visual Studio Code` you can run by this command:
```sh
node src/app.js
```