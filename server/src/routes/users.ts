import { Router, Request, Response } from 'express';
import { userService } from '../services/userService.js';

export const usersRouter = Router();

// GET /api/users/filters (locations and skills list)
usersRouter.get('/filters', (_req: Request, res: Response) => {
  try {
    const meta = userService.getFilterMeta();
    res.json(meta);
  } catch (error) {
    console.error('Error in GET /api/users/filters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users (paginated users with search & filters)
usersRouter.get('/', (req: Request, res: Response) => {
  try {
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const search = req.query.search ? (req.query.search as string) : undefined;
    const location = req.query.location ? (req.query.location as string) : undefined;
    const skill = req.query.skill ? (req.query.skill as string) : undefined;
    const ageMin = req.query.ageMin ? parseInt(req.query.ageMin as string, 10) : undefined;
    const ageMax = req.query.ageMax ? parseInt(req.query.ageMax as string, 10) : undefined;
    const sortBy = req.query.sortBy ? (req.query.sortBy as any) : undefined;
    const sortOrder = req.query.sortOrder ? (req.query.sortOrder as any) : undefined;

    if (isNaN(offset) || offset < 0) {
      res.status(400).json({ error: 'Invalid offset parameter. Must be a non-negative integer.' });
      return;
    }

    if (isNaN(limit) || limit < 1 || limit > 250) {
      res.status(400).json({ error: 'Invalid limit parameter. Must be between 1 and 250.' });
      return;
    }

    const result = userService.getUsers({
      offset,
      limit,
      search,
      location,
      skill,
      ageMin,
      ageMax,
      sortBy,
      sortOrder
    });
    res.json(result);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
