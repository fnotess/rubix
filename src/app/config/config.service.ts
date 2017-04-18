import 'rxjs/add/operator/map';
import { Channels } from '../constants/enums/channels.enum';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '../utils/logger.service';

@Injectable()
export class ConfigService {

	public configObj: any;

	constructor(private http: Http, private logger: LoggerService) {
	}

	// Below will be invoked from the main component's constructor. This will pre initialise the service.
	public init(): void {
		const self = this;
		self.http.get('./src/app/config/app-config.json').map((res) => res.json()).subscribe(data => {
			this.configObj = data;
		}, (rej) => {
			self.logger.logError('Could not load local data : ' + rej.message , 'ConfigService');
		});
	}

	private getConfigurationVal(key1: string, key2?: string, key3?: string): any {
		if (key3 && key2) {
			return this.configObj[key1][key2][key3];
		} else if (key2) {
			return this.configObj[key1][key2];
		} else {
			return this.configObj[key1];
		}
	}

	public getStringConfigVal(key1: string, key2?: string, key3?: string): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!this.configObj) {
				this.http.get('./src/app/config/app-config.json').map((res) => res.json()).subscribe(data => {
					this.configObj = data;
					resolve(this.getConfigurationVal(key1, key2, key3));
				});
			} else {
				resolve(this.getConfigurationVal(key1, key2, key3));
			}
		});
	}

	public getNumberConfigVal(key1: string, key2?: string, key3?: string): Promise<number> {
		return new Promise((resolve, reject) => {
			this.getStringConfigVal(key1, key2, key3).then(configVal => {
				resolve(Number(configVal));
			});
		});
	}

	public getBoolConfigVal(key1: string, key2?: string, key3?: string): Promise<number> {
		return new Promise((resolve, reject) => {
			this.getStringConfigVal(key1, key2, key3).then(configVal => {
				resolve(configVal === 'true');
			});
		});
	}
}
