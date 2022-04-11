import '@vaadin/button';
import '@vaadin/combo-box'
import '@vaadin/checkbox';
import '@vaadin/text-field';
import '@vaadin/number-field';
import '@vaadin/date-picker';
import '@vaadin/grid/vaadin-grid';
import { View } from '../../views/view';
import { customElement, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import {html, render} from "lit";
import * as CompanyEndpoint from "Frontend/generated/CompanyEndpoint";
import * as BalanceEndpoint from "Frontend/generated/BalanceEndpoint";
import EatFirma from 'Frontend/generated/pl/kskowronski/data/entities/EatFirma';
import EatFirmaModel from 'Frontend/generated/pl/kskowronski/data/entities/EatFirmaModel';
import {Notification} from "@vaadin/notification";
import { GridItemModel } from '@vaadin/grid';
import BalanceDTO from "Frontend/generated/pl/kskowronski/data/entities/BalanceDTO";
import './claude-date-from';
import './claude-date-to';
import { balanceViewStore } from './balance-view-store';
import * as XLSX from 'xlsx';

@customElement('balance-view')
export class BalanceView extends View  {
    private frmId: string  = '';
    private mask: string = '';


    @state()
    private companies: EatFirma[] = [];

    @state()
    private balance: BalanceDTO[] = [];


    async firstUpdated() {
        const companies = await CompanyEndpoint.getCompanies();
        this.companies = companies;
    }

    connectedCallback() {
        super.connectedCallback();
        //this.classList.add('flex', 'p-m', 'gap-m', 'items-end','height: 100%');
    }

    render() {
        return html`<div style="width: 99%; height: 100%; padding-left: 5px">
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
                <claude-date-from></claude-date-from>
                <claude-date-to></claude-date-to>
                <vaadin-button @click=${this.run}>Uruchom</vaadin-button>
                <vaadin-button @click=${this.excel}>Excel</vaadin-button>
            </div>
            
            <vaadin-split-layout>
            <vaadin-grid .items=${this.balance} style="width: 99%; height: 88%">
                <vaadin-grid-column path="frmName" .renderer="${this.subscriptionRenderer}" auto-width></vaadin-grid-column>
                <vaadin-grid-column path="account" width="250px"></vaadin-grid-column>
                <vaadin-grid-column header="Name" .renderer="${this.accountNameRenderer}" auto-width></vaadin-grid-column>

                <vaadin-grid-column header="BoWN" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.boWn))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="BoMA" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.boMa))}</span>`,root );})}"
                ></vaadin-grid-column>
                
                <vaadin-grid-column header="Bo+obroty nar WN" text-align="end" width="200px"
                   .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                    render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.boWnAndCumulativeTurnover))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="Bo+obroty nar MA" text-align="end" width="200px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.boMaAndCumulativeTurnover))}</span>`,root );})}"
                ></vaadin-grid-column>

                <!-- TODO obroty WN nar -->

                <vaadin-grid-column header="Obroty okresu WN" text-align="end" width="200px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.periodTurnoverWn))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="Obroty okresu MA" text-align="end" width="200px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.periodTurnoverMa))}</span>`,root );})}"
                ></vaadin-grid-column>

                <vaadin-grid-column header="Saldo WN" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.balanceWn))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="Saldo MA" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.balanceMa))}</span>`,root );})}"
                ></vaadin-grid-column>
                
                
                <vaadin-grid-column path="boWnAndWal" width="150px"></vaadin-grid-column>
                <vaadin-grid-column path="boWnAndCumulativeTurnoverWal" header="Bo+Obroty nar WN wal" width="150px"></vaadin-grid-column>

                
                
                <vaadin-grid-column path="boMaAndWal"></vaadin-grid-column>
                <vaadin-grid-column path="boMaAndCumulativeTurnoverWal"></vaadin-grid-column>

                
                <vaadin-grid-column path="periodTurnoverWnWal"></vaadin-grid-column>

                
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


    async run() {
        if (this.frmId === "") {
            Notification.show("Brak wybranej firmy !!!")
        }
        const serverResponse = await BalanceEndpoint.calculateBalance(Number(this.frmId), balanceViewStore.dateFrom, balanceViewStore.dateTo, this.mask)
        console.log(serverResponse.length);
        this.balance = serverResponse
    }

    async excel() {

        const readyToExport = this.balance;

        const workBook = XLSX.utils.book_new(); // create a new blank book
        const workSheet = XLSX.utils.json_to_sheet(readyToExport);

        XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book
        XLSX.writeFile(workBook, 'bilans.xlsx'); // initiate a file download in browser

    }


    formatAmount(num: number) {
        return Intl.NumberFormat('pl', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(
            num
        );
    }

    private accountNameRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
        render(html` <span title='${model.item.accountName}'>${model.item.accountName}</span>`, root);
    };

    private subscriptionRenderer = ( root: HTMLElement, _: HTMLElement, model: GridItemModel<BalanceDTO> ) => {
        const frmId =  model.item.frmName as number | undefined;
        let cName = this.companies.find( item => item.frmId == frmId );
        // @ts-ignore
        root.textContent = cName.frmName;
    };




}


