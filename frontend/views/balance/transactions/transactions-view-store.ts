import {makeAutoObservable} from "mobx";
import * as TransactionsEndpoint from "Frontend/generated/TransactionsEndpoint";
import TransactionDTO from "Frontend/generated/pl/kskowronski/data/entities/TransactionDTO";

class TransactionsViewStore {

    dialogOpened = false
    account = ''
    dateFrom = ''
    dataTo = ''
    frmName = ''

    transactions: TransactionDTO[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    async setOpenedChanged(newValue: boolean, account: string, dateFrom: string, dataTo: string, frmName: string) {
        this.getTransactions(newValue, frmName, dateFrom, dataTo, account);
    }

    async getTransactions( newValue: boolean, frmName: string, dateFrom: string, dataTo: string, account: string) {
        const serverResponse = await TransactionsEndpoint.getTransactionsForAccountAndPeriod(frmName, dateFrom, dataTo, account);
        this.transactions = serverResponse;
        this.dialogOpened = newValue
        this.account = account
        this.dateFrom = dateFrom
        this.dataTo = dataTo
        this.frmName = frmName
    }


}

export const transactionsViewStore = new TransactionsViewStore()