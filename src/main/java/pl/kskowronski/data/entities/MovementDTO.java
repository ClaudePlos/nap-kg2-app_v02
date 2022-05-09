package pl.kskowronski.data.entities;

import java.math.BigDecimal;

public class MovementDTO {

    private String  frmName;
    private String  account;
    private String  accountName;

    private BigDecimal boWn;
    private BigDecimal boMa;

    private BigDecimal obrotyWn;
    private BigDecimal obrotyMa;

    private BigDecimal obrotyWnNarPlusBO;
    private BigDecimal obrotyMaNarPlusBO;

    private BigDecimal saldoWn;
    private BigDecimal saldoMa;

    public MovementDTO() {
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

    public BigDecimal getObrotyWn() {
        return obrotyWn;
    }

    public void setObrotyWn(BigDecimal obrotyWn) {
        this.obrotyWn = obrotyWn;
    }

    public BigDecimal getObrotyMa() {
        return obrotyMa;
    }

    public void setObrotyMa(BigDecimal obrotyMa) {
        this.obrotyMa = obrotyMa;
    }

    public BigDecimal getObrotyWnNarPlusBO() {
        return obrotyWnNarPlusBO;
    }

    public void setObrotyWnNarPlusBO(BigDecimal obrotyWnNarPlusBO) {
        this.obrotyWnNarPlusBO = obrotyWnNarPlusBO;
    }

    public BigDecimal getObrotyMaNarPlusBO() {
        return obrotyMaNarPlusBO;
    }

    public void setObrotyMaNarPlusBO(BigDecimal obrotyMaNarPlusBO) {
        this.obrotyMaNarPlusBO = obrotyMaNarPlusBO;
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
}
