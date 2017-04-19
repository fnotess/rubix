
export class UserState {

	private static instance: UserState;
	private tradeDetails = {};
	private priceDetails = {};

	public static getInstance(): UserState {
		UserState.instance = UserState.instance || new UserState();
		return UserState.instance;
	}

	constructor() {
		if (UserState.instance) {
			throw new Error('Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.');
		}
	}

	public getTradeDetails(): any {
		return this.tradeDetails;
	}

	public getPriceDetails(): any {
		return this.priceDetails;
	}

	public setPriceValues(values: Object = {}): void {
		Object.assign(this.priceDetails, values);
	}

	public setTadeValues(values: Object = {}): void {
		Object.assign(this.tradeDetails, values);
	}
}