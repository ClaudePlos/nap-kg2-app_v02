import { html, LitElement, render } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import {Notification} from "@vaadin/notification";

import '@vaadin/button';
import '@vaadin/date-picker';
import '@vaadin/dialog';
import '@vaadin/horizontal-layout';
import '@vaadin/scroller';
import '@vaadin/text-area';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-sort-column.js';
import { GridItemModel } from '@vaadin/grid';

import { transactionsViewStore } from './transactions-view-store';
import {MobxLitElement} from "@adobe/lit-mobx";
import TransactionDTO from "Frontend/generated/pl/kskowronski/data/entities/TransactionDTO";
import * as XLSX from "xlsx";

@customElement('transactions-view')
export class TransactionsView extends MobxLitElement {


    @state()
    private dialogOpened = transactionsViewStore.dialogOpened;



    render() {
        return html`
      <vaadin-dialog theme="no-padding" aria-label="Transakcje TODO"
        .opened="${transactionsViewStore.dialogOpened}"
        @opened-changed="${(e: CustomEvent) => (transactionsViewStore.dialogOpened = e.detail.value)}"
        .renderer="${guard([], () => (root: HTMLElement) => {
            render(
                html`
              <vaadin-vertical-layout style="align-items: stretch; height: 100%; max-height: 720px; width: 1320px;">
                <header class="draggable" style="border-bottom: 1px solid var(--lumo-contrast-10pct); padding: var(--lumo-space-m) var(--lumo-space-l);">
                  <h2 style="font-size: var(--lumo-font-size-xl); font-weight: 600; line-height: var(--lumo-line-height-xs); margin: 0;">Transakcje dla ${transactionsViewStore.account}% </h2>
                </header>

                  <vaadin-grid .items="${transactionsViewStore.transactions}">
                      <vaadin-grid-sort-column path="frmName" auto-width resizable></vaadin-grid-sort-column>
                      <vaadin-grid-sort-column path="account" auto-width resizable></vaadin-grid-sort-column>
                      <vaadin-grid-sort-column header="Wartość" text-align="end" width="150px"
                                               .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<TransactionDTO>) => {
                                                   render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.wartosc))}</span>`,root );})}"
                      ></vaadin-grid-sort-column>
                      <vaadin-grid-sort-column path="tresc" .renderer="${this.textNameRenderer}" width="150px" resizable></vaadin-grid-sort-column>
                      <vaadin-grid-sort-column header="WN" text-align="end" width="150px"
                                               .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<TransactionDTO>) => {
                                                   render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.wartoscWn))}</span>`,root );})}"
                      ></vaadin-grid-sort-column>
                      <vaadin-grid-sort-column header="MA" text-align="end" width="150px"
                                               .renderer="${guard([], () => (root: HTMLElement,  _: HTMLElement, model: GridItemModel<TransactionDTO>) => {
                                                   render(html`<span style="font-variant-numeric: tabular-nums">${this.formatAmount(Number(model.item.wartoscMa))}</span>`,root );})}"
                      ></vaadin-grid-sort-column>
                      <vaadin-grid-sort-column path="numerWlasny" auto-width resizable></vaadin-grid-sort-column>
                      <vaadin-grid-sort-column path="dataZaksiegowania" auto-width></vaadin-grid-sort-column>
                  </vaadin-grid>
                  
                <footer style="background-color: var(--lumo-contrast-5pct); padding: var(--lumo-space-s) var(--lumo-space-m); text-align: right;">
                    <vaadin-button theme="primary success" @click=${this.excel}>Excel</vaadin-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <vaadin-button
                    theme="tertiary"
                    style="margin-inline-end: var(--lumo-space-m);"
                    @click="${() => (transactionsViewStore.dialogOpened = false)}">X</vaadin-button>
                </footer>
              </vaadin-vertical-layout>
            `,
                root
            );
        })}"
      ></vaadin-dialog>
    `;
    }

    formatAmount(num: number) {
        return Intl.NumberFormat('pl', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(
            num
        );
    }

    textNameRenderer = (root: HTMLElement, _: HTMLElement, model: GridItemModel<TransactionDTO>) => {
        render(html` <span title='${model.item.tresc}'>${model.item.tresc}</span>`, root);
    };

    async excel() {
        const readyToExport = transactionsViewStore.transactions;

        const workBook = XLSX.utils.book_new(); // create a new blank book
        const workSheet = XLSX.utils.json_to_sheet(readyToExport);
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Arkusz1'); // add the worksheet to the book

        XLSX.writeFile(workBook, 'transakcje.xlsx'); // initiate a file download in browser

    }
}