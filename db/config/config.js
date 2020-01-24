require('dotenv').config();

module.exports = {
  development: {
    storage: process.env.DATABASE_PATH,
    dialect: 'sqlite'
  },
  test: {
    storage: process.env.DATABASE_PATH,
    dialect: 'sqlite'
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres'
  }
}
