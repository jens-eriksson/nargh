export class Investment {
    id: string;
    name: string;
    description: string;
    financing: any[];
    totalInvestment: number;
    bankLoan: number;
    bond: number;
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
        timespan: number;
        revenue: number;
        operatingCost: number;
        intrest: number;
        netIncome: number;
        returnOnInvestment: number;
        returnOnEquity: number;
    };
    images: {
        name: string;
        url: string;
        fullPath: string;
    }[];

    constructor() {
        this.id = null;
        this.name = null;
        this.description = null;
        this.bankIntrestRate = null;
        this.bondIntrestRate = null;
        this.totalInvestment = null;
        this.financing = [];
        this.bankLoan = null;
        this.bond = null;
        this.equity = null;
        this.currency = 'SEK';
        this.hasPropertyDevelopment = false;
        this.hasRentalBusiness = false;
        this.isFavourite = false;
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
            timespan: null,
            revenue: null,
            operatingCost: null,
            intrest: null,
            netIncome: null,
            returnOnInvestment: null,
            returnOnEquity: null
        };
        this.images = [];
    }

    calculate() {
        this.calculateTimespan();

        this.bankLoan = 0;
        this.bond = 0;
        this.equity = 0;
        for (const f of this.financing) {
            this.bankLoan += f.bankLoan;
            this.bond += f.bond;
            this.equity += f.equity;
        }

        this.totalInvestment = this.bankLoan + this.bond + this.equity;

        this.calculateIntrest();

        if (
            this.hasPropertyDevelopment &&
            this.bankIntrestRate &&
            this.totalInvestment &&
            this.propertyDevelopment.timespan
        ) {
            if (!this.propertyDevelopment.salesPrice) {
                this.propertyDevelopment.netIncome = -this.propertyDevelopment.intrest;
            } else {
                this.propertyDevelopment.netIncome = this.propertyDevelopment.salesPrice - this.totalInvestment - this.propertyDevelopment.intrest;
                this.propertyDevelopment.netIncomePerMonth = this.propertyDevelopment.netIncome / this.propertyDevelopment.timespan;
                this.propertyDevelopment.returnOnInvestment = this.propertyDevelopment.netIncome / this.totalInvestment;
                if (this.equity) {
                    this.propertyDevelopment.returnOnEquity = this.propertyDevelopment.netIncome / this.equity;
                }
            }
        } else {
            this.propertyDevelopment.netIncome = null;
            this.propertyDevelopment.netIncomePerMonth = null;
            this.propertyDevelopment.returnOnInvestment = null;
            this.propertyDevelopment.returnOnEquity = null;
        }
        if (
            this.hasRentalBusiness &&
            this.rentalBusiness.revenue &&
            this.rentalBusiness.operatingCost &&
            this.totalInvestment
        ) {
            this.rentalBusiness.netIncome = this.rentalBusiness.revenue - this.rentalBusiness.operatingCost - this.rentalBusiness.intrest;
            this.rentalBusiness.returnOnInvestment = this.rentalBusiness.netIncome / this.totalInvestment;
            if (this.equity) {
                this.rentalBusiness.returnOnEquity = this.rentalBusiness.netIncome / this.equity;
            }
        } else {
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
                .toLowerCase()
                .trim()
                .split(' ').join('-')
                .split('å').join('a')
                .split('ä').join('a')
                .split('ö').join('o')
                .split(':').join('-');
        }
    }

    toObject() {
        return { ...this };
    }

    fromObject(obj) {
        Object.assign(this, obj);
    }

    private calculateTimespan() {
        if (this.propertyDevelopment.startDate && this.propertyDevelopment.endDate) {
            const start = Number.parseInt(this.propertyDevelopment.startDate.split('-')[0], 10) * 12 + Number.parseInt(this.propertyDevelopment.startDate.split('-')[1], 10);
            const end = Number.parseInt(this.propertyDevelopment.endDate.split('-')[0], 10) * 12 + Number.parseInt(this.propertyDevelopment.endDate.split('-')[1], 10);
            this.propertyDevelopment.timespan = end - start;
        } else {
            this.propertyDevelopment.timespan = 0;
        }

        if (this.rentalBusiness.startDate && this.rentalBusiness.endDate) {
            const start = Number.parseInt(this.rentalBusiness.startDate.split('-')[0], 10) * 12 + Number.parseInt(this.rentalBusiness.startDate.split('-')[1], 10);
            const end = Number.parseInt(this.rentalBusiness.endDate.split('-')[0], 10) * 12 + Number.parseInt(this.rentalBusiness.endDate.split('-')[1], 10);
            this.rentalBusiness.timespan = end - start;
        } else if (this.rentalBusiness.startDate) {
            this.rentalBusiness.timespan = Infinity;
        } else {
            this.rentalBusiness.timespan = 0;
        }

    }

    private calculateIntrest() {
        if (this.hasRentalBusiness && this.hasPropertyDevelopment) {
            const rentalStart = Number.parseInt(this.rentalBusiness.startDate.split('-')[0], 10) * 12 + Number.parseInt(this.rentalBusiness.startDate.split('-')[1], 10);
            const devStart = Number.parseInt(this.propertyDevelopment.startDate.split('-')[0], 10) * 12 + Number.parseInt(this.propertyDevelopment.startDate.split('-')[1], 10);
            const devTimespan = rentalStart - devStart;
            console.log(devTimespan);
            if (devTimespan > 0) {
                this.propertyDevelopment.intrest = this.bankLoan * this.bankIntrestRate * 0.01 + this.bond * this.bondIntrestRate * 0.01 / 12 * devTimespan;
            } else {
                this.propertyDevelopment.intrest = 0;
            }

            if (this.rentalBusiness.timespan >= 12) {
                this.rentalBusiness.intrest = this.bankLoan * this.bankIntrestRate * 0.01 + this.bond * this.bondIntrestRate * 0.01;
            } else {
                this.rentalBusiness.intrest = this.bankLoan * this.bankIntrestRate * 0.01 + this.bond * this.bondIntrestRate * 0.01 / 12 * this.rentalBusiness.timespan;
            }
        } else if (this.hasPropertyDevelopment) {
            this.propertyDevelopment.intrest = this.bankLoan * this.bankIntrestRate * 0.01 + this.bond * this.bondIntrestRate * 0.01 / 12 * this.propertyDevelopment.timespan;
            this.rentalBusiness.intrest = 0;
        } else if (this.hasRentalBusiness) {
            if (this.rentalBusiness.timespan >= 12) {
                this.rentalBusiness.intrest = this.bankLoan * this.bankIntrestRate * 0.01 + this.bond * this.bondIntrestRate * 0.01;
            } else {
                this.rentalBusiness.intrest = this.bankLoan * this.bankIntrestRate * 0.01 + this.bond * this.bondIntrestRate * 0.01 / 12 * this.rentalBusiness.timespan;
            }
            this.propertyDevelopment.intrest = 0;
        }
    }
}
