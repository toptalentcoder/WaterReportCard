import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';

export class CognitoStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const userPool = new UserPool(this, 'WaterQualityUserPool', {
            selfSignUpEnabled: true,
            signInAliases: { email: true },
        });

        new UserPoolClient(this, 'WaterQualityAppClient', {
            userPool,
        });
    }
}
