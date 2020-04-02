import { Asset } from './asset';
import { Base } from './base';

export class Forecast extends Base {
    year: number;
    assets: Asset[];
    incomeStatement: {
        propertyDevelopment: {
            netIncome: number;
        },
        rentalBusiness: {
            revenue: number;
            operatingCost: number;
            salaries: number;
            bankIntrest: number;
            bondIntrest: number;
            netIncome: number;
        },
        netIncome: number;
    };
    balanceSheet: {
        assets: number;
        bankLoan: number;
        bonds: number;
        equity: number;
    };

    constructor(initilizer?) {
        const obj = {
            year: null,
            assets: [],
            incomeStatement: {
                propertyDevelopment: {
                    netIncome: 0
                },
                rentalBusiness: {
                    revenue: 0,
                    operatingCost: 0,
                    salaries: 0,
                    bankIntrest: 0,
                    bondIntrest: 0,
                    netIncome: 0
                },
                netIncome: 0
            },
            balanceSheet: {
                assets: 0,
                bankLoan: 0,
                bonds: 0,
                equity: 0
            }
        };
        Object.assign(obj, initilizer);
        super(obj);
    }
}
