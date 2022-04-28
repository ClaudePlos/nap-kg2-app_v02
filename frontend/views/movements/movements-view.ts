import '@vaadin/button';
import '@vaadin/combo-box'
import '@vaadin/checkbox';
import '@vaadin/text-field';
import '@vaadin/text-field';
import '@vaadin/number-field';
import '@vaadin/date-picker';
import '@vaadin/grid/vaadin-grid';

import { customElement, state } from 'lit/decorators.js';
import {View} from "Frontend/views/view";
import {html, render} from "lit";
import {Notification} from "@vaadin/notification";
import {balanceViewStore} from "Frontend/views/balance/balance-view-store";
import MovementDTO from "Frontend/generated/pl/kskowronski/data/entities/MovementDTO";
import {MovementsEndpoint} from "Frontend/generated/endpoints";


@customElement('movements-view')
export class MovementsView extends View  {

    private mask: string = '';

    @state()
    private filteredMovements: MovementDTO[] = [];

    private movements: MovementDTO[] = [];

    async firstUpdated() {
    }

    connectedCallback() {
        super.connectedCallback();
        //this.classList.add('flex', 'p-m', 'gap-m', 'items-end','height: 100%');
    }

    render() {
        return html`<div style="width: 99%; height: 100%; padding-left: 5px">
            <div>
                <vaadin-text-field label="Maska" value="100%" @value-changed=${this.maskChanged} clear-button-visible></vaadin-text-field>
                <claude-date-from></claude-date-from>
                <claude-date-to></claude-date-to>
                <vaadin-button @click=${this.run}>Uruchom</vaadin-button>
            </div>
            
            <vaadin-grid .items=${this.filteredMovements} style="width: 99%; height: 88%" >
                <vaadin-grid-column path="frmName"  auto-width></vaadin-grid-column>
                <vaadin-grid-column path="account"  width="250px"></vaadin-grid-column>
                <vaadin-grid-column path="boWn"   auto-width></vaadin-grid-column>
                <vaadin-grid-column path="boMa"   auto-width></vaadin-grid-column>
            </vaadin-grid>
        </div>`;
    }

    maskChanged(e: CustomEvent) {
        this.mask = e.detail.value as string;
    }

    async run() {

        const serverResponse = await MovementsEndpoint.calculateMovements( balanceViewStore.dateFrom, balanceViewStore.dateTo, this.mask)
        if (serverResponse.length == 0) {
            const notification = Notification.show('Brak danych', {
                position: 'middle', duration: 1000
            });
        }
        this.movements = this.filteredMovements = serverResponse;
    }

}