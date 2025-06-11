import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { InstanceType, InstanceClass, InstanceSize, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { CfnOutput } from 'aws-cdk-lib';

interface RdsStackProps extends StackProps {
    vpc: Vpc;
}

export class RdsStack extends Stack {
    public readonly dbInstance: DatabaseInstance;
    public readonly dbSecret: Secret;

    constructor(scope: Construct, id: string, props: RdsStackProps) {
        super(scope, id, props);

        // Create a secret for database credentials
        this.dbSecret = new Secret(this, 'DBSecret', {
            generateSecretString: {
                secretStringTemplate: JSON.stringify({ username: 'postgres' }),
                generateStringKey: 'password',
                excludePunctuation: true,
                passwordLength: 16,
            },
        });

        // Create the RDS instance
        this.dbInstance = new DatabaseInstance(this, 'PostgresInstance', {
            engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_14 }),
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
            vpc: props.vpc,
            publiclyAccessible: true,
            allocatedStorage: 20,
            credentials: {
                username: 'postgres',
                password: this.dbSecret.secretValueFromJson('password'),
            },
            vpcSubnets: {
                subnetType: SubnetType.PRIVATE_WITH_EGRESS,
            },
            databaseName: 'waterreportcard',
        });

        // Output the database endpoint
        new CfnOutput(this, 'DatabaseEndpoint', {
            value: this.dbInstance.dbInstanceEndpointAddress,
            description: 'Database endpoint',
        });
    }
}
