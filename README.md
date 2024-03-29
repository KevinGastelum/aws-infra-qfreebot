# Objective

Deploy AWS infrastructure with EC2 instance that includes all our settings already configured - VPC, IAM role, Security Group, Policy Rules, etc. Deploy Lambda Function with Docker that runs FastAPI, HTTPX asynchronously to deploy algo bot

## Steps to reproduce

- pip install awscli --> aws configure --> enter keys&region
- Install (CDK) Cloud Dev Kit node command: `npm install -g aws-cdk`
- Bootstrap your AWS acct details (only needs to be done once) run: `cdk bootstrap aws://UR_ACCT_NUMBER/UR_REGION{us-east-1}`
  <br>(Get AWS acct details with `aws sts get-account-identity` from CLI)
- Begin CDK project with: `cdk init -l typescript`
- Edit file in - lib/UR_STACK_FILE_NAME.ts - Here is where we configure and create Lambda Function and Docker to run
- Create a Api directory to hold Dockerfile, shell script, and Python script
- Run ./shell_script.sh and this will pip install reqs into a zip file for our lambda function to run from

<!-- # Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template -->
