import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import { pool } from './db.js';

const MySQLStore = MySQLStoreFactory(session);

const sessionStore = new MySQLStore({}, pool);

export const sessionMiddleware = session({
  name: 'food_reimb_sid',
  secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 8,
    httpOnly: true,
    sameSite: 'lax'
  }
});
