import {makeAutoObservable} from "mobx";
import * as TransactionsEndpoint from "Frontend/generated/TransactionsEndpoint";
import BalanceDTO from "Frontend/generated/pl/kskowronski/data/entities/BalanceDTO";
import TransactionDTO from "Frontend/generated/pl/kskowronski/data/entities/TransactionDTO";

class TransactionsViewStore {

    dialogOpened = false
    account = ''
    dateFrom = ''
    dataTo = ''
    frmId = ''

    transactions: TransactionDTO[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    async setOpenedChanged(newValue: boolean, account: string, dateFrom: string, dataTo: string, frmId: string) {
        this.getTransactions(newValue, frmId, dateFrom, dataTo, account);
    }

    async getTransactions( newValue: boolean, frmId: string, dateFrom: string, dataTo: string, account: string) {
        const serverResponse = await TransactionsEndpoint.getTransactionsForAccountAndPeriod(Number(frmId), dateFrom, dataTo, account);
        this.transactions = serverResponse;
        this.dialogOpened = newValue
        this.account = account
        this.dateFrom = dateFrom
        this.dataTo = dataTo
        this.frmId = frmId
    }


}

export const transactionsViewStore = new TransactionsViewStore()