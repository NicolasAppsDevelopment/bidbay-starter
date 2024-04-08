import express, { Request } from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { Token } from '../types/types'

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

  
  res.status(200).send(products);
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
        attributes:['id','price','date'],
        include: [
          {
            model:User,
            as: 'bidder',
            attributes:['id','username'] 
          }
        ]
      }
    ]
  });

  if (products==null){
    res.status(404).json({ error: 'not found'});
  } 

  res.status(200).send(products);
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post('/api/products', authMiddleware, async (req: Request & {user?: Token}, res) => {
  if (req.user == undefined){
    res.status(500);
    return;
  }
  
  const user = await User.findByPk(req.user.id);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  if (req.body.name == undefined || req.body.name == null ||
    req.body.name == undefined || req.body.name == null ||
    req.body.description == undefined || req.body.description == null ||
    req.body.category == undefined || req.body.category == null ||
    req.body.originalPrice == undefined || req.body.originalPrice == null ||
    req.body.pictureUrl == undefined || req.body.pictureUrl == null ||
    req.body.endDate == undefined || req.body.endDate == null) {
      res.status(400).send("Empty fields!");
      return;
  } 

  const product = new Product();
  product.sellerId = req.user.id;
  product.name = req.body.name,
  product.description = req.body.description,
  product.category = req.body.category,
  product.originalPrice = req.body.originalPrice,
  product.pictureUrl = req.body.pictureUrl,
  product.endDate = req.body.endDate,
  await product.save();

  res.status(201).send("created");
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send();
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send();
})

export default router
