import { db } from '../../libs/shared/db';
import { parseTDSData } from './parser';

export async function storeTDSData(data: ReturnType<typeof parseTDSData>) {
    for (const item of data.items) {
        await db.query(
            `INSERT INTO tds_readings (device_id, timestamp, data)
            VALUES ($1, $2, $3)`,
            [data.device_id, item.timestamp, item.data]
        );
    }
}
