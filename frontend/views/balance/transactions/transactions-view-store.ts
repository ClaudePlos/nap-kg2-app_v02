import {makeAutoObservable} from "mobx";


class TransactionsViewStore {

    dialogOpened = false;
    account = '';

    constructor() {
        makeAutoObservable(this);
    }

    setOpenedChanged(newValue: boolean, account: string) {
        this.dialogOpened = newValue;
        this.account = account;
    }


}

export const transactionsViewStore = new TransactionsViewStore();