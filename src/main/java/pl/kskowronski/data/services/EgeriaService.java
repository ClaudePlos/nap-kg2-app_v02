package pl.kskowronski.data.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.kskowronski.data.entities.BalanceDTO;
import pl.kskowronski.data.entities.EatFirma;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Service
public class EgeriaService {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void setConsolidateCompanyOnCompany(Integer frmId) {
        this.em.createNativeQuery("BEGIN eap_globals.USTAW_firme(" + frmId + "); eap_globals.USTAW_konsolidacje('N'); END;")
                .executeUpdate();
    }

    @Transactional
    public String copyAccountToAnotherCompany(Integer frmIdCompanyTo, String mask, String year, String level) {
        String ret = "Skopiowano " + mask +  " do : " + frmIdCompanyTo;
        /*
         --rok z którego kopiujemy
         --rok do którego kopiujemy
         --firma z której kopiujemy
         --firma do której kopiujemy
         -- poziom kont (ile analityk), w naprzodzie chyba max jest z 5 ale ustawiam na 20
         -- maska konta(syntetyka)
          -- maska kont, których nie chcemy przenosić
        * */
        String sql = "BEGIN mkp_obj_plany_kont.kopiuj(" + year + "," + year + ", 300326, " + frmIdCompanyTo + ", " + level + ", '" + mask + "','nie-ma-takiego'); END;";
        try {
            this.em.createNativeQuery(sql).executeUpdate();
        } catch (Exception e){
            ret = e.getMessage();
        }
        return ret;
    }


    @Transactional
    public List<BalanceDTO> calculateBalance(String frmName, String dateFrom, String dateTo, String mask) {
        String sql = "BEGIN kgp_nowe_ois.generuj (\n" +
                "    " +  dateFrom.substring(0,4) +",\n" +
                "    to_date('" + dateFrom +"','YYYY-MM-DD'),\n" +
                "    to_date('" + dateTo + "','YYYY-MM-DD'),\n" +
                "    '" + mask + "',\n" +
                "    999, --p_knt_max_poziom      IN  NUMBER,\n" +
                "    'B',\n" +
                "    1,\n" +
                "    'T',\n" + // weryfikacja
                "    'N',\n" + // pomin 0 saldo
                "    'T',\n" + // pomin niektywne
                "    '0',\n" +
                "     '999999',\n" +
                "    null,\n" +
                "    'N',\n" +
                "     'N',\n" +
                "    'N',\n" +
                "    'N'\n" +
                "  ); END;";
       // System.out.println(sql);
        this.em.createNativeQuery(sql).executeUpdate();

        String sql2 =
                "select * from (\n" +
                        "select knt_pelny_numer \"Konto\",\n" +
                        "       knt_nazwa \"Nazwa konta\",\n" +
                        "       wal_symbol \"Waluta\",\n" +
                        "RAP_BO_WN \"BO WN\",\n" +
                        "RAP_OBR_N_WN \"BO+Obroty nar WN\",\n" +
                        "RAP_BO_WN_WAL \"BO WN wal\",\n" +
                        "RAP_OBR_N_WN_WAL \"BO+Obroty nar WN wal\",\n" +
                        "RAP_BO_MA \"BO MA\", \n" +
                        "RAP_OBR_N_MA \"BO+Obroty nar MA\",\n" +
                        "RAP_BO_MA_WAL \"BO MA wal\",\n" +
                        "RAP_OBR_N_MA_WAL \"BO+Obroty nar MA wal\",\n" +
                        "RAP_OBR_WN \"Obroty okresu WN\",\n" +
                        "RAP_OBR_WN_WAL \"Obroty okresu WN wal\",\n" +
                        "RAP_OBR_MA \"Obroty okresu MA\", \n" +
                        "RAP_OBR_MA_WAL \"Obroty okresu MA wal\",\n" +
                        "RAP_SALDO_WN \"Saldo WN\",\n" +
                        "RAP_SALDO_WN_WAL \"Saldo WN wal\",\n" +
                        "RAP_SALDO_MA \"Saldo MA\",\n" +
                        "RAP_SALDO_MA_WAL \"Saldo MA wal\" \n" +
                        "from kgtt_rap46, kg_konta, css_waluty\n" +
                        "where knt_id = rap_knt_id\n" +
                        "and wal_id = nvl(rap_wal_id,1)\n" +
                        "order by knt_pelny_numer )";
        //System.out.println(sql2);
        List<Object[]> result = em.createNativeQuery(sql2).getResultList();

        List<BalanceDTO> balanceList = new ArrayList<>();
        result.forEach( item -> {
            BalanceDTO b = new BalanceDTO();
            b.setFrmName(frmName);
            b.setAccount((String) item[0]);
            b.setAccountName((String) item[1]);

            b.setBoWn((BigDecimal) item[3]);
            b.setBoMa((BigDecimal) item[7]);

            b.setBoWnPlusObrotyNar((BigDecimal) item[4]);
            b.setBoMaPlusObrotyNar((BigDecimal) item[8]);

            b.setObrotyWnNar(((BigDecimal) item[4]).subtract((BigDecimal) item[3]));
            b.setObrotyMaNar(((BigDecimal) item[8]).subtract((BigDecimal) item[7]));

            b.setObrotyOkresuWn((BigDecimal) item[11]);
            b.setObrotyOkresuMa((BigDecimal) item[13]);

            b.setSaldoWn((BigDecimal) item[15]);
            b.setSaldoMa((BigDecimal) item[17]);

            b.setPersaldo( ((BigDecimal) item[15]).subtract((BigDecimal) item[17]) );

            b.setCurrency((String) item[2]);



//            b.setBoWnAndWal((BigDecimal) item[5]);
//            b.setBoWnAndCumulativeTurnoverWal((BigDecimal) item[6]);
//
//
//
//            b.setBoMaAndWal((BigDecimal) item[9]);
//            b.setBoMaAndCumulativeTurnoverWal((BigDecimal) item[10]);
//
//
//
//            b.setPeriodTurnoverWnWal((BigDecimal) item[12]);
//
//
//            b.setPeriodTurnoverMaWal((BigDecimal) item[14]);



            balanceList.add(b);
        });

        return balanceList;
    }

}