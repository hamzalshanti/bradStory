const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Story = require('../modles/Story');

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res, next) => {
  res.render('login', { 
    title: 'Login', 
    layout: 'login' 
  });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res, next) => {
  try {
  const stories = await Story.find({ user: req.user.id }).lean();
  res.render('dashboard', { 
    title: 'dashboard',
    firstName: req.user.firstName,
    stories: stories
  });
  } catch {
    res.render('error/500');
  }
});

module.exports = router;
