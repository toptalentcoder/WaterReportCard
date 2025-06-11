import { App } from 'aws-cdk-lib';
import { CognitoStack } from './cognito';
import { RdsStack } from './rds-postgresql';
import { LambdaStack } from './lambda-functions';
import { ApiGatewayStack } from './api-gateway';
import { VpcStack } from './vpc-stack';

const app = new App();

// Create the VPC stack first
const vpcStack = new VpcStack(app, 'VpcStack', {});

// Create the Cognito stack
const cognitoStack = new CognitoStack(app, 'CognitoStack', {});

// Create the RDS stack with the VPC
const rdsStack = new RdsStack(app, 'RdsStack', {
  vpcStack,
});

// Create the Lambda stack with references to both Cognito and RDS stacks
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  userPoolId: cognitoStack.userPool.userPoolId,
  clientId: cognitoStack.userPoolClient.userPoolClientId,
  rdsStack,
  vpcStack,
});

// Create the API Gateway stack
new ApiGatewayStack(app, 'ApiGatewayStack', lambdaStack.authHandler);

// Add explicit dependencies
rdsStack.addDependency(vpcStack);
lambdaStack.addDependency(vpcStack);
lambdaStack.addDependency(rdsStack);

app.synth();
