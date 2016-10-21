interface Quote {
    breakdown: QuoteBreakdownItem[];
    premium: Price;
    reference: string;
    total: {
        annual: QuoteDepositInstallment;
        monthly: QuoteDepositInstallment;
    }
}