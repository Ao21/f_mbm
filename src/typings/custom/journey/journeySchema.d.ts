interface JourneySchema {
    name: string;
    basePrice: number;
    coverLevel: {
        benefits: JourneyBenefit[];
    };
    paymentOptions: PaymentOption[];
    criteria: {
        adults?: {
            header: string;
            max: string;
            overides: MemberType;
            defaults: MemberType;
        }
    }
}