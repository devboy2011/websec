const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { jwtSecret, jwtExpiresIn } = require('../configs/jwt.config')

const User = require('../models/user.model')

exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body

    // Kiểm tra trùng username
    const existingUser = await User.findOne({ name: username })
    
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' })
    }

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10)

    // Tạo user mới
    const newUser = new User({
      name: username,
      password: hashedPassword,
      roles: ['CUSTOMER'],
    })

    await newUser.save()

    res.status(201).json({
      message: 'User registered successfully',
    })
  } catch (err) {
    console.error(err);
    if (res.statusCode !== 401) 
      res.status(500).json({ 
        error: "Internal Server Error"
      })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password} = req.body
    const existingUser = await User.findOne({ name: username })
      
    // Kiểm tra user tồn tại
    if (!existingUser)
        existingUser = await User.findOne({ email: username })
      
    if (!existingUser)
        return res.status(401).json({ 
          error: 'Invalid username or password' 
    })
    
      // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password,
    )
      
    if (!isPasswordValid)
        return res.status(401).json({ error: 'Invalid password' })

    const accessToken = jwt.sign(
      {
        userId: existingUser._id,
        roles: existingUser.roles,
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    )

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      body: {
        avatar: existingUser.avatar,
        name: existingUser.name,
        email: existingUser.email,
      },
    })
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" })
  }
}