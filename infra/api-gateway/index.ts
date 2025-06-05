import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Function } from 'aws-cdk-lib/aws-lambda';

interface ApiGatewayStackProps extends StackProps {
    lambda: Function;
}

export class ApiGatewayStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'WaterQualityApi', {
            restApiName: 'Water Quality Service',
        });

        const districts = api.root.addResource('districts');
        districts.addMethod('GET', new LambdaIntegration(props.lambda));
    }
}
