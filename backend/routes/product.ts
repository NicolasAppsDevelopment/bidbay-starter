import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'
import { Sequelize } from 'sequelize'

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  const products = await Product.findAll({
    attributes: [
      'id',
      'name',
      'description',
      'category',
      'originalPrice',
      'pictureUrl',
      'endDate',
    ],
    include: [
      {
        model: User,
        as: 'seller',
        attributes: ['id', 'username'],
      },
      {
        model: Bid,
        as: 'bids',
        attributes: ['id', 'price', 'date'],
      },
    ],
  });

  // Sort bids by price and set lastPrice for each product
  products.forEach(product => {
    product.bids.sort((a, b) => b.date.getTime() - a.date.getTime());
    if (product.bids.length == 0) { 
      product.setDataValue("lastPrice", product.originalPrice);
    } else {
      product.setDataValue("lastPrice", product.bids[0].price);
    }
  });

  
  res.status(200).send(products)
})

router.get('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post('/api/products', (req, res) => {
  res.status(600).send()
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

export default router
