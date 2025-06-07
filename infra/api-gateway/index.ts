import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

export class ApiGatewayStack extends Stack {
    constructor(scope: Construct, id: string, lambdaHandler: IFunction, props?: StackProps) {
        super(scope, id, props);

        new apigateway.LambdaRestApi(this, 'HttpApi', {
            handler: lambdaHandler,
            proxy: true,
            restApiName: 'WaterReportCardAPI',
            deployOptions: {
                stageName: 'prod',
            },
        });
    }
}
