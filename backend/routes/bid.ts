import authMiddleware from '../middlewares/auth.js'
import { Bid, Product } from '../orm/index.js'
import express, { Request } from 'express'
import { getDetails } from '../validators/index.js'
import { Token } from '../types/types'

const router = express.Router()

router.delete('/api/bids/:bidId', authMiddleware, async (req: Request & {user?: Token}, res) => {
  if (req.user == undefined){
    res.status(500).send();
    return;
  }

  if (req.params.bidId == undefined){
    res.status(400).send({
      "error": "Invalid or missing fields",
      "details": ["name", "bidId"]
    });
    return;
  }
  
  const bid = await Bid.findByPk(req.params.bidId);
  if (!bid) {
    res.status(404).send("Bid not found");
    return;
  }

  if (req.user?.id != bid.bidderId && req.user?.admin == false) {
    res.status(403).send({ "error" : "Unauthorized" });
    return;
  }

  await Bid.destroy({ where: { id: bid.id }});

  res.status(204).send();
})

router.post('/api/products/:productId/bids', authMiddleware, async (req: Request & {user?: Token}, res) => {
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

  if (req.body.price == undefined || req.body.price == null) {
    res.status(400).send(
      {
        "error": "Invalid or missing fields",
        "details": ["name", "price"]
      }
    );
    return;
  }

  const bid = await Bid.create({ 
    productId: req.params.productId,
    bidderId:req.user?.id,
    price:req.body.price,
    date: new Date()
  });

  res.status(201).send(bid);
})

export default router
