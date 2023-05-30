const bcrypt = require('bcrypt');
const mysql = require('mysql');
const connection = require('./db');

async function registerUser(req, res) {
  const { id, firstName, lastName, email, password, address, url_photo_profile, phone_number } = req.body;

  if (!id || !firstName || !lastName || !email || !password || !address || !phone_number) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const existingUserPhone = await getUserByPhoneNumber(phone_number);
  if (existingUserPhone) {
    return res.status(409).json({ message: 'Phone number already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      url_photo_profile,
      phone_number,
    };

    await saveUser(newUser);

    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function getUserByPhoneNumber(phoneNumber) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users WHERE phone_number = ?', [phoneNumber], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function saveUser(user) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO users SET ?', user, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  registerUser,
};
