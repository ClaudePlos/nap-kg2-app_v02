package pl.kskowronski.data.services;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.kskowronski.data.entities.BalanceDTO;


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
    public List<BalanceDTO> calculateBalance(Integer frmId, String dateFrom, String dateTo, String mask) {
        Gson gson = new Gson();
        String sql = "BEGIN kgp_nowe_ois.generuj (\n" +
                "    2021,\n" +
                "    '" + dateFrom +"',\n" +
                "    '" + dateTo + "',\n" +
                "    '" + mask + "',\n" +
                "    999, --p_knt_max_poziom      IN  NUMBER,\n" +
                "    'B',\n" +
                "    1,\n" +
                "    'T',\n" +
                "    'N',\n" +
                "    'N',\n" +
                "    '0',\n" +
                "     '999999',\n" +
                "    null,\n" +
                "    'N',\n" +
                "     'N',\n" +
                "    'N',\n" +
                "    'N'\n" +
                "  ); END;";
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
                        "nvl(RAP_OBR_N_WN, 0) - nvl(RAP_BO_WN, 0) \"Obroty WN nar\",\n" +
                        "nvl(RAP_OBR_N_WN_WAL, 0) - nvl(RAP_BO_WN_WAL, 0) \"Obroty WN nar wal\", \n" +
                        "nvl(RAP_OBR_N_MA, 0) - nvl(RAP_BO_MA, 0) \"Obroty MA nar\",\n" +
                        "nvl(RAP_OBR_N_MA_WAL, 0) - nvl(RAP_BO_MA_WAL, 0) \"Obroty MA nar wal\",\n" +
                        "RAP_SALDO_WN \"Saldo WN\",\n" +
                        "RAP_SALDO_WN_WAL \"Saldo WN wal\",\n" +
                        "RAP_SALDO_MA \"Saldo MA\",\n" +
                        "RAP_SALDO_MA_WAL \"Saldo MA wal\",\n" +
                        "nvl(RAP_SALDO_WN, 0) - nvl(RAP_SALDO_MA, 0) \"Persaldo\",\n" +
                        "nvl(RAP_SALDO_WN_WAL, 0) - nvl(RAP_SALDO_MA_WAL, 0) \"Persaldo wal\"\n" +
                        "from kgtt_rap46, kg_konta, css_waluty\n" +
                        "where knt_id = rap_knt_id\n" +
                        "and wal_id = nvl(rap_wal_id,1)\n" +
                        "order by knt_pelny_numer )";
        String parseSqlCellName = clearSql(sql2);
        String[] cellName = parseSqlCellName.split(" ");
        List<Object[]> result = em.createNativeQuery(sql2).getResultList();

        List<BalanceDTO> balanceList = new ArrayList<>();
        result.forEach( item -> {
            BalanceDTO b = new BalanceDTO();
            b.setFrmName(frmId + "");
            b.setAccount((String) item[0]);
            b.setAccountName((String) item[1]);
            b.setCurrency((String) item[2]);

            b.setBoWn((BigDecimal) item[3]);
            b.setBoWnAndCumulativeTurnover((BigDecimal) item[4]);
            b.setBoWnAndWal((BigDecimal) item[5]);
            b.setBoWnAndCumulativeTurnoverWal((BigDecimal) item[6]);

            b.setBoMa((BigDecimal) item[7]);
            b.setBoMaAndCumulativeTurnover((BigDecimal) item[8]);
            b.setBoMaAndWal((BigDecimal) item[9]);
            b.setBoMaAndCumulativeTurnoverWal((BigDecimal) item[10]);

            b.setPeriodTurnoverWn((BigDecimal) item[11]);
            b.setPeriodTurnoverWnWal((BigDecimal) item[12]);

            b.setPeriodTurnoverMa((BigDecimal) item[13]);
            b.setPeriodTurnoverMaWal((BigDecimal) item[14]);

            balanceList.add(b);
        });

//        JsonArray jsonArray = new Gson().fromJson(gson.toJson(result), JsonArray.class);
//        JsonArray jsonEnd = new JsonArray();
//        jsonArray.forEach(item -> {
//            JsonObject j = new JsonObject();
//            for (int i=0; i<jsonArray.get(0).getAsJsonArray().size(); i++) {
//                j.add(cellName[i+1].replace(",",""), item.getAsJsonArray().get(i));
//            }
//            jsonEnd.add(j);
//        });

        return balanceList;
    }


    private String clearSql( String sql ) {

        String[] cellName = sql.split(" ");
        List<String> list = new ArrayList<String>(Arrays.asList(cellName));
        List<String> list2 = new ArrayList<String>(Arrays.asList(cellName));
        int j = 0;
        for ( int i = 0; i < list.size(); i++){

            if (list.get(i).toUpperCase().equals("DISTINCT") ) {
                list2.remove(i-j);
                j++;
            }

            if (list.get(i).toUpperCase().equals("AS") ) {
                list2.remove(i-j);
                list2.remove(i-j-1);
                j++; j++;
            }

            if (list.get(i).toUpperCase().equals("FROM") ) {
                break;
            }

        }

        for ( int i = 0; i < list2.size(); i++){

            if (list2.get(i).contains("\"")) {
                int index = list2.indexOf(list2.get(i));
                list2.set( index, list2.get(i).replace("\"","") );
            }

            if (list2.get(i).toUpperCase().equals("FROM") ) {
                break;
            }
        }




        return String.join( " ",list2.toArray(new String[0]));
    }

}