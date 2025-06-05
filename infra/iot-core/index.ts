import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnThing } from 'aws-cdk-lib/aws-iot';

export class IotCoreStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new CfnThing(this, 'WaterSensorThing', {
            thingName: 'water-sensor',
        });
    }
}
