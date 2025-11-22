const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business.controller');

const authMiddleware = require('../middlewares/authMiddleware');    
const {authorizeRoles, hasAnyRoles, hasRole} = require('../middlewares/authRolesMiddleware');

router.get('/', 
    authMiddleware, 
    authorizeRoles('CUSTOMER'), 
    businessController.getBusiness);
    
router.post('/', 
    authMiddleware, 
    authorizeRoles('CUSTOMER'), 
    businessController.doBusiness);
    
router.get('/product',
    authMiddleware, 
    authorizeRoles('CUSTOMER'),
    businessController.getBusiness
)

router.post('/product',
    authMiddleware, 
    authorizeRoles('STAFF'),
    businessController.doBusiness
)

router.get('/order',
    authMiddleware, 
    hasAnyRoles('CUSTOMER', 'ADMIN'),
    businessController.getBusiness
)

router.post('/order',
    authMiddleware, 
    authorizeRoles('STAFF'),
    businessController.doBusiness
)

router.get('/basement',
    authMiddleware, 
    hasAnyRoles('STAFF', 'ADMIN'),
    businessController.getBusiness
)

router.post('/basement',
    authMiddleware, 
    hasRole('ADMIN'),
    businessController.doBusiness
)

module.exports = router;