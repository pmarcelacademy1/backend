import { clerkClient } from '@clerk/express';

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ error: 'Unauthorized: No user authenticated' });
    }

    const user = await clerkClient.users.getUser(req.auth.userId);
    
    // Assuming you store admin status in Clerk's publicMetadata
    const isAdmin = user.publicMetadata?.isAdmin === true;
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    
    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};