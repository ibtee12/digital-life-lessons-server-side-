import express from 'express';
import { ObjectId } from 'mongodb';

export function createCreatorRouter(lessonsCollection, usersCollection) {
  const router = express.Router();

  // GET /api/creators/top — Top Contributors for Homepage Showcase
  router.get('/top', async (req, res) => {
    try {
      const topCreators = await lessonsCollection
        .aggregate([
          { $match: { visibility: 'Public' } },
          {
            $group: {
              _id: '$creatorId',
              name: { $first: '$creatorName' },
              photo: { $first: '$creatorPhoto' },
              lessonCount: { $sum: 1 },
              totalLikes: { $sum: '$likesCount' }
            }
          },
          { $sort: { lessonCount: -1, totalLikes: -1 } },
          { $limit: 6 }
        ])
        .toArray();

      res.json({ success: true, creators: topCreators });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // GET /api/creators/:id — Single Creator Public Profile Archive
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const query = {
        visibility: 'Public',
        $or: [
          { creatorId: id },
          { creatorName: { $regex: id.replace(/-/g, ' '), $options: 'i' } }
        ]
      };

      const creatorLessons = await lessonsCollection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      if (creatorLessons.length === 0) {
        return res.json({
          success: true,
          creator: {
            id,
            name: 'Featured Author',
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            role: 'Wisdom Contributor',
            totalLessons: 0,
            totalLikes: 0,
            totalFavorites: 0
          },
          lessons: []
        });
      }

      const totalLikes = creatorLessons.reduce((sum, l) => sum + (l.likesCount || 0), 0);
      const totalFavorites = creatorLessons.reduce((sum, l) => sum + (l.favoritesCount || 0), 0);
      const totalViews = creatorLessons.reduce((sum, l) => sum + (l.viewsCount || 0), 0);

      res.json({
        success: true,
        creator: {
          id,
          name: creatorLessons[0].creatorName,
          photo: creatorLessons[0].creatorPhoto,
          role: 'Verified Wisdom Contributor',
          totalLessons: creatorLessons.length,
          totalLikes,
          totalFavorites,
          totalViews
        },
        lessons: creatorLessons
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
}
