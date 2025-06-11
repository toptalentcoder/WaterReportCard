import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { VpcStack } from '../vpc-stack';
import * as cdk from 'aws-cdk-lib';

interface RdsStackProps extends StackProps {
    vpcStack: VpcStack;
}

export class RdsStack extends Stack {
    public readonly instance: rds.DatabaseInstance;
    public readonly secret: secretsmanager.Secret;

    constructor(scope: Construct, id: string, props: RdsStackProps) {
        super(scope, id, props);

        // Create a secret for the database credentials
        this.secret = new secretsmanager.Secret(this, 'DatabaseSecret', {
            generateSecretString: {
                secretStringTemplate: JSON.stringify({ username: 'postgres' }),
                generateStringKey: 'password',
                excludePunctuation: true,
            },
        });

        // Create the RDS instance in our custom VPC
        this.instance = new rds.DatabaseInstance(this, 'Database', {
            engine: rds.DatabaseInstanceEngine.postgres({
                version: rds.PostgresEngineVersion.VER_15,
            }),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            vpc: props.vpcStack.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            },
            securityGroups: [props.vpcStack.databaseSecurityGroup],
            credentials: rds.Credentials.fromSecret(this.secret),
            databaseName: 'waterreportcard',
            backupRetention: Duration.days(7),
            removalPolicy: RemovalPolicy.SNAPSHOT,
        });

        // Output the database endpoint
        new cdk.CfnOutput(this, 'DatabaseEndpoint', {
            value: this.instance.dbInstanceEndpointAddress,
            exportName: 'DatabaseEndpoint',
        });

        // Output the secret ARN
        new cdk.CfnOutput(this, 'DatabaseSecretArn', {
            value: this.secret.secretArn,
            exportName: 'DatabaseSecretArn',
        });
    }
}
