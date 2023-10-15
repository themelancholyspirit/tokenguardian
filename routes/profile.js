const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../User');
const jwtMiddleware = require('../jwtMiddleware');

const router = express.Router();


router.get('/', jwtMiddleware, async (req, res) => {

    try {
      const user = await User.findById(req.user.userId); // Assuming you extract the user ID from the JWT
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const excludedPassword = {
        username: user.username,
        email: user.email
      }
      res.status(200).json(excludedPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user profile' });
    }
  });


router.delete('/delete-account', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have extracted the user ID from the JWT
    console.log(userId)
    const user = await User.findByIdAndDelete(userId);
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Additional cleanup or tasks can be added here (e.g., deleting associated data)

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});


router.put('/change-password', jwtMiddleware, async (req, res) => {
    try {


      const userId = req.user.userId; // Assuming you have extracted the user ID from the JWT
      const { currentPassword, newPassword } = req.body;


      const user = await User.findById(userId);
  

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  

      const isMatch = await user.comparePassword(currentPassword);
      console.log('here?!')
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
  
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error changing password' });
    }
  });

module.exports = router;
