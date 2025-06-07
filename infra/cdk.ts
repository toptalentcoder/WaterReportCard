import { App } from 'aws-cdk-lib';
import { CognitoStack } from './cognito';
import { LambdaStack } from './lambda-functions';
import { ApiGatewayStack } from './api-gateway';

const app = new App();

const cognitoStack = new CognitoStack(app, 'CognitoStack');
const lambdaStack = new LambdaStack(app, 'LambdaStack');
new ApiGatewayStack(app, 'ApiGatewayStack', lambdaStack.authHandler);
