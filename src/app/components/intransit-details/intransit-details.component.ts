import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { DateAdapter } from '@angular/material';
import { MessagePropertiesService } from '../../services/message-properties.service';
import { EnvConfigurationService } from '../../services/env-configuration.service';
import { ExcelService } from '../../services/excel.service';
declare var $: any;
declare var jQuery: any;
declare var swal: any;
var exportIdlist: number;
@Component({
    selector: 'app-intransit-details',
    templateUrl: './intransit-details.component.html',
    styleUrls: ['./intransit-details.component.css']
})
export class IntransitDetailsComponent implements OnInit {
    public inintransitForm: FormGroup;
    url: string;
    bpId: string;
    orgId: string;
    accessObjectId: any;
    intransitdetailslist: any;
    constructor(private http: Http, private formBuilder: FormBuilder, private environment: EnvConfigurationService,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private dateAdapter: DateAdapter<Date>, private excelService: ExcelService) {
        this.app.isActive = true;
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjectId = localStorage.getItem("Intransit Details");
        this.inintransitForm = new FormBuilder().group(
            {
                'frmDate': ['', Validators.required],
                'toDate': ['', Validators.required]
            }
        );
        this.intransitdetailslist = [];
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
        setTimeout(() => {
            var width = $("#mainContent").css("width");
            $(".outbound-footer").css("width", width);
        }, 50);
        
        this.applyDataTable();
    }
    changeTodatePicker() {
        var maxFromDate = this.convertDate($("#frmDate").val());
        if ($("#toDate").val() != "") {
            $(".datepicker-init2").datetimepicker("destroy");
        }
        $('.datepicker-init2').datetimepicker({
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
            minDate: maxFromDate,
        });
        this.inintransitForm.controls['frmDate'].setValue($("#frmDate").val());
        this.inintransitForm.controls['toDate'].setValue($("#toDate").val());
    }
    public convertDate(date) {
        let dateArry = date.split("-");
        return new Date(dateArry[2], dateArry[1] - 1, dateArry[0]);
    }
    removeStyles() {
        this.inintransitForm.controls['frmDate'].setValue($("#frmDate").val());
        this.inintransitForm.controls['toDate'].setValue($("#toDate").val());
    }
    getintransitdetailslist() {
        $('#loadingIcon').show();
        $("#black-overlay").show();
        let fromDate, toDate;
        let splittedFromDate = $("#frmDate").val().split("-");
        fromDate = splittedFromDate[2] + splittedFromDate[1] + splittedFromDate[0];
        let splittedToDate = $("#toDate").val().split("-");
        toDate = splittedToDate[2] + splittedToDate[1] + splittedToDate[0];
        this.url = this.environment.getRequiredApi('get_intransit_details') + "?bp_id=" + this.bpId + "&org_id=" + this.orgId + "&from_date=" + fromDate + "&to_date=" + toDate + "&";
        this.commonService.getData(this.url, 'GET', '', this.accessObjectId)
            .subscribe((response) => {
                if (response.status == '1') {
                    this.commonService.responseMessages("", response.message, "warning");
                    this.intransitdetailslist = [];
                    this.applyDataTable();
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                } else {
                    let data = response.data.ex_return;
                    if (response.data.hasOwnProperty("ex_return")) {
                        for (let index of data) {
                            if (index.type == "E") {
                                this.intransitdetailslist = [];
                                $("#filter-block").show();
                                this.commonService.responseMessages('', index.message, 'warning');
                            }
                        }
                    }
                    this.intransitdetailslist = response.data.ex_transit_details;
                    $("#cust-info-table").DataTable().destroy();
                    this.applyDataTable();
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                }
            }, err => {
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                console.log(err)
            });
    }
    applyDataTable() {
        setTimeout(() => {
            $("#cust-info-table").DataTable({
                retrieve: true,
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
        }, 500);

        setTimeout(() => {
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
            //$("#cust-info-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
        }, 1100);
    }
    exportExcel() {
        let jsonArrrayData: any = [];
        console.log(this.intransitdetailslist);
        if (this.intransitdetailslist.length != 0) {
            for (let index of this.intransitdetailslist) {
                if (!index.hasOwnProperty('ebeln')) {
                    index.ebeln = "  "
                }
                if (!index.hasOwnProperty('aedat')) {
                    index.aedat = "  "
                }
                if (!index.hasOwnProperty('lifnr')) {
                    index.lifnr = "  "
                }
                if (!index.hasOwnProperty('name1')) {
                    index.name1 = "  "
                }
                if (!index.hasOwnProperty('xbnlr')) {
                    index.xbnlr = ' ';
                }
                if (!index.hasOwnProperty('bldat')) {
                    index.bldat = ' ';
                }
                if (!index.hasOwnProperty('vbeln_billing')) {
                    index.vbeln_billing = " ";
                }
                if (!index.hasOwnProperty('erdat')) {
                    index.erdat = " ";
                }
                if (!index.hasOwnProperty('grn_no')) {
                    index.grn_no = " ";
                }
                if (!index.hasOwnProperty('budat')) {
                    index.budat = " ";
                }
                jsonArrrayData.push(index);
            }
            let columns: any = ['ebeln', 'aedat', 'lifnr', 'name1', 'xbnlr', 'bldat', 'vbeln_billing', 'erdat', 'grn_no', 'budat']
            let columnHeaders: any = ['PO No', 'PO Date', 'Vendor Code', 'Vendor Name', 'Delivery Note', 'Delivery Date', 'Billing No', 'Billing Date', 'GRN No', 'GRN Date']
            let jsonData: any = JSON.stringify(jsonArrrayData);
            this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Intransit list", columns, columnHeaders, 'Intransit');
        } else {
            this.commonService.responseMessages("", "No Data Available To Export", "warning")
        }
    }
    displayDetails(deliveryno, grnno) {
        if (grnno == "" || grnno == "null" || grnno==undefined) {
            this.commonService.saleType = 'Create';
            const path: any = "goodsreceipt/createGR";
            let ordertype="WREFDLV";
            this.router.navigate([path], { queryParams: { "orderType": ordertype, "dlvNumber": deliveryno, "action": "C", "frompage": "GR" } });
        }
        else {
            this.commonService.saleType = 'Create';
            const path: any = "invoicedetails/createInvoice";
            this.router.navigate([path], { queryParams: { "refNum": deliveryno, "action": "C" } });
        }
    }
}
