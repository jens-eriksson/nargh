export interface IInvestment {
    id: string;
    name: string;
    description: string;
    investments: any[];
    totalInvestment: number;
    bankLoan: number;
    loanShare: number;
    bond: number;
    bondShare: number;
    equity: number;
    bankIntrestRate: number;
    bondIntrestRate: number;
    currency: string;
    hasPropertyDevelopment: boolean;
    hasRentalBusiness: boolean;
    isFavourite: boolean;
    propertyDevelopment: {
        startDate: string;
        endDate: string;
        timespan: number;
        salesPrice: number;
        intrest: number;
        netIncome: number;
        netIncomePerMonth: number;
        returnOnInvestment: number;
        returnOnEquity: number;
    };
    rentalBusiness: {
        startDate: string;
        endDate: string;
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
    investments: any[];
    totalInvestment: number;
    bankLoan: number;
    loanShare: number;
    bond: number;
    bondShare: number;
    equity: number;
    bankIntrestRate: number;
    bondIntrestRate: number;
    currency: string;
    hasPropertyDevelopment: boolean;
    hasRentalBusiness: boolean;
    isFavourite: boolean;
    startDate: string;
    investmentDate: string;
    propertyDevelopment: {
        startDate: string;
        endDate: string;
        timespan: number;
        salesPrice: number;
        intrest: number;
        netIncome: number;
        netIncomePerMonth: number;
        returnOnInvestment: number;
        returnOnEquity: number;
    };
    rentalBusiness: {
        startDate: string;
        endDate: string;
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
        this.bankIntrestRate = null;
        this.bondIntrestRate = null;
        this.totalInvestment = null;
        this.investments = [];
        this.bankLoan = null;
        this.loanShare = null;
        this.bond = null;
        this.bondShare = null;
        this.equity = null;
        this.currency = 'SEK';
        this.hasPropertyDevelopment = false;
        this.hasRentalBusiness = false;
        this.isFavourite = false;
        this.startDate = null;
        this.investmentDate = null;
        this.propertyDevelopment = {
            startDate: null,
            endDate: null,
            timespan: null,
            salesPrice:  null,
            intrest:  null,
            netIncome:  null,
            netIncomePerMonth:  null,
            returnOnInvestment:  null,
            returnOnEquity:  null,
        };
        this.rentalBusiness = {
            startDate: null,
            endDate: null,
            revenue: null,
            operatingCost: null,
            intrest: null,
            netIncome: null,
            returnOnInvestment: null,
            returnOnEquity: null
        };
    }

    calculate() {
        this.calculateTimespan();

        if(this.bankLoan && this.totalInvestment) {
            this.loanShare = this.bankLoan / this.totalInvestment;
        } else {
            this.loanShare = null;
        }

        if(this.bond && this.totalInvestment) {
            this.bondShare = this.bond / this.totalInvestment;
        } else {
            this.bondShare = null;
        }

        if (
            this.hasPropertyDevelopment &&
            this.bankIntrestRate &&
            this.totalInvestment &&
            this.propertyDevelopment.timespan &&
            this.propertyDevelopment.salesPrice
        ) {
            if (!this.hasRentalBusiness) {
                this.propertyDevelopment.intrest = this.bankIntrestRate * 0.01 * this.bankLoan / 12 * this.propertyDevelopment.timespan;
                if (this.bond && this.bondIntrestRate) {
                    this.propertyDevelopment.intrest += this.bondIntrestRate * 0.01 * this.bond / 12 * this.propertyDevelopment.timespan;
                }
            } else {
                this.propertyDevelopment.intrest = 0;
            }
            
            this.propertyDevelopment.netIncome = this.propertyDevelopment.salesPrice - this.totalInvestment - this.propertyDevelopment.intrest;
            this.propertyDevelopment.netIncomePerMonth = this.propertyDevelopment.netIncome / this.propertyDevelopment.timespan;
            this.propertyDevelopment.returnOnInvestment = this.propertyDevelopment.netIncome / this.totalInvestment;
            if (this.equity) {
                this.propertyDevelopment.returnOnEquity = this.propertyDevelopment.netIncome / this.equity;
            }
        } else {
            this.propertyDevelopment.intrest = null;
            this.propertyDevelopment.netIncome = null;
            this.propertyDevelopment.netIncomePerMonth = null;
            this.propertyDevelopment.returnOnInvestment = null;
            this.propertyDevelopment.returnOnEquity = null;
            this.propertyDevelopment.startDate = null;
            this.propertyDevelopment.endDate = null;
            this.propertyDevelopment.timespan = null;
        }
        if (
            this.hasRentalBusiness &&
            this.rentalBusiness.revenue &&
            this.rentalBusiness.operatingCost &&
            this.bankIntrestRate &&
            this.totalInvestment
        ) {
            this.rentalBusiness.intrest = this.bankIntrestRate * 0.01 * this.bankLoan;
            if (this.bond && this.bondIntrestRate) {
                this.rentalBusiness.intrest += this.bondIntrestRate * 0.01 * this.bond;
            }
            this.rentalBusiness.netIncome = this.rentalBusiness.revenue - this.rentalBusiness.operatingCost - this.rentalBusiness.intrest;
            this.rentalBusiness.returnOnInvestment = this.rentalBusiness.netIncome / this.totalInvestment;
            if (this.equity) {
                this.rentalBusiness.returnOnEquity = this.rentalBusiness.netIncome / this.equity;
            }
        } else {
            this.rentalBusiness.intrest = null;
            this.rentalBusiness.netIncome = null;
            this.rentalBusiness.returnOnInvestment = null;
            this.rentalBusiness.returnOnEquity = null;
            this.rentalBusiness.startDate = null;
            this.rentalBusiness.endDate = null;
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

    calculateTimespan() {
        if (this.propertyDevelopment.startDate && this.propertyDevelopment.endDate) {
            const start = this.propertyDevelopment.timespan = Number.parseInt(this.propertyDevelopment.startDate.split('-')[0], 10) * 12 + Number.parseInt(this.propertyDevelopment.startDate.split('-')[1], 10);
            const end = this.propertyDevelopment.timespan = Number.parseInt(this.propertyDevelopment.endDate.split('-')[0], 10) * 12 + Number.parseInt(this.propertyDevelopment.endDate.split('-')[1], 10);
            this.propertyDevelopment.timespan = end - start;
        } else {
            this.propertyDevelopment.timespan = 0;
        }
    }
}
