import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { routing } from './app.routing';
import { TopBarComponent} from './components/top-bar/top-bar.component';
import { MenuLeftComponent } from './components/menu-left/menu-left.component';
import { MenuRightComponent } from './components/menu-right/menu-right.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import {CdkTableModule} from '@angular/cdk/table';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StockBalanceComponent } from './components/stock-balance/stock-balance.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { SalesOrderComponent } from './components/sales-order/sales-order.component';
import { OutboundDeliveryComponent } from './components/outbound-delivery/outbound-delivery.component';
import { SalesOrderDetailsComponent } from './components/sales-order-details/sales-order-details.component';
import {CommonService} from './services/common.service';
import { BillingComponent } from './components/billing/billing.component';
import { BillingDetailsComponent } from './components/billing-details/billing-details.component';
import { OutboundDeliveryDetailsComponent } from './components/outbound-delivery-details/outbound-delivery-details.component';
import { ValidateOnBlurDirective } from './directives/validate-on-blur.directive';
import { MessagePropertiesService } from './services/message-properties.service';
import { EnvConfigurationService } from './services/env-configuration.service';
import { DelarshipDetailsComponent } from './components/delarship-details/delarship-details.component';
import { ChartsModule } from 'ng2-charts';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { IncomingPaymentsComponent } from './components/incoming-payments/incoming-payments.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { PurchaseOrderDetailsComponent } from './components/purchase-order-details/purchase-order-details.component';
import { PurchaseOrderComponent } from './components/purchase-order/purchase-order.component';
import { GoodsReceiptComponent } from './components/goods-receipt/goods-receipt.component';
import { GoodsReceiptDetailsComponent } from './components/goods-receipt-details/goods-receipt-details.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { CreateInvoiceComponent } from './components/create-invoice/create-invoice.component';
import { OutgoingPaymentComponent } from './components/outgoing-payment/outgoing-payment.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { BussinessPartnersComponent } from './components/bussiness-partners/bussiness-partners.component';
import {PriceIndPipe} from './directives/customprice.converter';
import { BusinessplaceSettingsComponent } from './components/businessplace-settings/businessplace-settings.component';
import { CustomerInformationComponent } from './components/customer-information/customer-information.component';
import { EditSalesOrderComponent } from './components/edit-sales-order/edit-sales-order.component';
import { EditOutboundDeliveryComponent } from './components/edit-outbound-delivery/edit-outbound-delivery.component';
import { EditBillingDetailsComponent } from './components/edit-billing-details/edit-billing-details.component';
import {ExcelService} from './services/excel.service';
import { CustomroundPipe } from './directives/customround.pipe';
import { IncomingPaymentsListComponent } from './components/incoming-payments-list/incoming-payments-list.component';
import { InventoryStockMbComponent } from './components/inventory-stock-mb/inventory-stock-mb.component';
import { BusinessPartnerSettingsComponent } from './components/business-partner-settings/business-partner-settings.component';
import { EditPurchaseOrderComponent } from './components/edit-purchase-order/edit-purchase-order.component';
import { OutgoingPaymentsListComponent } from './components/outgoing-payments-list/outgoing-payments-list.component';
import { ReleasePurchaseOrderComponent } from './components/release-purchase-order/release-purchase-order.component';
import { EditInvoiceComponent } from './components/edit-invoice/edit-invoice.component';
import { EditGoodsReceiptComponent } from './components/edit-goods-receipt/edit-goods-receipt.component';
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
import { GoogleChartComponent } from './components/google-chart/google-chart.component';
import { CustomerLedgerReportComponent } from './components/customer-ledger-report/customer-ledger-report.component';
import { VendorLedgerReportComponent } from './components/vendor-ledger-report/vendor-ledger-report.component';
import { Gstr2ReportComponent } from './components/gstr2-report/gstr2-report.component';
import { SalesPersonReportComponent } from './components/sales-person-report/sales-person-report.component';
import { ActiveUserDetailsComponent } from './components/active-user-details/active-user-details.component';
import { IntransitDetailsComponent } from './components/intransit-details/intransit-details.component';
import { SalesOrderReportComponent } from './components/sales-order-report/sales-order-report.component';
import { TargetAchievementReportComponent } from './components/target-achievement-report/target-achievement-report.component';





@NgModule({
    declarations: [
        AppComponent,
        TopBarComponent,
        MenuLeftComponent,
        MenuRightComponent,
        FooterComponent,
        LoginComponent,
        UserManagementComponent,
        DashboardComponent,
        StockBalanceComponent,
        StockDetailsComponent,
        SalesOrderComponent,
        OutboundDeliveryComponent,
        SalesOrderDetailsComponent,
        ValidateOnBlurDirective,
        SalesOrderDetailsComponent,
        BillingComponent,
        BillingDetailsComponent,
        OutboundDeliveryDetailsComponent,
        DelarshipDetailsComponent,
        CustomerDetailsComponent,
        IncomingPaymentsComponent,
        RoleManagementComponent,
        PurchaseOrderDetailsComponent,
        PurchaseOrderComponent,
        GoodsReceiptComponent,
        GoodsReceiptDetailsComponent,
        InvoiceDetailsComponent,
        CreateInvoiceComponent,
        OutgoingPaymentComponent,
        ResetPasswordComponent,
        UserProfileComponent,
        BussinessPartnersComponent,
        PriceIndPipe,
        BusinessplaceSettingsComponent,
        CustomerInformationComponent,
        EditSalesOrderComponent,
        EditOutboundDeliveryComponent,
        EditBillingDetailsComponent,
        CustomroundPipe,
        IncomingPaymentsListComponent,
        InventoryStockMbComponent,
        BusinessPartnerSettingsComponent,
        EditPurchaseOrderComponent,
        OutgoingPaymentsListComponent,
        ReleasePurchaseOrderComponent,
        EditInvoiceComponent,
        EditGoodsReceiptComponent,
        ClosingStockbalReportComponent,
        ConfigGroupDetailsComponent,
        ConfigGroupComponent,
        MctaReportComponent,
        ConfigValuesDetailsComponent,
        RecurringOrderDetailsComponent,
        ConfigValComponent,
        Gstr1ReportComponent,
       ReportsGalleryComponent,
       BillingReportComponent,
       PurchaseAnalysisComponent,
       PurchaseOrderReportComponent,
       PurchaseInvoiceReportComponent,
       GoodsReceiptReportComponent,
       DeliveryReportComponent,
       CustomerDelarwiseReportComponent,
       PendingSalesOrderReportComponent,
       GoogleChartComponent,
       CustomerLedgerReportComponent,
       VendorLedgerReportComponent,
       Gstr2ReportComponent,
       SalesPersonReportComponent,
       ActiveUserDetailsComponent,
       IntransitDetailsComponent,
       SalesOrderReportComponent,
       TargetAchievementReportComponent,

    ],
    imports: [
        BrowserModule, FormsModule, ReactiveFormsModule,
        CdkTableModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        RouterModule,
        HttpModule,
        routing,
        ChartsModule,
        NgbModule.forRoot()
    ],
    providers: [CommonService, MessagePropertiesService, EnvConfigurationService, ExcelService],
    bootstrap: [AppComponent]
})
export class AppModule { }
