import { Page, Text, View, Document, StyleSheet, Font, Image } from "@react-pdf/renderer";
import carImg from "../ui/assets/invoice_car_img.png";
import { dateFormatter } from "../ui/utils/DateFormatter";
import arial from "../ui/fonts/ArialBlack.ttf";
import neon from "../ui/fonts/TiltNeonRegular.ttf";
import goodtime from "../ui/fonts/GoodTimesRegular.ttf";
import NablaRegular from "../ui/fonts/NablaRegular.ttf";
import ShrikhandRegular from "../ui/fonts/ShrikhandRegular.ttf";
import CommeBold from "../ui/fonts/CommeExtraBold.ttf";
import { round2 } from "../ui/utils/Round2";
import { calculateAmountExVat } from "../ui/utils/vatHelpers";

// ===========================
// Font Registration
// ===========================
Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});
Font.register({
  family: "Noto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf",
      fontWeight: 700,
    },
  ],
});
Font.register({
  family: "Neon",
  fonts: [
    {
      src: neon,
    },
  ],
});
Font.register({
  family: "Goodtime",
  fonts: [
    {
      src: goodtime,
    },
  ],
});
Font.register({
  family: "Arial",
  fonts: [
    {
      src: arial,
    },
  ],
});
Font.register({
  family: "NablaRegular",
  fonts: [
    {
      src: NablaRegular,
    },
  ],
});
Font.register({
  family: "ShrikhandRegular",
  fonts: [
    {
      src: ShrikhandRegular,
    },
  ],
});
Font.register({
  family: "CommeBold",
  fonts: [
    {
      src: CommeBold,
    },
  ],
});

// ===========================
// Styles
// ===========================
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Oswald",
    display: "flex",
    justifyContent: "space-between",
  },
  header: {
    // backgroundColor: "#2d2d2d",
    fontFamily: "CommeBold",
    flex: 1,
    // color: "red",
    padding: 10,
    textAlign: "center",
    fontSize: 22,
    // letterSpacing: 1,
    fontWeight: 700,
  },
  arabicHeader: { fontFamily: "Noto", textAlign: "center", fontSize: 16, marginBottom: 4 },
  contactBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e2e2e2",
    padding: 6,
    marginVertical: 8,
    fontSize: 8,
  },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  table: { width: "100%", borderWidth: 1, borderColor: "#ccc", marginTop: 0 },
  tableTitle: {
    backgroundColor: "#d9d9d9",
    padding: 6,
    fontSize: 10,
    fontWeight: 700,
    marginTop: 12,
  },
  tableRow: { flexDirection: "row" },
  tableHeader: { backgroundColor: "#f2f2f2" },
  tableCell: {
    padding: 4,
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  stripe: { backgroundColor: "#eaeaea" },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 30,
    marginTop: 8,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  summaryBox: {
    marginTop: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "40%",
    alignSelf: "flex-end",
  },
  content: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
    flexGrow: 1,
  },
  paymentBox: { flexDirection: "row", gap: 12, marginTop: 12 },
  paymentItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  signatureBox: { flexDirection: "row", justifyContent: "space-between", marginTop: 32 },
  signatureLine: { borderBottomWidth: 1, width: 120, marginBottom: 4 },
});

// ===========================
// Reusable Components
// ===========================
const TableHeaderItem = () => (
  <View style={[styles.tableRow, styles.tableHeader]}>
    {["#", "Description", "Qty", "Unit price", "Subtotal", "VAT (5%)", "Total"].map((text, idx) => (
      <View
        key={idx}
        style={[
          styles.tableCell,
          {
            width: idx === 1 ? "30%" : idx === 0 ? "5%" : "13%",
            borderRightWidth: idx === 6 ? 0 : 1,
          },
        ]}
      >
        <Text>{text}</Text>
      </View>
    ))}
  </View>
);

const TableHeaderLabor = () => (
  <View style={[styles.tableRow, styles.tableHeader]}>
    {["#", "Type", "Amount (excl. VAT)", "VAT (5%)", "Amount (incl VAT)", "Description"].map(
      (text, idx) => (
        <View
          key={idx}
          style={[
            styles.tableCell,
            {
              width: idx === 5 ? "32%" : idx === 0 ? "6%" : idx === 1 ? "20%" : "15%",
              borderRightWidth: idx === 5 ? 0 : 1,
            },
          ]}
        >
          <Text>{text}</Text>
        </View>
      )
    )}
  </View>
);

const TableRowItem = ({ item, index }: any) => {
  return (
    <View style={[styles.tableRow, ...(index % 2 === 0 ? [styles.stripe] : [])]}>
      <View style={[styles.tableCell, { width: "5%" }]}>
        <Text>{index + 1}</Text>
      </View>
      <View style={[styles.tableCell, { width: "30%" }]}>
        <Text>{item.name}</Text>
      </View>
      <View style={[styles.tableCell, { width: "13%" }]}>
        <Text>{item.quantity}</Text>
      </View>
      <View style={[styles.tableCell, { width: "13%" }]}>
        {/* <Text>{round2(calculateAmountExVat(item.unit_price_incl_vat))}</Text> */}
        <Text>{calculateAmountExVat(item.unit_price_incl_vat)}</Text>
      </View>
      <View style={[styles.tableCell, { width: "13%" }]}>
        <Text>{item.subtotal_excl_vat}</Text>
      </View>
      <View style={[styles.tableCell, { width: "13%" }]}>
        <Text>{item.vat_amount}</Text>
      </View>
      <View style={[styles.tableCell, { width: "13%", borderRightWidth: 0 }]}>
        <Text>{item.subtotal_incl_vat}</Text>
      </View>
    </View>
  );
};

const TableRowLaborCost = ({ item, index }: any) => (
  <View style={[styles.tableRow, ...(index % 2 === 0 ? [styles.stripe] : [])]}>
    <View style={[styles.tableCell, { width: "6%" }]}>
      <Text>{index + 1}</Text>
    </View>
    <View style={[styles.tableCell, { width: "20%" }]}>
      <Text>{item.title}</Text>
    </View>
    <View style={[styles.tableCell, { width: "15%" }]}>
      <Text>{item.subtotal_excl_vat}</Text>
    </View>
    <View style={[styles.tableCell, { width: "15%" }]}>
      <Text>{item.labor_item_vat}</Text>
    </View>
    <View style={[styles.tableCell, { width: "15%" }]}>
      <Text>{item.subtotal_incl_vat}</Text>
    </View>
    <View style={[styles.tableCell, { width: "32%", borderRightWidth: 0 }]}>
      <Text>{item.description}</Text>
    </View>
  </View>
);

const SummaryRow = ({
  label,
  value,
  ctmStyle = null,
}: {
  label: string;
  value: string | number;
  ctmStyle?: any | null;
}) => (
  <View style={[styles.summaryRow, { ...ctmStyle }]}>
    <Text>{label}</Text>
    <Text>
      {value} <Text style={{ fontSize: 8 }}>AED</Text>
    </Text>
  </View>
);

// ===========================
// Main Document
// ===========================
const MyDocument = ({ details, isTrnInclude, isPaymentDetailsInclude }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.content}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#d3d3d3",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              alignItems: "center",
              flexGrow: 1,
              position: "relative",
            }}
          >
            <Text style={styles.header}>JESR AL HAYAH MAIN W. SHOP</Text>
            <Text style={styles.arabicHeader}>ورشه جسر الحياه لحيانه السارات</Text>
          </View>
          <Image
            style={{ width: 110, position: "absolute", top: 0, right: 0 }}
            // style={styles.image}
            src={carImg}
          />
        </View>

        <View style={styles.contactBar}>
          <Text>Mob: +971558757029, +971503315047</Text>
          <Text style={{ fontWeight: 700 }}>TRN: 104712178300003</Text>
          <Text>Email: jesralhayah2024@gmail.com</Text>
        </View>

        <View>
          <Text style={{ fontWeight: 900, fontSize: 18, letterSpacing: 1, textAlign: "center" }}>
            INVOICE
          </Text>
        </View>

        <View style={styles.sectionRow}>
          <View>
            {details.service.name && <Text>Customer: {details.service.name}</Text>}
            {details.service.phone_number && <Text>Phone: {details.service.phone_number}</Text>}
            {details.service?.company_name && <Text>Company: {details.service.company_name}</Text>}
            {details.service?.company_phone_number && (
              <Text>Compnay phone: {details.service.company_phone_number}</Text>
            )}
            <Text>Vehicle: {details.service.vehicle_number}</Text>
            {details.service.chassis_number && (
              <Text>Chassis: {details.service.chassis_number}</Text>
            )}
            <Text>
              Make & Model: {details.service.make}{" "}
              {details.service.model ? `• ${details.service.model}` : ""}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 14, fontWeight: 700 }}>Invoice no: {details.service.id}</Text>
            <Text>Date: {dateFormatter(details.service.created_at)}</Text>
            {isTrnInclude && <Text>TRN: {details.service.trn || "N/A"}</Text>}
          </View>
        </View>

        {/* Items Title */}
        <Text style={styles.tableTitle}>Items Detail</Text>

        {/* Items Table */}
        <View style={styles.table}>
          {details.serviceItems.length && <TableHeaderItem />}
          {details.serviceItems.length ? (
            details.serviceItems.map((item: any, index: number) => (
              <TableRowItem key={index} item={item} index={index} />
            ))
          ) : (
            <View>
              <View style={[styles.tableCell, { width: "100%" }]}>
                <Text>{"No service item"}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Labor Title */}
        <Text style={styles.tableTitle}>Labor Cost Detail</Text>

        {/* Labor Table */}
        <View style={styles.table}>
          {details.serviceLaborCostList.length && <TableHeaderLabor />}
          {details.serviceLaborCostList.length ? (
            details.serviceLaborCostList.map((item: any, index: number) => (
              <TableRowLaborCost key={index} item={item} index={index} />
            ))
          ) : (
            <View>
              <View style={[styles.tableCell, { width: "100%" }]}>
                <Text>{"No labor cost"}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* FOOTER */}
      <View wrap={false} style={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
        <View style={styles.summaryBox}>
          <SummaryRow
            label="Items cost (excl. VAT)"
            value={calculateAmountExVat(round2(
              Number(
                details.serviceItems.reduce(
                  (sum: any, item: any) => sum + item.subtotal_incl_vat,
                  0
                )
              )
            ))}
          />
          <SummaryRow
            label="Labor cost (excl. VAT)"
            value={calculateAmountExVat(round2(
              Number(
                details?.serviceLaborCostList?.reduce(
                  (sum: any, item: any) => sum + item.subtotal_incl_vat,
                  0
                )
              )
            ))}
          />
          <SummaryRow
            label="Subtotal"
            value={round2(details.serviceBill.subtotal_excl_vat)}
            ctmStyle={{
              fontSize: 10,
              borderTop: 1,
              borderColor: "#ccc",
              marginTop: 4,
              paddingTop: 4,
            }}
          />
          <SummaryRow label="VAT (5%)" value={round2(details.serviceBill.vat_amount)} />
          <SummaryRow label="Discount" value={round2(details.serviceBill.discount)} />
          <SummaryRow
            label="Total"
            value={round2(details.serviceBill.total)}
            ctmStyle={{
              fontSize: 12,
              borderTop: 1,
              borderColor: "#ccc",
              marginTop: 4,
              paddingTop: 4,
            }}
          />
          {isPaymentDetailsInclude && (
            <SummaryRow label="Paid amount" value={round2(details.serviceBill.amount_paid)} />
          )}
          {isPaymentDetailsInclude && (
            <SummaryRow label="Due amount" value={round2(details.serviceBill.amount_due)} />
          )}
        </View>

        <View style={styles.paymentBox}>
          {["Cash", "Card"].map((method, idx) => (
            <View key={idx} style={styles.paymentItem}>
              <Text>{method}</Text>
              <View style={{ width: 16, height: 12, borderWidth: 0.5 }} />
            </View>
          ))}
        </View>

        <View style={styles.signatureBox}>
          <View>
            <View style={styles.signatureLine} />
            <Text>Receiver's sign</Text>
          </View>
          <View>
            <View style={styles.signatureLine} />
            <Text>JESRAL HAYAH MAIN W.SHOP</Text>
          </View>
        </View>
       
      </View>
    </Page>
  </Document>
);

export default MyDocument;
