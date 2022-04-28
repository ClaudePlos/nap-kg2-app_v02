package pl.kskowronski.data.entities;

import java.math.BigDecimal;

public class MovementDTO {

    private String  frmName;
    private String  account;

    private BigDecimal boWn;
    private BigDecimal  boMa;

    private BigDecimal obrotyWn;
    private BigDecimal obrotyMa;

    private BigDecimal obrotyWnNarPlusBO;
    private BigDecimal obrotyMaNarPlusBO;

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
}
