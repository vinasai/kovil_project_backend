const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();


const JWT_SECRET = 'KP#24';

// Token verification middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Register route
router.post("/register", async (req, res) => {
    try {
        const { email, password, role} = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email,
            password: hashedPassword,
            role:'admin'&& 'user'
        
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role , email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            role: user.role
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: "Server error during registration", 
            error: error.message 
        });
    }
});


// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password); // bcrypt.compare should be used here
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            role: user.role,
            userId: user._id
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: "Server error during login", 
            error: error.message 
        });
    }
});


// Change password route
router.post("/change-password", verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ 
            message: "Server error during password change", 
            error: error.message 
        });
    }
});

// Logout route
router.post('/logout', verifyToken, (req, res) => {
    try {
        // Optional: Clear server-side session or other data if necessary
        // Example: req.session.destroy(); // If using sessions

        // Respond with a success message
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
});

router.delete("/:userId", verifyToken, async (req, res) => {
    try {
        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                message: "Not authorized to delete users" 
            });
        }

        const userId = req.params.userId;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }
        if (req.user.id === userId) {
            return res.status(400).json({ 
                message: "Cannot delete your own account" 
            });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ 
            message: "User deleted successfully" 
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ 
            message: "Server error while deleting user",
            error: error.message 
        });
    }
});

// Update user route
router.put("/:userId", verifyToken, async (req, res) => {
    try {
        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                message: "Not authorized to edit users" 
            });
        }

        const userId = req.params.userId;
        const {  email, role } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        // If email is being changed, check if new email already exists
        if (email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ 
                    message: "Email already in use" 
                });
            }
        }

        // Update user fields
        const updateData = {
    
            email: email || user.email,
            role: role || user.role,
           
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from response

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ 
            message: "Server error while updating user",
            error: error.message 
        });
    }
});


router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;
