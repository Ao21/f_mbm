interface Price {
    annual: BasicPrice,
    monthly: BasicPrice
}

interface BasicPrice {
    amount: number;
    str: string;
    symbol: string;
    currency: string;
    pretty: string;
}
