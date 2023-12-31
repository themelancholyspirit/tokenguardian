const User = require('./User')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            message: 'Authentication invalid'
        })
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = { userId: payload.userId}
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication invalid'
        })
    }
}

module.exports = verifyToken