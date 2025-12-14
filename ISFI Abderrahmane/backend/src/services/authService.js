const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, RefreshToken } = require('../models');

class AuthService {
  /**
   * Hash password
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate access token (JWT)
   */
  generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: process.env.JWT_EXPIRY || '15m',
    });
  }

  /**
   * Generate refresh token (JWT)
   */
  generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key', {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    });
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key');
    } catch (error) {
      return null;
    }
  }

  /**
   * Register new user
   */
  async register({ email, password, firstName, lastName, companyName }) {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error('Email already exists');
      error.status = 409;
      throw error;
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
    });

    // Generate tokens (auto-login after registration)
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    // Save refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async login({ email, password }) {
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    // Save refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refresh(refreshToken) {
    // Verify refresh token
    const decoded = this.verifyRefreshToken(refreshToken);
    if (!decoded) {
      const error = new Error('Invalid refresh token');
      error.status = 401;
      throw error;
    }

    // Check if token exists in DB and not revoked
    const storedToken = await RefreshToken.findOne({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.revoked_at) {
      const error = new Error('Refresh token has been revoked');
      error.status = 401;
      throw error;
    }

    if (new Date() > storedToken.expires_at) {
      const error = new Error('Refresh token has expired');
      error.status = 401;
      throw error;
    }

    // Generate new access token
    const newAccessToken = this.generateAccessToken(decoded.userId);

    return {
      accessToken: newAccessToken,
    };
  }

  /**
   * Logout user (revoke refresh token)
   */
  async logout(refreshToken) {
    const token = await RefreshToken.findOne({
      where: { token: refreshToken },
    });

    if (token) {
      await token.update({ revoked_at: new Date() });
    }

    return { message: 'Logged out successfully' };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      companyName: user.company_name,
      currency: user.currency,
      address: user.address,
      taxId: user.tax_id,
    };
  }
}

module.exports = new AuthService();
