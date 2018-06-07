import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { MessagePropertiesService } from '../../services/message-properties.service';
import { EnvConfigurationService } from '../../services/env-configuration.service';
import { ExcelService } from '../../services/excel.service';
declare var $: any;
declare var jQuery: any;
@Component({
    selector: 'app-gstr1-report',
    templateUrl: './gstr1-report.component.html',
    styleUrls: ['./gstr1-report.component.css']
})
export class Gstr1ReportComponent implements OnInit {
    public gstrdetailsForm: FormGroup;
    public bpId: string;
    public orgId: string;
    public accessObjId: string;
    gstrdetailsList: any = [];
    public material: any;
    public ajaxDropdown = false;
    public screenType: any;
    public actionFlag: any;
    public customertypeList: any;
    public emptyFlag: boolean = false;
    public cdListLength: any;
    public gstrdetailslength: any;
    invAmt: any;
    taxAmt: any;
    tableView: any;
    totalQty: any;
    totalPrice: any;
    totalIgstVal: any;
    totalCgstVal: any;
    totalSgstVal: any;
    totalGrossVal: any;
    reportype: any;
    totalexcis_gst_amt: any;
    totalgst_exemp_amt: any;
    totalnet_amt: any;
    totalnon_gst_amt: any;
    total_amt: any;
    crinvAmt: any = 0;
    crtaxAmount: any = 0;
    constructor(private http: Http, private formBuilder: FormBuilder, private environment: EnvConfigurationService,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private excelService: ExcelService) {
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjId = localStorage.getItem("Reports Gallery")
        this.gstrdetailsForm = new FormBuilder().group(
            {
                'frmDate': ['', Validators.required],
                'toDate': ['', Validators.required]
            }
        );
        this.actionFlag = true;
        this.gstrdetailsList = [];
        this.cdListLength = 0;
        this.gstrdetailslength = 0;
        this.invAmt = 0;
        this.taxAmt = 0;
        this.totalPrice = 0;
        this.totalIgstVal = 0;
        this.totalCgstVal = 0;
        this.totalSgstVal = 0;
        this.totalGrossVal = 0;
        this.tableView = "gstr1-table";
        this.reportype = "GSTR1 Invoice Summary";
        this.totalexcis_gst_amt = 0;
        this.totalgst_exemp_amt = 0;
        this.totalnet_amt = 0;
        this.totalnon_gst_amt = 0;
        this.total_amt = 0;
        this.crinvAmt = 0;
        this.crtaxAmount = 0;
        this.totalQty=0;
    }
    ngOnInit() {
        $('.datepicker-init').datetimepicker({
            widgetPositioning: {
                horizontal: 'left'
            },
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down",
                previous: 'fa fa-arrow-left',
                next: 'fa fa-arrow-right'
            },
            format: 'DD-MM-YYYY',

        });
        this.applyDataTable();
    }
    selectScreen(typeVal) {
        this.gstrdetailsList = [];
        this.screenType = typeVal;
        if (this.screenType == "G") {
            $("#gstr1-table").show();
            $("#hsn_summary-table").hide();
            $("#nil_summary-table").hide();

            $("#head-gstr1-table").show();
            $("#head-hsn-table").hide();
            $("#head-nil-table").hide();

            this.tableView = "gstr1-table";
            this.reportype = "GSTR1 Invoice Summary";
        }
        if (this.screenType == "H") {
            $("#gstr1-table").hide();
            $("#hsn_summary-table").show();
            $("#nil_summary-table").hide();

            $("#head-gstr1-table").hide();
            $("#head-hsn-table").show();
            $("#head-nil-table").hide();
            this.tableView = "hsn_summary-table";
            this.reportype = "GSTR1 HSN Summary";
        }
        if (this.screenType == "N") {
            $("#gstr1-table").hide();
            $("#hsn_summary-table").hide();
            $("#nil_summary-table").show();

            $("#head-gstr1-table").hide();
            $("#head-hsn-table").hide();
            $("#head-nil-table").show();
            this.tableView = "nil_summary-table";
            this.reportype = "GSTR1 Nil Summary";
        }
        this.applyDataTable();
    }
    getgstr1Details() {
        this.totalPrice = 0;
        this.totalIgstVal = 0;
        this.totalCgstVal = 0;
        this.totalSgstVal = 0;
        this.totalQty=0;
        this.totalGrossVal = 0;
        this.totalexcis_gst_amt = 0;
        this.totalgst_exemp_amt = 0;
        this.totalnet_amt = 0;
        this.totalnon_gst_amt = 0;
        this.total_amt = 0;
        this.crinvAmt = 0;
        this.crtaxAmount = 0;
        $('.hsn_summary-table').DataTable().clear();
        this.applyDataTable();
        this.gstrdetailsList = [];
        this.invAmt = 0;
        this.taxAmt = 0;
        $('#loadingIcon').show();
        $("#black-overlay").show();
        let gstrPayload = {};
        let fromDate, toDate;
        let custArray = [];
        let custGrpArray = [];
        let matArray = [];
        let splittedFromDate = $("#frmDate").val().split("-");
        fromDate = splittedFromDate[2] + splittedFromDate[1] + splittedFromDate[0];
        let splittedToDate = $("#toDate").val().split("-");
        toDate = splittedToDate[2] + splittedToDate[1] + splittedToDate[0];
        let gstrdateArray = [];
        gstrdateArray.push(fromDate);
        gstrdateArray.push(toDate);
        gstrPayload["from_date"] = fromDate;
        gstrPayload["to_date"] = toDate;
        gstrPayload["bp_id"] = this.bpId;
        gstrPayload["org_id"] = this.orgId;
        this.screenType = $("#txt_type").val();
        let url = "";
        let methodtype = "";
        if (this.screenType == "G") {
            $("#gstr1-table").show();
            $("#hsn_summary-table").hide();
            $("#nil_summary-table").hide();
            $("#head-gstr1-table").show();
            $("#head-hsn-table").hide();
            $("#head-nil-table").hide();
            gstrPayload["company_code"] = "RMSS";
            url = this.environment.getRequiredApi('get_gstr1_details') + "?";
            this.commonService.getData(url, 'POST', gstrPayload, this.accessObjId)
                .subscribe((response) => {
                    console.log(response);
                    if (response.status == '1') {
                        this.gstrdetailsList = [];
                        this.commonService.responseMessages('', response.message, 'warning');
                    } else {
                        this.gstrdetailsList = [];
                        if (response.data.hasOwnProperty('ex_gstr1_details')) {
                            this.gstrdetailsList = response.data.ex_gstr1_details;
                        }
                        $("#filter-block").hide();
                        let data = response.data.ex_return;
                        if (response.data.hasOwnProperty("ex_return")) {
                            for (let index of data) {
                                if (index.type == "E") {
                                    this.gstrdetailsList = [];
                                    this.gstrdetailslength = 0;
                                    $("#filter-block").show();
                                    this.commonService.responseMessages('', index.message, 'warning');
                                }
                            }
                        }
                        for (let gstr1 of this.gstrdetailsList) {
                            if (gstr1.invoice_type == 'Credit memo') {
                                this.crinvAmt = this.crinvAmt + parseFloat(gstr1.invoice_value);
                                this.crtaxAmount = this.crtaxAmount + parseFloat(gstr1.taxable_value);
                            }
                            else {
                                this.invAmt = this.invAmt + parseFloat(gstr1.invoice_value);
                                this.taxAmt = this.taxAmt + parseFloat(gstr1.taxable_value);
                            }
                        }


                    }
                    $('.gstr1-table').DataTable().destroy();
                    this.applyDataTable();
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                }, err => {
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                    console.log(err)
                });
        }
        if (this.screenType == "H") {
            $("#gstr1-table").hide();
            $("#hsn_summary-table").show();
            $("#nil_summary-table").hide();
            $("#head-gstr1-table").hide();
            $("#head-hsn-table").show();
            $("#head-nil-table").hide();
            url = this.environment.getRequiredApi('hsn_summary_report') + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&from_date=" + fromDate + "&to_date=" + toDate + "&";
            this.commonService.getData(url, 'GET', "", this.accessObjId)
                .subscribe((response) => {
                    console.log(response);
                    if (response.status == '1') {
                        this.gstrdetailsList = [];
                        this.commonService.responseMessages('', response.message, 'warning');
                    } else {
                        this.gstrdetailsList = [];
                        if (response.data.hasOwnProperty('ex_hsn_summary')) {
                            this.gstrdetailsList = response.data.ex_hsn_summary;
                        }
                        $("#filter-block").hide();
                        let data = response.data.ex_return;
                        if (response.data.hasOwnProperty("ex_return")) {
                            for (let index of data) {
                                if (index.type == "E") {
                                    this.gstrdetailsList = [];
                                    this.gstrdetailslength = 0;
                                    $("#filter-block").show();
                                    this.commonService.responseMessages('', index.message, 'warning');
                                }
                            }
                        }
                        for (let gstr1 of this.gstrdetailsList) {
                            this.totalPrice = this.totalPrice + parseFloat(gstr1.net_amt);
                            this.totalSgstVal = this.totalSgstVal + parseFloat(gstr1.sgst_amt);
                            this.totalCgstVal = this.totalCgstVal + parseFloat(gstr1.cgst_amt);
                            this.totalIgstVal = this.totalIgstVal + parseFloat(gstr1.igst_amt);
                            this.totalGrossVal = this.totalGrossVal + parseFloat(gstr1.total_amt);
                              this.totalQty = this.totalQty + parseFloat(gstr1.total_qty);
                            
                        }


                    }
                    $('.hsn_summary-table').DataTable().destroy();

                    this.applyDataTable();
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                }, err => {
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                    console.log(err)
                });
        }
        if (this.screenType == "N") {
            $("#gstr1-table").hide();
            $("#hsn_summary-table").hide();
            $("#nil_summary-table").show();
            $("#head-gstr1-table").hide();
            $("#head-hsn-table").hide();
            $("#head-nil-table").show();
            url = this.environment.getRequiredApi('get_nil_summary_report') + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&from_date=" + fromDate + "&to_date=" + toDate + "&";
            this.commonService.getData(url, 'GET', "", this.accessObjId)
                .subscribe((response) => {
                    console.log(response);
                    if (response.status == '1') {
                        this.gstrdetailsList = [];
                        this.commonService.responseMessages('', response.message, 'warning');
                    } else {
                        this.gstrdetailsList = [];
                        if (response.data.hasOwnProperty('ex_hsn_summary')) {
                            this.gstrdetailsList = response.data.ex_nill_summary;
                        }
                        $("#filter-block").hide();
                        let data = response.data.ex_return;
                        if (response.data.hasOwnProperty("ex_return")) {
                            for (let index of data) {
                                if (index.type == "E") {
                                    this.gstrdetailsList = [];
                                    this.gstrdetailslength = 0;
                                    $("#filter-block").show();
                                    this.commonService.responseMessages('', index.message, 'warning');
                                }
                            }
                        }
                        for (let gstr1 of this.gstrdetailsList) {
                            this.totalexcis_gst_amt = this.totalexcis_gst_amt + parseFloat(gstr1.excis_gst_amt);
                            this.totalgst_exemp_amt = this.totalgst_exemp_amt + parseFloat(gstr1.gst_exemp_amt);
                            this.totalnet_amt = this.totalnet_amt + parseFloat(gstr1.net_amt);
                            this.totalnon_gst_amt = this.totalnon_gst_amt + parseFloat(gstr1.non_gst_amt);
                            this.total_amt = this.total_amt + parseFloat(gstr1.total_amt);
                        }


                    }
                    $('.nil_summary-table').DataTable().destroy();

                    this.applyDataTable();
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                }, err => {
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                    console.log(err)
                });
        }

    }

    changeTodatePicker(id) {
        $(id).datetimepicker("hide");
        this.gstrdetailsForm.controls['frmDate'].setValue($("#frmDate").val());

        if ($("#toDate").val() != "") {
            $("#toDate").datetimepicker("refresh");
            $("#toDate").datetimepicker("destroy");

        }
        var fromDateFilt = new Date();
        if ($("#frmDate").val().length != 0) {
            fromDateFilt = this.convertDate($("#frmDate").val())
        }

        $('#toDate').datetimepicker({

            widgetPositioning: {
                horizontal: 'left'
            },
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down",
                previous: 'fa fa-arrow-left',
                next: 'fa fa-arrow-right'
            },
            format: 'DD-MM-YYYY',

            minDate: fromDateFilt
        });

    }

    public convertDate(date) {
        let dateArry = date.split("-");
        return new Date(dateArry[2], dateArry[1] - 1, dateArry[0]);
    }

    removeStyles() {
        this.gstrdetailsForm.controls['frmDate'].setValue($("#frmDate").val());
        this.gstrdetailsForm.controls['toDate'].setValue($("#toDate").val());
    }
    applyDataTable() {
        let klass = this.tableView;
        setTimeout(() => {
            $('.' + klass).DataTable({
                retrieve: true,
                "bPaginate": false,
                "bInfo": false,
                "order": [0],
                "language": {
                    "emptyTable": "No data available",
                    "info": "Showing page _PAGE_ of _PAGES_",
                    "infoFiltered": "(filtered from _MAX_ total records)"
                },
                "fnDrawCallback": function(oSettings) {
                    if (5 >= oSettings.fnRecordsDisplay()) {
                        $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();

                        $(oSettings.nTableWrapper).find('.dataTables_info').hide();
                    } else {
                        $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                        $(oSettings.nTableWrapper).find('.dataTables_filter').show();
                        $(oSettings.nTableWrapper).find('.dataTables_info').show();
                        $(oSettings.nTableWrapper).find('.dataTables_length').show();

                    }
                },
                "columnDefs": [{
                    "targets": 'no-sort',
                    "orderable": false,
                }]
            });
            $('.' + klass).css("display", "table !important")
        }, 500);

        setTimeout(() => {
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
            //$("#cust-info-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
        }, 1100);
    }
    exportExcel() {
        let jsonArrrayData: any = [];
        if (this.gstrdetailsList.length != 0) {
            if (this.screenType == "G") {
                for (let index of this.gstrdetailsList) {
                    if (!index.hasOwnProperty('ecomm_gstin')) {
                        index.ecomm_gstin = "  "
                    }
                    if (!index.hasOwnProperty('gstin_recipient')) {
                        index.gstin_recipient = "  "
                    }
                    if (!index.hasOwnProperty('invoice_date')) {
                        index.invoice_date = ' ';
                    }
                    if (!index.hasOwnProperty('invoice_no')) {
                        index.invoice_no = ' ';
                    }
                    if (!index.hasOwnProperty('invoice_type')) {
                        index.invoice_type = " ";
                    }
                    if (!index.hasOwnProperty('invoice_value')) {
                        index.invoice_value = " ";
                    }
                    if (!index.hasOwnProperty('place_of_supply')) {
                        index.place_of_supply = " ";
                    }
                    if (!index.hasOwnProperty('rate')) {
                        index.rate = " ";
                    }
                    if (!index.hasOwnProperty('receiver_name')) {
                        index.receiver_name = " ";
                    }
                    if (!index.hasOwnProperty('reverse_charge')) {
                        index.reverse_charge = " ";
                    }
                    if (!index.hasOwnProperty('taxable_value')) {
                        index.taxable_value = " ";
                    }
                    if (!index.hasOwnProperty('type')) {
                        index.type = " ";
                    }
                    jsonArrrayData.push(index);
                }
                let columns: any = ['type', 'invoice_no', 'invoice_date', 'invoice_type', 'invoice_value', 'rate', 'taxable_value', 'reverse_charge', 'receiver_name', 'place_of_supply', 'ecomm_gstin', 'gstin_recipient']
                let columnHeaders: any = ['Type', 'Invoice No', 'Invoice Date', 'Invoice Type', 'Invoice Value', 'Rate', 'Tax Value', 'Reverse Charge', 'Receiver Name', 'Place Of Supply', 'GSTIN', 'Recipient GSTN']
                let jsonData: any = JSON.stringify(jsonArrrayData);
                this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "GSTR1 List", columns, columnHeaders, 'GSTR1');
            }
            if (this.screenType == "H") {
                for (let index of this.gstrdetailsList) {
                    if (!index.hasOwnProperty('hsn_code')) {
                        index.hsn_code = "  "
                    }
                    if (!index.hasOwnProperty('item_type')) {
                        index.item_type = "  "
                    }
    if (!index.hasOwnProperty('total_qty')) {
                        index.total_qty = "  "
                    }
    if (!index.hasOwnProperty('uom')) {
                        index.uom = "  "
                    }
                    if (!index.hasOwnProperty('net_amt')) {
                        index.net_amt = ' ';
                    }
                    if (!index.hasOwnProperty('sgst_amt')) {
                        index.sgst_amt = ' ';
                    }
                    if (!index.hasOwnProperty('cgst_amt')) {
                        index.cgst_amt = ' ';
                    }
                    if (!index.hasOwnProperty('igst_amt')) {
                        index.igst_amt = ' ';
                    }
                    if (!index.hasOwnProperty('total_amt')) {
                        index.total_amt = ' ';
                    }
                    jsonArrrayData.push(index);
                }
                let columns: any = ['hsn_code', 'item_type', 'total_qty', 'uom', 'net_amt', 'sgst_amt', 'cgst_amt', 'igst_amt', 'total_amt']
                let columnHeaders: any = ['HSN Code', 'Item Type', 'Total Qty', 'UOM', 'Net Amount', 'SGST', 'CGST', 'IGST', 'Total Amount']
                let jsonData: any = JSON.stringify(jsonArrrayData);
                this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "HSN Summary List", columns, columnHeaders, 'HSN Summary');
            }
            if (this.screenType == "N") {
                for (let index of this.gstrdetailsList) {
                    if (!index.hasOwnProperty('hsn_code')) {
                        index.hsn_code = "  "
                    }
                    if (!index.hasOwnProperty('item_type')) {
                        index.item_type = "  "
                    }
                    if (!index.hasOwnProperty('excis_gst_amt')) {
                        index.excis_gst_amt = ' ';
                    }
                    if (!index.hasOwnProperty('gst_exemp_amt')) {
                        index.gst_exemp_amt = ' ';
                    }
                    if (!index.hasOwnProperty('net_amt')) {
                        index.net_amt = ' ';
                    }
                    if (!index.hasOwnProperty('non_gst_amt')) {
                        index.non_gst_amt = ' ';
                    }
                    if (!index.hasOwnProperty('total_amt')) {
                        index.total_amt = ' ';
                    }
                    jsonArrrayData.push(index);
                }
                let columns: any = ['hsn_code', 'item_type', 'excis_gst_amt', 'gst_exemp_amt', 'net_amt', 'non_gst_amt', 'total_amt']
                let columnHeaders: any = ['HSN Code', 'Item Type', 'Excise GST Amount', 'GST Exempt Amount', 'Net Amount', 'Non GST Amount', 'Total Amount']
                let jsonData: any = JSON.stringify(jsonArrrayData);
                this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Nil Summary List", columns, columnHeaders, 'Nil Summary');
            }
        } else {
            this.commonService.responseMessages("", "No Data Available To Export", "warning")
        }
    }
    navigateToRepGallery() {
        const path: any = "rptsgallery";
        this.router.navigate([path]);
    }
    showFilters() {
        $("#filter-block").slideToggle();
    }
}