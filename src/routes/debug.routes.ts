
import express from 'express';
import { errorTracker } from '../utils/errorTracker';

const router = express.Router();

router.get('/error-stats', (req, res) => {
    res.json(errorTracker.getStats());
});

router.post('/error-stats/reset', (req, res) => {
    errorTracker.reset();
    res.json({ message: 'Error stats reset.' });
});

export default router;
