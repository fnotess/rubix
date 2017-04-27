import { Component, Injector } from '@angular/core';
import { BaseWidgetComponent } from '../../widget-util/base-widget/base-widget.component';
import { LocalizationService } from '../../../utils/localization/localization.service';
import { PriceService } from '../../../app-backend/price/price.service';
import { RangeSliderComponent } from '../../widget-util/sub-components/range-slider/range-slider.component';

@Component({
	selector: 'app-detail-quote',
	templateUrl: './detail-quote.component.html',
})
export class DetailQuoteComponent extends BaseWidgetComponent {

	public response: Array<any> = [] ;
	private session = '';
	public stockObj;

	constructor(
		private priceService: PriceService,
		public localizationService: LocalizationService,
		injector: Injector,
	) {
		super(injector);
		this.stockObj = this.priceService.stockDM.getOrAddStock(this.exgStock);

		// Temp
		this.updatePriceResponse();
	}

	private updatePriceResponse(): void {
		this.priceService.getPriceResponseStream().subscribe(response => {
			this.response.push(response);
			if (response && response[0] && response[0].MT === '-1') {
				this.session = response[0].SESSION;
			}
		});
	}

	public onInit(): void {
		if (!this.stockObj) {
			this.stockObj = this.priceService.stockDM.getOrAddStock(this.exgStock);
		}

		this.priceService.requestSymbolMeta(this.exgStock);
		this.priceService.addSymbolRequest(this.exgStock);
	}

	public onDestroy(): void {
		// Remove the symbol subscription
		this.priceService.removeSymbolRequest(this.exgStock);
	}
}