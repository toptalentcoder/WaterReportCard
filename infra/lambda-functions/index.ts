import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambdaRuntime from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class LambdaStack extends Stack {
  public readonly authHandler;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.authHandler = new lambda.NodejsFunction(this, 'AuthLambda', {
      entry: path.join(__dirname, '../../services/api/server.ts'),
      handler: 'handler', // change this if your handler has a different name
      runtime: lambdaRuntime.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(15),
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        NODE_OPTIONS: '--enable-source-maps',
        REGION: 'us-west-2', // change if needed
      },
    });
  }
}
