require('dotenv').config();
const db = require('./src/models');

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await db.sequelize.authenticate();
    console.log('✅ Database connection established');
    
    console.log('🔄 Creating tables from models...');
    // Use alter: true to update tables to match models without losing data
    await db.sequelize.sync({ alter: true });
    console.log('✅ All tables created successfully!');
    
    console.log('\n📊 Tables in database:');
    const tables = await db.sequelize.query(
      "SHOW TABLES",
      { type: db.sequelize.QueryTypes.SELECT }
    );
    tables.forEach(table => console.log('  -', Object.values(table)[0]));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

setupDatabase();
