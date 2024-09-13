const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// PostgreSQL pool configuration
const pool = new Pool({
  user: 'postgres', // Your PostgreSQL username
  host: 'localhost',
  database: 'transactions', // Your database name
  password: '!12TreFyra', // Your PostgreSQL password
  port: 5432,
});

// Users to insert
const users = [
  { name: 'chris', password: 'christoffer' },
  { name: 'tom', password: 'tommy' }
];

// Hash passwords and insert users into the database
const addUsers = async () => {
  for (const user of users) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Insert user into the users table
      const query = 'INSERT INTO users (name, password) VALUES ($1, $2)';
      await pool.query(query, [user.name, hashedPassword]);

      console.log(`User ${user.name} added with hashed password.`);
    } catch (err) {
      console.error('Error inserting user:', err);
    }
  }

  // Close the pool connection when done
  pool.end();
};

// Run the function to add users
addUsers();
