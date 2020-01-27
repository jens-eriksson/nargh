import { registerLocaleData } from '@angular/common';
export interface IInvestment {
    id: string;
    name: string;
    description: string;
    totalInvestment: number;
    equity: number;
    intrestRate: number;
    currency: string;
    hasInvestmentDeal: boolean;
    hasRentalBusiness: boolean;
    isFavourite: boolean;
    investmentDeal: {
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
    hasInvestmentDeal: boolean;
    hasRentalBusiness: boolean;
    isFavourite: boolean;
    investmentDeal: {
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
        this.hasInvestmentDeal = false;
        this.hasRentalBusiness = false;
        this.isFavourite = false;
        this.investmentDeal = {
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
            this.hasInvestmentDeal &&
            this.intrestRate &&
            this.equity &&
            this.totalInvestment &&
            this.investmentDeal.timespan &&
            this.investmentDeal.salesPrice
        ) {
            this.investmentDeal.intrest = this.intrestRate * 0.01 * (this.totalInvestment - this.equity) / 12 * this.investmentDeal.timespan;
            this.investmentDeal.netIncome = this.investmentDeal.salesPrice - this.totalInvestment - this.investmentDeal.intrest;
            this.investmentDeal.netIncomePerMonth = this.investmentDeal.netIncome / this.investmentDeal.timespan;
            this.investmentDeal.returnOnInvestment = this.investmentDeal.netIncome / this.totalInvestment * 100;
            this.investmentDeal.returnOnEquity = this.investmentDeal.netIncome / this.equity * 100;
        } else {
            this.investmentDeal.intrest = null;
            this.investmentDeal.netIncome = null;
            this.investmentDeal.netIncomePerMonth = null;
            this.investmentDeal.returnOnInvestment = null;
            this.investmentDeal.returnOnEquity = null;
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
            this.rentalBusiness.returnOnInvestment = this.rentalBusiness.netIncome / this.totalInvestment * 100;
            this.rentalBusiness.returnOnEquity = this.rentalBusiness.netIncome / this.equity * 100;
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
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
