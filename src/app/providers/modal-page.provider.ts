import { Injectable, Component } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalPageProvider {
    private modals: any[] = [];

    add(modal: any) {
        // add modal to array of active modals
        this.modals.push(modal);
    }

    remove(id: string) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x.id !== id);
    }

    close() {
        // close modal specified by id
        const modal = this.modals.find(x => x.id === 'modal-page');
        modal.close();
    }

    open(component, initialState?) {
        const modal = this.modals.find(x => x.id === 'modal-page');
        modal.setContent(component, initialState);
        modal.open();
    }
}
