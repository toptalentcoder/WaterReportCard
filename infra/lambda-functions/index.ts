// infra/lambda-functions/index.ts
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

interface LambdaFunctionsStackProps extends StackProps {
  vpc: Vpc;
}

export class LambdaFunctionsStack extends Stack {
  public readonly lambda: Function;

  constructor(scope: Construct, id: string, props: LambdaFunctionsStackProps) {
    super(scope, id, props);

    this.lambda = new Function(this, 'DistrictsHandler', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: Code.fromAsset('services/api/districts'),
      vpc: props.vpc,
    });
  }
}
