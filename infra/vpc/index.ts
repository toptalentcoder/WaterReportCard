import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class VpcStack extends Stack {
    public readonly vpc: Vpc;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.vpc = new Vpc(this, 'MainVpc', {
            maxAzs: 2,
            subnetConfiguration: [
                { name: 'Public', subnetType: SubnetType.PUBLIC },
                { name: 'Private', subnetType: SubnetType.PRIVATE_WITH_EGRESS },
            ],
        });
    }
}
