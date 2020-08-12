const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../modles/Story');
const { findById, findByIdAndUpdate } = require('../modles/Story');

// @desc    Add Story
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res, next) => {
  res.render('stories/add', { 
    title: 'Add Story',  
  });
});

// @desc    Show Stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res, next) => {
    try {
        const stories = await Story.find({ status: 'public' })
                                    .populate('user').lean();
        res.render('stories/index', { stories: stories });
    } catch {
        res.render('error/500');
    }
});

// @desc    Add Story
// @route   POST /stories
router.post('/', ensureAuth, async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch {
        res.render('error/500');
    }
});

// @desc    Story details
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res, next) => {
    try {
        console.log("SS");
        let story = await Story.findById(req.params.id)
                            .populate('user').lean();
        if(!story) return res.render('/dashboard');

        res.render('stories/show', { story: story });
    } catch {
        res.render('error/404');
    }
});

// @desc    show ditpages
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.id).lean();
        if(!story || req.user.id != story.user) {
            res.redirect('/');
        }else {
            res.render('stories/edit', { 
                title: 'Edit Story',  
                story: story
            });
        }
    } catch {
        res.render('error/404');
    }
});

// @desc    show ditpages
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res, next) => {
    try {
        let story = await Story.findById(req.params.id);
        if(!story || req.user.id != story.user) {
            res.redirect('/');
        }else {
            story = await Story.findByIdAndUpdate(req.params.id, req.body);
            res.redirect('/dashboard');
        }
    } catch {
        res.render('error/500');
    }
});


// @desc    Delter Story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res, next) => {
    try {
        let story = await Story.findByIdAndRemove(req.params.id);
        res.redirect('/dashboard');
    } catch {
        res.render('error/500');
    }
});

// @desc    show user stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res, next) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean();
        if(!stories) return res.render('stories/404');
        res.render('stories/index', { stories: stories });
    } catch {
        res.render('stories/404');
    }
});
  

module.exports = router;
