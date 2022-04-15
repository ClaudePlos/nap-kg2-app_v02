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

import { applyTheme } from 'Frontend/generated/theme';

import { transactionsViewStore } from './transactions-view-store';
import {MobxLitElement} from "@adobe/lit-mobx";

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
              <vaadin-vertical-layout style="align-items: stretch; height: 100%; max-height: 720px; width: 1220px;">
                <header class="draggable" style="border-bottom: 1px solid var(--lumo-contrast-10pct); padding: var(--lumo-space-m) var(--lumo-space-l);">
                  <h2 style="font-size: var(--lumo-font-size-xl); font-weight: 600; line-height: var(--lumo-line-height-xs); margin: 0;">Transakcje:</h2>
                </header>

                  <vaadin-grid .items="${transactionsViewStore.transactions}">
                      <vaadin-grid-column path="account" auto-width></vaadin-grid-column>
                      <vaadin-grid-column path="wartosc" auto-width></vaadin-grid-column>
                      <vaadin-grid-column path="tresc" auto-width></vaadin-grid-column>
                      <vaadin-grid-column path="wartoscWn" auto-width></vaadin-grid-column>
                      <vaadin-grid-column path="wartoscMa" auto-width></vaadin-grid-column>
                      <vaadin-grid-column path="numerWlasny" auto-width></vaadin-grid-column>
                      <vaadin-grid-column path="dataZaksiegowania" auto-width></vaadin-grid-column>
                  </vaadin-grid>
                  
                <footer style="background-color: var(--lumo-contrast-5pct); padding: var(--lumo-space-s) var(--lumo-space-m); text-align: right;">
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
}