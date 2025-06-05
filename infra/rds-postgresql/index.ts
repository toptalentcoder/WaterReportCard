import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { InstanceType, InstanceClass, InstanceSize, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';

interface RdsStackProps extends StackProps {
    vpc: Vpc;
}

export class RdsStack extends Stack {
    constructor(scope: Construct, id: string, props: RdsStackProps) {
        super(scope, id, props);

        new DatabaseInstance(this, 'PostgresInstance', {
            engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_14 }),
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
            vpc: props.vpc,
            publiclyAccessible: true,
            allocatedStorage: 20,
            credentials: {
                username: 'postgres',
            },
            vpcSubnets: {
                subnetType: SubnetType.PRIVATE_WITH_EGRESS,
            },
        });
    }
}
