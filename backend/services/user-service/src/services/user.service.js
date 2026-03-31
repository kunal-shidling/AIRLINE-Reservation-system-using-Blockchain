const User = require('../models/User.model');
const JWTUtil = require('../utils/jwt.util');
const Logger = require('../../../../shared/utils/logger');

class UserService {
  async register(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = new User(userData);
      await user.save();

      Logger.success('USER-SERVICE', `New user registered: ${user.email}`);

      const token = JWTUtil.generateToken(user._id, user.email, user.role);

      return {
        token,
        user: user.toPublicJSON()
      };
    } catch (error) {
      Logger.error('USER-SERVICE', 'Registration failed', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        throw new Error('Account is inactive');
      }

      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      Logger.success('USER-SERVICE', `User logged in: ${user.email}`);

      const token = JWTUtil.generateToken(user._id, user.email, user.role);

      return {
        token,
        user: user.toPublicJSON()
      };
    } catch (error) {
      Logger.error('USER-SERVICE', 'Login failed', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return user.toPublicJSON();
    } catch (error) {
      Logger.error('USER-SERVICE', 'Get user failed', error);
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      delete updateData.password;
      delete updateData.email;
      delete updateData.role;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      Logger.success('USER-SERVICE', `User updated: ${user.email}`);

      return user.toPublicJSON();
    } catch (error) {
      Logger.error('USER-SERVICE', 'Update user failed', error);
      throw error;
    }
  }

  async updatePreferences(userId, preferences) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { preferences } },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      Logger.success('USER-SERVICE', `Preferences updated for: ${user.email}`);

      return user.toPublicJSON();
    } catch (error) {
      Logger.error('USER-SERVICE', 'Update preferences failed', error);
      throw error;
    }
  }
}

module.exports = new UserService();
