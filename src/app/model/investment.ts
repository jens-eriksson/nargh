export interface IInvestment {
    id: string;
    name: string;
    description: string;
    timespan: number;
    intrestRate: number;
    equity: number;
    investment: {
        totalInvestment: number;
        salesPrice: number;
        intrest: number;
        netIncome: number;
        netIncomePerMonth: number;
        returnOnInvestment: number;
        returnOnEquity: number;
    };
    rentalBusiness: {
        revenue: number;
        operatingCost: number;
        intrest: number;
        netIncome: number;
        returnOnInvestment: number;
        returnOnEquity: number;
    };
}

export class Investment implements IInvestment {
    id: string;
    name: string;
    description: string;
    timespan: number;
    intrestRate: number;
    equity: number;
    investment: {
        totalInvestment: number;
        salesPrice: number;
        intrest: number;
        netIncome: number;
        netIncomePerMonth: number;
        returnOnInvestment: number;
        returnOnEquity: number;
    };
    rentalBusiness: {
        revenue: number;
        operatingCost: number;
        intrest: number;
        netIncome: number;
        returnOnInvestment: number;
        returnOnEquity: number;
    };

    constructor() {
        this.id = null;
        this.name = null;
        this.description = null;
        this.timespan = null;
        this.intrestRate = null;
        this.equity = null;
        this.investment = {
            totalInvestment: null,
            salesPrice:  null,
            intrest:  null,
            netIncome:  null,
            netIncomePerMonth:  null,
            returnOnInvestment:  null,
            returnOnEquity:  null,
        };
        this.rentalBusiness = {
            revenue: null,
            operatingCost: null,
            intrest: null,
            netIncome: null,
            returnOnInvestment: null,
            returnOnEquity: null
        };
    }

    calculate() {
        if(
            this.timespan &&
            this.intrestRate &&
            this.equity &&
            this.investment.totalInvestment &&
            this.investment.salesPrice
        ) {
            this.investment.intrest = this.intrestRate * 0.01 * (this.investment.totalInvestment - this.equity) / 12 * this.timespan;
            this.investment.netIncome = this.investment.salesPrice - this.investment.totalInvestment - this.investment.intrest;
            this.investment.netIncomePerMonth = this.investment.netIncome / this.timespan;
            this.investment.returnOnInvestment = this.investment.netIncome / this.investment.totalInvestment * 100;
            this.investment.returnOnEquity = this.investment.netIncome / this.equity * 100;
        } else {
            this.investment.intrest = null;
            this.investment.netIncome = null;
            this.investment.netIncomePerMonth = null;
            this.investment.returnOnInvestment = null;
            this.investment.returnOnEquity = null;
        }
        if(
            this.rentalBusiness.revenue &&
            this.rentalBusiness.operatingCost &&
            this.intrestRate &&
            this.equity &&
            this.investment.totalInvestment
        ) {
            this.rentalBusiness.intrest = this.intrestRate * 0.01 * (this.investment.totalInvestment - this.equity);
            this.rentalBusiness.netIncome = this.rentalBusiness.revenue - this.rentalBusiness.operatingCost - this.rentalBusiness.intrest;
            this.rentalBusiness.returnOnInvestment = this.rentalBusiness.netIncome / this.investment.totalInvestment * 100;
            this.rentalBusiness.returnOnEquity = this.rentalBusiness.netIncome / this.equity * 100; 
        } else {
            this.rentalBusiness.intrest = null;
            this.rentalBusiness.netIncome = null;
            this.rentalBusiness.returnOnInvestment = null;
            this.rentalBusiness.returnOnEquity = null;
        }
    }

    generateId() {
        if(
            !this.id &&
            this.name
        ) {
            this.id = this.name
                .replace(' ', '-')
                .replace('å', 'a')
                .replace('ä', 'a')
                .replace('ö', 'o') 
                .toLowerCase()
                .trim();
        }
    }

    toObject(): IInvestment {
        return { ...this };
    }

    fromObject(obj: IInvestment) {
        for(let key in obj) {
            this[key] = obj[key];
        }
    }
}