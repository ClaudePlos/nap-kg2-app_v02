import '@vaadin/button';
import '@vaadin/combo-box'
import '@vaadin/checkbox';
import '@vaadin/text-field';
import '@vaadin/number-field';
import '@vaadin/date-picker';
import '@vaadin/grid/vaadin-grid';
import { View } from '../../views/view';
import { customElement, query, state } from 'lit/decorators.js';
import {html} from "lit";
import * as CompanyEndpoint from "Frontend/generated/CompanyEndpoint";
import * as BalanceEndpoint from "Frontend/generated/BalanceEndpoint";
import EatFirma from 'Frontend/generated/pl/kskowronski/data/entities/EatFirma';
import EatFirmaModel from 'Frontend/generated/pl/kskowronski/data/entities/EatFirmaModel';
import {Notification} from "@vaadin/notification";

@customElement('balance-view')
export class BalanceView extends View  {
    private frmId: string  = '';
    private dateFrom: string = '';
    private dateTo: string = '';

    @state()
    private companies: EatFirma[] = [];




    async firstUpdated() {
        const companies = await CompanyEndpoint.getCompanies();
        this.companies = companies;
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('flex', 'p-m', 'gap-m', 'items-end');
    }

    render() {
        return html`<div>
            <div>
                <vaadin-combo-box label="Do firmy"
                                  .items="${this.companies}"
                                  @value-changed="${this.companyChanged}"
                                  item-label-path="frmName"
                                  item-value-path="frmKlId"
                                  allow-custom-value
                                  label="Browser"
                                  helper-text="Wybierz firmę"
                ></vaadin-combo-box>
                <vaadin-date-picker label="Okres od:" value="2022-01-01" @value-changed="${this.dateFromChanged}"></vaadin-date-picker>
                <vaadin-date-picker label="Okres do:" value="2022-01-31" @value-changed="${this.dateFromTo}"></vaadin-date-picker>
                <vaadin-button @click=${this.run}>Uruchom</vaadin-button>
            </div>
         
            
    </div>`;
    }

    companyChanged(e: CustomEvent) {
        this.frmId = e.detail.value as string;
    }

    dateFromChanged(e: CustomEvent) {
        this.dateFrom = e.detail.value as string;
    }

    dateFromTo(e: CustomEvent) {
        this.dateTo = e.detail.value as string;
    }

    async run() {
        const serverResponse = await BalanceEndpoint.calculateBalance(Number(this.frmId), this.dateFrom, this.dateTo);
        Notification.show(serverResponse as string);
    }




}


