import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Channels } from '../../../constants/enums/channels.enum';
import { CommonHelperService } from '../../../utils/helper/common-helper.service';
import { DataService } from '../../../app-backend/communication/data.service';
import { LocalizationService } from '../../../utils/localization/localization.service';
import { LoggerService } from '../../../utils/logger.service';
import { PriceService } from '../../../app-backend/price/price.service';
import { ThemeService } from '../../../utils/theme.service';

@Component({
	selector: 'app-rubix-test-page',
	templateUrl: './rubix-test-page.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RubixTestPageComponent {

	public response: Array<any> = [] ;
	public inputValues: string;
	public userName = '';
	public password = '';
	public result: string;
	private session = '';

	constructor(private commonHelperService: CommonHelperService, public themeService: ThemeService,
		private priceService: PriceService, private loggerService: LoggerService, private dataService: DataService,
		private localizationService: LocalizationService) {
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

	public convert(): void {
		// console.log(this.commonHelperService.getMonth('Jan'));
		// this.result = this.utilsService.formatDate('20170218142324' , 'YYYY-MM-DD hh:mm:ss' , {});
		// this.inputValues = this.commonHelperService.getMonth('Jan');
	}

	public changeLang(): void {
		if (this.localizationService.getActiveLanguage() === 'EN') {
			this.localizationService.setActiveLanguage('AR');
		}else {
			this.localizationService.setActiveLanguage('EN');
		}
	}

	public getPrice(): void {
		this.loggerService.logInfo(this.inputValues);
		this.priceService.addSymbolRequest(['TDWL', '1010']);
		// this.priceService.addExchangeRequest('TDWL');
		// this.priceService.addSymbolListRequest([['TDWL', '1010'], ['TDWL', '1020'], ['DFM', 'EMAAR']]);
		// this.priceService.addExchangeListRequest(['TDWL', 'DFM', 'LKCSE']);
	}

	public authenticateRealTimePath(): void {
		const authParams: Object = {
			priceVerion: '1',
			userName: this.userName,
			password: this.password,
			userType: '30',
			subType: '1',
			omsId: 10,
			brokerCode: 'MFS_UAT',
		};
		this.priceService.authenticateWithUsernameAndPassword(authParams, Channels.Price);
	}

	public authenticateBackLogPath(): void {
		const authParams: Object = {
			priceVerion: '1',
			userName: this.userName,
			password: this.password,
			userType: '30',
			subType: '1',
			omsId: 10,
			session: this.session,
			brokerCode: 'MFS_UAT',
		};
		this.priceService.authenticateWithSecondaryAuthToken(authParams, Channels.PriceMeta);
	}

	public sendSymbolSnapshotRequest(): void {
		const sampleRequest = '{"MT":10,"PRM":["DFM~DFMGI","BSE~BSEX",TDWL~1150","TDWL~8100","ADSM~ALDAR","NSDQ~GOOG","NSDQ~AAPL"],"RT":1}';
		const request = {
			channel : Channels.Price,
			data : sampleRequest,
		};
		this.dataService.sendToWs(request);
	}

	public sendNewsRequest(): void {
		const sampleRequest = '{ "RT": "1", "MT": 30, "LAN": "EN", "PRM": [ "N/WER", "N/FNVW", "MUBASHER.AE" ] }';
		const request = {
			channel : Channels.Price,
			data : sampleRequest,
		};
		this.dataService.sendToWs(request);
	}

	public sendMarketMetaRequest(): void {
		// Below is temperoray
		// tslint:disable-next-line:max-line-length
		const sampleRequest = '{ "MT": 80, "TKN": 1, "LAN": "EN", "SEG": [ "EXG", "EXGFE", "SUBM", "SECT", "TD", "ID", "WLD", "WLTD", "TZD", "GMS", "NPD" ], "EXG": [ "TDWL", "CASE", "ISE", "DFM" ] }';
		// const sampleRequest = '{ "MT": 46, "TKN": 1, "LAN": "EN", "PRM": [ "TDWL~1150", "NSDQ~QQQ" ] }';
		// const sampleRequest =
		// 			'{ "MT": 44, "SYM": [ "TDWL~TASI", "LKCSE~JKH.N0000`N", "ISE~TARAF",
		// 			"CSE~SAM", "CSE~MASI" ], "PRD": "1d", "TYP": "1" }';
		const request = {
			channel : Channels.PriceMeta,
			data : sampleRequest,
		};
		this.dataService.sendToWs(request);
	}
}