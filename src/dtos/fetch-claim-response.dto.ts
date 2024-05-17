export interface FetchClaimResponseDto {
	id?: string | null;
	date?: string | null;
	type?: string | null;
	requestedBy?: string | null;
	requestedAmt?: string | null;
	approvedAmt?: string | null;
	currency?: string | null;
	requestPhase?: string | null;
	notes?: string | null;
	approvedBy?: string | null;
	declinedBy?: string | null;
	receiptName?: string | null;
	receipt?: string | null;
}
