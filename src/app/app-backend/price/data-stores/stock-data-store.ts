import { BaseDataStore } from './base-data-store';
import { Injectable } from '@angular/core';
import { StockEntity } from '../business-entities/stock-entity';

@Injectable()
export class StockDataStore extends BaseDataStore {

	private allStockStore = {};

	public getOrAddStock(exgSym: [string, string]): StockEntity {
        // TODO: [Amila] implement a common "keyGenerator" in utils package
		const key: string = exgSym[0] + '~' + exgSym[1]; // utils.keyGenerator.getKey(exchange, stockCode);
		let stockObj = this.allStockStore[key];

		if (!stockObj) {
			stockObj = new StockEntity({
				exchangeCode: exgSym[0],
				symbolCode: exgSym[1],
			});

			this.allStockStore[key] = stockObj;
		}

		return stockObj;
	}
}
