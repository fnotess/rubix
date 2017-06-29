import { BaseDataStore } from './base-data-store';
import { CommonHelperService } from '../../../app-utils/helper/common-helper.service';
import { Injectable } from '@angular/core';
import { MutualFundEntity } from '../business-entities/mutual-fund-entity';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class MutualFundsDataStore extends BaseDataStore {

	private fundByRegionStore = {};
	private fundByRiskTypeStore = {};
	private fundBySymbolStore = {};
	private _regionMetaMap = {};
	private _riskTypeMetaMap = {};
	private $dataLoaded = new Subject();

	constructor(private commonHelperService: CommonHelperService) {
		super();
	}

	public get dataLoadedObserver(): Subject<boolean> {
		return this.$dataLoaded;
	}

	public get regionMetaMap(): any {
		return this._regionMetaMap;
	}

	public get riskTypeMetaMap(): any {
		return this._riskTypeMetaMap;
	}

	public getItemsByRegion(region: string): Array<MutualFundEntity> {

		let dataArray = this.fundByRegionStore[region];

		if (!dataArray) {
			dataArray = {};
			this.fundByRegionStore[region] = dataArray;

		}

		return dataArray;
	}

	public getItemsByRiskType(riskType: string): Array<MutualFundEntity> {

		let dataArray = this.fundByRiskTypeStore[riskType];

		if (!dataArray) {
			dataArray = {};
			this.fundByRiskTypeStore[riskType] = dataArray;

		}

		return dataArray;
	}

	public getItemsByRegionAndRiskType(region: string, riskType: string): MutualFundEntity {
		if (this.fundByRegionStore[region] && this.fundByRegionStore[region][riskType]) {
			return this.fundByRegionStore[region][riskType];
		} else {
			return null;
		}
	}

	public updateMutualFunds(response: any): void {
		this.updateRegionData(response.GEO);
		this.updateRiskTypeData(response.CLASS);
		this.updateMasterData(response.MASTER);
		this.addChartData(response.ANNUAL);
		this.addPerformanceData(response.PERFORM);
		this.$dataLoaded.next(true);
	}

	public updateRegionData(values: {id: string, description: string}[]): void {
		for (const item of values){
			this._regionMetaMap[item.id] = item.description;
		}
	}

	public updateRiskTypeData(values: {id: string, description: string}[]): void {
		for (const item of values){
			this._riskTypeMetaMap[item.id] = item.description;
		}
	}

	public updateMasterData(values: {
		exchangeCode: string,
		symbolCode: string,
		region: string,
		riskType: string,
		description: string,
		fullDescription: string,
		shortDescription: string,
		currency: string,
		benchMark: string}[]): void {

		for (const masterDataItem of values){
			const itemsByRegion = this.getItemsByRegion(masterDataItem.region);
			const itemsByRiskType = this.getItemsByRiskType(masterDataItem.riskType);
			let mutualFundDataEntity = itemsByRegion[masterDataItem.riskType];

			if (!mutualFundDataEntity) {
				mutualFundDataEntity = new MutualFundEntity();
				mutualFundDataEntity.commonHelperService = this.commonHelperService;
				itemsByRegion[masterDataItem.riskType] = mutualFundDataEntity;
				itemsByRiskType[masterDataItem.region] = mutualFundDataEntity;
				this.fundBySymbolStore[masterDataItem.symbolCode] = mutualFundDataEntity;
			}

			mutualFundDataEntity.setValues(masterDataItem);

		}

	}

	public addChartData(values: {
		exchangeCode: string,
		symbolCode: string,
		duration: string,
		value: number,
	}[]): void {
		for (const item of values){

			const mutualFundDataEntity = this.fundBySymbolStore[item.symbolCode];
			mutualFundDataEntity.addchartData(item.duration, item.value);
		}
	}

	public addPerformanceData(values: {
		exchangeCode: string,
		symbolCode: string,
		percentageOneMonth: string,
		percentageThreeMonth: number,
	}[]): void {
		for (const item of values){

			const mutualFundDataEntity = this.fundBySymbolStore[item.symbolCode];
			mutualFundDataEntity.setValues(item);
		}
	}
}
