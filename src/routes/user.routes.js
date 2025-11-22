const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');    
const authorizeRoles = require('../middlewares/authRolesMiddleware');

const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/profile', 
    authMiddleware,
    userController.getProfile);
router.put('/profile', 
    authMiddleware,
    userController.updateProfile);

module.exports = router;