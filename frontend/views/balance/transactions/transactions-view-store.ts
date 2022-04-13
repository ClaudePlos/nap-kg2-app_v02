import {makeAutoObservable} from "mobx";


class TransactionsViewStore {

    dialogOpened = false
    account = ''
    dateFrom = ''
    dataTo = ''
    company = ''

    constructor() {
        makeAutoObservable(this)
    }

    setOpenedChanged(newValue: boolean, account: string, dateFrom: string, dataTo: string, company: string) {
        this.dialogOpened = newValue
        this.account = account
        this.dateFrom = dateFrom
        this.dataTo = dataTo
        this.company = company
    }


}

export const transactionsViewStore = new TransactionsViewStore()