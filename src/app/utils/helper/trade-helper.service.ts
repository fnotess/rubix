import { Injectable } from '@angular/core';

@Injectable()
export class TradeHelperService {

	/**
	* Return price ratio
	* @param value Input value
	* @param isExg Is exchange
	*/
	// TODO: [Malindu] Complete this
	getPriceRatios(value : number , isExg : boolean) : number {
		const rate = 1;
		return rate;
	}
}
