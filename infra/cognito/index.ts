import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
    UserPool,
    UserPoolClient,
    AccountRecovery,
    VerificationEmailStyle,
} from 'aws-cdk-lib/aws-cognito';

export class CognitoStack extends Stack {
    public readonly userPool: UserPool;
    public readonly userPoolClient: UserPoolClient;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.userPool = new UserPool(this, 'UserPool', {
            selfSignUpEnabled: true,
            signInAliases: { email: true },
            autoVerify: { email: true },
            accountRecovery: AccountRecovery.EMAIL_ONLY,
            userVerification: {
                emailStyle: VerificationEmailStyle.CODE,
            },
        });

        this.userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
            userPool: this.userPool,
            generateSecret: false,
            authFlows: {
                userPassword: true,
                userSrp: true,
            },
        });
    }
}
