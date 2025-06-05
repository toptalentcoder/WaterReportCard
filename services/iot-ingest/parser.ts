import { z } from 'zod';

const dataSchema = z.object({
    device_id: z.string(),
    items: z.array(z.object({
        timestamp: z.string(),
        has_alert: z.boolean(),
        alerts: z.any(),
        data: z.record(z.any()),
    })),
});

export function parseTDSData(input: any) {
  return dataSchema.parse(input);
}
