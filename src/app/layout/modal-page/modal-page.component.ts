import { LayoutProvider } from '../../providers/layout.provider';
import { ModalPageProvider } from '../../providers/modal-page.provider';
import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

@Component({
    selector: 'app-modal-page',
    templateUrl: 'modal-page.component.html',
    styleUrls: ['modal-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModalPageComponent implements OnInit, OnDestroy {
    @Input() id: string;
    @ViewChild('modalPageContent', { read: ViewContainerRef, static: false }) container;
    private element: any;
    componentRef;

    constructor(
        private modalPageProvider: ModalPageProvider,
        private el: ElementRef,
        public layoutProvider: LayoutProvider,
        private resolver: ComponentFactoryResolver
    ) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalPageProvider.add(this);
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.modalPageProvider.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('modal-page-open');
    }

    // close modal
    close(): void {
        this.element.style.display = 'none';
        document.body.classList.remove('modal-page-open');
    }

    setContent(component, initialState) {
        this.container.clear();
        const factory = this.resolver.resolveComponentFactory(component);
        this.componentRef = this.container.createComponent(factory);
        for(let key in initialState) {
            this.componentRef._component[key] = initialState[key];
        }
    }
}
