interface PaymentOption {
    type: string;
    display: string;
    multiplier: number;
    active: boolean;
    options: String[]
}