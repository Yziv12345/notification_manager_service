import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { userStore } from '../models/userStore';

const router = Router();

// router.use(authMiddleware);


// View all users
router.get('/', (req, res) => {
    res.json(userStore.getAll());
});

// Create new user preferences
router.post('/create', (req: Request, res: Response) => {
    const { email, telephone, preferences } = req.body;

    if (!email || !telephone || !preferences) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        userStore.create({ email, telephone, preferences });
        return res.status(201).json({ message: 'User preferences created' });
    } catch (err: any) {
        return res.status(409).json({ error: err.message });
    }
});

// Edit existing user preferences
router.post('/edit', (req: Request, res: Response) => {
    const { email, preferences } = req.body;

    if (!email || !preferences) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        userStore.edit(email, preferences);
        return res.status(200).json({ message: 'User preferences updated' });
    } catch (err: any) {
        return res.status(404).json({ error: err.message });
    }
});

export default router;
