const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business.controller');

const authMiddleware = require('../middlewares/authMiddleware');    
const authorizeRoles = require('../middlewares/authRolesMiddleware');

router.get('/', 
    authMiddleware, 
    authorizeRoles('CUSTOMER'), 
    businessController.getBusiness);
    
router.post('/', 
    authMiddleware, 
    authorizeRoles('CUSTOMER'), 
    businessController.doBusiness);

module.exports = router;