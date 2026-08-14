import express from 'express';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../middleware/auth.js';

export function createInteractionRouter(
  lessonsCollection,
  favoritesCollection,
  commentsCollection,
  reportsCollection
) {
  const router = express.Router();

  // POST /api/lessons/:id/like — Toggle Like (Protected)
  router.post('/:id/like', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id || req.user.email;

      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch (e) {
        query = { id: id };
      }

      const lesson = await lessonsCollection.findOne(query);
      if (!lesson) {
        return res.status(404).json({ success: false, message: 'Lesson not found' });
      }

      const likes = lesson.likes || [];
      const hasLiked = likes.includes(userId);

      let updateDoc;
      if (hasLiked) {
        // Remove like
        updateDoc = {
          $pull: { likes: userId },
          $inc: { likesCount: -1 }
        };
      } else {
        // Add like
        updateDoc = {
          $addToSet: { likes: userId },
          $inc: { likesCount: 1 }
        };
      }

      await lessonsCollection.updateOne(query, updateDoc);
      const updatedLesson = await lessonsCollection.findOne(query);

      res.json({
        success: true,
        message: hasLiked ? 'Unliked lesson' : 'Liked lesson',
        likesCount: updatedLesson.likesCount,
        hasLiked: !hasLiked
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // POST /api/lessons/:id/favorite — Toggle Save to Favorites (Protected)
  router.post('/:id/favorite', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id || req.user.email;

      const existingFav = await favoritesCollection.findOne({ userId, lessonId: id });

      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch (e) {
        query = { id: id };
      }

      if (existingFav) {
        // Remove from favorites
        await favoritesCollection.deleteOne({ userId, lessonId: id });
        await lessonsCollection.updateOne(query, { $inc: { favoritesCount: -1 } });

        return res.json({ success: true, isSaved: false, message: 'Removed from Favorites' });
      } else {
        // Add to favorites
        const favEntry = {
          userId,
          lessonId: id,
          savedAt: new Date().toISOString()
        };
        await favoritesCollection.insertOne(favEntry);
        await lessonsCollection.updateOne(query, { $inc: { favoritesCount: 1 } });

        return res.json({ success: true, isSaved: true, message: 'Saved to Favorites' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // GET /api/favorites — Get User Saved Favorites (Protected)
  router.get('/user/favorites', verifyToken, async (req, res) => {
    try {
      const userId = req.user.id || req.user.email;
      const userFavs = await favoritesCollection.find({ userId }).toArray();
      const lessonIds = userFavs.map((f) => f.lessonId);

      const savedLessons = await lessonsCollection
        .find({
          $or: [
            { id: { $in: lessonIds } },
            { _id: { $in: lessonIds.map((id) => { try { return new ObjectId(id); } catch(e){ return null; } }).filter(Boolean) } }
          ]
        })
        .toArray();

      res.json({ success: true, favorites: savedLessons });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // POST /api/lessons/:id/comments — Add Comment (Protected)
  router.post('/:id/comments', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ success: false, message: 'Comment text is required.' });
      }

      const commentEntry = {
        lessonId: id,
        userId: req.user.id || req.user.email,
        userName: req.user.name || req.user.email.split('@')[0],
        userPhoto: req.user.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        text,
        createdAt: new Date().toISOString()
      };

      const result = await commentsCollection.insertOne(commentEntry);
      res.status(201).json({
        success: true,
        message: 'Comment posted',
        comment: { _id: result.insertedId, ...commentEntry }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // GET /api/lessons/:id/comments — Fetch Comments Thread
  router.get('/:id/comments', async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await commentsCollection
        .find({ lessonId: id })
        .sort({ createdAt: -1 })
        .toArray();

      res.json({ success: true, comments });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // POST /api/lessons/:id/report — Report Lesson (Protected)
  router.post('/:id/report', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const reportEntry = {
        lessonId: id,
        reporterUserId: req.user.id || req.user.email,
        reportedUserEmail: req.user.email,
        reason: reason || 'Inappropriate Content',
        timestamp: new Date().toISOString()
      };

      const result = await reportsCollection.insertOne(reportEntry);
      res.status(201).json({
        success: true,
        message: 'Report submitted successfully to moderators',
        report: { _id: result.insertedId, ...reportEntry }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
}
