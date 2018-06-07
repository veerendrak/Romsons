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
    selector: 'app-customer-ledger-report',
    templateUrl: './customer-ledger-report.component.html',
    styleUrls: ['./customer-ledger-report.component.css']
})
export class CustomerLedgerReportComponent implements OnInit {
    public poreportdetailsForm: FormGroup;
    public bpId: string;
    public orgId: string;
    public accessObjId: string;
    public customerledgerdetailsList: any = [];
    public material: any;
    public ajaxDropdown = false;
    public screenType: any;
    public actionFlag: any;
    public customertypeList: any;
    public emptyFlag: boolean = false;
    public cdListLength: any;
    public gstrdetailslength: any;
    public NEWporeportdetailsList: any = [];
    customerNames: any;
    cust_id: any;
    tot_debit_amount: any;
    tot_credit_amount: any;
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
                'custName': ['', Validators.required]
            }
        );
        this.actionFlag = true;
        this.customerledgerdetailsList = [];
        this.cdListLength = 0;
        this.gstrdetailslength = 0;
        this.customerNames = [];
        this.cdListLength = 0;
        this.tot_debit_amount = 0;
        this.tot_credit_amount = 0;
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
        this.customerledgerdetailsList = [];
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
    getpoReportDetails() {
        this.tot_debit_amount = 0;
        this.tot_credit_amount = 0;
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
        this.cust_id = $("#filterCustomerId").val();
        let url = this.environment.getRequiredApi('get_customer_ledger') + "?bp_id=" + this.bpId + "&org_id=" + this.orgId + "&from_date=" + fromDate + "&to_date=" + toDate + "&cust_id=" + this.cust_id + "&";
        this.commonService.getData(url, 'GET', '', this.accessObjId)
            .subscribe((response) => {
                console.log(response);
                if (response.status == '1') {
                    this.customerledgerdetailsList = [];
                    this.commonService.responseMessages('', response.message, 'warning');
                } else {

                    //  this.gstrdetailslength = Object.keys(this.gstrdetailsList).length;
                    var InvoiceTable = [];
                    var totqty = 0;
                    let data = response.data.ex_return;
                    if (response.data.hasOwnProperty("ex_return")) {
                        for (let index of data) {
                            if (index.type == "E") {
                                this.customerledgerdetailsList = [];
                                this.cdListLength = 0;
                                this.commonService.responseMessages('', index.message, 'warning');
                                $('#loadingIcon').hide();
                                $("#black-overlay").hide();
                                return false;
                            }
                        }
                    }
                    this.customerledgerdetailsList = response.data;
                    this.cdListLength = Object.keys(this.customerledgerdetailsList).length;
                     if (response.data.hasOwnProperty("ex_ledger_data")) {
                        for (let lst of this.customerledgerdetailsList.ex_ledger_data) {
                            this.tot_debit_amount = this.tot_debit_amount + parseFloat(lst.debit_amount);
                            this.tot_credit_amount = this.tot_credit_amount + parseFloat(lst.credit_amount);
                        }
                    }
                }
                $("#purchase-order-table").DataTable().destroy();
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
            $("#purchase-order-table").DataTable({
                retrieve: true,
                paging: false,
                "bFilter": false,
                "info": false,
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
            // $("#purchase-order-table").css("display", "table !important")
        }, 500);

        setTimeout(() => {
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
            //$("#cust-info-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
        }, 1100);
    }
    exportExcel() {
        let jsonArrrayData: any = [];
        let count = 0;
        if (this.customerledgerdetailsList.length != 0) {
            //        let listObj: any = {};
            //        listObj.ex_opening_bal = this.customerledgerdetailsList.ex_opening_bal.amount;
            //        jsonArrrayData.push(listObj);
            for (let items of this.customerledgerdetailsList.ex_ledger_data) {
                let listObj: any = {};
                if (!items.hasOwnProperty('doc_num')) {
                    listObj.doc_num = " ";
                }
                else {
                    listObj.doc_num = items.doc_num;
                }
                if (!items.hasOwnProperty('doc_text')) {
                    listObj.doc_text = " ";
                }
                else {
                    listObj.doc_text = items.doc_text;
                }

                if (!items.hasOwnProperty('debit_amount')) {
                    listObj.debit_amount = " ";
                }
                else {
                    listObj.debit_amount = items.debit_amount;
                }

                if (!items.hasOwnProperty('credit_amount')) {
                    listObj.credit_amount = " ";
                }
                else {
                    listObj.credit_amount = items.credit_amount;
                }
                jsonArrrayData.push(listObj);
            }
            count++;

            let columns: any = ['doc_num', 'doc_text', 'debit_amount', 'credit_amount']
            let columnHeaders: any = ['Document Number', 'Document Text', 'Debit Amount', 'Credit amount']
            let jsonData: any = JSON.stringify(jsonArrrayData);
            this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Customer Ledger List", columns, columnHeaders, 'Customer Ledger');

        } else {
            this.commonService.responseMessages("", "No Data Available To Export", "warning")
        }
    }
    navigateToRepGallery() {
        const path: any = "rptsgallery";
        this.router.navigate([path]);
    }
}
