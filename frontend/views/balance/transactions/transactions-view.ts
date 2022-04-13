import { html, LitElement, render } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';

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
    // protected createRenderRoot() {
    //     const root = super.createRenderRoot();
    //     // Apply custom theme (only supported if your app uses one)
    //     applyTheme(root);
    //     return root;
    // }


    @state()
    private dialogOpened = transactionsViewStore.dialogOpened;

    render() {
        return html`
      <vaadin-dialog
        theme="no-padding"
        aria-label="Create new employee"
        .opened="${transactionsViewStore.dialogOpened}"
        @opened-changed="${(e: CustomEvent) => (transactionsViewStore.dialogOpened = e.detail.value)}"
        .renderer="${guard([], () => (root: HTMLElement) => {
            render(
                html`
              <vaadin-vertical-layout
                style="align-items: stretch; height: 100%; max-height: 420px; width: 320px;"
              >
                <header
                  class="draggable"
                  style="border-bottom: 1px solid var(--lumo-contrast-10pct); padding: var(--lumo-space-m) var(--lumo-space-l);"
                >
                  <h2
                    style="font-size: var(--lumo-font-size-xl); font-weight: 600; line-height: var(--lumo-line-height-xs); margin: 0;"
                  >
                    Create new employee
                  </h2>
                </header>
                <vaadin-scroller scroll-direction="vertical" style="padding: var(--lumo-space-l);">
                  <vaadin-vertical-layout
                    aria-labelledby="personal-title"
                    role="region"
                    style="align-items: stretch; margin-bottom: var(--lumo-space-xl);"
                  >
                    <h3
                      id="personal-title"
                      style="font-size: var(--lumo-font-size-l); font-weight: 600; line-height: var(--lumo-line-height-xs); margin: 0 0 var(--lumo-space-s) 0;"
                    >
                      Personal information
                    </h3>
                    <vaadin-text-field label="First name" value="${transactionsViewStore.account}"></vaadin-text-field>
                    <vaadin-text-field label="Last name"></vaadin-text-field>
                    <vaadin-date-picker
                      initial-position="1990-01-01"
                      label="Birthdate"
                    ></vaadin-date-picker>
                  </vaadin-vertical-layout>
                  <vaadin-vertical-layout
                    aria-labelledby="employment-title"
                    role="region"
                    style="align-items: stretch;"
                  >
                    <h3
                      id="employment-title"
                      style="font-size: var(--lumo-font-size-l); font-weight: 600; line-height: var(--lumo-line-height-xs); margin: 0 0 var(--lumo-space-s) 0;"
                    >
                      Employment information
                    </h3>
                    <vaadin-text-field label="Position"></vaadin-text-field>
                    <vaadin-text-area label="Additional information"></vaadin-text-area>
                  </vaadin-vertical-layout>
                </vaadin-scroller>
                <footer
                  style="background-color: var(--lumo-contrast-5pct); padding: var(--lumo-space-s) var(--lumo-space-m); text-align: right;"
                >
                  <vaadin-button
                    theme="tertiary"
                    style="margin-inline-end: var(--lumo-space-m);"
                    @click="${() => (transactionsViewStore.dialogOpened = false)}"
                  >
                    Cancel
                  </vaadin-button>
                  <vaadin-button theme="primary" @click="${() => (transactionsViewStore.dialogOpened = false)}">
                    Save
                  </vaadin-button>
                </footer>
              </vaadin-vertical-layout>
            `,
                root
            );
        })}"
      ></vaadin-dialog>
<!--      <vaadin-button @click="${() => (this.dialogOpened = true)}"> Show dialog </vaadin-button>-->
    `;
    }
}