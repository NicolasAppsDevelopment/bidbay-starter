/*import express from 'express'
import { User } from '../orm/index.js';

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
      res.status(500).send();
  }
});

export default router*/

import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  res.status(600).send()
})

export default router
