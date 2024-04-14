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
  const product = await Product.findOne({
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

  if (product==null){
    res.status(404).json({ "error": "Product not found" });
    return;
  }

    // Sort bids by price and set lastPrice for each product
    product.bids.sort((a, b) => b.date.getTime() - a.date.getTime());
    if (product.bids.length == 0) { 
      product.setDataValue("lastPrice", product.originalPrice);
    } else {
      product.setDataValue("lastPrice", product.bids[0].price);
    }
  
  res.status(200).send(product);
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post('/api/products', authMiddleware, async (req: Request & {user?: Token}, res) => {
  if (req.user == undefined){
    res.status(500).send();
    return;
  }
  
  const user = await User.findByPk(req.user.id);
  if (!user) {
    res.status(404).send({ "error" : "User not found" });
    return;
  }

  if (req.body.name == undefined || req.body.name == null) {
    res.status(400).send(
      {
        "error": "Invalid or missing fields",
        "details": ["name", "name"]
      }
    );
    return;
  }

  if (req.body.description == undefined || req.body.description == null) {
      res.status(400).send(
        {
		      "error": "Invalid or missing fields",
          "details": ["name", "description"]
		    }
      );
      return;
  }

  if (req.body.category == undefined || req.body.category == null) {
      res.status(400).send(
        {
		      "error": "Invalid or missing fields",
          "details": ["name", "category"]
		    }
      );
      return;
  }

  if (req.body.originalPrice == undefined || req.body.originalPrice == null) {
      res.status(400).send(
        {
		      "error": "Invalid or missing fields",
          "details": ["name", "originalPrice"]
		    }
      );
      return;
  }

  if (req.body.pictureUrl == undefined || req.body.pictureUrl == null) {
      res.status(400).send(
        {
		      "error": "Invalid or missing fields",
          "details": ["name", "pictureUrl"]
		    }
      );
      return;
  }

  if (req.body.endDate == undefined || req.body.endDate == null) {
      res.status(400).send(
        {
		      "error": "Invalid or missing fields",
          "details": ["name", "endDate"]
		    }
      );
      return;
  }

  const product = new Product();
  product.sellerId = req.user.id;
  product.name = req.body.name;
  product.description = req.body.description;
  product.category = req.body.category;
  product.originalPrice = req.body.originalPrice;
  product.pictureUrl = req.body.pictureUrl;
  product.endDate = req.body.endDate;
  await product.save();

  res.status(201).send(product);
})

router.put('/api/products/:productId', authMiddleware, async (req: Request & {user?: Token}, res) => {
  if (req.user == undefined){
    res.status(500).send();
    return;
  }
  
  if (req.params.productId == undefined){
    res.status(400).send({
      "error": "Invalid or missing fields",
      "details": ["name", "productId"]
    });
    return;
  }
  
  const product = await Product.findByPk(req.params.productId);
  if (!product) {
    res.status(404).send({ "error" : "Product not found" });
    return;
  }

  if (req.user?.id != product.sellerId && req.user?.admin == false) {
    res.status(403).send({ "error" : "Unauthorized" });
    return;
  }

  if (req.body.name == undefined || req.body.name == null) {
      res.status(400).send(
        {
		      "error": "Invalid or missing fields",
          "details": ["name", "name"]
		    }
      );
      return;
  }

  if (req.body.description == undefined || req.body.description == null) {
      res.status(400).send(
        {
		      "error": "Invalid or missing fields",
          "details": ["name", "description"]
		    }
      );
      return;
  }

  if (req.body.category == undefined || req.body.category == null) {
      res.status(400).send(
        {
		      "error": "Invalid or missing fields",
          "details": ["name", "category"]
		    }
      );
      return;
  }

  if (req.body.originalPrice == undefined || req.body.originalPrice == null) {
      res.status(400).send(
        {
		      "error": "Invalid or missing fields",
          "details": ["name", "originalPrice"]
		    }
      );
      return;
  }

  if (req.body.pictureUrl == undefined || req.body.pictureUrl == null) {
      res.status(400).send(
        {
		      "error": "Invalid or missing fields",
          "details": ["name", "pictureUrl"]
		    }
      );
      return;
  }

  if (req.body.endDate == undefined || req.body.endDate == null) {
      res.status(400).send(
        {
		      "error": "Invalid or missing fields",
          "details": ["name", "endDate"]
		    }
      );
      return;
  }

  product.name = req.body.name;
  product.description = req.body.description;
  product.category = req.body.category;
  product.originalPrice = req.body.originalPrice;
  product.pictureUrl = req.body.pictureUrl;
  product.endDate = req.body.endDate;
  await product.save();

  res.status(200).send(product);
})

router.delete('/api/products/:productId', authMiddleware, async (req: Request & {user?: Token}, res) => {
  if (req.user == undefined){
    res.status(500).send();
    return;
  }

  if (req.params.productId == undefined){
    res.status(400).send({
      "error": "Invalid or missing fields",
      "details": ["name", "productId"]
    });
    return;
  }
  
  const product = await Product.findByPk(req.params.productId);
  if (!product) {
    res.status(404).send("User not found");
    return;
  }

  if (req.user?.id != product.sellerId && req.user?.admin == false) {
    res.status(403).send({ "error" : "Unauthorized" });
    return;
  }

  await Bid.destroy({ where: { productId: product.id }});
  await Product.destroy({ where: { id: product.id }});

  res.status(204).send();
})

export default router
