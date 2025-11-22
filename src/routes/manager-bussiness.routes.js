const express = require('express');
const router = express.Router();
const adminBusinessController = require('../controllers/admin-business.controller');

const authMiddleware = require('../middlewares/authMiddleware');    
const {authorizeRoles} = require('../middlewares/authRolesMiddleware');

router.post('/add-admin', 
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminBusinessController.createAdmin
);

router.post('/add-staff',
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminBusinessController.createStaff
);

router.get('/admins',
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminBusinessController.getAllAdmins
);


router.put('/grant-admin/:adminId',
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminBusinessController.grantAdminRole
);

router.put('/revoke-admin/:adminId',
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminBusinessController.revokeAdminRole
);

router.get('/logs',
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminBusinessController.getLogs
);

module.exports = router;