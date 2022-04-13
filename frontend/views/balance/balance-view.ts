import '@vaadin/button';
import '@vaadin/combo-box'
import '@vaadin/checkbox';
import '@vaadin/text-field';
import '@vaadin/number-field';
import '@vaadin/date-picker';
import '@vaadin/grid/vaadin-grid';
import { View } from '../../views/view';
import { TextFieldValueChangedEvent } from '@vaadin/text-field';
import type { GridActiveItemChangedEvent } from '@vaadin/grid';
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
import './transactions/transactions-view'
import { balanceViewStore } from './balance-view-store';
import { transactionsViewStore } from './transactions/transactions-view-store';
import * as XLSX from 'xlsx';

@customElement('balance-view')
export class BalanceView extends View  {
    private frmName: string  = '';
    private frmId: string  = '';
    private mask: string = '';
    private selectedAccount: string = '';

    @state()
    private companies: EatFirma[] = [];

    @state()
    private filteredBalance: BalanceDTO[] = [];

    private balance: BalanceDTO[] = [];

    @state()
    private selectedItems: BalanceDTO[] = [];

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
                <vaadin-combo-box  id="companies-box" label="Do firmy"
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
                <vaadin-button theme="primary success" @click=${this.excel}>Excel</vaadin-button>
                <vaadin-text-field placeholder="Search" style="width: 130px"
                                   @value-changed="${(e: TextFieldValueChangedEvent) => {
                                       const searchTerm = ((e.detail.value as string) || '').trim();
                                       const matchesTerm = (value: string) => {
                                           return value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0;
                                       };

                                       this.filteredBalance = this.balance.filter(({ frmName, account, accountName }) => {
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
                <vaadin-button @click=${this.openTransaction}>T</vaadin-button>
            </div>
            
            <vaadin-split-layout>
            <vaadin-grid .items=${this.filteredBalance}
                         .selectedItems="${this.selectedItems}"
                         @active-item-changed="${(e: GridActiveItemChangedEvent<BalanceDTO>) => {
                             const item = e.detail.value;
                             this.selectedItems = item ? [item] : [];
                             this.openTransaction()
                         }}"
                          style="width: 99%; height: 88%" >
                <vaadin-grid-column path="frmName" .renderer="${this.frmNameRenderer}" auto-width></vaadin-grid-column>
                <vaadin-grid-column path="account" .renderer="${this.accountRenderer}" .cl width="250px"></vaadin-grid-column>
                <vaadin-grid-column header="Name"  .renderer="${this.accountNameRenderer}" auto-width></vaadin-grid-column>

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
                    render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.boWnPlusObrotyNar))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="Bo+obroty nar MA" text-align="end" width="200px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.boMaPlusObrotyNar))}</span>`,root );})}"
                ></vaadin-grid-column>



                <vaadin-grid-column header="Obroty WN nar" text-align="end" width="200px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.obrotyWnNar))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="Obroty MA nar" text-align="end" width="200px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.obrotyMaNar))}</span>`,root );})}"
                ></vaadin-grid-column>
                
                
                

                <vaadin-grid-column header="Obroty okresu WN" text-align="end" width="200px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.obrotyOkresuWn))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="Obroty okresu MA" text-align="end" width="200px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.obrotyOkresuMa))}</span>`,root );})}"
                ></vaadin-grid-column>

                <vaadin-grid-column header="Saldo WN" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.saldoWn))}</span>`,root );})}"
                ></vaadin-grid-column>
                <vaadin-grid-column header="Saldo MA" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.saldoMa))}</span>`,root );})}"
                ></vaadin-grid-column>

                <vaadin-grid-column header="Persaldo" text-align="end" width="150px"
                                    .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
                                        render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.persaldo))}</span>`,root );})}"
                ></vaadin-grid-column>


                <vaadin-grid-column header="Waluta" path="currency" auto-width></vaadin-grid-column>
                
                
<!--                <vaadin-grid-column path="boWnAndWal" width="150px"></vaadin-grid-column>-->
<!--                <vaadin-grid-column path="boWnAndCumulativeTurnoverWal" header="Bo+Obroty nar WN wal" width="150px"></vaadin-grid-column>-->

<!--                -->
<!--                -->
<!--                <vaadin-grid-column path="boMaAndWal"></vaadin-grid-column>-->
<!--                <vaadin-grid-column path="boMaAndCumulativeTurnoverWal"></vaadin-grid-column>-->

<!--                -->
<!--                <vaadin-grid-column path="periodTurnoverWnWal"></vaadin-grid-column>-->
<!--                <vaadin-grid-column path="periodTurnoverMaWal"></vaadin-grid-column>-->
                
            </vaadin-grid>
            </vaadin-split-layout>
            <transactions-view></transactions-view>
<!--            <vaadin-button @click="${transactionsViewStore.setOpenedChanged }"> Show dialog </vaadin-button>-->
            
    </div>`;
    }

    companyChanged(e: CustomEvent) {
        this.frmId = e.detail.value as string;
        // @ts-ignore
        this.frmName = this.companies.find( item => item.frmId == e.detail.value ).frmName;
    }

    maskChanged(e: CustomEvent) {
        this.mask = e.detail.value as string;
    }


    async run() {
        if (this.frmId === "") {
            const notification = Notification.show('Brak wybranej firmy !!!', {
                position: 'middle', duration: 1000
            });
            notification.setAttribute('theme', 'error');
        }

        if (this.frmId == "0") {
            const serverResponse = await BalanceEndpoint.calculateBalanceForCompaniesInGK( balanceViewStore.dateFrom, balanceViewStore.dateTo, this.mask )
            this.balance = this.filteredBalance = serverResponse;
            return
        }

        const serverResponse = await BalanceEndpoint.calculateBalance(Number(this.frmId), balanceViewStore.dateFrom, balanceViewStore.dateTo, this.mask)
        if (serverResponse.length == 0) {
            const notification = Notification.show('Brak danych', {
                position: 'middle', duration: 1000
            });
        }
        this.balance = this.filteredBalance = serverResponse;
    }

    async excel() {

        const readyToExport = this.filteredBalance;

        const workBook = XLSX.utils.book_new(); // create a new blank book
        const workSheet = XLSX.utils.json_to_sheet(readyToExport);
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Obroty i Salda'); // add the worksheet to the book

        const workSheet2 = XLSX.utils.aoa_to_sheet([
            ["Rok:", balanceViewStore.dateFrom.substring(0,4)],
            ["Data od:", balanceViewStore.dateFrom],
            ["Data do:", balanceViewStore.dateTo],
            ["Wzorzec konta:", this.mask],
            ["Firma:", this.frmName],
        ]);
        XLSX.utils.book_append_sheet(workBook, workSheet2, 'Parametry'); // add the worksheet to the book

        XLSX.writeFile(workBook, 'bilans.xlsx'); // initiate a file download in browser

    }


    formatAmount(num: number) {
        return Intl.NumberFormat('pl', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(
            num
        );
    }

    private frmNameRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
        render(html` <span title='${model.item.frmName}'>${model.item.frmName}</span>`, root);
    };

    private accountRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
        render(html` <span title='${model.item.account}' @dblclick=${this.openTransaction}>${model.item.account}</span>`, root);
    };

    private accountNameRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
        render(html` <span title='${model.item.accountName}'>${model.item.accountName}</span>`, root);
    };


    openTransaction() {
        this.selectedItems.forEach( item => {
            transactionsViewStore.setOpenedChanged(true, item.account as string);
        })

    }



    // private subscriptionRenderer = ( root: HTMLElement, _: HTMLElement, model: GridItemModel<BalanceDTO> ) => {
    //     const frmId =  model.item.frmName as number | undefined;
    //     let cName = this.companies.find( item => item.frmId == frmId );
    //     // @ts-ignore
    //     root.textContent = cName.frmName;
    // };




}


