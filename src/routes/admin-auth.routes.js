const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/admin-auth.controller');

const authMiddleware = require('../middlewares/authMiddleware');    
const authorizeRoles = require('../middlewares/authRolesMiddleware');

router.post('/login', adminAuthController.login);
router.post('/manager/add', 
    authMiddleware,
    authorizeRoles(['ADMIN']),
    adminAuthController.createManager
);

module.exports = router;