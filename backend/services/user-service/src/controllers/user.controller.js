const UserService = require('../services/user.service');
const Logger = require('../../../../shared/utils/logger');

class UserController {
  async register(req, res) {
    try {
      const result = await UserService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      Logger.error('USER-CONTROLLER', 'Registration error', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await UserService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      Logger.error('USER-CONTROLLER', 'Login error', error);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.params.id || req.userId;
      const user = await UserService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      Logger.error('USER-CONTROLLER', 'Get profile error', error);
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.params.id || req.userId;
      const user = await UserService.updateUser(userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      Logger.error('USER-CONTROLLER', 'Update profile error', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updatePreferences(req, res) {
    try {
      const userId = req.params.id || req.userId;
      const user = await UserService.updatePreferences(userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Preferences updated successfully',
        data: user
      });
    } catch (error) {
      Logger.error('USER-CONTROLLER', 'Update preferences error', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new UserController();
