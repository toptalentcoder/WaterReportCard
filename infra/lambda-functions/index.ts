import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambdaRuntime from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { RdsStack } from '../rds-postgresql';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

interface LambdaStackProps extends StackProps {
  userPoolId: string;
  clientId: string;
  rdsStack: RdsStack;
}

export class LambdaStack extends Stack {
  public readonly authHandler;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.authHandler = new lambda.NodejsFunction(this, 'AuthLambda', {
      entry: path.join(__dirname, '../../services/api/server.ts'),
      handler: 'handler',
      runtime: lambdaRuntime.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      memorySize: 512,
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        NODE_OPTIONS: '--enable-source-maps',
        REGION: process.env.AWS_REGION || 'us-west-2',

        COGNITO_CLIENT_ID: props.clientId,
        COGNITO_POOL_ID: props.userPoolId,

        // Database configuration
        POSTGRES_HOST: props.rdsStack.dbInstance.dbInstanceEndpointAddress,
        POSTGRES_PORT: '5432',
        POSTGRES_USER: 'postgres',
        POSTGRES_DB: 'waterreportcard',
      },
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'es2020',
      },
      vpc: props.rdsStack.dbInstance.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [props.rdsStack.dbInstance.connections.securityGroups[0]],
    });

    // Grant the Lambda function access to the database secret
    props.rdsStack.dbSecret.grantRead(this.authHandler);

    // Add the secret ARN to the Lambda environment
    this.authHandler.addEnvironment('POSTGRES_SECRET_ARN', props.rdsStack.dbSecret.secretArn);
  }
}
