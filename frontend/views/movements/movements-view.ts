import '@vaadin/button';
import '@vaadin/combo-box'
import '@vaadin/checkbox';
import '@vaadin/text-field';
import '@vaadin/text-field';
import '@vaadin/number-field';
import '@vaadin/date-picker';
import '@vaadin/grid/vaadin-grid';

import { TextFieldValueChangedEvent } from '@vaadin/text-field';
import { GridItemModel } from '@vaadin/grid';
import { customElement, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import {View} from "Frontend/views/view";
import {html, render} from "lit";
import {Notification} from "@vaadin/notification";
import {balanceViewStore} from "Frontend/views/balance/balance-view-store";
import MovementDTO from "Frontend/generated/pl/kskowronski/data/entities/MovementDTO";
import {MovementsEndpoint} from "Frontend/generated/endpoints";
import BalanceDTO from "Frontend/generated/pl/kskowronski/data/entities/BalanceDTO";
import * as XLSX from "xlsx";
import EatFirma from "Frontend/generated/pl/kskowronski/data/entities/EatFirma";
import * as CompanyEndpoint from "Frontend/generated/CompanyEndpoint";
import {ComboBox} from "@vaadin/combo-box";
import EatFirmaModel from "Frontend/generated/pl/kskowronski/data/entities/EatFirmaModel";


@customElement('movements-view')
export class MovementsView extends View  {
    private frmName: string  = '';
    private frmId: number | undefined;
    private mask: string = '';

    @state()
    private companies: EatFirma[] = [];

    @state()
    private filteredMovements: MovementDTO[] = [];

    private movements: MovementDTO[] = [];

    @state()
    private company: EatFirma | undefined;

    async firstUpdated() {
        const companies = await CompanyEndpoint.getCompanies();
        this.companies = companies;
        this.company = companies[35];
        this.frmId = this.company.frmId;
    }

    connectedCallback() {
        super.connectedCallback();
        //this.classList.add('flex', 'p-m', 'gap-m', 'items-end','height: 100%');
    }

    render() {
        return html`<div style="width: 99%; height: 100%; padding-left: 5px">
            <div>
                <vaadin-combo-box  id="companies-box" label="Do firmy"
                                   .items="${this.companies}"
                                   .value="${this.company?.frmName}"
                                   @value-changed="${this.companyChanged}"
                                   item-label-path="frmName"
                                   item-value-path="frmId"
                                   allow-custom-value
                                   label="Browser"
                                   helper-text="Wybierz firmę"
                ></vaadin-combo-box>
                <vaadin-text-field label="Maska" value="100%" @value-changed=${this.maskChanged} clear-button-visible></vaadin-text-field>
                <claude-date-from></claude-date-from>
                <claude-date-to></claude-date-to>
                <vaadin-button @click=${this.run}>Uruchom</vaadin-button>
                <vaadin-button theme="primary success" @click=${this.excel}>Excel</vaadin-button>
                <vaadin-text-field placeholder="Search" style="width: 130px"
                                   @value-changed="${(e: TextFieldValueChangedEvent) => {
                                       const searchTerm = ((e.detail.value as string) || '').trim();
                                       const matchesTerm = (value: string) => {
                                           return value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0;
                                       };

                                       this.filteredMovements = this.movements.filter(({ frmName, account, accountName }) => {
                                           return (
                                                   !searchTerm ||
                                                   // @ts-ignore
                                                   matchesTerm(frmName) ||
                                                   // @ts-ignore
                                                   matchesTerm(account) ||
                                                   // @ts-ignore
                                                   matchesTerm(accountName)
                                           );
                                       });
                                   }}"
                >
                    >
                    <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
                </vaadin-text-field>
            </div>
            
            <vaadin-grid .items=${this.filteredMovements} style="width: 99%; height: 88%" >
                <vaadin-grid-column header="Firma" .renderer="${this.frmNameRenderer}" width="150px"></vaadin-grid-column>
                <vaadin-grid-column header="Konto" .renderer="${this.accountRenderer}" width="150px"></vaadin-grid-column>
                <vaadin-grid-column header="Nazwa konta" .renderer="${this.accountNameRenderer}""  width="250px"></vaadin-grid-column>

                <vaadin-grid-column header="BoWN" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<MovementDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.boWn))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="BoMA" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<MovementDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.boMa))}</span>`,root );})}"
                ></vaadin-grid-column>

                
                
                <vaadin-grid-column header="obrotyWn" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<MovementDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.obrotyWn))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="obrotyMa" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<MovementDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.obrotyMa))}</span>`,root );})}"
                ></vaadin-grid-column>

                <vaadin-grid-column header="saldoWn" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<MovementDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.saldoWn))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="saldoMa" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<MovementDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.saldoMa))}</span>`,root );})}"
                ></vaadin-grid-column>

                
                
                <vaadin-grid-column header="obrotyWnNarPlusBO" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<MovementDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.obrotyWnNarPlusBO))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="obrotyMaNarPlusBO" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<MovementDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.obrotyMaNarPlusBO))}</span>`,root );})}"
                ></vaadin-grid-column>
                
            </vaadin-grid>
        </div>`;
    }

    companyChanged(e: CustomEvent) {
        if ( e.detail.value === "% - wszystkie firmy") {
            this.frmId = 0;
        } else {
            this.frmId = e.detail.value as number;
        }
        // @ts-ignore
        this.frmName = this.companies.find( item => item.frmId == e.detail.value ).frmName;
    }

    maskChanged(e: CustomEvent) {
        this.mask = e.detail.value as string;
    }

    async run() {

        const serverResponse = await MovementsEndpoint.calculateMovements( this.frmId, balanceViewStore.dateFrom, balanceViewStore.dateTo, this.mask)
        if (serverResponse.length == 0) {
            const notification = Notification.show('Brak danych', {
                position: 'middle', duration: 1000
            });
        }
        this.movements = this.filteredMovements = serverResponse;
    }

    async excel() {

        const readyToExport = this.filteredMovements;

        const workBook = XLSX.utils.book_new(); // create a new blank book
        const workSheet = XLSX.utils.json_to_sheet(readyToExport);
        const now = new Date();

        XLSX.utils.sheet_add_aoa(workSheet, [["Rok: " + balanceViewStore.dateFrom.substring(0,4)]], { origin: "K1" });
        XLSX.utils.sheet_add_aoa(workSheet, [["Data generacji: " + now.toLocaleString("pl-PL")]], { origin: "K2" });
        XLSX.utils.sheet_add_aoa(workSheet, [["Data od: " + balanceViewStore.dateFrom]], { origin: "K3" });
        XLSX.utils.sheet_add_aoa(workSheet, [["Data do: " + balanceViewStore.dateTo]], { origin: "K4" });
        XLSX.utils.sheet_add_aoa(workSheet, [["Firma: " + "GRUPA REKEEP"]], { origin: "K5" });
        XLSX.utils.sheet_add_aoa(workSheet, [["Maska: " + this.mask]], { origin: "K6" });

        XLSX.utils.book_append_sheet(workBook, workSheet, 'Arkusz1'); // add the worksheet to the book

        XLSX.writeFile(workBook, 'obroty_salda_34.xlsx'); // initiate a file download in browser

    }

    private frmNameRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<MovementDTO>) => {
        render(html` <span title='${model.item.frmName}'>${model.item.frmName}</span>`, root);
    };

    private accountRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<MovementDTO>) => {
        render(html` <span title='${model.item.account}'>${model.item.account}</span>`, root);
    };

    private accountNameRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
        render(html` <span title='${model.item.accountName}'>${model.item.accountName}</span>`, root);
    };

    formatAmount(num: number) {
        return Intl.NumberFormat('pl', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(
            num
        );
    }

}