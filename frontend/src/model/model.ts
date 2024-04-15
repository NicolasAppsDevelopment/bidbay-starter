type Product = {
    id: string,
    name: string
};

type ProductDetail = {
    id: string,
    name: string,
    description: string,
    category: string,
    originalPrice: number,
    pictureUrl: string,
    endDate: string
};

type Seller = {
    id: string,
    username: string
};

type Bidder = {
    id: string,
    username: string
};

type Bid = {
    id: string,
    price: number,
    date: string,
};

type BidWithBidder = {
    id: string,
    price: number,
    date: string,
    bidder: Bidder,
};

type BidWithProduct = {
    id: string,
    price: number,
    date: string,
    product: Product,
};


export type HomeProducts ={
    id: string,
    name: string,
    description: string,
    category: string,
    originalPrice: number,
    lastPrice: number,
    pictureUrl: string,
    endDate: string,
    seller:Seller,
    bids: Bid[]
}[];

export type ViewProduct = {
    id: string,
    name: string,
    description: string,
    category: string,
    originalPrice: number,
    pictureUrl: string,
    endDate: string,
    seller: Seller,
    bids: BidWithBidder[]
};

export type UserProducts = {
    id: string,
    username: string,
    email: string,
    password: string,
    products: ProductDetail[],
    bids: BidWithProduct[]
};