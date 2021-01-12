const userRouter = require('express').Router();

const {
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/me', getUserInfo);

module.exports = userRouter;
