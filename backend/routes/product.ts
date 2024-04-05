import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'
import { Sequelize } from 'sequelize'

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  const products = await Product.findAll(
    {attributes: [
      'id',
      'name',
      'description',
      'category',
      'originalPrice',
      [Sequelize.literal(`(SELECT price FROM Bids WHERE productId = Product.id AND date in (SELECT MAX(date) FROM 'Bids'))`), 'lastPrice'],
      'pictureUrl',
      'endDate',

      [Sequelize.literal(`(SELECT id,username FROM Users WHERE id = Product.sellerId)`), 'seller'],
      [Sequelize.literal(`(SELECT id,price,date FROM Bids WHERE productId = Product.id)`), 'bids']]
    }
  );
  res.status(200).send(products)
})

router.get('/api/products/:productId', async (req, res) => {
  const products = await Product.findAll({
    where:{ 
      'id' : req.params.productId
    }, 
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
        model:User,
        as: 'seller',
        attributes:['id','username'] 
      },
      {
        model:Bid,
        as: 'bids',
        attributes:['id','price','date',include: [
          {
            model:User,
            as: 'bidder',
            attributes:['id','username'] 
          }
        ] ] 
      }

    ]
    
});
  res.status(200).send(products)
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
