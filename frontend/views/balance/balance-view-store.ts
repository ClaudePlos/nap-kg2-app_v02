import dateFnsFormat from "date-fns/format";
import {makeAutoObservable} from "mobx";


class BalanceViewStore {

    public dateFrom: string = dateFnsFormat(new Date('2021-01-31'), 'yyyy-MM-dd');
    public dateTo: string = dateFnsFormat(new Date('2021-01-31'), 'yyyy-MM-dd');

    public xlsRows = [{
        "EmployeeID": "EMP001",
        "FullName": "Jolly"
    },
        {
            "EmployeeID": "EMP002",
            "FullName": "Macias"
        },
        {
            "EmployeeID": "EMP003",
            "FullName": "Lucian"
        },
        {
            "EmployeeID": "EMP004",
            "FullName": "Blaze"
        },
    ];

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