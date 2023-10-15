require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())

const authRouter = require('./routes/auth')
const jwtMiddleware = require('./jwtMiddleware')
const connectDB = require('./dbConnect')
const User = require('./User')

const port = process.env.PORT || 3000

app.use('/auth', authRouter)

app.get('/profile', jwtMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId); // Assuming you extract the user ID from the JWT
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user profile' });
    }
  });

app.delete('/delete-account', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have extracted the user ID from the JWT
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Additional cleanup or tasks can be added here (e.g., deleting associated data)

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});


app.put('/change-password', jwtMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId; // Assuming you have extracted the user ID from the JWT
      const { currentPassword, newPassword } = req.body;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await user.comparePassword(currentPassword);
  
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
  

async function startServer() {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => 
            console.log(`Server is listening on port ${port}`)
        )
    } catch (error) {
        console.log(error)

        console.log("Error starting the server.")        
    }
}

startServer()