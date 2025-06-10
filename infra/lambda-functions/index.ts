import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambdaRuntime from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

interface LambdaStackProps extends StackProps {
  userPoolId: string;
  clientId: string;
}

export class LambdaStack extends Stack {
  public readonly authHandler;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.authHandler = new lambda.NodejsFunction(this, 'AuthLambda', {
      entry: path.join(__dirname, '../../services/api/server.ts'),
      handler: 'handler', // change this if your handler has a different name
      runtime: lambdaRuntime.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(15),
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        NODE_OPTIONS: '--enable-source-maps',
        REGION: process.env.AWS_REGION || 'us-west-2', // change if needed

        COGNITO_CLIENT_ID: props.clientId,
        COGNITO_POOL_ID: props.userPoolId,

        POSTGRES_HOST: process.env.POSTGRES_HOST || '',
        POSTGRES_PORT: process.env.POSTGRES_PORT || '5432',
        POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
        POSTGRES_DB: process.env.POSTGRES_DB || '',
      },
    });
  }
}
