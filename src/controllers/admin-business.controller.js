const Admin = require('../models/admin.model');
const Log = require('../models/log.model');

const bcrypt = require('bcrypt');

exports.createAdmin = async (req, res) => {
  try {
    const {username, password} = req.body;
    const adminId = req.user.userId;

    // Kiểm tra trùng email
    const existingUser = await Admin.findOne({username});
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      roles: ['ADMIN'],
    });
    
    const log = new Log({
        action: 'CREATE',
        entity: 'Admin',
        userId: adminId,
        content: `Created admin user: ${username}`,
    })

    await log.save();
    await newAdmin.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newAdmin.username,
        roles: newAdmin.roles,
        status: newAdmin.status,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const {username, password} = req.body;
    const adminId = req.user.userId;
    
    // Kiểm tra trùng email
    const existingUser = await Admin.findOne({username});
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      roles: ['STAFF'],
    });
    
    const log = new Log({
        action: 'CREATE',
        entity: 'Admin',
        userId: adminId,
        content: `Created staff user: ${username}`,
    })

    await log.save();
    await newAdmin.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newAdmin.username,
        roles: newAdmin.roles,
        status: newAdmin.status,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const adminId = req.user.userId;
        
        const admins = await Admin.find({
            roles: { $in: ['ADMIN']}
        }, '-password'); 
        
        const log = new Log({
            action: 'CREATE',
            entity: 'Admin',
            userId: adminId,
            content: `Retrieved all admins`,
        })
     await log.save();
        
    if (!admins) {
        return res.status(200).json({ 
            message: 'No admins found' });
    }
    
    res.status(200).json({ 
        message: 'Admins retrieved successfully',
        body: admins 
});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal error' });
    }
}

exports.grantAdminRole = async (req, res) => {
    try{
        const { adminId } = req.params;
        const managerId = req.user.userId;
        
        const admin = await Admin.findById(adminId);
        
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        
        if (admin.roles.includes('ADMIN')) {
            return res.status(400).json({ error: 'Admin already has ADMIN role' });
        }
        
        admin.roles.push('ADMIN');
        
        const log = new Log({
            action: 'CREATE',
            entity: 'Admin',
            userId: managerId,
            content: `Granted ADMIN role to user: ${admin.username}`,
        })
        
        await log.save();
        await admin.save();

        res.status(200).json({ message: 'Admin role granted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.revokeAdminRole = async (req, res) => {
    try{
        const { adminId } = req.params;
        const managerId = req.user.userId;
        
        const admin = await Admin.findById(adminId);
        
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        
        if (!admin.roles.includes('ADMIN')) {
            return res.status(400).json({ error: 'Admin does not have ADMIN role' });
        }
        
        admin.roles = admin.roles.filter(role => role !== 'ADMIN');
        
        const log = new Log({
            action: 'CREATE',
            entity: 'Admin',
            userId: managerId,
            content: `Revoked ADMIN role from user: ${admin.username}`,
        })
        await log.save();
        await admin.save();

        res.status(200).json({ message: 'Admin role revoked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}