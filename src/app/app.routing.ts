import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';
import { LoginComponent } from './components/login/login.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StockBalanceComponent } from './components/stock-balance/stock-balance.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { SalesOrderComponent } from './components/sales-order/sales-order.component';
import { OutboundDeliveryComponent } from './components/outbound-delivery/outbound-delivery.component';
import { SalesOrderDetailsComponent } from './components/sales-order-details/sales-order-details.component';
import { BillingComponent } from './components/billing/billing.component';
import { BillingDetailsComponent } from './components/billing-details/billing-details.component';
import { OutboundDeliveryDetailsComponent } from './components/outbound-delivery-details/outbound-delivery-details.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { IncomingPaymentsComponent } from './components/incoming-payments/incoming-payments.component';
import { IncomingPaymentsListComponent } from './components/incoming-payments-list/incoming-payments-list.component';
import { DelarshipDetailsComponent } from './components/delarship-details/delarship-details.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { PurchaseOrderDetailsComponent } from './components/purchase-order-details/purchase-order-details.component';
import { PurchaseOrderComponent } from './components/purchase-order/purchase-order.component';
import { EditPurchaseOrderComponent } from './components/edit-purchase-order/edit-purchase-order.component';
import { GoodsReceiptComponent } from './components/goods-receipt/goods-receipt.component';
import { GoodsReceiptDetailsComponent } from './components/goods-receipt-details/goods-receipt-details.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { CreateInvoiceComponent } from './components/create-invoice/create-invoice.component';
import { OutgoingPaymentComponent } from './components/outgoing-payment/outgoing-payment.component';
import { OutgoingPaymentsListComponent } from './components/outgoing-payments-list/outgoing-payments-list.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { BussinessPartnersComponent } from './components/bussiness-partners/bussiness-partners.component';
import { BusinessplaceSettingsComponent } from './components/businessplace-settings/businessplace-settings.component';
import { CustomerInformationComponent } from './components/customer-information/customer-information.component';
import { EditSalesOrderComponent } from './components/edit-sales-order/edit-sales-order.component';
import { EditOutboundDeliveryComponent } from './components/edit-outbound-delivery/edit-outbound-delivery.component';
import { EditBillingDetailsComponent } from './components/edit-billing-details/edit-billing-details.component';
import { InventoryStockMbComponent } from './components/inventory-stock-mb/inventory-stock-mb.component';
import { BusinessPartnerSettingsComponent } from './components/business-partner-settings/business-partner-settings.component';
import { ReleasePurchaseOrderComponent } from './components/release-purchase-order/release-purchase-order.component';
import { EditGoodsReceiptComponent } from './components/edit-goods-receipt/edit-goods-receipt.component';
import { EditInvoiceComponent } from './components/edit-invoice/edit-invoice.component';
import { ClosingStockbalReportComponent } from './components/closing-stockbal-report/closing-stockbal-report.component';
import { ConfigGroupDetailsComponent } from './components/config-group-details/config-group-details.component';
import { ConfigGroupComponent } from './components/config-group/config-group.component';
import { MctaReportComponent } from './components/mcta-report/mcta-report.component';
import { ConfigValuesDetailsComponent } from './components/config-values-details/config-values-details.component';
import { RecurringOrderDetailsComponent } from './components/recurring-order-details/recurring-order-details.component';
import { ConfigValComponent } from './components/config-val/config-val.component';
import { Gstr1ReportComponent } from './components/gstr1-report/gstr1-report.component';
import { ReportsGalleryComponent } from './components/reports-gallery/reports-gallery.component';
import { BillingReportComponent } from './components/billing-report/billing-report.component';
import { PurchaseAnalysisComponent } from './components/purchase-analysis/purchase-analysis.component';
import { PurchaseOrderReportComponent } from './components/purchase-order-report/purchase-order-report.component';
import { PurchaseInvoiceReportComponent } from './components/purchase-invoice-report/purchase-invoice-report.component';
import { GoodsReceiptReportComponent } from './components/goods-receipt-report/goods-receipt-report.component';
import { DeliveryReportComponent } from './components/delivery-report/delivery-report.component';
import { CustomerDelarwiseReportComponent } from './components/customer-delarwise-report/customer-delarwise-report.component';
import { PendingSalesOrderReportComponent } from './components/pending-sales-order-report/pending-sales-order-report.component';
import { CustomerLedgerReportComponent } from './components/customer-ledger-report/customer-ledger-report.component';
import { VendorLedgerReportComponent } from './components/vendor-ledger-report/vendor-ledger-report.component';
import { Gstr2ReportComponent } from './components/gstr2-report/gstr2-report.component';
import { SalesPersonReportComponent } from './components/sales-person-report/sales-person-report.component';
import { ActiveUserDetailsComponent } from './components/active-user-details/active-user-details.component';
import { IntransitDetailsComponent } from './components/intransit-details/intransit-details.component';
import { SalesOrderReportComponent } from './components/sales-order-report/sales-order-report.component';
import { TargetAchievementReportComponent } from './components/target-achievement-report/target-achievement-report.component';
export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'manageuser', component: UserManagementComponent },
    { path: 'quickstats', component: DashboardComponent },
    { path: 'openstk', component: StockBalanceComponent },
    { path: 'stkdet', component: StockDetailsComponent },
    { path: 'salesorder', component: SalesOrderDetailsComponent },
    { path: 'createsalesorder', component: SalesOrderComponent },
    { path: 'salesorder/createsalesorder', component: SalesOrderComponent },
    { path: 'salesorder/displaysalesorder', component: SalesOrderComponent },
    { path: 'salesreturn/createsalesreturn', component: SalesOrderComponent },
    { path: 'obd/createdelivery', component: SalesOrderComponent },
    { path: 'billing/createbilling', component: SalesOrderComponent },
    { path: 'obd', component: OutboundDeliveryDetailsComponent },
    { path: 'billing', component: BillingDetailsComponent },
    { path: 'custdet', component: CustomerInformationComponent },
    { path: 'incomingpay', component: IncomingPaymentsListComponent },
    { path: 'delarshipdetails', component: DelarshipDetailsComponent },
    { path: 'manageroles', component: RoleManagementComponent },
    { path: 'purchaseorder', component: PurchaseOrderDetailsComponent },
    { path: 'purchaseorder/savepurchaseorder', component: PurchaseOrderComponent },
    { path: 'purchaseorder/editpurchaseorder', component: EditPurchaseOrderComponent },
    { path: 'goodsreceipt/createGR', component: GoodsReceiptComponent },
    { path: 'goodsreceipt/editGR', component: EditPurchaseOrderComponent },
    { path: 'goodsreceipt', component: GoodsReceiptDetailsComponent },
    { path: 'invoicedetails', component: InvoiceDetailsComponent },
    { path: 'invoicedetails/createInvoice', component: CreateInvoiceComponent },
    { path: 'invoicedetails/editInvoice', component: EditPurchaseOrderComponent },
    { path: 'outgoingpayment', component: OutgoingPaymentsListComponent },
    { path: 'resetPassword', component: ResetPasswordComponent },
    { path: 'userProfile', component: UserProfileComponent },
    { path: 'managebp', component: BussinessPartnersComponent },
    { path: 'businessPlaceSet', component: BusinessplaceSettingsComponent },
    { path: 'customerInfo', component: CustomerDetailsComponent },
    { path: 'incomingpay/postincomingpayment', component: IncomingPaymentsComponent },
    { path: 'salesorder/editsalesorder', component: EditSalesOrderComponent },
    { path: 'obd/displaydeliverydetails', component: EditSalesOrderComponent },
    { path: 'obd/editdeliverydetails', component: EditSalesOrderComponent },
    { path: 'billing/editbillingdetails', component: EditSalesOrderComponent },
    { path: 'appsettings', component: BusinessPartnerSettingsComponent },
    { path: 'inventorystock', component: InventoryStockMbComponent },
    { path: 'outgoingpayment/postoutgoingpayment', component: OutgoingPaymentComponent },
    { path: 'releasepo', component: ReleasePurchaseOrderComponent },
    { path: 'closingstock', component: ClosingStockbalReportComponent },
    { path: 'configgrp', component: ConfigGroupDetailsComponent },
    { path: 'config/grp', component: ConfigGroupComponent },
    { path: 'salesanalysis', component: MctaReportComponent },
    { path: 'recordrlist', component: RecurringOrderDetailsComponent },
    { path: 'gstr1', component: Gstr1ReportComponent },
    { path: 'configval', component: ConfigValuesDetailsComponent },
    { path: 'rptsgallery', component: ReportsGalleryComponent },
    { path: 'bill/report', component: BillingReportComponent },
    { path: 'me2nreport', component: PurchaseAnalysisComponent },
    { path: 'poreport', component: PurchaseOrderReportComponent },
    { path: 'pireport', component: PurchaseInvoiceReportComponent },
    { path: 'grreport', component: GoodsReceiptReportComponent },
    { path: 'deliveryreport', component: DeliveryReportComponent },
    { path: 'customerdealerwiserpt', component: CustomerDelarwiseReportComponent },
    { path: 'pendingsalesreport', component: PendingSalesOrderReportComponent },
    { path: 'customerledgerreport', component: CustomerLedgerReportComponent },
    { path: 'vendorledgerreport', component: VendorLedgerReportComponent },
    { path: 'gstr2', component: Gstr2ReportComponent },
    { path: 'salespersonreport', component: SalesPersonReportComponent },
    { path: 'activeuser', component: ActiveUserDetailsComponent },
    { path: 'intransit', component: IntransitDetailsComponent },
     { path: 'soreport', component: SalesOrderReportComponent },
     { path: 'targetreport', component: TargetAchievementReportComponent },
    { path: '**', redirectTo: 'pages/page-404' }

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });