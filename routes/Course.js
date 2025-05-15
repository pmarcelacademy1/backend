import express from 'express';
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
const router = express.Router();
import Course from "../models/Course.js";


router.get('/', async (req, res) => {
  try {
    const { ids } = req.query;
    let courses;
    if (ids) {
      const idArray = ids.split(',');
      courses = await Course.find({ _id: { $in: idArray } });
    } else {
      courses = await Course.find();
    }
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// Public route - anyone can view courses
// router.get('/', async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Public route - anyone can view specific course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authenticated routes
const authRouter = express.Router();
authRouter.use(ClerkExpressWithAuth());

// Admin-only routes with embedded auth
authRouter.post('/', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    // Check authentication
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized: No user authenticated' });
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
      return res.status(403).json({error: 'Forbidden: Admin access required'});
    }

    // Create course
    const course = new Course({
      ...req.body,
      // user: req.auth.clerkUserId
    });
    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

authRouter.put('/:id', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    // Check authentication
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized: No user authenticated' });
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
      return res.status(403).json({error: 'Forbidden: Admin access required'});
    }
    // Update course
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Course update error:', error);
    res.status(400).json({ error: error.message });
  }
});

authRouter.delete('/:id', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    // Check authentication
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized: No user authenticated' });
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
      return res.status(403).json({error: 'Forbidden: Admin access required'});
    }

    // Delete course
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Course deletion error:', error);
    res.status(500).json({ error: 'Error deleting course' });
  }
});

router.use(authRouter);

export default router;