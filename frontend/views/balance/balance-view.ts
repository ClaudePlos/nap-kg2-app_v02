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
import { GridItemModel } from '@vaadin/grid';
import BalanceDTO from "Frontend/generated/pl/kskowronski/data/entities/BalanceDTO";

@customElement('balance-view')
export class BalanceView extends View  {
    private frmId: string  = '';
    private mask: string = '';
    private dateFrom: string = '';
    private dateTo: string = '';

    @state()
    private companies: EatFirma[] = [];

    @state()
    private balance: Array<BalanceDTO | undefined> | undefined = [];

    async firstUpdated() {
        const companies = await CompanyEndpoint.getCompanies();
        this.companies = companies;
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('flex', 'p-m', 'gap-m', 'items-end');
    }

    render() {
        return html`<div style="width: 100%;">
            <div>
                <vaadin-combo-box label="Do firmy"
                                  .items="${this.companies}"
                                  @value-changed="${this.companyChanged}"
                                  item-label-path="frmName"
                                  item-value-path="frmId"
                                  allow-custom-value
                                  label="Browser"
                                  helper-text="Wybierz firmę"
                ></vaadin-combo-box>
                <vaadin-text-field label="Maska" value="501-Z386%" @value-changed=${this.maskChanged} clear-button-visible></vaadin-text-field>
                <vaadin-date-picker label="Okres od:" value="2021-01-01" @value-changed="${this.dateFromChanged}"></vaadin-date-picker>
                <vaadin-date-picker label="Okres do:" value="2021-01-31" @value-changed="${this.dateFromTo}"></vaadin-date-picker>
                <vaadin-button @click=${this.run}>Uruchom</vaadin-button>
            </div>
            
            <vaadin-split-layout>
            <vaadin-grid .items=${this.balance} style="width: 100%;">
                <vaadin-grid-column path="frmName" .renderer="${this.subscriptionRenderer}" auto-width></vaadin-grid-column>
                <vaadin-grid-column path="account" auto-width></vaadin-grid-column>
                <vaadin-grid-column path="accountName" auto-width></vaadin-grid-column>

                <vaadin-grid-column path="boWn" header="BoWN" width="7em" flex-grow="0" auto-width></vaadin-grid-column>
                <vaadin-grid-column path="boMa" header="BoMA" width="7em" flex-grow="0" auto-width></vaadin-grid-column>
                
                <vaadin-grid-column path="boWnAndCumulativeTurnover" header="Bo+obroty nar WN" auto-width></vaadin-grid-column>
                <vaadin-grid-column path="boMaAndCumulativeTurnover" header="Bo+obroty nar MA" auto-width></vaadin-grid-column>
                
                <vaadin-grid-column path="boWnAndWal" auto-width></vaadin-grid-column>
                <vaadin-grid-column path="boWnAndCumulativeTurnoverWal" header="Bo+Obroty nar WN wal" auto-width></vaadin-grid-column>

                
                
                <vaadin-grid-column path="boMaAndWal"></vaadin-grid-column>
                <vaadin-grid-column path="boMaAndCumulativeTurnoverWal"></vaadin-grid-column>

                <vaadin-grid-column path="periodTurnoverWn"></vaadin-grid-column>
                <vaadin-grid-column path="periodTurnoverWnWal"></vaadin-grid-column>

                <vaadin-grid-column path="periodTurnoverMa"></vaadin-grid-column>
                <vaadin-grid-column path="periodTurnoverMaWal"></vaadin-grid-column>
                
            </vaadin-grid>
            </vaadin-split-layout>
            
    </div>`;
    }

    companyChanged(e: CustomEvent) {
        this.frmId = e.detail.value as string;
    }

    maskChanged(e: CustomEvent) {
        this.mask = e.detail.value as string;
    }

    dateFromChanged(e: CustomEvent) {
        this.dateFrom = e.detail.value as string;
    }

    dateFromTo(e: CustomEvent) {
        this.dateTo = e.detail.value as string;
    }

    async run() {
        const serverResponse = await BalanceEndpoint.calculateBalance(Number(this.frmId), this.dateFrom, this.dateTo, this.mask);
        console.log(serverResponse);
        this.balance = serverResponse;
    }

    private subscriptionRenderer = (
        root: HTMLElement,
        _: HTMLElement,
        model: GridItemModel<BalanceDTO>
    ) => {
        let cName = '';
        if (model.item.frmName === '300000') {
            cName = 'IZAN+';
        } else {
            cName = 'others';
        }
        root.textContent = cName;
    };




}


