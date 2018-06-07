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
    selector: 'app-sales-person-report',
    templateUrl: './sales-person-report.component.html',
    styleUrls: ['./sales-person-report.component.css']
})
export class SalesPersonReportComponent implements OnInit {
    public accessObjId: string = "9c4425d2-5b3c-11e8-9c2d-fa7ae01bbebc";
    public mctadetailsForm: FormGroup;
    public bpId: string;
    public orgId: string;
    public newmctadetailsList: any = [];
    public mctadetailsList: any = [];
    material: any;
    ajaxDropdown = false;
    valueType: any;
    qtyType: any;

    public actionFlag: any;
    customerNames: any;
    public customertypeList: any;
    public emptyFlag: boolean = false;
    public cdListLength: any;
    public mctadetailslength: any;
    salespersonList: any;
    incomingqty: any;
    incomingvalue: any;
    salesqty: any;
    salesvalue; any
    openqty: any;
    openvalue: any;
    customerMaterialSmry: any;
    dealersSummary: any;
    tableView: any;
    constructor(private http: Http, private formBuilder: FormBuilder, private environment: EnvConfigurationService,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private excelService: ExcelService) {
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        // this.accessObjId = localStorage.getItem("Sales Person")
        this.accessObjId = "9c4425d2-5b3c-11e8-9c2d-fa7ae01bbebc";

        this.app.isActive = true;
        this.mctadetailsForm = new FormBuilder().group(
            {

                'frmDate': ['', Validators.required],
                'toDate': ['', Validators.required]
            }
        );
        this.valueType = true;
        this.qtyType = false;
        this.actionFlag = true;
        this.mctadetailsList = [];
        this.customerNames = [];
        this.cdListLength = 0;
        this.mctadetailslength = 0;
        this.salespersonList = [];
        this.incomingqty = 0;
        this.incomingvalue = 0;
        this.salesqty = 0;
        this.salesvalue = 0;
        this.openqty = 0;
        this.openvalue = 0;
        this.tableView = "sales_group_item_table";
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

        this.getCustomertypesList();
        this.getsalespersonlist();
    }
    getsalespersonlist() {
        let url: any = this.environment.getRequiredApi("get_sales_group_persons") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&";
        this.commonService.getData(url, "GET", "", this.accessObjId).subscribe(response => {
            if (response.status == 0) {
                this.salespersonList = response["data"].sales_persons;
            }
        });
    }
    getCustomertypesList() {
        let url = this.environment.getRequiredApi('header_dropdown') + "?group=CUSTTYPS&";
        this.commonService.getData(url, "GET", '', "")
            .subscribe((response) => {
                console.log(response);
                this.customertypeList = response.data.configValues;
                this.emptyFlag = false;
            });
    }
    getmctaDetails() {
        $("#sales_group_item_table").show();
        $("#sales_group_table").hide();
        $("#material_code_table").hide();
        $("#dealer_name_table").hide();
        this.tableView = "sales_group_item_table";
        $('#layoutVal').val('sales_group_item');
        $("." + this.tableView).DataTable().clear();
        this.applyDataTable();
        this.incomingqty = 0;
        this.incomingvalue = 0;
        this.salesqty = 0;
        this.salesvalue = 0;
        this.openqty = 0;
        this.openvalue = 0;
        let salesgroup = $("#sales_group_type").val();
        if (salesgroup == "" || salesgroup == undefined) {
            this.commonService.responseMessages("", "Please select Sales Group", "warning");
            return false;
        }
        $('#loadingIcon').show();
        $("#black-overlay").show();
        let fromDate, toDate;
        let custArray = [];
        let custGrpArray = [];
        let matArray = [];
        let sgroupArray = [];
        let splittedFromDate = $("#frmDate").val().split("-");
        fromDate = splittedFromDate[2] + splittedFromDate[1] + splittedFromDate[0];
        let splittedToDate = $("#toDate").val().split("-");
        toDate = splittedToDate[2] + splittedToDate[1] + splittedToDate[0];
        //        let cust_code = $("#modal-searchInput").val();
        //        let cust_name = $("#modal-name").val();
        //        if (cust_name.length != 0 && cust_code.length != 0) {
        //            custArray[0] = cust_code;
        //        }
        let url = "";
        let sales_group_type = $("#sales_group_type").val();
        if (sales_group_type.length != 0) {
            if (sales_group_type == "all") {
                this.salespersonList.forEach((items) => {
                    if (items.isGroupAdmin != true || items.sptype == 'FS') {
                        sgroupArray.push(items.fscode);
                    }
                });
            }
            else {
                sgroupArray[0] = sales_group_type;
            }
        }
        //        let mat_nr = $("#material-code").val();
        //        if (mat_nr.length != 0) {
        //            matArray[0] = mat_nr;
        //        }
        url = this.environment.getRequiredApi('mcta_salesgroup_report') + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&from_date=" + fromDate + "&to_date=" + toDate + "&sgroups=" + sgroupArray + "&custs=" + custArray + "&matnrs=" + matArray + "&";

        this.commonService.getData(url, 'GET', "", this.accessObjId)
            .subscribe((response) => {
                console.log(response);
                if (response.status == '1') {
                    this.mctadetailsList = [];
                    this.commonService.responseMessages('', response.message, 'warning');
                } else {
                    let data = response.data.ex_return;
                    $("#filter-block").hide();
                    if (response.data.hasOwnProperty("ex_return")) {
                        for (let index of data) {
                            if (index.type == "E") {
                                this.mctadetailsList = [];
                                this.mctadetailslength = 0;
                                $("#filter-block").show();
                                this.commonService.responseMessages('', index.message, 'warning');
                            }
                        }
                    }
                    this.mctadetailsList = response.data.ex_analysis;
                    this.newmctadetailsList = response.data.ex_analysis;
                    if (response.data.hasOwnProperty("ex_analysis")) {
                        this.mctadetailslength = Object.keys(this.mctadetailsList).length;
                    }
                    if (this.mctadetailslength > 0) {
                        for (let gstr1 of this.mctadetailsList) {
                            this.incomingqty = this.incomingqty + parseFloat(gstr1.incoming_qty);
                            this.incomingvalue = this.incomingvalue + parseFloat(gstr1.incoming_price);
                            this.salesqty = this.salesqty + parseFloat(gstr1.sales_qty);
                            this.salesvalue = this.salesvalue + parseFloat(gstr1.sales_price);
                            this.openqty = this.openqty + parseFloat(gstr1.open_qty);
                            this.openvalue = this.openvalue + parseFloat(gstr1.open_price);
                        }
                    }
                }
                $("." + this.tableView).DataTable().destroy();
                this.applyDataTable();
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
            }, err => {
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                console.log(err)
            });


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
        this.mctadetailsForm.controls['frmDate'].setValue($("#frmDate").val());
        this.mctadetailsForm.controls['toDate'].setValue($("#toDate").val());
    }
    public convertDate(date) {
        let dateArry = date.split("-");
        return new Date(dateArry[1], dateArry[0] - 1);
    }
    removeStyles() {
        this.mctadetailsForm.controls['frmDate'].setValue($("#frmDate").val());
        this.mctadetailsForm.controls['toDate'].setValue($("#toDate").val());
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
        if (this.newmctadetailsList.length != 0) {
            let layoutVal = $('#layoutVal').val();
            if (layoutVal == "dealer_name") {
                for (let index of this.newmctadetailsList) {
                    if (!index.hasOwnProperty('sales_group')) {
                        index.sales_group = "  "
                    }
                    if (!index.hasOwnProperty('sales_group_desc')) {
                        index.sales_group_desc = "  "
                    }
                    if (!index.hasOwnProperty('plant')) {
                        index.plant = "  "
                    }
                    if (!index.hasOwnProperty('plant_name')) {
                        index.plant_name = "  "
                    }
                    if (!index.hasOwnProperty('dealer_code')) {
                        index.dealer_code = "  "
                    }
                    if (!index.hasOwnProperty('dealer_name')) {
                        index.dealer_name = "  "
                    }
                    if (!index.hasOwnProperty('incoming_qty')) {
                        index.incoming_qty = " ";
                    }
                    if (!index.hasOwnProperty('incoming_price')) {
                        index.incoming_price = " ";
                    }
                    if (!index.hasOwnProperty('open_qty')) {
                        index.open_qty = " ";
                    }
                    if (!index.hasOwnProperty('open_price')) {
                        index.open_price = " ";
                    }
                    if (!index.hasOwnProperty('sales_qty')) {
                        index.sales_qty = " ";
                    }
                    if (!index.hasOwnProperty('sales_price')) {
                        index.sales_price = " ";
                    }
                    jsonArrrayData.push(index);
                }
                let columns: any = ['sales_group', 'sales_group_desc', 'plant', 'plant_name', 'dealer_code', 'dealer_name', 'incoming_qty', 'incoming_price', 'sales_qty', 'sales_price', 'open_qty', 'open_price']
                let columnHeaders: any = ['Sales Group', 'Sales Group Name', 'Plant Code', 'Plant Name', 'Customer ID', 'Customer Name', 'Incoming Qty', 'Incoming Value', 'Sales Qty', 'Sales Value', 'Open Qty', 'Open Value']
                let jsonData: any = JSON.stringify(jsonArrrayData);
                this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Sales Group Dealer wise Report", columns, columnHeaders, 'Sales Group Dealer wise Report');
            }
            if (layoutVal == "material_code") {
                for (let index of this.newmctadetailsList) {

                    if (!index.hasOwnProperty('material_code')) {
                        index.material_code = ' ';
                    }
                    if (!index.hasOwnProperty('material_name')) {
                        index.material_name = ' ';
                    }
                    if (!index.hasOwnProperty('incoming_qty')) {
                        index.incoming_qty = " ";
                    }
                    if (!index.hasOwnProperty('incoming_price')) {
                        index.incoming_price = " ";
                    }
                    if (!index.hasOwnProperty('open_qty')) {
                        index.open_qty = " ";
                    }
                    if (!index.hasOwnProperty('open_price')) {
                        index.open_price = " ";
                    }
                    if (!index.hasOwnProperty('sales_qty')) {
                        index.sales_qty = " ";
                    }
                    if (!index.hasOwnProperty('sales_price')) {
                        index.sales_price = " ";
                    }
                    jsonArrrayData.push(index);
                }
                let columns: any = ['material_code', 'material_name', 'incoming_qty', 'incoming_price', 'sales_qty', 'sales_price', 'open_qty', 'open_price']
                let columnHeaders: any = ['Material Code', 'Material Name', 'Incoming Qty', 'Incoming Value', 'Sales Qty', 'Sales Value', 'Open Qty', 'Open Value']
                let jsonData: any = JSON.stringify(jsonArrrayData);
                this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Material wise Report", columns, columnHeaders, 'Material wise Report');
            }
            if (layoutVal == "sales_group") {
                for (let index of this.newmctadetailsList) {
                    if (!index.hasOwnProperty('sales_group')) {
                        index.sales_group = "  "
                    }
                    if (!index.hasOwnProperty('sales_group_desc')) {
                        index.sales_group_desc = "  "
                    }
                    if (!index.hasOwnProperty('plant')) {
                        index.plant = "  "
                    }
                    if (!index.hasOwnProperty('plant_name')) {
                        index.plant_name = "  "
                    }
                    if (!index.hasOwnProperty('incoming_qty')) {
                        index.incoming_qty = " ";
                    }
                    if (!index.hasOwnProperty('incoming_price')) {
                        index.incoming_price = " ";
                    }
                    if (!index.hasOwnProperty('open_qty')) {
                        index.open_qty = " ";
                    }
                    if (!index.hasOwnProperty('open_price')) {
                        index.open_price = " ";
                    }
                    if (!index.hasOwnProperty('sales_qty')) {
                        index.sales_qty = " ";
                    }
                    if (!index.hasOwnProperty('sales_price')) {
                        index.sales_price = " ";
                    }
                    jsonArrrayData.push(index);
                }
                let columns: any = ['sales_group', 'sales_group_desc', 'plant', 'plant_name', 'incoming_qty', 'incoming_price', 'sales_qty', 'sales_price', 'open_qty', 'open_price']
                let columnHeaders: any = ['Sales Group', 'Sales Group Name', 'Plant Code', 'Plant Name', 'Incoming Qty', 'Incoming Value', 'Sales Qty', 'Sales Value', 'Open Qty', 'Open Value']
                let jsonData: any = JSON.stringify(jsonArrrayData);
                this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Sales Group wise Report", columns, columnHeaders, 'Sales Group wise Report');
            }
            if (layoutVal == "sales_group_item") {
                for (let index of this.newmctadetailsList) {
                    if (!index.hasOwnProperty('sales_group')) {
                        index.sales_group = "  "
                    }
                    if (!index.hasOwnProperty('sales_group_desc')) {
                        index.sales_group_desc = "  "
                    }
                    if (!index.hasOwnProperty('plant')) {
                        index.plant = "  "
                    }
                    if (!index.hasOwnProperty('plant_name')) {
                        index.plant_name = "  "
                    }
                    if (!index.hasOwnProperty('dealer_code')) {
                        index.dealer_code = "  "
                    }
                    if (!index.hasOwnProperty('dealer_name')) {
                        index.dealer_name = "  "
                    }
                    if (!index.hasOwnProperty('material_code')) {
                        index.material_code = ' ';
                    }
                    if (!index.hasOwnProperty('material_name')) {
                        index.material_name = ' ';
                    }
                    if (!index.hasOwnProperty('incoming_qty')) {
                        index.incoming_qty = " ";
                    }
                    if (!index.hasOwnProperty('incoming_price')) {
                        index.incoming_price = " ";
                    }
                    if (!index.hasOwnProperty('open_qty')) {
                        index.open_qty = " ";
                    }
                    if (!index.hasOwnProperty('open_price')) {
                        index.open_price = " ";
                    }
                    if (!index.hasOwnProperty('sales_qty')) {
                        index.sales_qty = " ";
                    }
                    if (!index.hasOwnProperty('sales_price')) {
                        index.sales_price = " ";
                    }
                    jsonArrrayData.push(index);
                }
                let columns: any = ['sales_group', 'sales_group_desc', 'plant', 'plant_name', 'dealer_code', 'dealer_name', 'material_code', 'material_name', 'incoming_qty', 'incoming_price', 'sales_qty', 'sales_price', 'open_qty', 'open_price']
                let columnHeaders: any = ['Sales Group', 'Sales Group Name', 'Plant Code', 'Plant Name', 'Customer ID', 'Customer Name', 'Material Code', 'Material Name', 'Incoming Qty', 'Incoming Value', 'Sales Qty', 'Sales Value', 'Open Qty', 'Open Value']
                let jsonData: any = JSON.stringify(jsonArrrayData);
                this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Sales Person Report", columns, columnHeaders, 'Sales Person Report');
            }
        }
        else {
            this.commonService.responseMessages("", "No Data Available To Export", "warning")
        }
    }

    extractData(id, spinnerId, ajaxDropdown) {
        let term: any = $("#" + id).val();
        if (term.length == 3) {
            $("#" + spinnerId).show();
            let url: any = this.environment.getRequiredApi("find_customers") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&cust_name=" + term + "&";
            this.commonService.getData(url, "GET", "", this.accessObjId).subscribe(response => {
                if (response.status == 0) {
                    this.customerNames = response["data"].ex_cust_list;
                    this.cdListLength = Object.keys(this.customerNames).length;
                    $("#" + spinnerId).hide();
                    $("#" + ajaxDropdown).show();
                } else {
                    $("#" + spinnerId).hide();
                    $("#" + ajaxDropdown).show();
                }

            });
        } else {
            if (term == "") {
                this.customerNames = [];
                $("#" + spinnerId).hide();
            } else {
                var searchText = term;
                searchText = searchText.toUpperCase();
                $("#" + ajaxDropdown).find('ul > li').each(function() {
                    var currentLiText = $(this).text();
                    currentLiText = currentLiText.toUpperCase();
                    var showCurrentLi = currentLiText.indexOf(searchText) !== -1;
                    $(this).toggle(showCurrentLi);
                });
            }
        }
    }
    selectedItem(response, modalBlock, textInput, hiddenInput) {
        $("#" + textInput).val(response.cust_name);
        $("#" + hiddenInput).val(response.cust_id);
        $("#" + modalBlock).hide();
    }

    materialextractData(id, spinnerId, ajaxDropdown) {
        let term: any = $("#" + id).val();
        if (term.length == 2) {
            $("#" + spinnerId).show();
            let url: any = this.environment.getRequiredApi("find_matnr_num") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&material=" + term + "&";
            this.commonService.getData(url, "GET", "", this.accessObjId).subscribe(response => {
                if (response.status == 0) {
                    this.material = response["data"].ex_mat_list;
                    $("#" + spinnerId).hide();
                    $("#" + ajaxDropdown).show();
                    this.ajaxDropdown = true;
                } else {
                    $("#" + spinnerId).hide(); $("#" + ajaxDropdown).show();
                    this.ajaxDropdown = false;
                }

            });
        } else {
            if (term == "") {
                this.material = [];
                $("#" + spinnerId).hide();
            } else {
                var searchText = term;
                searchText = searchText.toUpperCase();
                $("#" + ajaxDropdown).find('ul > li').each(function() {
                    var currentLiText = $(this).text();
                    currentLiText = currentLiText.toUpperCase();
                    var showCurrentLi = currentLiText.indexOf(searchText) !== -1;
                    $(this).toggle(showCurrentLi);
                });
            }
        }
    }
    materialselectedItem(response, modalBlock, textInput, hiddenInput) {
        $("#" + textInput).val(response.mat_num);
        $("#" + hiddenInput).val(response.mat_num);
        $("#" + modalBlock).hide();

    }

    navigateToRepGallery() {
        const path: any = "rptsgallery";
        this.router.navigate([path]);
    }
    showFilters() {
        $("#filter-block").slideToggle();
    }

    switchLayout(layOutValue) {
        if (layOutValue == "dealer_name") {
            $("#sales_group_item_table").hide();
            $("#sales_group_table").hide();
            $("#material_code_table").hide();
            $("#dealer_name_table").show();
            this.tableView = "dealer_name_table";
        }
        if (layOutValue == "sales_group") {
            $("#sales_group_item_table").hide();
            $("#sales_group_table").show();
            $("#material_code_table").hide();
            $("#dealer_name_table").hide();
            this.tableView = "sales_group_table";
        }
        if (layOutValue == "material_code") {
            $("#sales_group_item_table").hide();
            $("#sales_group_table").hide();
            $("#material_code_table").show();
            $("#dealer_name_table").hide();
            this.tableView = "material_code_table";
        }
        if (layOutValue == "sales_group_item") {
            $("#sales_group_item_table").show();
            $("#sales_group_table").hide();
            $("#material_code_table").hide();
            $("#dealer_name_table").hide();
            this.tableView = "sales_group_item_table";
        }
        this.customerMaterialSmry = [];
        if (layOutValue != "sales_group_item") {
            this.layoutDataSummary(this.mctadetailsList, layOutValue);
            setTimeout(() => { this.applyDataTable(); }, 500)
        }
        else {
            this.newmctadetailsList = this.mctadetailsList;
        }
    }
    layoutDataSummary(response, filterOption) {
        let layoutSelectList: any = [];
        this.customerMaterialSmry = [];
        this.dealersSummary = [];
        // this.invoiceSumary = [];
        for (let list of response) {
            if (list.hasOwnProperty(filterOption)) {
                if (filterOption == 'dealer_name') {
                    if (layoutSelectList.indexOf(list.dealer_name) == -1) {
                        layoutSelectList.push(list.dealer_name);
                    }
                } else {
                    if (filterOption == 'sales_group') {
                        if (layoutSelectList.indexOf(list.sales_group) == -1) {
                            layoutSelectList.push(list.sales_group);
                        }
                    }
                    if (filterOption == 'material_code') {
                        if (layoutSelectList.indexOf(list.material_code) == -1) {
                            layoutSelectList.push(list.material_code);
                        }
                    }
                }
            }
        }
        let total_incomingqty: any = 0;
        let total_incomingvalue: any = 0;
        let total_salesqty: any = 0;
        let total_salesvalue: any = 0;
        let total_openqty: any = 0;
        let total_openvalue: any = 0;
        let disObj: any;
        for (let index of layoutSelectList) {
            total_incomingqty = 0;
            total_incomingvalue = 0;
            total_salesqty = 0;
            total_openqty = 0;
            total_openvalue = 0;
            total_salesvalue = 0;
            disObj = {};
            disObj.dealer_name = index;
            for (let element of this.mctadetailsList) {
                if (element.hasOwnProperty(filterOption)) {
                    if (filterOption == 'dealer_name') {
                        if (element.dealer_name == index) {
                            disObj.sales_group = element.sales_group;
                            disObj.sales_group_desc = element.sales_group_desc;
                            disObj.plant = element.plant;
                            disObj.plant_name = element.plant_name;
                            disObj.dealer_code = element.dealer_code;
                            disObj.dealer_name = element.dealer_name;
                            total_incomingqty = total_incomingqty + (parseFloat(element.incoming_qty));
                            total_incomingvalue = total_incomingvalue + (parseFloat(element.incoming_price));
                            total_salesqty = total_salesqty + (parseFloat(element.sales_qty));
                            total_salesvalue = total_salesvalue + (parseFloat(element.sales_price));
                            total_openqty = total_openqty + (parseFloat(element.open_qty));
                            total_openvalue = total_openvalue + (parseFloat(element.open_price));
                        }
                    } else {
                        if (filterOption == 'sales_group') {
                            if (element.sales_group == index) {
                                disObj.sales_group = element.sales_group;
                                disObj.sales_group_desc = element.sales_group_desc;
                                disObj.plant = element.plant;
                                disObj.plant_name = element.plant_name;
                                total_incomingqty = total_incomingqty + (parseFloat(element.incoming_qty));
                                total_incomingvalue = total_incomingvalue + (parseFloat(element.incoming_price));
                                total_salesqty = total_salesqty + (parseFloat(element.sales_qty));
                                total_salesvalue = total_salesvalue + (parseFloat(element.sales_price));
                                total_openqty = total_openqty + (parseFloat(element.open_qty));
                                total_openvalue = total_openvalue + (parseFloat(element.open_price));

                            }
                        }
                        if (filterOption == 'material_code') {
                            if (element.material_code == index) {
                                disObj.material_code = element.material_code;
                                disObj.material_name = element.material_name;
                                total_incomingqty = total_incomingqty + (parseFloat(element.incoming_qty));
                                total_incomingvalue = total_incomingvalue + (parseFloat(element.incoming_price));
                                total_salesqty = total_salesqty + (parseFloat(element.sales_qty));
                                total_salesvalue = total_salesvalue + (parseFloat(element.sales_price));
                                total_openqty = total_openqty + (parseFloat(element.open_qty));
                                total_openvalue = total_openvalue + (parseFloat(element.open_price));
                            }
                        }
                    }
                }
            }
            disObj.incoming_qty = total_incomingqty;
            disObj.incoming_price = total_incomingvalue;
            disObj.sales_qty = total_salesqty;
            disObj.sales_price = total_salesvalue;
            disObj.open_qty = total_openqty;
            disObj.open_price = total_openvalue;
            this.customerMaterialSmry.push(disObj);
        }
        this.newmctadetailsList = this.customerMaterialSmry;

        console.log(this.newmctadetailsList);
    }
}
