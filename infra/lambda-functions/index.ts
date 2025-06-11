import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { RdsStack } from '../rds-postgresql';
import { VpcStack } from '../vpc-stack';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

interface LambdaStackProps extends StackProps {
  userPoolId: string;
  clientId: string;
  rdsStack: RdsStack;
  vpcStack: VpcStack;
}

export class LambdaStack extends Stack {
  public readonly authHandler: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.authHandler = new NodejsFunction(this, 'AuthLambda', {
      entry: path.join(__dirname, '../../services/api/server.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      memorySize: 1024,
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'node20',
        externalModules: ['pg-native'],
      },
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        NODE_OPTIONS: '--enable-source-maps',
        REGION: process.env.AWS_REGION || 'us-west-2',
        COGNITO_CLIENT_ID: props.clientId,
        COGNITO_POOL_ID: props.userPoolId,
        POSTGRES_HOST: props.rdsStack.instance.dbInstanceEndpointAddress,
        POSTGRES_PORT: '5432',
        POSTGRES_USER: 'postgres',
        POSTGRES_DB: 'waterreportcard',
        POSTGRES_SECRET_ARN: props.rdsStack.secret.secretArn,
      },
      vpc: props.vpcStack.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [props.vpcStack.lambdaSecurityGroup],
    });

    // Grant the Lambda function access to the database secret
    props.rdsStack.secret.grantRead(this.authHandler);
  }
}
