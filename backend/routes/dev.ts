import express from 'express'
import { regenerateFixtures } from '../orm/fixtures/index.js'
import { Bid, Product, User } from '../orm/index.js'

const router = express.Router()

router.get('/api/dev/reset', async (req, res) => {
  await regenerateFixtures();
  await Bid.truncate();
  await Product.truncate();
  await User.truncate();
  res.status(200).send('OK');
})

export default router
