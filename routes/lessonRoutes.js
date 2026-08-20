import express from 'express';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../middleware/auth.js';
import { validateLessonPayload } from '../middleware/validator.js';

export function createLessonRouter(lessonsCollection) {
  const router = express.Router();

  // GET /api/lessons — Public Browse with Search, Filter, Sort & Pagination
  router.get('/', async (req, res) => {
    try {
      const { search, category, emotionalTone, sort, page = 1, limit = 6, visibility } = req.query;

      const query = {};

      // Visibility filter (Default to Public if not specified)
      if (visibility) {
        query.visibility = visibility;
      } else {
        query.visibility = 'Public';
      }

      // Search filter
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }

      // Category filter
      if (category && category !== 'All') {
        query.category = category;
      }

      // Emotional Tone filter
      if (emotionalTone && emotionalTone !== 'All') {
        query.emotionalTone = emotionalTone;
      }

      // Sorting
      let sortOption = { createdAt: -1 };
      if (sort === 'most_saved') {
        sortOption = { favoritesCount: -1 };
      } else if (sort === 'most_liked') {
        sortOption = { likesCount: -1 };
      }

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await lessonsCollection.countDocuments(query);
      const lessons = await lessonsCollection
        .find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      res.json({
        success: true,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        lessons
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // GET /api/lessons/:id — Single Lesson Details
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
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

      // Increment view count
      await lessonsCollection.updateOne(query, { $inc: { viewsCount: 1 } });

      res.json({ success: true, lesson });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // POST /api/lessons — Create Life Lesson (Protected Route)
  router.post('/', verifyToken, validateLessonPayload, async (req, res) => {
    try {
      const { title, description, content, category, emotionalTone, image, accessLevel, visibility } = req.body;

      // Enforce Free user constraint: Only Premium users can create Premium access level lessons
      const finalAccessLevel = req.user.isPremium ? (accessLevel || 'Free') : 'Free';

      const newLesson = {
        title,
        description,
        content: content || description,
        category,
        emotionalTone,
        image: image || 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
        accessLevel: finalAccessLevel,
        visibility: visibility || 'Public',
        isFeatured: false,
        isReviewed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creatorId: req.user.id || 'user-101',
        creatorName: req.user.name || req.user.email.split('@')[0],
        creatorPhoto: req.user.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        likes: [],
        likesCount: 0,
        favoritesCount: 0,
        viewsCount: 0,
        comments: []
      };

      const result = await lessonsCollection.insertOne(newLesson);
      res.status(201).json({
        success: true,
        message: 'Lesson created successfully',
        lesson: { _id: result.insertedId, ...newLesson }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // PUT /api/lessons/:id — Update Lesson (Protected Route)
  router.put('/:id', verifyToken, validateLessonPayload, async (req, res) => {
    try {
      const { id } = req.params;
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

      // Check ownership or admin role
      if (lesson.creatorId !== req.user.id && req.user.role !== 'admin' && lesson.creatorName !== req.user.email?.split('@')[0]) {
        return res.status(403).json({ success: false, message: 'Forbidden. You do not own this lesson.' });
      }

      const { title, description, content, category, emotionalTone, image, accessLevel, visibility } = req.body;

      const updateDoc = {
        $set: {
          title: title || lesson.title,
          description: description || lesson.description,
          content: content || lesson.content,
          category: category || lesson.category,
          emotionalTone: emotionalTone || lesson.emotionalTone,
          image: image || lesson.image,
          accessLevel: req.user.isPremium ? (accessLevel || lesson.accessLevel) : lesson.accessLevel,
          visibility: visibility || lesson.visibility,
          updatedAt: new Date().toISOString()
        }
      };

      await lessonsCollection.updateOne(query, updateDoc);
      const updatedLesson = await lessonsCollection.findOne(query);

      res.json({ success: true, message: 'Lesson updated successfully', lesson: updatedLesson });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // DELETE /api/lessons/:id — Delete Lesson (Protected Route)
  router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch (e) {
        query = { id: id };
      }

      const result = await lessonsCollection.deleteOne(query);
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Lesson not found' });
      }

      res.json({ success: true, message: 'Lesson deleted permanently' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
}
