import { Component } from '@angular/core';
import { UtilsService } from './utils/utils.service';
import { CommonHelperService } from './utils/helper/common-helper.service';
import { PriceService } from './app-backend/price/price.service';
import { LoggerService } from './utils/logger.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {

	private title = 'Rubix test page';
	private result : string;
	private inputValues : string;

	constructor(
		private commonHelperService : CommonHelperService ,
		private utilsService : UtilsService ,
		private priceService : PriceService,
		private loggerService : LoggerService) {}

	public convert() : void {
		// console.log(this.commonHelperService.getMonth('Jan'));
		this.result = this.commonHelperService.formatDate('20170218142324' , 'YYYY-MM-DD hh:mm:ss' , {});
		this.inputValues = this.commonHelperService.getMonth('Jan');
	}

	public changeLang() : void {
		if (this.utilsService.geLocalizationManager().getActiveLanguage() === 'EN') {
			this.utilsService.geLocalizationManager().setActiveLanguage('AR');
		} else {
			this.utilsService.geLocalizationManager().setActiveLanguage('EN');
		}
	}

	private getPrice() : void {
		this.loggerService.logInfo(this.inputValues);
		this.priceService.addSymbolRequest(this.inputValues);
	}
}

