import dateFnsFormat from "date-fns/format";
import {makeAutoObservable} from "mobx";


class BalanceViewStore {

    public dateFrom: string = dateFnsFormat(new Date('2022-01-01'), 'yyyy-MM-dd');
    public dateTo: string = dateFnsFormat(new Date('2022-01-31'), 'yyyy-MM-dd');

    constructor() {
        makeAutoObservable(this);
    }

    dateFromChanged( newDate: string ) {
        this.dateFrom = newDate;
    }

    dateToChanged( newDate: string ) {
        this.dateTo = newDate;
    }

}

export const balanceViewStore = new BalanceViewStore();