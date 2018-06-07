import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { ExcelService } from '../../services/excel.service';
import { MessagePropertiesService } from '../../services/message-properties.service';
import { EnvConfigurationService } from '../../services/env-configuration.service';
import {GoogleChartComponent} from '../google-chart/google-chart.component';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
var table;

@Component({
    selector: 'app-billing-report',
    templateUrl: './billing-report.component.html',
    styleUrls: ['./billing-report.component.css']
})
export class BillingReportComponent implements OnInit {

    filterBillingForm: FormGroup;
    bpId: string;
    orgId: string;
    billingListData: any;
    additionalDisAmt: any = 0;
    fixedDisAmt: any = 0;
    billingAmt: any = 0;
    igstAmt: any = 0;
    cgstAmt: any = 0;
    sgstAmt: any = 0;
    cessAmt: any = 0;
    netAmount: any = 0;
    cradditionalDisAmt: any = 0;
    crfixedDisAmt: any = 0;
    crbillingAmt: any = 0;
    crigstAmt: any = 0;
    crcgstAmt: any = 0;
    crsgstAmt: any = 0;
    crcessAmt: any = 0;
    crnetAmount: any = 0;
    graphBlock: boolean = true;
    public pie_ChartData = [
        ['Sales Group', 'Total Sales Group Amounts']
    ];
    public pie_ChartData1 = [
        ['Material Group', 'Total Material Group Amounts']
    ];

    public bar_ChartData = [
        ['Stockist Customers', 'Total Invoice Amounts', 'Total Fixed Discounts'],
    ];
    public pie_ChartOptions = {
        title: 'Sales Group activities',
        width: 600,
        height: 300
    };
    public pie_ChartOptions1 = {
        title: 'Material Group activities',
        width: 610,
        height: 300
    };
    public bar_ChartOptions = {
        title: ' ',
        bars: 'vertical',
        chartArea: { width: '65%' },
        colors: ['#FF9900', '#FFCC33'],
        hAxis: {
            title: 'Dealers',
            showTextEvery: 1,
            minValue: 0,
            textStyle: {
                bold: true,
                fontSize: 12,
                color: '#4d4d4d'
            },
            titleTextStyle: {
                bold: true,
                fontSize: 18,
                color: '#4d4d4d'
            }
        },
        vAxis: {
            title: ' ',
            viewWindowMode: 'explicit',
            viewWindow: {
                max: 30000,
                min: 0
            },
            textStyle: {
                fontSize: 14,
                bold: true,
                color: '#848484'
            },
            titleTextStyle: {
                fontSize: 14,
                bold: true,
                color: '#848484'
            }
        },
    };
    customerList: any;
    matList: any;
    columnHeadersList: any;
    billedSummary; any;
    columnHeadersBlock: any;
    materialSummary: any;
    customerMaterialSmry: any;
    dealersSummary: any;
    invoiceSumary: any;
    constructor(private http: Http, private formBuilder: FormBuilder, private environment: EnvConfigurationService,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private excelService: ExcelService) {
        this.app.isActive = true;
        this.filterBillingForm = formBuilder.group({
            'from_date': ['', Validators.required],
            'to_date': ['', Validators.required],
        });
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.billingListData = [];
        this.additionalDisAmt = 0;
        this.fixedDisAmt = 0;
        this.billingAmt = 0;
        this.igstAmt = 0;
        this.cgstAmt = 0;
        this.sgstAmt = 0;
        this.cessAmt = 0;
        this.netAmount = 0;
        this.crnetAmount = 0;
        this.crbillingAmt = 0;
        this.crigstAmt = 0;
        this.crsgstAmt = 0;
        this.crcgstAmt = 0;
        this.crfixedDisAmt = 0;
        this.cradditionalDisAmt = 0;
        this.crcessAmt = 0;
        this.customerList = [];
        this.matList = [];
        this.columnHeadersList =
            {
                'billedSummary': ['Invoice No.', 'Status', 'Sales Group', 'Doc Category', 'Invoice Date', 'Customer Name', 'City', 'Delivery No.', 'Delivery Date',
                    'Item No.', 'Material Group', 'Material', 'Description', 'QTY', 'UOM', 'Price', 'Gross Amount', 'Fix Sch', 'Sch val', 'Discount val',
                    'Discount amt', 'Net Amount', 'IGST', 'CGST', 'S/UGST', 'CESS', 'Total Amount',
                ],
                'bill_doc': ['Invoice No.', 'Customer Name', 'status', 'Doc Category', 'Invoice Date', 'city', 'Net Amount', 'IGST', 'CGST', 'S/UGST', 'CESS', 'Total Amount'],
                'material': ['Material', 'Material Description', 'QTY', 'UOM', 'Fixed Discount', 'Additional Discount',
                    'Net Amount', 'IGST', 'CGST', 'S/UGST', 'CESS', 'Total Amount'
                ],
                'sold_to_name': ['Customer Id', 'Customer Name', 'Fixed Discount', 'Additional Discount', 'Net Amount',
                    'IGST', 'CGST', 'S/UGST', 'CESS', 'Total Amount'
                ],
            }
        this.columnHeadersBlock = this.columnHeadersList.billedSummary;
        this.billedSummary = [];
        this.materialSummary = this.columnHeadersList.material;
        this.customerMaterialSmry = [];
        this.dealersSummary = [];
        this.invoiceSumary = [];
    }

    ngOnInit() {

        $('#fromDateFilt').datetimepicker({
            debug: true,
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
        /*$.fn.dataTable.ext.errMode = 'none';
        $("[id^=datatablediv-]").on( 'error.dt', function ( e, settings, techNote, message ) {
          console.log( 'An error has been reported by DataTables: ', message );
          } ) ;*/
       
        this.applyTable();

    }

    convertDateToSapStructure(date) {
        let dateArray = date.split("-");
        return dateArray[2].toString() + dateArray[1].toString() + dateArray[0].toString();
    }

    getBillingReport() {
        $('#loadingIcon').show();
        $("#black-overlay").show();
        let filterOption: any = $("#layoutVal").val();
        let repPayload = {};
        let frmDate = this.convertDateToSapStructure(this.filterBillingForm.value.from_date);
        let toDate = this.convertDateToSapStructure(this.filterBillingForm.value.to_date);
        repPayload["bp_id"] = this.bpId;
        repPayload["org_id"] = this.orgId;
        repPayload["from_date"] = frmDate;
        repPayload["to_date"] = toDate;


        let url = this.environment.getRequiredApi('get_billing_report') + "?";

        this.commonService.getData(url, 'POST', repPayload, localStorage.getItem("Billing"))
            .subscribe((response) => {
                $("#datatablediv-billedSummary").DataTable().destroy();
                this.billingListData = [];
                this.bar_ChartData = [['Stockist Customers', 'Total Invoice Amounts', 'Total Fixed Discounts'],];
                this.pie_ChartData = [['Sales Group', 'Total Sales Group Amounts'],];
                this.pie_ChartData1 = [['Material Group', 'Total Material Group Amounts'],];
                let objectNamesList: any = [];
                let salesGroupList: any = [];
                let materialGroupList: any = [];
                this.billingAmt = 0;
                this.igstAmt = 0;
                this.sgstAmt = 0;
                this.cgstAmt = 0;
                this.fixedDisAmt = 0;
                this.additionalDisAmt = 0;
                this.cessAmt = 0;
                this.netAmount = 0;
                this.crnetAmount = 0;
                this.crbillingAmt = 0;
                this.crigstAmt = 0;
                this.crsgstAmt = 0;
                this.crcgstAmt = 0;
                this.crfixedDisAmt = 0;
                this.cradditionalDisAmt = 0;
                this.crcessAmt = 0;
                if (response.status == '1') {
                    this.commonService.responseMessages("", response.message, "warning");
                } else {
                    if (response.data.hasOwnProperty('ex_bill_list')) {
                        this.billingListData = response.data.ex_bill_list;
                        let grossTotal: any = 0;
                        for (let element of this.billingListData) {
                            if (objectNamesList.indexOf(element.sold_to_name) == -1) {
                                objectNamesList.push(element.sold_to_name);
                            }
                            console.log(element.bill_doc);
                            for (let item of element.item) {
                                if (item.hasOwnProperty('mat_group2')) {
                                    if (materialGroupList.indexOf(item.mat_group2) == -1) {
                                        materialGroupList.push(item.mat_group2);
                                    }
                                } else {
                                    if (materialGroupList.indexOf('other') == -1) {
                                        let matGroup: any = 'other';
                                        materialGroupList.push(matGroup);
                                    }
                                }
                                if (item.hasOwnProperty('new_sales_group')) {
                                    if (salesGroupList.indexOf(item.new_sales_group) == -1) {
                                        salesGroupList.push(item.new_sales_group);
                                    }
                                } else {
                                    if (salesGroupList.indexOf('other') == -1) {
                                        let salesGroup: any = 'other';
                                        salesGroupList.push(salesGroup);
                                    }
                                }
                                item.qty = Math.round(item.qty);
                                item.fix_sch = Math.abs(item.fix_sch);
                                item.sch_val = Math.abs(item.sch_val);
                                item.dis_amt = Math.abs(item.dis_amt);
                                item.dis_val = Math.abs(item.dis_val);
                                if (element.doc_cat == 'Invoice') {
                                    this.fixedDisAmt = this.fixedDisAmt + parseFloat(item.sch_val);
                                    this.additionalDisAmt = this.additionalDisAmt + parseFloat(item.dis_amt);
                                    this.billingAmt = this.billingAmt + (parseFloat(item.total_amt));
                                    this.netAmount = this.netAmount + parseFloat(item.net_val);
                                    this.igstAmt = this.igstAmt + (parseFloat(item.igst_amt));
                                    this.cgstAmt = this.cgstAmt + (parseFloat(item.cgst_amt));
                                    this.sgstAmt = this.sgstAmt + (parseFloat(item.sgst_amt));
                                    this.cessAmt = this.cessAmt;
                                }
                                if (element.doc_cat == 'Credit Memo') {
                                    this.crfixedDisAmt = this.crfixedDisAmt + parseFloat(item.sch_val);
                                    this.cradditionalDisAmt = this.cradditionalDisAmt + parseFloat(item.dis_amt);
                                    this.crbillingAmt = this.crbillingAmt + (parseFloat(item.total_amt));
                                    this.crnetAmount = this.crnetAmount + parseFloat(item.net_val);
                                    this.crigstAmt = this.crigstAmt + (parseFloat(item.igst_amt));
                                    this.crcgstAmt = this.crcgstAmt + (parseFloat(item.cgst_amt));
                                    this.crsgstAmt = this.crsgstAmt + (parseFloat(item.sgst_amt));
                                    this.crcessAmt = this.crcessAmt;
                                }

                            }

                        }
                    }
                    let salesAmounts: any = 0;
                    let salesObj: any = [];
                    for (let so of salesGroupList) {
                        salesAmounts = 0;
                        salesObj = [];
                        salesObj.push(so);
                        for (let element of this.billingListData) {
                            for (let item of element.item) {
                                if (item.hasOwnProperty('new_sales_group')) {
                                    if (item.new_sales_group == so) {
                                        salesAmounts = salesAmounts + (parseFloat(item.net_val));
                                    }
                                } else {
                                    salesAmounts = salesAmounts + (parseFloat(item.net_val));
                                }
                            }
                        }
                        salesObj.push(salesAmounts);
                        this.pie_ChartData.push(salesObj);
                    }
                    let totalAmounts: any = 0;
                    let fixedAmounts: any = 0;
                    let objectData: any;
                    let disObj: any;
                    for (let index of objectNamesList) {
                        totalAmounts = 0;
                        fixedAmounts = 0;
                        objectData = [];
                        disObj = {};
                        objectData.push(index);
                        disObj.cust_name = index;
                        for (let element of this.billingListData) {
                            if (element.sold_to_name == index) {
                                for (let item of element.item) {
                                    totalAmounts = totalAmounts + (parseFloat(item.total_amt));
                                    fixedAmounts = fixedAmounts + parseFloat(item.sch_val);
                                }
                            }
                        }
                        objectData.push(totalAmounts);
                        objectData.push(fixedAmounts);
                        disObj.total_amt = totalAmounts;
                        this.bar_ChartData.push(objectData);
                        this.customerList.push(disObj);
                    }
                    console.log(this.bar_ChartData);
                    let matAmounts: any = 0;
                    let matData: any;
                    let dismatObj: any;
                    for (let index of materialGroupList) {
                        matAmounts = 0;
                        matData = [];
                        matData.push(index);
                        for (let element of this.billingListData) {
                            for (let item of element.item) {
                                if (item.hasOwnProperty('mat_group2')) {
                                    if (item.mat_group2 == index) {
                                        matAmounts = matAmounts + (parseFloat(item.total_amt));
                                    }
                                } else {
                                    matAmounts = matAmounts + (parseFloat(item.total_amt));
                                }
                            }
                        }
                        matData.push(matAmounts);
                        this.pie_ChartData1.push(matData);
                    }
                }
                $("#filter-block").hide();
                if (filterOption == 'billedSummary') {
                    this.applyDataTable('billingordertable-billedSummary', 'billedSummary');
                } else {
                    this.switchLayout(filterOption);
                }
                this.graphBlock = false;
                $('#loadingIcon').hide();
                $("#black-overlay").hide();

            }, err => {
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                console.log(err)

            });
    }
    applyTable() {
        setTimeout(() => {
            $('#loadingIcon').hide();
            $("#black-overlay").hide();
            var table = $("#datatablediv-billedSummary").DataTable({
                "order": [],
                "retrieve": true,
                "bPaginate": false,
                "bInfo": false,
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
                },
                    { type: 'currency', "targets": [15, 16, 20, 21, 22, 23, 24, 25, 26] }]

            });
            $("#datatablediv-material").DataTable({
                "order": [],
                "retrieve": true,
                "bPaginate": false,
                "bInfo": false,
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
                },
                    { type: 'currency', "targets": [4, 5, 6, 7, 8, 9, 10, 11] }
                ]

            });
            $("#datatablediv-sold_to_name").DataTable({
                "order": [],
                "retrieve": true,
                "bPaginate": false,
                "bInfo": false,
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
                },
                    { type: 'currency', "targets": [2, 3, 4, 5, 6, 7, 8, 9] }]

            });
            $("#billingordertable-bill_doc").DataTable({
                "order": [],
                "retrieve": true,
                "bPaginate": false,
                "bInfo": false,
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
                },
                    { type: 'currency', "targets": [6, 7, 8, 9, 10, 11] }]

            });
        }, 1000);
        setTimeout(() => {
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
            //$("#billing-order-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
        }, 1100);

        setTimeout(() => {
            var width = $("#mainContent").css("width");
            $(".outbound-footer").css("width", width);
            $(".outbound-footer").show();
        }, 50);

    }

    applyDataTable(id, tableId) {
        setTimeout(() => {
            $('#loadingIcon').hide();
            $("#black-overlay").hide();
            var targetArray = [];
            if (tableId == 'billedSummary') {
                targetArray = [15, 16, 20, 21, 22, 23, 24, 25, 26];
            }
            if (tableId == 'material') {
                targetArray = [4, 5, 6, 7, 8, 9, 10, 11];
            }
            if (tableId == 'sold_to_name') {
                targetArray = [2, 3, 4, 5, 6, 7, 8, 9];
            }
            if (tableId == 'bill_doc') {
                targetArray = [6, 7, 8, 9, 10, 11];
            }
            var table = $("#datatablediv-" + tableId).DataTable({
                "order": [],
                "retrieve": true,
                "bPaginate": false,
                "bInfo": false,
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
                },
                    { type: 'currency', "targets": targetArray }]

            });
        }, 1000);
        setTimeout(() => {
            $("#" + id).show();
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
            //$("#billing-order-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
        }, 1100);

        setTimeout(() => {
            var width = $("#mainContent").css("width");
            $(".outbound-footer").css("width", width);
            $(".outbound-footer").show();
        }, 50);


    }

    changeTodatePicker(id) {
        $(id).datetimepicker("hide");
        this.filterBillingForm.controls['from_date'].setValue($("#fromDateFilt").val());
        if ($("#toDateFilt").val() != "") {
            $("#toDateFilt").datetimepicker("destroy");
        }
        var fromDateFilt = new Date();
        if ($("#fromDateFilt").val().length != 0) {
            fromDateFilt = this.convertDate($("#fromDateFilt").val())
        }





        $('#toDateFilt').datetimepicker({

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

    removeStyles(id) {

        if (id == "#fromDateFilt" || id == "#toDateFilt") {
            this.filterBillingForm.controls['from_date'].setValue($("#fromDateFilt").val());
            this.filterBillingForm.controls['to_date'].setValue($("#toDateFilt").val());
        }
        $(id).datetimepicker("hide");

        //this.cancelBillingForm.controls['billingDate'].setValue($("#cancelBilling").val());
    }
    navigateToRepGallery() {
        const path: any = "rptsgallery";
        this.router.navigate([path]);
    }

    expandChildRows(itemId, billNum, icon, index) {
        if ($("#plus-" + index).is(":visible")) {
            $("#plus-" + index).hide();
            $("#minus-" + index).show();
            $("#" + itemId + index + "-" + billNum).show();

        } else {
            if ($("#minus-" + index).is(":visible")) {
                $("#plus-" + index).show();
                $("#minus-" + index).hide();
            }
            $("#" + itemId + index + "-" + billNum).hide();    // item0-9600500004     
        }

    }


    exportExcel() {
        let jsonArrrayData: any = [];
        let filterOption: any = $("#layoutVal").val();
        if (filterOption == 'billedSummary') {
            if (this.billingListData.length != 0) {
                for (let index of this.billingListData) {

                    for (let items of index.item) {
                        let listObj: any = {};
                        if (!index.hasOwnProperty('bill_doc')) {
                            listObj.bill_doc = "  "
                        } else {
                            listObj.bill_doc = index.bill_doc;
                        }
                        if (!index.hasOwnProperty('status')) {
                            listObj.status = "  "
                        } else {
                            listObj.status = index.status;
                        }
                        if (!index.hasOwnProperty('doc_cat')) {
                            listObj.doc_cat = ' ';
                        } else {
                            listObj.doc_cat = index.doc_cat;
                        }
                        if (!index.hasOwnProperty('bill_date')) {
                            listObj.bill_date = ' ';
                        } else {
                            listObj.bill_date = index.bill_date;
                        }
                        if (!index.hasOwnProperty('sold_to_name')) {
                            listObj.sold_to_name = " ";
                        } else {
                            listObj.sold_to_name = index.sold_to_name;
                        }
                        if (!index.hasOwnProperty('sold_to_city')) {
                            listObj.sold_to_city = " ";
                        } else {
                            listObj.sold_to_city = index.sold_to_city;
                        }

                        if (!index.hasOwnProperty('delv_no')) {
                            listObj.delv_no = " ";
                        } else {
                            listObj.delv_no = index.delv_no;
                        }
                        if (!index.hasOwnProperty('delv_date')) {
                            listObj.delv_date = " ";
                        } else {
                            listObj.delv_date = index.delv_date;
                        }
                        if (!items.hasOwnProperty('item_no')) {
                            listObj.item_no = " ";
                        } else {
                            listObj.item_no = items.item_no.toString();
                        }
                        if (!items.hasOwnProperty('new_sales_group')) {
                            listObj.new_sales_group = " "
                        } else {
                            listObj.new_sales_group = items.new_sales_group;
                        }
                        if (!items.hasOwnProperty('mat_group2')) {
                            listObj.mat_group2 = " "
                        } else {
                            listObj.mat_group2 = items.mat_group2;
                        }

                        if (!items.hasOwnProperty('material')) {
                            listObj.material = " ";
                        } else {
                            listObj.material = items.material;
                        }
                        if (!items.hasOwnProperty('mat_desc')) {
                            listObj.mat_desc = " ";
                        } else {
                            listObj.mat_desc = items.mat_desc;
                        }
                        if (!items.hasOwnProperty('qty')) {
                            listObj.qty = " ";
                        } else {
                            listObj.qty = items.qty;
                        }
                        if (!items.hasOwnProperty('net_val')) {
                            listObj.net_val = " ";
                        } else {
                            listObj.net_val = items.net_val;
                        }
                        if (!items.hasOwnProperty('rate')) {
                            listObj.rate = " ";
                        } else {
                            listObj.rate = items.rate;
                        }
                        if (!items.hasOwnProperty('price')) {
                            listObj.price = " ";
                        } else {
                            listObj.price = items.price;
                        }
                        if (!items.hasOwnProperty('fix_sch')) {
                            listObj.fix_sch = " ";
                        } else {
                            listObj.fix_sch = items.fix_sch;
                        }
                        if (!items.hasOwnProperty('sch_val')) {
                            listObj.sch_val = " ";
                        } else {
                            listObj.sch_val = items.sch_val;
                        }
                        if (!items.hasOwnProperty('dis_val')) {
                            listObj.dis_val = " ";
                        } else {
                            listObj.dis_val = items.dis_val;
                        }
                        if (!items.hasOwnProperty('dis_amt')) {
                            listObj.dis_amt = " ";
                        } else {
                            listObj.dis_amt = items.dis_amt;
                        }
                        if (!items.hasOwnProperty('total_amt')) {
                            listObj.total_amt = " ";
                        } else {
                            listObj.total_amt = items.total_amt;
                        }
                        if (!items.hasOwnProperty('igst_amt')) {
                            listObj.igst_amt = " ";
                        } else {
                            listObj.igst_amt = items.igst_amt;
                        }
                        if (!items.hasOwnProperty('cgst_amt')) {
                            listObj.cgst_amt = " ";
                        } else {
                            listObj.cgst_amt = items.cgst_amt;
                        }
                        if (!items.hasOwnProperty('sgst_amt')) {
                            listObj.sgst_amt = " ";
                        } else {
                            listObj.sgst_amt = items.sgst_amt;
                        }
                        if (!index.hasOwnProperty('sum_csamt')) {
                            listObj.sum_csamt = " ";
                        } else {
                            listObj.sum_csamt = index.sum_csamt;
                        }
                        if (!items.hasOwnProperty('total_amt')) {
                            listObj.total_amt = " ";
                        } else {
                            listObj.total_amt = items.total_amt;
                        }

                        jsonArrrayData.push(listObj);
                    }

                }
                let columns: any =
                    ['bill_doc', 'status', 'new_sales_group', 'doc_cat', 'bill_date', 'sold_to_name', 'sold_to_city', 'delv_no', 'delv_date',
                        'item_no', 'mat_group2', 'material', 'mat_desc', 'qty', 'uom', 'rate', 'price', 'fix_sch', 'sch_val', 'dis_val',
                        'dis_amt', 'net_val', 'igst_amt', 'cgst_amt', 'sgst_amt', 'total_amt',
                    ]
                let columnHeaders: any = ['Invoice No.', 'Status', 'Sales Group', 'Doc Category', 'Invoice Date', 'Customer Name', 'City', 'Delivery No.', 'Delivery Date',
                    'Item No.', 'Material Group', 'Material', 'Description', 'QTY', 'UOM', 'Price', 'Gross Amount', 'Fix Sch', 'Sch val', 'Discount val',
                    'Discount amt', 'Net Amount', 'IGST', 'CGST', 'S/UGST', 'Total Amount',
                ];
                let jsonData: any = JSON.stringify(jsonArrrayData);
                this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Billing Report", columns, columnHeaders, 'Billing_Report_Item_wise');

            } else {
                this.commonService.responseMessages("", "No Data Available To Export", "warning")
            }
        } else {
            if (filterOption == 'material') {
                if (this.customerMaterialSmry.length != 0) {
                    let columnHeaders: any = this.columnHeadersList.material;
                    let columns: any = ['cust_name', 'desc', 'totalQty', 'uom', 'sch_val', 'dis_amt', 'net_amt', 'igst_amt', 'cgst_amt',
                        'sgst_amt', 'cess_amt', 'total_amt',]
                    jsonArrrayData = this.customerMaterialSmry;
                    let jsonData: any = JSON.stringify(jsonArrrayData);
                    this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Material Report", columns, columnHeaders, 'Billing_Report_Material_wise');
                } else {
                    this.commonService.responseMessages("", "No Data Available To Export", "warning")
                }
            } else {
                if (filterOption == 'sold_to_name') {
                    if (this.dealersSummary.length != 0) {
                        let columnHeaders: any = this.columnHeadersList.sold_to_name;
                        let columns: any = ['cust_id', 'cust_name', 'sch_val', 'dis_amt', 'net_amt', 'igst_amt', 'cgst_amt',
                            'sgst_amt', 'cess_amt', 'total_amt',]
                        jsonArrrayData = this.dealersSummary;
                        let jsonData: any = JSON.stringify(jsonArrrayData);
                        this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Dealers Report", columns, columnHeaders, 'Billing_Report_Dealers_wise');
                    } else {
                        this.commonService.responseMessages("", "No Data Available To Export", "warning")
                    }
                } else {
                    if (filterOption == 'bill_doc') {
                        if (this.invoiceSumary.length != 0) {
                            let columnHeaders: any = this.columnHeadersList.bill_doc;
                            let columns: any = ['cust_name', 'sold_name', 'status', 'doc_cat', 'bill_date', 'city', 'net_amt', 'igst_amt', 'cgst_amt',
                                'sgst_amt', 'cess_amt', 'total_amt',]
                            jsonArrrayData = this.dealersSummary;
                            let jsonData: any = JSON.stringify(jsonArrrayData);
                            this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Dealers Report", columns, columnHeaders, 'Billing_Report_Invoice_Wise');
                        } else {
                            this.commonService.responseMessages("", "No Data Available To Export", "warning")
                        }

                    }
                }
            }
        }
    }
    showFilters() {
        $("#filter-block").slideToggle();
    }
    switchLayout(layOutValue) {
        $('#loadingIcon').show();
        $("#black-overlay").show();
        $(".showcolumns").hide();
        let id: any = "billingordertable-" + layOutValue;
        this.customerMaterialSmry = [];
        //$("#datatablediv-"+layOutValue).DataTable().destroy();
        if (layOutValue != 'billedSummary') {
            $("#datatablediv-" + layOutValue).DataTable().destroy();
            this.layoutDataSummary(this.billingListData, layOutValue);
        }
        setTimeout(() => { this.applyDataTable(id, layOutValue); }, 500)
    }
    layoutDataSummary(response, filterOption) {
        let layoutSelectList: any = [];
        this.customerMaterialSmry = [];
        this.dealersSummary = [];
        this.invoiceSumary = [];
        for (let list of response) {
            if (list.hasOwnProperty(filterOption)) {
                if (filterOption == 'sold_to_name') {
                    if (layoutSelectList.indexOf(list.sold_to_name) == -1) {
                        layoutSelectList.push(list.sold_to_name);
                    }
                } else {
                    if (filterOption == 'bill_doc') {
                        if (layoutSelectList.indexOf(list.bill_doc) == -1) {
                            layoutSelectList.push(list.bill_doc);
                        }
                    }
                }
            } else {
                for (let item of list.item) {
                    if (layoutSelectList.indexOf(item.material) == -1) {
                        layoutSelectList.push(item.material);
                    }
                }
            }
        }
        let totalAmounts: any = 0;
        let igstAmounts: any = 0;
        let cgstAmounts: any = 0;
        let sgstAmounts: any = 0;
        let cessAmounts: any = 0;
        let fixedAmounts: any = 0;
        let addDisAmounts: any = 0;
        let netValAmounts: any = 0;
        let totalQty: any = 0;
        let disObj: any;
        for (let index of layoutSelectList) {
            totalAmounts = 0;
            igstAmounts = 0;
            cgstAmounts = 0;
            sgstAmounts = 0;
            cessAmounts = 0;
            fixedAmounts = 0;
            addDisAmounts = 0;
            netValAmounts = 0;
            disObj = {};
            disObj.cust_name = index;
            for (let element of this.billingListData) {
                if (element.hasOwnProperty(filterOption)) {
                    if (filterOption == 'sold_to_name') {
                        if (element.sold_to_name == index) {
                            disObj.cust_id = element.sold_to_num;
                            for (let item of element.item) {
                                totalAmounts = totalAmounts + (parseFloat(item.total_amt));
                                igstAmounts = igstAmounts + parseFloat(item.igst_amt);
                                cgstAmounts = cgstAmounts + parseFloat(item.cgst_amt);
                                sgstAmounts = sgstAmounts + parseFloat(item.sgst_amt);
                                cessAmounts = cessAmounts;
                                fixedAmounts = fixedAmounts + parseFloat(item.sch_val);
                                addDisAmounts = addDisAmounts + parseFloat(item.dis_amt);
                                netValAmounts = netValAmounts + parseFloat(item.net_val);

                            }
                        }
                    } else {
                        if (filterOption == 'bill_doc') {
                            if (element.bill_doc == index) {
                                disObj.cust_id = element.sold_to_num;
                                disObj.delv_no = element.delv_no;
                                disObj.sold_name = element.sold_to_name;
                                disObj.status = element.status;
                                disObj.doc_cat = element.doc_cat;
                                disObj.bill_date = element.bill_date;
                                disObj.city = element.sold_to_city;
                                totalAmounts = totalAmounts + (parseFloat(element.total_amount));
                                igstAmounts = igstAmounts + (parseFloat(element.sum_iamt));
                                cgstAmounts = cgstAmounts + (parseFloat(element.sum_camt));
                                sgstAmounts = sgstAmounts + (parseFloat(element.sum_samt));
                                cessAmounts = cessAmounts + (parseFloat(element.sum_csamt));
                                for (let item of element.item) {
                                    disObj.sales_group = item.sales_group;
                                    disObj.mat_group = item.mat_group2;
                                    fixedAmounts = fixedAmounts + parseFloat(item.sch_val);
                                    addDisAmounts = addDisAmounts + parseFloat(item.dis_amt);
                                    netValAmounts = netValAmounts + parseFloat(item.net_val);

                                }
                            }
                        }
                    }
                } else {
                    for (let item of element.item) {
                        if (item.hasOwnProperty(filterOption)) {
                            if (item.material == index) {
                                totalAmounts = totalAmounts + (parseFloat(item.total_amt));
                                igstAmounts = igstAmounts + parseFloat(item.igst_amt);
                                cgstAmounts = cgstAmounts + parseFloat(item.cgst_amt);
                                sgstAmounts = sgstAmounts + parseFloat(item.sgst_amt);
                                cessAmounts = cessAmounts;
                                disObj.desc = item.mat_desc;
                                disObj.uom = item.uom;
                                totalQty = Math.round(totalQty + parseFloat(item.qty));
                                fixedAmounts = fixedAmounts + parseFloat(item.sch_val);
                                addDisAmounts = addDisAmounts + parseFloat(item.dis_amt);
                                netValAmounts = netValAmounts + parseFloat(item.net_val);
                            }
                        }
                    }

                }
            }
            disObj.total_amt = totalAmounts;
            disObj.totalQty = totalQty;
            disObj.net_amt = netValAmounts;
            disObj.sch_val = fixedAmounts;
            disObj.dis_amt = addDisAmounts;
            disObj.igst_amt = igstAmounts;
            disObj.cgst_amt = cgstAmounts;
            disObj.sgst_amt = sgstAmounts;
            disObj.cess_amt = cessAmounts;
            this.customerMaterialSmry.push(disObj);
        }
        this.dealersSummary = this.customerMaterialSmry;
        this.invoiceSumary = this.customerMaterialSmry;
        console.log(this.customerMaterialSmry);
    }
    showGraphs() {
        let filterOption: any = $("#layoutVal").val();
        if ($("#graph-block").is(':visible')) {
            this.graphBlock = false;
            window.scrollTo(0, 0);
        } else {
            this.graphBlock = true;
            setTimeout(() => {
                let height: any = $(document).height() - 200;
                $("html, body").animate({ scrollTop: height }, 1000);
            }, 500);

        }
    }
    displayBillingDetails(selectedBillId, selectedDelNo) {
        this.commonService.saleType = 'Display';
        const path: any = "billing/editbillingdetails";
        this.router.navigate([path], { queryParams: { "billId": selectedBillId, "delvNo": selectedDelNo, "action": "DIS" } });

    }
}
