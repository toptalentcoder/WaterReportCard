import { Router } from 'express';
import { parseTDSData } from '../../iot-ingest/parser';
import { storeTDSData } from '../../iot-ingest/store';
import { z } from 'zod';

const router = Router();

router.post('/iot/tds-data', async (req, res) => {
    try {
        const data = parseTDSData(req.body); // Validate + parse
        await storeTDSData(data);            // Save to DB
        res.status(200).json({ message: 'TDS data stored' });
    } catch (err) {
        console.error('TDS ingestion error:', err);
        res.status(400).json({ error: 'Invalid payload' });
    }
});

export default router;
