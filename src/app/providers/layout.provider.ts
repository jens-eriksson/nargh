import { Injectable } from '@angular/core';

declare var google: any;

@Injectable()
export class LayoutProvider {
    mobileView = false;
    sidebar = {
        hidden: false,
        heading: 'NARGH INVEST AB'
    };
    constructor() {
    }
}
