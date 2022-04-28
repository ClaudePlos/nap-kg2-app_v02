import {customElement} from "lit/decorators";
import {View} from "Frontend/views/view";
import {html} from "lit";
import {TextFieldValueChangedEvent} from "@vaadin/text-field";
import {GridActiveItemChangedEvent, GridItemModel} from "@vaadin/grid";
import BalanceDTO from "Frontend/generated/pl/kskowronski/data/entities/BalanceDTO";
import {guard} from "lit/directives/guard";
import {transactionsViewStore} from "Frontend/views/balance/transactions/transactions-view-store";
import {Notification} from "@vaadin/notification";
import * as BalanceEndpoint from "Frontend/generated/BalanceEndpoint";
import {balanceViewStore} from "Frontend/views/balance/balance-view-store";
import TurnoverDTO from "Frontend/generated/pl/kskowronski/data/entities/TurnoverDTO";


@customElement('turnover-view')
export class MovementsView extends View  {

    private mask: string = '';

    @state()
    private filteredTurnover: TurnoverDTO[] = [];

    private turnover: TurnoverDTO[] = [];

    render() {
        return html`<div>
            <div>
                <vaadin-text-field label="Maska" value="501-Z386%" @value-changed=${this.maskChanged} clear-button-visible></vaadin-text-field>
                <claude-date-from></claude-date-from>
                <claude-date-to></claude-date-to>
                <vaadin-button @click=${this.run}>Uruchom</vaadin-button>
            </div>
        </div>
        `;
    }

    maskChanged(e: CustomEvent) {
        this.mask = e.detail.value as string;
    }

    async run() {

        const serverResponse = await BalanceEndpoint.calculateBalance(Number(this.frmId), balanceViewStore.dateFrom, balanceViewStore.dateTo, this.mask, this.lowestLevel)
        if (serverResponse.length == 0) {
            const notification = Notification.show('Brak danych', {
                position: 'middle', duration: 1000
            });
        }
        this.balance = this.filteredBalance = serverResponse;
    }

}