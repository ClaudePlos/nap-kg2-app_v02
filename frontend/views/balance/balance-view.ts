import '@vaadin/button';
import '@vaadin/combo-box'
import '@vaadin/checkbox';
import '@vaadin/text-field';
import '@vaadin/number-field';
import '@vaadin/date-picker';
import '@vaadin/grid/vaadin-grid';
import { View } from '../../views/view';
import { customElement, query, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import {html, render} from "lit";
import * as CompanyEndpoint from "Frontend/generated/CompanyEndpoint";
import * as BalanceEndpoint from "Frontend/generated/BalanceEndpoint";
import EatFirma from 'Frontend/generated/pl/kskowronski/data/entities/EatFirma';
import EatFirmaModel from 'Frontend/generated/pl/kskowronski/data/entities/EatFirmaModel';
import {Notification} from "@vaadin/notification";
import { GridColumn, GridItemModel } from '@vaadin/grid';
import BalanceDTO from "Frontend/generated/pl/kskowronski/data/entities/BalanceDTO";
import { DatePicker, DatePickerDate, DatePickerValueChangedEvent } from '@vaadin/date-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import './claude-date-from';
import './claude-date-to';
import { balanceViewStore } from './balance-view-store';

@customElement('balance-view')
export class BalanceView extends View  {
    private frmId: string  = '';
    private mask: string = '';

    @state()
    private dateFrom: string = dateFnsFormat(new Date('2021-01-01'), 'yyyy-MM-dd');

    @state()
    private dateTo: string = dateFnsFormat(new Date('2021-01-31'), 'yyyy-MM-dd');

    @state()
    private companies: EatFirma[] = [];

    @state()
    private balance: Array<BalanceDTO | undefined> | undefined = [];

    @query('vaadin-date-picker')
    private datePicker?: DatePicker;



    async firstUpdated() {
        const companies = await CompanyEndpoint.getCompanies();
        this.companies = companies;

        const formatDateIso8601 = (dateParts: DatePickerDate): string => {
            const { year, month, day } = dateParts;
            const date = new Date(year, month, day);

            return dateFnsFormat(date, 'yyyy-MM-dd');
        };

        const parseDateIso8601 = (inputValue: string): DatePickerDate => {
            const date = dateFnsParse(inputValue, 'yyyy-MM-dd', new Date());

            return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
        };

        if (this.datePicker) {
            this.datePicker.i18n = {
                ...this.datePicker.i18n,
                formatDate: formatDateIso8601,
                parseDate: parseDateIso8601,
            };
        }
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

    dateFromChanged(e: CustomEvent) {
        this.dateFrom = e.detail.value as string;
    }

    dateToChanged(e: CustomEvent) {
        this.dateTo = e.detail.value as string;
    }

    async run() {
        if (this.frmId === "") {
            Notification.show("Brak wybranej firmy !!!")
        }
        const serverResponse = await BalanceEndpoint.calculateBalance(Number(this.frmId), balanceViewStore.dateFrom, balanceViewStore.dateTo, this.mask)
        //console.log(serverResponse);
        this.balance = serverResponse
    }

    formatAmount(num: number) {
        return Intl.NumberFormat('pl', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(
            num
        );
    }

    private accountNameRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<BalanceDTO>) => {
        render(html` <span title='${model.item.accountName}'>${model.item.accountName}</span>`, root);
    };

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


