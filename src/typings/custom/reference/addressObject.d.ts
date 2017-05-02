interface addressObject {
	address: string,
	id: number,
	isEcho?: boolean
	addressLine1?: string;
	addressLine2?: string;
	area?: string;
	county?: string;
	lookups?: addressObject[];
	selected?: addressObject;
}
