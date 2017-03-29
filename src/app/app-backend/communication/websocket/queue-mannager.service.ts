import * as Rx from 'rxjs/Rx';
import { ConfigService } from '../../../config/config.service';
import { Connection } from '../connection';
import { Injectable } from '@angular/core';
import { LoggerService } from '../../../utils/logger.service';
import { Observable } from 'rxjs/Observable';
import { PulseService } from './pulse.service';
import { WebsocketService } from './websocket.service';

@Injectable()
export class QueueMannagerService {
	private TIME_INTERVAL = 300; // 1000 * 3
	private connectedSocketPool: Array<Connection> = [];
	private response$: Rx.Subject<any> ;

	constructor(private configService: ConfigService, private websocketService: WebsocketService,
		private loggerService: LoggerService) {
		this.response$ = new Rx.Subject();
		this.init();
	}

	public getResponse(): Rx.Subject<any> {
		return this.response$;
	}

	private init(): void {
		this.configService.getConnectionConfig().forEach(connection => {
			const connConfig: Connection = {
				channel: connection.channel,
				url: connection.url,
				connectedSocket: null,
				sendMessageQueue: [],
				recivedMessageQueue: [],
				isConnected: false,
				sendQueueProcessInterval: null,
				recivedQueueProcessInterval: null,
				subscription: null,
				pulseService: null,
			};
			this.connectedSocketPool.push(connConfig);
		});
	}

	private enQueueMessage(message: Object, messageQueue: Array<any>): void {
		messageQueue.push(message);
	}

	private deQueueMessage(messageQueue: Array<any>): any {
		return messageQueue.shift();
	}

	public getConnectionByChannel(channel: number): Connection {
		return this.connectedSocketPool[channel];
	}

	private connect(connectionConfig: Connection): void {
		const connection: Connection = this.getConnectionByChannel(connectionConfig.channel);
		if (!connection.isConnected) {
			this.websocketService.initConnection(connection).then(sockt => {
				const socket: Rx.Subject<MessageEvent> = this.websocketService.createConnection(sockt);
				connection.connectedSocket = socket;
				connection.isConnected = true;
				this.subscribeForConnected(connectionConfig.channel);
				this.activateSentReceive(
					connection.sendMessageQueue,
					connection.sendQueueProcessInterval,
					connection.connectedSocket,
					connection.channel);
				this.activateSentReceive(
					connection.recivedMessageQueue,
					connection.recivedQueueProcessInterval,
					this.response$ ,
					connection.channel);
			}).catch(error => {
				this.loggerService.logInfo('error occured ' + connectionConfig.channel , 'QueueMannagerService');
			});
		}else {
			this.loggerService.logInfo('allready connected ' + connectionConfig.channel , 'QueueMannagerService');
		}
	}

	private activateSentReceive(messageQueue: Array<any>, timeIntervalProcess: NodeJS.Timer,
		socket: Rx.Subject<MessageEvent> , index: number): void {
		timeIntervalProcess = setInterval(() => {
			if (messageQueue.length > 0) {
				const msg: any = this.deQueueMessage(messageQueue);
				const sendRecivedMsg = {
					data : {
						data : msg,
						connection : index,
					},
				};
				socket.next(<MessageEvent>sendRecivedMsg);
			}
		}, this.TIME_INTERVAL);
	}

	private subscribeForConnected(channel: number): void {
		const connection: Connection = this.getConnectionByChannel(channel);
		if (connection.connectedSocket && !connection.subscription) {
			connection.subscription = connection.connectedSocket.subscribe(msg => {
				if (JSON.parse(msg.data).channel !== 'pulse' && msg.data) {
					this.enQueueMessage(msg.data, connection.recivedMessageQueue);
				}
				connection.pulseService.resetPulse();
			}, error => {
				this.loggerService.logError(error, 'QueueMannagerService');
			}, () => {
				this.unsubcribeConnection(connection.channel);
				this.loggerService.logInfo('disconnected ' + connection.channel , 'QueueMannagerService');
			});
		}
	}

	public unsubcribeConnection(channel: number): void {
		const connection: Connection = this.getConnectionByChannel(channel);
		if (connection.isConnected && connection.subscription) {
			connection.isConnected = false;
			connection.subscription.unsubscribe();
			connection.subscription = null;
			clearInterval(connection.sendQueueProcessInterval);
			clearInterval(connection.recivedQueueProcessInterval);
			connection.sendQueueProcessInterval = null;
		}
	}

	public addMessageToQueue(data: any): void {
		const connection: Connection = this.getConnectionByChannel(data.channel);
		this.enQueueMessage(data.data, connection.sendMessageQueue);
		if (!connection.isConnected) {
			this.connect(data);
		}
	}
}
