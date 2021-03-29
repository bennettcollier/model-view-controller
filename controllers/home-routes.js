const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');
const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    console.log(req.session);
  
    Post.findAll({
      attributes: [
        'id',
        'title',
        'created_at',  
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({plain:true}));
        console.log(posts)
        res.render('startpage', {
          posts,
          loggedIn: req.session.loggedIn,
          userName: req.session.username,
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'textbody', 
      'title',
      'created_at'    
    ],
    include: [  
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      
      {
        model: User,
        attributes: ['username']
      }   
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'There is no post with this ID.' });
        return;
      }

      const post = dbPostData.get({ plain: true });
      
      console.log(post);
     
      res.render('show-post', {
      post,
      userName: req.session.username,
      loggedIn: req.session.loggedIn,
      });
      
    })
    .catch(err => {
      
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/signin', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('signin');
  });
  
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('signup');
  });

module.exports = router;
