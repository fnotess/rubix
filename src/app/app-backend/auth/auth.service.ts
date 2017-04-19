import { DataService } from '../communication/data.service';
import { Injectable } from '@angular/core';
import { LoggerService } from '../../utils/logger.service';
import { PriceAuthHandler } from './price/price-auth-handler';
import { PriceStreamingResponseHandler } from '../price/protocols/streaming/price-streaming-response-handler';
import { ResponseStatus } from '../../constants/enums/response-status.enum';
import { Subject } from 'rxjs/Rx';
import { TradeAuthHandler } from './trade/trade-auth-handler';
import { TradeStreamingResponseHandler } from '../trade/protocols/streaming/trade-streaming-response-handler';
import { UserState } from '../../model/user-state';

@Injectable()
export class AuthService {
	private tradeAuthHandler: TradeAuthHandler;
	private priceAuthHandler: PriceAuthHandler;
	// TODO: [Chaamini] This should move to customer entity. For now keeping the reference here
	private _isAuthenticated = false;
	private authStatus$: Subject<boolean>;
	private _redirectURL: string;

	constructor(private dataService: DataService,
		private tradeStreamingResponseHandler: TradeStreamingResponseHandler,
		private priceStreamingResponseHandler: PriceStreamingResponseHandler,
		private loggerService: LoggerService) {

		this.updateAuthStatus();
		this.tradeAuthHandler = TradeAuthHandler.getInstance();
		this.priceAuthHandler = PriceAuthHandler.getInstance();
		this.authStatus$ = new Subject();
	}

	public authenticateUser(userName: string, password: string): void {
		this.loggerService.logInfo('Trade Connecting...', 'AuthService');
		UserState.getInstance().setTadeValues({ userName: userName });
		const authRequest = this.tradeAuthHandler.buildAuthRequest(userName, password);
		this.dataService.sendToWs(authRequest);
	}

	public checkAuthenticated(): Subject<boolean> {
		return this.authStatus$;
	}

	private authenticatePrimarySSO(): void {
		this.loggerService.logInfo('Price Connecting...', 'AuthService');
		const request = this.priceAuthHandler.getPrimarySSORequest();
		this.dataService.sendToWs(request);
	}

	private authenticateSecondarySSO(): void {
		this.loggerService.logInfo('Meta Connecting...', 'AuthService');
		const request = this.priceAuthHandler.getSecondarySSORequest();
		this.dataService.sendToWs(request);
	}

	private updateAuthStatus(): void {
		this.tradeStreamingResponseHandler.getAuthenticationResponseStream().subscribe(response => {
			if (response && response.DAT) {
				if (response.DAT.AUTH_STS === ResponseStatus.Success) {
					this.loggerService.logInfo('Trade Connected', 'AuthService');
					this.tradeAuthHandler.isAuthenticated = true;
					UserState.getInstance().setTadeValues(response.DAT);
					UserState.getInstance().setTadeValues({ SESN_ID: response.HED.SESN_ID });
					this.authenticatePrimarySSO();
				}
			}
		});

		this.priceStreamingResponseHandler.getPriceAuthResponseStream().subscribe(response => {
			this.loggerService.logInfo('Price Connected', 'AuthService');
			UserState.getInstance().setPriceValues(response);
			this.priceAuthHandler.isPriceAuthenticated = true;
			this.authenticateSecondarySSO();
		});

		this.priceStreamingResponseHandler.getMetaAuthResponseStream().subscribe(response => {
			this.loggerService.logInfo('Meta Connected', 'AuthService');
			this.priceAuthHandler.isMetaAuthenticated = true;
			if (this.priceAuthHandler.isPriceAuthenticated) {
				this.priceAuthHandler.isAuthenticated = true;
				this.isAuthenticated = true;
				this.authStatus$.next(true);
			}
		});
	}

	public get redirectURL(): string {
		return this._redirectURL;
	}

	public set redirectURL(value: string) {
		this._redirectURL = value;
	}

	public get isAuthenticated(): boolean {
		return this._isAuthenticated;
	}

	public set isAuthenticated(value: boolean) {
		this._isAuthenticated = value;
	}
}