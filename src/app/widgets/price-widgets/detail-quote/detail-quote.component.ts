import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { PriceService } from '../../../app-backend/price/price.service';

@Component({
	selector: 'app-detail-quote',
	templateUrl: './detail-quote.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailQuoteComponent implements OnInit, OnDestroy {

	public stockObj;
	private exgStock: [string, string] = ['TDWL', '1010'];

	constructor(private priceService: PriceService) {
		// Constructor
		this.stockObj = this.priceService.stockDM.getOrAddStock(this.exgStock);

		// TODO: [Amila] Below is hardcoded until the login is impmented
		const authParams: Object = {
			priceVerion: '1',
			userName: 'amila',
			password: 'password',
			userType: '30',
			subType: '1',
			omsId: 10,
			brokerCode: 'MFS_UAT',
		};
		this.priceService.authenticateWithUsernameAndPassword(authParams, 2);
	}

	public ngOnInit(): void {
		// on init
		if (!this.stockObj) {
			this.stockObj = this.priceService.stockDM.getOrAddStock(this.exgStock);
		}

		if (!this.stockObj.isMetaDataLoaded) {
			// this.priceService.requestSymbolMeta(this.exgStock);
		}

		// Add the symbol subscription
		this.priceService.addSymbolRequest(this.exgStock);
	}

	public ngOnDestroy(): void {
		// Remove the symbol subscription
		this.priceService.removeSymbolRequest(this.exgStock);
	}
}