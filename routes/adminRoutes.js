import express from 'express';
import { ObjectId } from 'mongodb';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

export function createAdminRouter(usersCollection, lessonsCollection, reportsCollection) {
  const router = express.Router();

  // Protect all admin routes
  router.use(verifyToken, verifyAdmin);

  // GET /api/admin/users — List all platform users
  router.get('/users', async (req, res) => {
    try {
      const users = await usersCollection.find({}).toArray();
      res.json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // PATCH /api/admin/users/:id/role — Promote / Demote User Role
  router.patch('/users/:id/role', async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      let query;
      try { query = { _id: new ObjectId(id) }; } catch (e) { query = { id: id }; }

      await usersCollection.updateOne(query, { $set: { role: role || 'admin' } });
      const updatedUser = await usersCollection.findOne(query);

      res.json({ success: true, message: `Role updated to ${role}`, user: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // DELETE /api/admin/users/:id — Delete User Account
  router.delete('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      let query;
      try { query = { _id: new ObjectId(id) }; } catch (e) { query = { id: id }; }

      await usersCollection.deleteOne(query);
      res.json({ success: true, message: 'User account deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // PATCH /api/admin/lessons/:id/featured — Toggle Featured Status
  router.patch('/lessons/:id/featured', async (req, res) => {
    try {
      const { id } = req.params;
      let query;
      try { query = { _id: new ObjectId(id) }; } catch (e) { query = { id: id }; }

      const lesson = await lessonsCollection.findOne(query);
      if (!lesson) {
        return res.status(404).json({ success: false, message: 'Lesson not found' });
      }

      const newFeaturedState = !lesson.isFeatured;
      await lessonsCollection.updateOne(query, { $set: { isFeatured: newFeaturedState } });

      res.json({
        success: true,
        message: `Lesson is now ${newFeaturedState ? 'featured on Home page' : 'removed from featured'}`,
        isFeatured: newFeaturedState
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // GET /api/admin/reports — List all reported content with reason logs
  router.get('/reports', async (req, res) => {
    try {
      const reports = await reportsCollection.find({}).toArray();
      res.json({ success: true, reports });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // DELETE /api/admin/reports/:lessonId — Ignore & clear reports for a lesson
  router.delete('/reports/:lessonId', async (req, res) => {
    try {
      const { lessonId } = req.params;
      await reportsCollection.deleteMany({ lessonId });
      res.json({ success: true, message: 'Reports cleared for this lesson' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
}
