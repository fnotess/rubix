export const priceResponseTags = {
	3: 'symbolCode',
	4: 'exchangeCode',
	10: 'bestAskPrice',
	11: 'bestAskQty',
	12: 'bestBidPrice',
	13: 'bestBidQty',
	16: 'totalBidQty',
	17: 'totalAskQty',
	30: 'highPrice',
	31: 'lowPrice',
	32: 'closePrice',
	33: 'openPrice',
	34: 'change',
	35: 'perChange',
	36: 'previousClosePrice',
	37: 'turnover',
	38: 'volume',
	43: 'marketDate',
	52: 'splits',
	53: 'time',
	54: 'sequence',
	55: 'lastTradePrice',
	56: 'totalQty',
	62: 'vwap',
	67: 'type',
	75: 'trades',
	77: 'lastTradedPrice',
	80: 'max',
	81: 'min',
	82: 'high52',
	84: 'low52',
	221: 'depthType',
	222: 'depthID',
	227: 'depthType',
	228: 'depthID',
	226: 'depthSplit',
	225: 'depthQty',
	224: 'depthValue',
	220: 'depthQty',
	219: 'depthValue',
	403: 'date',
	635: 'lastTradeDate',
	640: 'date',
	800: 'date',
	801: 'unrealizedReturn',
	802: 'remainingPotential',
	803: 'report',
	804: 'title',
	805: 'takeProfit',
	806: 'stopLoss',
	807: 'entryPrice',
	809: 'action',
	811: 'gicsL4',
	813: 'exitPrice',

	EXCHANGE: 'exchangeCode',
	SYMBOL: 'symbolCode',
	INSTRUMENT_TYPE: 'instrumentType',
	SYMBOL_DESCRIPTION: 'longDesc',
	CURRENCY: 'currency',
	SHRT_DSC: 'shortDesc',
	DECIMAL_PLACES: 'decimalPlaces',
	CORRECTION_FACTOR: 'decimalCorrectionFactor',
	DS: 'dispCode',
	DES: 'des',
	SDES: 'sDes',
	CON: 'contry',
	CAT: 'cat',
	SECTOR: 'sectorCode',
	S: 'indexSymbolCode',
	L: 'language',
	SEC: 'section',
	SYMT: 'symt',
	SD: 'startDate',
	ED: 'endDate',
	IPC: 'indexPercentageChange',
	PL: 'realizedProfit',
	CID: 'companyId',
	E: 'exchangeCode',
	BS: 'symbolCode',
	BRATE: 'bestSymbolRate',
	SRATE: 'successRate',
	ARTN: 'averageReturn',
	MIP: 'marketIndex',
	EXG: 'exchangeCode',
	SYM: 'symbolCode',
	DUR: 'duration',
	VALUE: 'value',
	GEO: 'region',
	CLASS : 'riskType',
	DESCR: 'description',
	DESC: 'description',
	FULL: 'fullDescription',
	SHORT: 'shortDescription',
	CUR: 'currency',
	BENM: 'benchMark',
	PCT1M: 'percentageOneMonth',
	PCT3M: 'percentageThreeMonth',
	DATE: 'date',
	EXPR: 'expenseRatio',
	HOLD: 'holdings',
	MCAP: 'averageMarketCap',
	PE: 'profitEarnings',
	RET: 'return',
	IR: 'informationRatio',
	R2: 'R2',
	TE: 'trackingError',
	SHP: 'sharpeRatio',
	STOK: 'stock',
	BOND: 'bond',
	CASH: 'cash',
	OTHR: 'other',
	ID: 'id',
	M6: 'M6',
	Y1: 'Y1',
	Y3: 'Y3',
	Y5: 'Y5',
	YEAR: 'year',
	MONTH: 'month',
	FILE: 'file',
	// refatcor below
	/*0: 'NODATA',
	5: 'EXC',
	6: 'INS',
	39: 'UP',
	40: 'DOWN',
	41: 'NOCHG',
	42: 'MSTAT',
	44: 'MTIM',
	45: 'CUR',
	75: 'NOT',
	50: 'SYMTRD',
    57: 'OL',
	65: 'ALT_TYP',
	66: 'ALT_ID',
	68: 'MSG_TYP',
	72: 'NWS_CAT',
	73: 'LTQ',
	74: 'TRT',
	78: 'STS',
	79: 'OPERATOR',
	85: 'SYMBOL',
	86: 'FREQ',
	100: 'SIGNAL_TYPE',
	110: 'SIGNAL_SUB_TYPE',
	111: 'SIGNAL_STRTGY',
	101: 'SIGNAL_ID',
	102: 'SIGNAL_TI',
	103: 'SIGNAL_SIDE',
	104: 'SIGNAL_TIME',
	105: 'SIGNAL_PRICE',
	106: 'SIGNAL_MSG_STATUS',
	107: 'SIGNAL_LAST_PRI',
	112: 'YTD_PCHG',
	113: 'SIGNAL_INTERVAL',
	123: 'TDES',
	125: 'DEP',
	130: 'ISIN',
	131: 'OPEN_INTEREST',
	135: 'MARKET_CODE',
	138: 'STRTGY',
	145: 'PER',
	146: 'MARKETCAP',
	155: 'EPS',
	157: 'REFP',
	346: 'NWPRV',
	348: 'NWID',
	349: 'NWD',
	350: 'LN',
	351: 'NWHD',
	354: 'NWSRC',
	361: 'NWSHOT',
	371: 'NWCT',
	372: 'ANTIM',
	373: 'ANID',
	374: 'ANHED',
	375: 'ANBOD',
	383: 'ANSYM',
	398: 'TTYP',
	463: 'CIT',
	466: 'COT',
	473: 'LUD',
	635: 'DATE',
	808: 'ALERT_ID',
	810: 'BASE_SYMBOL',
	812: 'ADVICE_STATUS',
	830: 'MSG_STATUS',
	831: 'RESEARCH_ID',
	832: 'REPORT_TYPE',
	833: 'PUBLISH_DATE',
	834: 'COUNTRY_CODES',
	835: 'GICS_CODES',
	836: 'AGENT_CODE',
	837: 'RESEARCH_TITLE',
	838: 'DESCRIPTION',
	839: 'HTML_URL',
	840: 'PDF_URL',
	841: 'WEB_URL',
	842: 'RESEARCH_IMAGE_URL',
	843: 'RESEARCH_SYMBOL_LIST',
	844: 'RESEARCH_TIME',
	850: 'NOTIFICATION_ID',
	2015: 'CID',
	11006: 'DE',
	11023: 'SDES',
	11039: 'DES',
	11044: 'DS',
	12370: 'TYPE',
	12590: 'TITLE',
	12240: 'SYMSTS',
	12402 : 'CA_ID',
	12743: 'YTD_CHG',
	17380: 'AV5D',
	23815: 'STATUS',
	24037: 'YEARLY_PCT_CHANGE',
	25828: 'ANN_INDICATOR',
	25827: 'NWS_INDICATOR',
	26328: 'WEEKLY_PCT_CHANGE',
	25127: 'NWS_EDITORIAL_ID',*/
};
