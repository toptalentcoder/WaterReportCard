import { App } from 'aws-cdk-lib';
import { CognitoStack } from './cognito';
import { LambdaStack } from './lambda-functions';
import { ApiGatewayStack } from './api-gateway';
import { RdsStack } from './rds-postgresql';
import { VpcStack } from './vpc-stack';

const app = new App();

// Create the VPC stack first
const vpcStack = new VpcStack(app, 'VpcStack');

// Create the RDS stack with the VPC
const rdsStack = new RdsStack(app, 'RdsStack', {
  vpc: vpcStack.vpc,
});

// Create the Cognito stack
const cognitoStack = new CognitoStack(app, 'CognitoStack');

// Create the Lambda stack with RDS configuration
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  userPoolId: cognitoStack.userPool.userPoolId,
  clientId: cognitoStack.userPoolClient.userPoolClientId,
  rdsStack,
});

// Create the API Gateway stack
new ApiGatewayStack(app, 'ApiGatewayStack', lambdaStack.authHandler);
