import { BaseDataStore } from './data-stores/base-data-store';
import { Channels } from '../../constants/enums/channels.enum';
import { DataManagers } from '../../constants/enums/data-managers.enum';
import { DataService } from '../communication/data.service';
import { Injectable } from '@angular/core';
import { PriceRequest } from './protocols/price-request';
import { PriceRequestTypes } from '../../constants/enums/price-request-types.enum';
import { PriceStreamingRequestHandler } from './protocols/streaming/price-streaming-request-handler';
import { PriceStreamingResponseHandler } from './protocols/streaming/price-streaming-response-handler';
import { PriceSubscriptionService } from './price-subscription.service';
import { StockDataStore } from './data-stores/stock-data-store';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class PriceService {

	constructor(
		private dataService: DataService,
		private priceStreamingResponseHandler: PriceStreamingResponseHandler,
		private priceSubscriptionService: PriceSubscriptionService) {  }

	// TODO: [Amila] Check if this is required
	/**
	 * Get the price response handler
	 * @returns {Subject<Object>} Response stream
	 */
	public getPriceResponseStream(): Subject<Object> {
		return this.priceStreamingResponseHandler.getPriceResponseStream();
	}

	/**
     * Fetch data managers
     * @param {number} dmID - Data Manager ID
     * @returns {BaseDataStore} Data Store Object
     */
	public getDataManager (dmID: number): BaseDataStore {
		let dtStore: BaseDataStore = null;

		switch (dmID) {
			case DataManagers.Stock:
				dtStore = StockDataStore.getInstance();
				break;
			case DataManagers.Exchange:
				dtStore = StockDataStore.getInstance();
				break;
		}

		return dtStore;
	}

	//
	// API to handle authentication
	//

	// TODO: [Amila] Validate the auth protocols
	/**
	 * Authenticate with username and password
	 * @param {Object} authParams - An object with following properties set
	 * 			channel		: Value Defined at Channels Enum. Mandatory
	 * 			username    : Username. Mandatory.
	 * 			password    : Password. Mandatory.
	 * 			loginIP     : Machine IP
	 * 			appVersion  : Application version
	 * 			lan         : Current Language. Mandatory.
	 * @param {number} channel - Respective Channel from Channel Enum
	*/
	public authenticateWithUsernameAndPassword (authParams: any, channel: Channels): void  {
		const authReqest =  PriceStreamingRequestHandler.getInstance().generateAuthRequest(authParams);
		const request = {
			channel : channel,
			data : authReqest,
		};

		this.dataService.sendToWs(request);
	}

	/**
	* Authenticate with Secondary Auth Token
	* @param {Object} authParams An object with following properties set
	* 			username    : Username. Mandatory.
	* 			password    : Password. Mandatory.
	* 			loginIP     : Machine IP
	* 			appVersion  : Application version
	* 			lan         : Current Language. Mandatory.
	* @param {number} channel - Respective CHannel from Channel Enum
	*/
	public authenticateWithSecondaryAuthToken (authParams: any, channel: number): void  {
		const authRequest =  PriceStreamingRequestHandler.getInstance().generateSecondaryAuthRequest(authParams);
		const request = {
			channel : channel,
			data : authRequest,
		};
		this.dataService.sendToWs(request);
	}

	//
	// API to handle price related meta and streaming
	//

	/**
     * Subscribe and Un-subscribe from exchange updates
     * @param {string} exchange - Exchange code
     */
	public addExchangeRequest (exchange: string): void {
		if (this.priceSubscriptionService.subscribeFor(PriceRequestTypes.Exchange, exchange)) {
			const req = new PriceRequest();
			req.mt = PriceRequestTypes.Exchange;
			req.addParam(exchange);

			const request = {
				index : Channels.Price,
				data : PriceStreamingRequestHandler.getInstance().generateAddRequest(req),
			};
			this.dataService.sendToWs(request);
		}
	}

	public removeExchangeRequest (exchange: string): void {
		if (this.priceSubscriptionService.unSubscribeFor(PriceRequestTypes.Exchange, exchange)) {
			const req = new PriceRequest();
			req.mt = PriceRequestTypes.Exchange;
			req.addParam(exchange);

			const request = {
				index : Channels.Price,
				data : PriceStreamingRequestHandler.getInstance().generateRemoveRequest(req),
			};
			this.dataService.sendToWs(request);
		}
	}

	public addExchangeListRequest (exchange: string[]): void {
		const req = new PriceRequest();
		req.mt = PriceRequestTypes.Exchange;

		for (const exg of exchange) {
			req.addParam(exg);
		}

		const request = {
			index : Channels.Price,
			data : PriceStreamingRequestHandler.getInstance().generateAddRequest(req),
		};
		this.dataService.sendToWs(request);
	}

	public removeExchangeListRequest (exchange: string[]): void {
		const req = new PriceRequest();
		req.mt = PriceRequestTypes.Exchange;

		for (const exg of exchange) {
			req.addParam(exg);
		}

		const request = {
			index : Channels.Price,
			data : PriceStreamingRequestHandler.getInstance().generateRemoveRequest(req),
		};
		this.dataService.sendToWs(request);
	}

    /**
     * Subscribe and Un-subscribe for a symbol updates
     * @param {[string, string]} exgSym - A tupple with Exchange Code and Symbol Code
     */
	public addSymbolRequest (exgSym: [string, string]): void {
		if (this.priceSubscriptionService.subscribeFor(PriceRequestTypes.Exchange, exgSym[0], exgSym[1])) {
			const req = new PriceRequest();
			req.mt = PriceRequestTypes.SnapshotSymbol;
			req.addParam(exgSym[0], exgSym[1]);

			const request = {
				index : Channels.Price,
				data : PriceStreamingRequestHandler.getInstance().generateAddRequest(req),
			};
			this.dataService.sendToWs(request);
		}
	}

	public removeSymbolRequest (exgSym: [string, string]): void {
		if (this.priceSubscriptionService.unSubscribeFor(PriceRequestTypes.Exchange, exgSym[0], exgSym[1])) {
			const req = new PriceRequest();
			req.mt = PriceRequestTypes.SnapshotSymbol;
			req.addParam(exgSym[0], exgSym[1]);

			const request = {
				index : Channels.Price,
				data : PriceStreamingRequestHandler.getInstance().generateRemoveRequest(req),
			};
			this.dataService.sendToWs(request);
		}
	}

	/**
     * Subscribe and Un-subscribe for a list of symbol updates.
     * @param {[string, string][]} exgSym - An array of tupples with Exchange Code and Symbol Code
     */
	public addSymbolListRequest (exgSym: [string, string][]): void {
		const req = new PriceRequest();
		req.mt = PriceRequestTypes.SnapshotSymbol;

		for (const sym of exgSym) {
			req.addParam(sym[0], sym[1]);
		}

		const request = {
			index : Channels.Price,
			data : PriceStreamingRequestHandler.getInstance().generateAddRequest(req),
		};
		this.dataService.sendToWs(request);
	}

	public removeSymbolListRequest (exgSym: [string, string][]): void {
		const req = new PriceRequest();
		req.mt = PriceRequestTypes.SnapshotSymbol;

		for (const sym of exgSym) {
			req.addParam(sym[0], sym[1]);
		}

		const request = {
			index : Channels.Price,
			data : PriceStreamingRequestHandler.getInstance().generateRemoveRequest(req),
		};
		this.dataService.sendToWs(request);
	}

	//
	// API to handle trade related meta and streaming
	//
}
