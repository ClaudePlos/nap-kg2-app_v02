package pl.kskowronski.data.entities;

import javax.persistence.Column;
import java.math.BigDecimal;

public class BalanceDTO {

    private String  frmName;
    private String  account;
    private String  accountName;
    private String  currency;

    private BigDecimal  boWn;
    private BigDecimal  boWnAndCumulativeTurnover; // BO+Obroty nar WN
    private BigDecimal  boWnAndWal; // BO WN wal
    private BigDecimal  boWnAndCumulativeTurnoverWal; // BO+Obroty nar WN Wal

    private BigDecimal  boMa;
    private BigDecimal  boMaAndCumulativeTurnover;
    private BigDecimal  boMaAndWal;
    private BigDecimal  boMaAndCumulativeTurnoverWal;

    private BigDecimal  periodTurnoverWn; //"Obroty okresu WN\",\n" +
    private BigDecimal  periodTurnoverWnWal; //"Obroty okresu WN wal\",\n" +

    private BigDecimal  periodTurnoverMa;
    private BigDecimal  periodTurnoverMaWal;

    public String getFrmName() {
        return frmName;
    }

    public void setFrmName(String frmName) {
        this.frmName = frmName;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getBoWn() {
        return boWn;
    }

    public void setBoWn(BigDecimal boWn) {
        this.boWn = boWn;
    }

    public BigDecimal getBoWnAndCumulativeTurnover() {
        return boWnAndCumulativeTurnover;
    }

    public void setBoWnAndCumulativeTurnover(BigDecimal boWnAndCumulativeTurnover) {
        this.boWnAndCumulativeTurnover = boWnAndCumulativeTurnover;
    }

    public BigDecimal getBoWnAndWal() {
        return boWnAndWal;
    }

    public void setBoWnAndWal(BigDecimal boWnAndWal) {
        this.boWnAndWal = boWnAndWal;
    }

    public BigDecimal getBoWnAndCumulativeTurnoverWal() {
        return boWnAndCumulativeTurnoverWal;
    }

    public void setBoWnAndCumulativeTurnoverWal(BigDecimal boWnAndCumulativeTurnoverWal) {
        this.boWnAndCumulativeTurnoverWal = boWnAndCumulativeTurnoverWal;
    }

    public BigDecimal getBoMa() {
        return boMa;
    }

    public void setBoMa(BigDecimal boMa) {
        this.boMa = boMa;
    }

    public BigDecimal getBoMaAndCumulativeTurnover() {
        return boMaAndCumulativeTurnover;
    }

    public void setBoMaAndCumulativeTurnover(BigDecimal boMaAndCumulativeTurnover) {
        this.boMaAndCumulativeTurnover = boMaAndCumulativeTurnover;
    }

    public BigDecimal getBoMaAndWal() {
        return boMaAndWal;
    }

    public void setBoMaAndWal(BigDecimal boMaAndWal) {
        this.boMaAndWal = boMaAndWal;
    }

    public BigDecimal getBoMaAndCumulativeTurnoverWal() {
        return boMaAndCumulativeTurnoverWal;
    }

    public void setBoMaAndCumulativeTurnoverWal(BigDecimal boMaAndCumulativeTurnoverWal) {
        this.boMaAndCumulativeTurnoverWal = boMaAndCumulativeTurnoverWal;
    }

    public BigDecimal getPeriodTurnoverWn() {
        return periodTurnoverWn;
    }

    public void setPeriodTurnoverWn(BigDecimal periodTurnoverWn) {
        this.periodTurnoverWn = periodTurnoverWn;
    }

    public BigDecimal getPeriodTurnoverWnWal() {
        return periodTurnoverWnWal;
    }

    public void setPeriodTurnoverWnWal(BigDecimal periodTurnoverWnWal) {
        this.periodTurnoverWnWal = periodTurnoverWnWal;
    }

    public BigDecimal getPeriodTurnoverMa() {
        return periodTurnoverMa;
    }

    public void setPeriodTurnoverMa(BigDecimal periodTurnoverMa) {
        this.periodTurnoverMa = periodTurnoverMa;
    }

    public BigDecimal getPeriodTurnoverMaWal() {
        return periodTurnoverMaWal;
    }

    public void setPeriodTurnoverMaWal(BigDecimal periodTurnoverMaWal) {
        this.periodTurnoverMaWal = periodTurnoverMaWal;
    }
}
