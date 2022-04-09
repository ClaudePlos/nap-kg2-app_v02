import '@vaadin/button';
import '@vaadin/combo-box'
import '@vaadin/checkbox';
import '@vaadin/text-field';
import '@vaadin/number-field';
import '@vaadin/grid/vaadin-grid';
import { html, LitElement  } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { View } from '../../views/view';
import { Binder, field } from '@hilla/form';
import * as CompanyEndpoint from 'Frontend/generated/CompanyEndpoint';
import EatFirma from 'Frontend/generated/pl/kskowronski/data/entities/EatFirma';
import EatFirmaModel from 'Frontend/generated/pl/kskowronski/data/entities/EatFirmaModel';
import {Notification} from "@vaadin/notification";
import * as HelloWorldEndpoint from "Frontend/generated/HelloWorldEndpoint";

@customElement('accounts-coping-view')
export class AccountCopingView extends LitElement  {
    mask = '';
    year = '';
    level = '';
    frmIdCompanyCopyTo = '';

    @state()
    private comapnies: EatFirma[] = [];

    @state()
    private items = ['Chrome', 'Edge', 'Firefox', 'Safari'];

    private binder = new Binder(this, EatFirmaModel);

    render() {
        return html`<div>
            <p>Kopiowanie kont z szablonu do wybranej firmy 🤗</p>
            
            <div>
                <vaadin-combo-box label="Do firmy"
                                  .items="${this.comapnies}"
                                  @value-changed="${this.companyChanged}"
                                  item-label-path="frmName"
                                  item-value-path="frmId"
                                  allow-custom-value
                                  label="Browser"
                                  helper-text="Wybierz firmę"
                ></vaadin-combo-box>
            </div>
            
            <div><vaadin-text-field label="Maska dla kont syntetycznych, które mają być skopiowane" value="5%" @value-changed=${this.maskChanged} clear-button-visible></vaadin-text-field></div>
            <div><vaadin-text-field label="Rok" value="2022" @value-changed=${this.yearChanged} clear-button-visible></vaadin-text-field></div>
            <div><vaadin-text-field label="Poziom analityki" value="5" @value-changed=${this.levelChanged} clear-button-visible></vaadin-text-field></div>
            <div><vaadin-button @click=${this.copyAccountsToCompany}>Kopiuj</vaadin-button><div>


            <!-- grid example:
            <vaadin-checkbox></vaadin-checkbox>
            <h3>Comany List</h3>
            <vaadin-grid .items="${this.comapnies}" theme="row-stripes" style="max-width: 400px">
                <vaadin-grid-column path="frmName"></vaadin-grid-column>
                <vaadin-grid-column path="frmKlId"></vaadin-grid-column>
            </vaadin-grid>
            -->
        
            
    </div>`;
    }

    maskChanged(e: CustomEvent) {
        this.mask = e.detail.value;
    }

    yearChanged(e: CustomEvent) {
        this.year = e.detail.value;
    }

    levelChanged(e: CustomEvent) {
        this.level = e.detail.value;
    }

    companyChanged(e: CustomEvent) {
        console.log(e.detail.value as string);
        this.frmIdCompanyCopyTo = e.detail.value as string;
    }

    async copyAccountsToCompany() {
        const serverResponse = await CompanyEndpoint.copyAccountsToCompany(Number(this.frmIdCompanyCopyTo), this.mask, this.year, this.level);
        Notification.show(serverResponse as string);
    }




    async firstUpdated() {
        const comapnies = await CompanyEndpoint.getCompanies();
        this.comapnies = comapnies;
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('flex', 'p-m', 'gap-m', 'items-end');
        // this.classList.add(
        //     'flex',
        //     'flex-col',
        //     'h-full',
        //     'items-center',
        //     'justify-center',
        //     'p-l',
        //     'text-center',
        //     'box-border'
        // );
    }


}