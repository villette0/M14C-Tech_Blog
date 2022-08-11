const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        // Get all posts and JOIN with user data
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        // Serialize data so the template can read it
        const posts = postData.map((post) => post.get({ plain: true }));

        // Pass serialized data and session flag into template
        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/post/:id', async (req, res) => {
    try {
        // Get one post, and include the username and comments connected to it. The comments will also include the username connected to it.
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: ['comment', 'user_id', 'date_created'],
                    include: [{model: User, attributes: ['username']}]
                },
            ],
        });

        const post = postData.get({ plain: true });
        console.log(post);
        res.render('single-post', {
            ...post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


// Use withAuth middleware to prevent access to route  - only if logged in
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        // Find the logged in user based on the session ID
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            // also get the posts the user has made to be displayed on dashboard
            include: [{ model: Post }],
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/new-post', withAuth, async (req, res) => {
    res.render('new-post', {
        logged_in: req.session.logged_in
    });
});

router.get('/edit-post/:id', withAuth, async (req, res) => {
    try {
        // Get one post, don't need to include anything with it.
        const postData = await Post.findByPk(req.params.id, {});

        const post = postData.get({ plain: true });

        res.render('edit-post', {
            ...post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

    res.render('login');
});

module.exports = router;
