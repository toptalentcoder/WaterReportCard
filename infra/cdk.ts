import { App } from 'aws-cdk-lib';
import { VpcStack } from './vpc';
import { RdsStack } from './rds-postgresql';
import { LambdaFunctionsStack } from './lambda-functions';
import { ApiGatewayStack } from './api-gateway';
import { IotCoreStack } from './iot-core';
import { CognitoStack } from './cognito';
import { StaticSiteStack } from './s3-static-site';

const app = new App();

const vpcStack = new VpcStack(app, 'WaterQualityVpc');

const rdsStack = new RdsStack(app, 'WaterQualityRDS', { vpc: vpcStack.vpc });
const lambdaStack = new LambdaFunctionsStack(app, 'WaterQualityLambdas', { vpc: vpcStack.vpc });

new ApiGatewayStack(app, 'WaterQualityAPI', {
    lambda: lambdaStack.lambda,
});

new CognitoStack(app, 'WaterQualityCognito');
new IotCoreStack(app, 'WaterQualityIoT');
new StaticSiteStack(app, 'WaterQualityStaticWeb');
