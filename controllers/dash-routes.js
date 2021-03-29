const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment, Vote} = require('../models');
const withAuth = require('../utils/auth');


router.get('/', withAuth, (req,res)=>{
    Post.findAll({
        where:{
            user_id: req.session.user_id
        },
        attributes:[
            'id',
            'textbody',
            'title',
            'created_at',
        ],
        include: [    
            {
                model:Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include:{
                    model: User,
                    attributes:['username']
                }
            },          
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => {
        const posts = dbPostData.map(post => post.get({plain:true}));
        console.log(posts)
     
        res.render('dashboard', {
            posts,
            loggedIn: req.session.loggedIn,
            userName: req.session.username,
          });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


router.get('/edit/:id', withAuth, (req, res) => {
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
       
        res.render('edit-post', {
        post,
        loggedIn: req.session.loggedIn,
        userName: req.session.username
        });
        
      })
      .catch(err => {
        
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router