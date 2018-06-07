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
    selector: 'app-sales-order-report',
    templateUrl: './sales-order-report.component.html',
    styleUrls: ['./sales-order-report.component.css']
})
export class SalesOrderReportComponent implements OnInit {
    public poreportdetailsForm: FormGroup;
    public bpId: string;
    public orgId: string;
    public accessObjId: string;
    public SOdetailsList: any = [];
    public material: any;
    public ajaxDropdown = false;
    public screenType: any;
    public actionFlag: any;
    public customertypeList: any;
    public emptyFlag: boolean = false;
    customerNames: any;
    sch_val: any;
    igstAmt: any;
    cgstAmt: any;
    sgstAmt: any;
    netAmount: any;
    total_amt: any;
    dis_val: any;
    fix_sch: any;

    crsch_val: any;
    crigstAmt: any;
    crcgstAmt: any;
    crsgstAmt: any;
    crtotal_amt: any;
    crnetAmount: any;
    crdis_val: any;
    crfix_sch: any;
    constructor(private http: Http, private formBuilder: FormBuilder, private environment: EnvConfigurationService,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private excelService: ExcelService) {
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjId = localStorage.getItem("Reports Gallery")
        this.poreportdetailsForm = new FormBuilder().group(
            {
                'frmDate': ['', Validators.required],
                'toDate': ['', Validators.required],
                'custName': ['']
            }
        );
        this.actionFlag = true;
        this.SOdetailsList = [];
        this.customerNames = [];
        this.sch_val = 0;
        this.igstAmt = 0;
        this.cgstAmt = 0;
        this.sgstAmt = 0;
        this.netAmount = 0;
        this.total_amt = 0;
        this.dis_val = 0;
        this.fix_sch = 0;

        this.crsch_val = 0;
        this.crigstAmt = 0;
        this.crcgstAmt = 0;
        this.crsgstAmt = 0;
        this.crtotal_amt = 0;
        this.crnetAmount = 0;
        this.crdis_val = 0;
        this.crfix_sch = 0;
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
        this.SOdetailsList = [];
        this.applyDataTable();
    }
    extractData(id, spinnerId, ajaxDropdown, event) {
        let term: any = $("#" + id).val();
        if (this.customerNames.length == 0) {
            if (term.length > 3) {
                term = term.substring(0, 3);
            }
        }
        if (term.length == 3 && event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
            $("#" + spinnerId).show();
            let url: any = this.environment.getRequiredApi("find_customers") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&cust_name=" + term + "&";
            this.commonService.getData(url, "GET", "", this.accessObjId).subscribe(response => {
                if (response.status == 0) {
                    this.customerNames = response["data"].ex_cust_list;
                    $("#" + spinnerId).hide();
                    $("#" + ajaxDropdown).show();
                    setTimeout(() => {
                        $("#" + ajaxDropdown).find('ul').find('li:first').addClass('active');
                        $("#" + ajaxDropdown).find('ul').find('li:first').focus();
                    }, 100);
                } else {
                    $("#" + spinnerId).hide();
                    $("#" + ajaxDropdown).show();
                }
            });
        } else {
            if (term == "") {
                this.customerNames = [];
                $("#" + spinnerId).hide();
                $("#filterCustomerId").val("");
            } else {
                if (event.keyCode != 13 && event.keyCode != 38 && event.keyCode != 40) {
                    var searchText = term;
                    searchText = searchText.toUpperCase();
                    $(".ajax-list").removeClass('active');
                    $("#" + ajaxDropdown).find('ul > li').each(function() {
                        var currentLiText = $(this).text();
                        currentLiText = currentLiText.toUpperCase();
                        var showCurrentLi = currentLiText.indexOf(searchText) !== -1;
                        $(this).toggle(showCurrentLi);
                    });
                    $("#" + ajaxDropdown).find('ul').find('li:visible').first().addClass('active');
                    $("#" + ajaxDropdown).find('ul').find('li:visible').first().focus();
                }
            }
        }
        if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13) {
            $("#" + ajaxDropdown).find('ul > li').each(function() {
                if (event.keyCode == 40) {
                    if ($(this).hasClass('active')) {
                        console.log($(this).attr('class'));
                        if ($(this).next().is(':visible')) {
                            $(this).removeClass('active');
                            $(this).next().addClass('active');
                            $(this).next().focus();
                            $("#" + ajaxDropdown).find("ul").scrollTop($(this).position().top);
                            return false;
                        }
                    }
                }
                if (event.keyCode == 13) {
                    if ($(this).hasClass('active')) {
                        $(this).click();
                    }
                }
                if (event.keyCode == 38) {
                    if ($(this).hasClass('active')) {
                        if ($(this).prev().is(':visible')) {
                            $(this).removeClass('active');
                            $(this).prev().focus();
                            $(this).prev().addClass('active');
                            $("#" + ajaxDropdown).find("ul").scrollTop($(this).position().top);
                            return false;
                        }
                    }
                }
            });
        }
    }
    selectedItem(response, modalBlock, textInput, hiddenInput) {
        if (response.cust_name == null && response.cust_name == undefined) {
            $("#" + textInput).val(response.cust_id);
        } else {
            let cutname: any = response.cust_id + "-" + response.cust_name;
            $("#" + textInput).val(cutname);
        }
        $("#" + hiddenInput).val(response.cust_id);
        $("#" + modalBlock).hide();
    }
    getSoReportDetails() {
        this.sch_val = 0;
        this.igstAmt = 0;
        this.cgstAmt = 0;
        this.sgstAmt = 0;
        this.netAmount = 0;
        this.total_amt = 0;
        this.dis_val = 0;
        this.fix_sch = 0;

        this.crsch_val = 0;
        this.crigstAmt = 0;
        this.crcgstAmt = 0;
        this.crsgstAmt = 0;
        this.crtotal_amt = 0;
        this.crnetAmount = 0;
        this.crdis_val = 0;
        this.crfix_sch = 0;
        $('#loadingIcon').show();
        $("#black-overlay").show();
        let fromDate, toDate;
        let custArray = [];
        let custGrpArray = [];
        let matArray = [];
        let splittedFromDate = $("#frmDate").val().split("-");
        fromDate = splittedFromDate[2] + splittedFromDate[1] + splittedFromDate[0];
        let splittedToDate = $("#toDate").val().split("-");
        toDate = splittedToDate[2] + splittedToDate[1] + splittedToDate[0];
        let ship_to = $("#filterCustomerId").val();
        let url = this.environment.getRequiredApi('sales_order_report') + "?bp_id=" + this.bpId + "&org_id=" + this.orgId + "&from_date=" + fromDate + "&to_date=" + toDate + "&client_id=" + ship_to + "&";
        this.commonService.getData(url, 'GET', '', this.accessObjId)
            .subscribe((response) => {
                console.log(response);
                if (response.status == '1') {
                    this.SOdetailsList = [];
                    this.commonService.responseMessages('', response.message, 'warning');
                } else {
                    if (response.data.hasOwnProperty('ex_so_report')) {
                        this.SOdetailsList = response.data.ex_so_report;
                        for (let list of this.SOdetailsList) {
                            for (let item of list.items) {
                                item.sch_val = Math.abs(item.sch_val);
                                item.fix_sch = Math.abs(item.fix_sch);
                                item.dis_val = Math.abs(item.dis_val);
                                if (list.doc_category == 'Order') {
                                    this.sch_val = this.sch_val + parseFloat(item.sch_val);
                                    this.fix_sch = this.fix_sch + parseFloat(item.fix_sch);
                                    this.dis_val = this.dis_val + parseFloat(item.dis_val);
                                    this.netAmount = this.netAmount + parseFloat(item.net_val);
                                    this.igstAmt = this.igstAmt + (parseFloat(item.igst_amt));
                                    this.cgstAmt = this.cgstAmt + (parseFloat(item.cgst_amt));
                                    this.sgstAmt = this.sgstAmt + (parseFloat(item.sgst_amt));
                                    this.total_amt = this.total_amt + (parseFloat(item.total_amt));
                                }
                                if (list.doc_category == 'Returns') {
                                    this.crsch_val = this.crsch_val + parseFloat(item.sch_val);
                                    this.crfix_sch = this.crfix_sch + parseFloat(item.fix_sch);
                                    this.crdis_val = this.crdis_val + parseFloat(item.dis_val);
                                    this.crnetAmount = this.crnetAmount + parseFloat(item.net_val);
                                    this.crigstAmt = this.crigstAmt + (parseFloat(item.igst_amt));
                                    this.crcgstAmt = this.crcgstAmt + (parseFloat(item.cgst_amt));
                                    this.crsgstAmt = this.crsgstAmt + (parseFloat(item.sgst_amt));
                                    this.crtotal_amt = this.crtotal_amt + (parseFloat(item.total_amt));
                                }
                            }
                        }
                        $("#filter-block").hide();
                        var InvoiceTable = [];
                        var totqty = 0;

                    }
                }
                let data = response.data.ex_return;
                if (response.data.hasOwnProperty("ex_return")) {
                    for (let index of data) {
                        if (index.type == "E") {
                            this.SOdetailsList = [];
                            this.commonService.responseMessages('', index.message, 'warning');
                        }
                    }
                }
                $("#delivery-order-table").DataTable().destroy();
                this.applyDataTable();
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
            }, err => {
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                console.log(err)
            });
    }

    changeTodatePicker(id) {
        $(id).datetimepicker("hide");
        this.poreportdetailsForm.controls['frmDate'].setValue($("#frmDate").val());
        if ($("#toDate").val() != "") {
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
        this.poreportdetailsForm.controls['frmDate'].setValue($("#frmDate").val());
        this.poreportdetailsForm.controls['toDate'].setValue($("#toDate").val());
    }
    applyDataTable() {
        setTimeout(() => {
            $("#delivery-order-table").DataTable({
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
            // $("#delivery-order-table").css("display", "table !important")
        }, 500);

        setTimeout(() => {
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
        }, 1100);
    }
    exportExcel() {
        let jsonArrrayData: any = [];
        let count = 0;
        if (this.SOdetailsList.length != 0) {
            for (let index of this.SOdetailsList) {
                for (let items of this.SOdetailsList[count].items) {
                    let listObj: any = {};
                    if (!index.hasOwnProperty('sales_doc')) {
                        listObj.sales_doc = " ";
                    }
                    else {
                        listObj.sales_doc = index.sales_doc;
                    }
                    if (!index.hasOwnProperty('status')) {
                        listObj.status = "  "
                    }
                    else {
                        listObj.status = index.status;
                    }
                    if (!index.hasOwnProperty('doc_date')) {
                        listObj.doc_date = ' ';
                    }
                    else {
                        listObj.doc_date = index.doc_date;
                    }
                    if (!index.hasOwnProperty('doc_category')) {
                        listObj.doc_category = ' ';
                    }
                    else {
                        listObj.doc_category = index.doc_category;
                    }
                    if (!index.hasOwnProperty('req_del_date')) {
                        listObj.req_del_date = ' ';
                    }
                    else {
                        listObj.req_del_date = index.req_del_date;
                    }
                    if (!index.hasOwnProperty('po_num')) {
                        listObj.po_num = " ";
                    }
                    else {
                        listObj.po_num = index.po_num;
                    }
                    if (!index.hasOwnProperty('po_date')) {
                        listObj.po_date = " ";
                    }
                    else {
                        listObj.po_date = index.po_date;
                    }
                    if (!index.hasOwnProperty('sold_to_name')) {
                        listObj.sold_to_name = " ";
                    }
                    else {
                        listObj.sold_to_name = index.sold_to_name;
                    }
                    if (!index.hasOwnProperty('ship_to_name')) {
                        listObj.ship_to_name = " ";
                    }
                    else {
                        listObj.ship_to_name = index.ship_to_name;
                    }
                    if (!index.hasOwnProperty('net_amount')) {
                        listObj.net_amount = " ";
                    }
                    else {
                        listObj.net_amount = index.net_amount;
                    }
                    if (!index.hasOwnProperty('total_amt')) {
                        listObj.total_amt = " ";
                    }
                    else {
                        listObj.total_amt = index.total_amt;
                    }
                    if (!items.hasOwnProperty('material')) {
                        listObj.material = " ";
                    }
                    else {
                        listObj.material = items.material;
                    }
                    if (!items.hasOwnProperty('description')) {
                        listObj.description = " ";
                    }
                    else {
                        listObj.description = items.description;
                    }
                    if (!items.hasOwnProperty('qty')) {
                        listObj.qty = " ";
                    }
                    else {
                        listObj.qty = items.qty;
                    }
                    if (!items.hasOwnProperty('uom')) {
                        listObj.uom = " ";
                    }
                    else {
                        listObj.uom = items.uom;
                    }
                    if (!items.hasOwnProperty('unit_price')) {
                        listObj.unit_price = " ";
                    }
                    else {
                        listObj.unit_price = items.unit_price;
                    }
                    if (!items.hasOwnProperty('fix_sch')) {
                        listObj.fix_sch = " ";
                    }
                    else {
                        listObj.fix_sch = items.fix_sch;
                    }
                    if (!items.hasOwnProperty('sch_val')) {
                        listObj.sch_val = " ";
                    }
                    else {
                        listObj.sch_val = items.sch_val;
                    }
                    if (!items.hasOwnProperty('dis_val')) {
                        listObj.dis_val = " ";
                    }
                    else {
                        listObj.dis_val = items.dis_val;
                    }
                    if (!items.hasOwnProperty('dis_amt')) {
                        listObj.dis_amt = " ";
                    }
                    else {
                        listObj.dis_amt = items.dis_amt;
                    }
                    if (!items.hasOwnProperty('net_val')) {
                        listObj.net_val = " ";
                    }
                    else {
                        listObj.net_val = items.net_val;
                    }
                    if (!items.hasOwnProperty('sgst_amt')) {
                        listObj.sgst_amt = " ";
                    }
                    else {
                        listObj.sgst_amt = items.sgst_amt;
                    }
                    if (!items.hasOwnProperty('cgst_amt')) {
                        listObj.cgst_amt = " ";
                    }
                    else {
                        listObj.cgst_amt = items.cgst_amt;
                    }
                    if (!items.hasOwnProperty('igst_amt')) {
                        listObj.igst_amt = " ";
                    }
                    else {
                        listObj.igst_amt = items.igst_amt;
                    }
                    if (!items.hasOwnProperty('total_amt')) {
                        listObj.total_amt = " ";
                    }
                    else {
                        listObj.total_amt = items.total_amt;
                    }
                    jsonArrrayData.push(listObj);
                }
                count++;
            }
            let columns: any = ['sales_doc', 'status', 'doc_date', 'doc_category', 'req_del_date', 'po_num', 'po_date', 'sold_to_name', 'ship_to_name', 'net_amount', 'total_amt', 'material', 'description', 'qty', 'uom', 'unit_price', 'fix_sch', 'sch_val', 'dis_val', 'dis_amt', 'net_val', 'sgst_amt', 'cgst_amt', 'igst_amt', 'total_amt']
            let columnHeaders: any = ['sales_doc', 'Status', 'Doc Date', 'Doc Category', 'Del Date', 'po_num', 'po_date', 'sold_to_name', 'Ship To Name', 'net_amount', 'total_amt', 'Material', 'Description', 'Qty', 'UOM', 'unit_price', 'fix_sch', 'sch_val', 'dis_val', 'dis_amt', 'net_val', 'sgst_amt', 'cgst_amt', 'igst_amt', 'total_amt']
            let jsonData: any = JSON.stringify(jsonArrrayData);
            this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Sales Order List", columns, columnHeaders, 'Sales Order');

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