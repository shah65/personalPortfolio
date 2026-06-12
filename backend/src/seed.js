const userModel = require('./module/user.module');
const bcrypt = require('bcrypt');

const seedDefaultUser = async () => {
  try {
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'ctech8868@gmail.com';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'shah324725';
    const defaultUserName = process.env.DEFAULT_ADMIN_USERNAME || 'admin';

    // Check if user already exists
    const existingUser = await userModel.findOne({ email: defaultEmail });

    if (!existingUser) {
      // Hash password
      const hashedPassword = await bcrypt.hash(defaultPassword, 12);

      // Create default user
      const user = await userModel.create({
        userName: defaultUserName,
        email: defaultEmail,
        password: hashedPassword,
        role: 'FULLSTACK',
        isActive: true
      });

      console.log(`✅ Default admin user created: ${defaultEmail}`);
      console.log(`   Password: ${defaultPassword}`);
      return user;
    } else {
      console.log(`✅ Default admin user already exists: ${defaultEmail}`);
      return existingUser;
    }
  } catch (error) {
    console.error('❌ Error seeding default user:', error.message);
  }
};

module.exports = seedDefaultUser;