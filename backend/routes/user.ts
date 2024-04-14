import express from 'express'
import { Bid, Product, User } from '../orm/index.js';

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  if (req.params.userId == undefined){
    res.status(400).send({
      "error": "Invalid or missing fields",
      "details": ["name", "userId"]
    });
    return;
  }

  const user = await User.findByPk(req.params.userId, { 
    include: [
    {
      model: Product,
      as: 'products',
      attributes: ['id', 'name', 'description', 'category', 'originalPrice', 'pictureUrl', 'endDate'],
    },
    {
      model: Bid,
      as: 'bids',
      attributes: ['id', 'price', 'date'],
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name'],
      }],
    },
  ]});
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  res.status(200).send(user);
})

export default router
