package pl.kskowronski.data.entities;

import java.math.BigDecimal;

public class BalanceDTO {

    private String  frmName;
    private String  account;
    private String  accountName;


    private BigDecimal  boWn;
    private BigDecimal  boMa;

    private BigDecimal  boWnPlusObrotyNar; // BO+Obroty nar WN
    private BigDecimal  boMaPlusObrotyNar;

    private BigDecimal obrotyWnNar; //Obroty WN nar
    private BigDecimal obrotyMaNar;

    private BigDecimal  obrotyOkresuWn; //"Obroty okresu WN\
    private BigDecimal  obrotyOkresuMa;




    private BigDecimal  boWnAndWal; // BO WN wal
    private BigDecimal  boWnAndCumulativeTurnoverWal; // BO+Obroty nar WN Wal

    private BigDecimal  saldoWn;
    private BigDecimal  saldoMa;

    private BigDecimal  persaldo;

    private String  currency;


    private BigDecimal  boMaAndWal;
    private BigDecimal  boMaAndCumulativeTurnoverWal;


    private BigDecimal  periodTurnoverWnWal; //"Obroty okresu WN wal\"


    private BigDecimal  periodTurnoverMaWal;

    public BalanceDTO() {
    }

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

    public BigDecimal getBoMa() {
        return boMa;
    }

    public void setBoMa(BigDecimal boMa) {
        this.boMa = boMa;
    }

    public BigDecimal getBoWnPlusObrotyNar() {
        return boWnPlusObrotyNar;
    }

    public void setBoWnPlusObrotyNar(BigDecimal boWnPlusObrotyNar) {
        this.boWnPlusObrotyNar = boWnPlusObrotyNar;
    }

    public BigDecimal getBoMaPlusObrotyNar() {
        return boMaPlusObrotyNar;
    }

    public void setBoMaPlusObrotyNar(BigDecimal boMaPlusObrotyNar) {
        this.boMaPlusObrotyNar = boMaPlusObrotyNar;
    }

    public BigDecimal getObrotyWnNar() {
        return obrotyWnNar;
    }

    public void setObrotyWnNar(BigDecimal obrotyWnNar) {
        this.obrotyWnNar = obrotyWnNar;
    }

    public BigDecimal getObrotyMaNar() {
        return obrotyMaNar;
    }

    public void setObrotyMaNar(BigDecimal obrotyMaNar) {
        this.obrotyMaNar = obrotyMaNar;
    }

    public BigDecimal getObrotyOkresuWn() {
        return obrotyOkresuWn;
    }

    public void setObrotyOkresuWn(BigDecimal obrotyOkresuWn) {
        this.obrotyOkresuWn = obrotyOkresuWn;
    }

    public BigDecimal getObrotyOkresuMa() {
        return obrotyOkresuMa;
    }

    public void setObrotyOkresuMa(BigDecimal obrotyOkresuMa) {
        this.obrotyOkresuMa = obrotyOkresuMa;
    }

    public BigDecimal getSaldoWn() {
        return saldoWn;
    }

    public void setSaldoWn(BigDecimal saldoWn) {
        this.saldoWn = saldoWn;
    }

    public BigDecimal getSaldoMa() {
        return saldoMa;
    }

    public void setSaldoMa(BigDecimal saldoMa) {
        this.saldoMa = saldoMa;
    }

    public BigDecimal getPersaldo() {
        return persaldo;
    }

    public void setPersaldo(BigDecimal persaldo) {
        this.persaldo = persaldo;
    }
}
