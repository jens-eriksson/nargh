export interface IInvestment {
    id: string;
    name: string;
    description: string;
    totalInvestment: number;
    equity: number;
    intrestRate: number;
    currency: string;
    hasPropertyDevelopment: boolean;
    hasRentalBusiness: boolean;
    isFavourite: boolean;
    propertyDevelopment: {
        timespan: number;
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
    totalInvestment: number;
    equity: number;
    intrestRate: number;
    currency: string;
    hasPropertyDevelopment: boolean;
    hasRentalBusiness: boolean;
    isFavourite: boolean;
    propertyDevelopment: {
        timespan: number;
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
        this.intrestRate = null;
        this.totalInvestment = null;
        this.equity = null;
        this.currency = 'SEK';
        this.hasPropertyDevelopment = false;
        this.hasRentalBusiness = false;
        this.isFavourite = false;
        this.propertyDevelopment = {
            timespan: null,
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
        if (
            this.hasPropertyDevelopment &&
            this.intrestRate &&
            this.equity &&
            this.totalInvestment &&
            this.propertyDevelopment.timespan &&
            this.propertyDevelopment.salesPrice
        ) {
            this.propertyDevelopment.intrest = this.intrestRate * 0.01 * (this.totalInvestment - this.equity) / 12 * this.propertyDevelopment.timespan;
            this.propertyDevelopment.netIncome = this.propertyDevelopment.salesPrice - this.totalInvestment - this.propertyDevelopment.intrest;
            this.propertyDevelopment.netIncomePerMonth = this.propertyDevelopment.netIncome / this.propertyDevelopment.timespan;
            this.propertyDevelopment.returnOnInvestment = this.propertyDevelopment.netIncome / this.totalInvestment;
            this.propertyDevelopment.returnOnEquity = this.propertyDevelopment.netIncome / this.equity;
        } else {
            this.propertyDevelopment.intrest = null;
            this.propertyDevelopment.netIncome = null;
            this.propertyDevelopment.netIncomePerMonth = null;
            this.propertyDevelopment.returnOnInvestment = null;
            this.propertyDevelopment.returnOnEquity = null;
        }
        if (
            this.hasRentalBusiness &&
            this.rentalBusiness.revenue &&
            this.rentalBusiness.operatingCost &&
            this.intrestRate &&
            this.equity &&
            this.totalInvestment
        ) {
            this.rentalBusiness.intrest = this.intrestRate * 0.01 * (this.totalInvestment - this.equity);
            this.rentalBusiness.netIncome = this.rentalBusiness.revenue - this.rentalBusiness.operatingCost - this.rentalBusiness.intrest;
            this.rentalBusiness.returnOnInvestment = this.rentalBusiness.netIncome / this.totalInvestment;
            this.rentalBusiness.returnOnEquity = this.rentalBusiness.netIncome / this.equity;
        } else {
            this.rentalBusiness.intrest = null;
            this.rentalBusiness.netIncome = null;
            this.rentalBusiness.returnOnInvestment = null;
            this.rentalBusiness.returnOnEquity = null;
        }
    }

    generateId() {
        if (
            !this.id &&
            this.name
        ) {
            this.id = this.name
                .split(' ').join('-')
                .split('å').join('a')
                .split('ä').join('a')
                .split('ö').join('o')
                .toLowerCase()
                .trim();
        }
    }

    toObject(): IInvestment {
        return { ...this };
    }

    fromObject(obj: IInvestment) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
