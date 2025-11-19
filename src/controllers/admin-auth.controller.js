const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin.model');

const { jwtSecret, jwtExpiresIn } = require('../configs/jwt.config');


exports.login = async (req, res) => {
  try {
    const { username, password} = req.body;

    // Kiểm tra user tồn tại
    const existingUser = await Admin.findOne({ username});
    
    if (!existingUser)
      return res.status(401).json({ error: 'Invalid username or password' });
    
    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    
    if (!isPasswordValid) 
      return res.status(401).json({ error: 'Invalid username or password' });
       
    const accessToken = jwt.sign(
      { 
        userId: existingUser._id, 
        roles: existingUser.roles,
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );
    
    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      body: {
        username: existingUser.username,
        avatar: existingUser.avatar,
      }
    })
    
  } catch (err) {
    if (res.statusCode !== 401) 
    res.status(500).json({ error: err.message });
  }
};

exports.createManager = async (req, res) => {
  try {
    const {username, password} = req.body;

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
      roles: ['MANAGER'],
    });

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