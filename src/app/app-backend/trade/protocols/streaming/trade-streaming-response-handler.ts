import { AuthenticationResponseTypes } from '../../../../constants/enums/trade-meta/authentication/authentication-response-types.enum';
import { Injectable } from '@angular/core';
import { LoggerService } from '../../../../utils/logger.service';
import { StreamRouteService } from '../../../communication/stream-route.service';
import { Subject } from 'rxjs/Rx';
import { TradeMetaGroups } from '../../../../constants/enums/trade-meta/trade-meta-groups.enum';

@Injectable()
export class TradeStreamingResponseHandler {

	private tradeResponseStream$: Subject<Object>;
	private authenticationResponseStream$: Subject<Object>;

	constructor(private streamRouteService: StreamRouteService, private loggerService: LoggerService) {
		this.tradeResponseStream$ = new Subject();
		this.authenticationResponseStream$ = new Subject();
		this.updateTradeResponseStream();
	}

	private updateTradeResponseStream(): void {
		this.streamRouteService.getTradeResponseStream().map(response => {
			return this.processTradeResponse(response.data);
		}).subscribe(response => {
			this.tradeResponseStream$.next(response);
			this.updateTradeModel(response);
		});
	}

	private processTradeResponse(response: string): Object {
		let processResponse = {};
		try {
			processResponse = JSON.parse(response);
		} catch (error) {
			this.loggerService.logError(error, 'TradeStreamingResponseHandler');
		}
		return processResponse;
	}

	private updateTradeModel(response: any): void {
		if (response && response.DAT && response.HED) {
			if (response.HED.MSG_GRP === TradeMetaGroups.Authentication) {
				if (response.HED.MSG_TYP === AuthenticationResponseTypes.AuthNormal) {
					this.authenticationResponseStream$.next(response);
				}else {
					this.loggerService.logError('No response type under group - ' + TradeMetaGroups.Authentication , 'TradeStreamingResponseHandler');
				}
			} else {
				this.loggerService.logError('No response group - ' + response.HED.MSG_GRP , 'TradeStreamingResponseHandler');
			}
		}
	}

	public getAuthenticationResponseStream(): Subject<any> {
		return this.authenticationResponseStream$;
	}

}
