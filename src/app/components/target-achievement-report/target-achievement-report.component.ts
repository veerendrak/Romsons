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
    selector: 'app-target-achievement-report',
    templateUrl: './target-achievement-report.component.html',
    styleUrls: ['./target-achievement-report.component.css']
})
export class TargetAchievementReportComponent implements OnInit {
    public accessObjId: string = "9c4425d2-5b3c-11e8-9c2d-fa7ae01bbebc";
    public mctadetailsForm: FormGroup;
    public bpId: string;
    public orgId: string;
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
    public targetdetailslength: any;
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
        this.targetdetailslength = 0;
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
            format: 'MM-YYYY',
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
        fromDate = splittedFromDate[1] + splittedFromDate[0];
        let splittedToDate = $("#toDate").val().split("-");
        toDate = splittedToDate[1] + splittedToDate[0];
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
        let gstrPayload = {};
        let target_type = $("#target_type").val();
        if (target_type == "BS") {
            gstrPayload["im_bulk_sales"] = "X";
            gstrPayload["im_product_wise"] = "";
            gstrPayload["im_material_spl"] = "";
            gstrPayload["im_value_based"] = "";
        }
        if (target_type == "PW") {
            gstrPayload["im_bulk_sales"] = "";
            gstrPayload["im_product_wise"] = "X";
            gstrPayload["im_material_spl"] = "";
            gstrPayload["im_value_based"] = "";
        }
        if (target_type == "MW") {
            gstrPayload["im_bulk_sales"] = "";
            gstrPayload["im_product_wise"] = "";
            gstrPayload["im_material_spl"] = "X";
            gstrPayload["im_value_based"] = "";
        }
        if (target_type == "VW") {
            gstrPayload["im_bulk_sales"] = "";
            gstrPayload["im_product_wise"] = "";
            gstrPayload["im_material_spl"] = "";
            gstrPayload["im_value_based"] = "X";
        }
        let report_type = $("#txt_type").val();
        if (report_type == "sales_group") {
            gstrPayload["im_sales_group_wise"] = "X";
            gstrPayload["im_cummulative_wise"] = "";
        }
        if (report_type == "cummulative_code") {
            gstrPayload["im_sales_group_wise"] = "";
            gstrPayload["im_cummulative_wise"] = "X";
        }
        let dateArray = [];
        dateArray.push(fromDate);
        dateArray.push(toDate);
        gstrPayload["im_period"] = dateArray;
        gstrPayload["im_sales_group"] = sgroupArray;
        gstrPayload["bp_id"] = this.bpId;
        gstrPayload["org_id"] = this.orgId;
        url = this.environment.getRequiredApi('target_achievement_report') + "?";
        this.commonService.getData(url, 'POST', gstrPayload, this.accessObjId)
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
                                this.targetdetailslength = 0;
                                $("#filter-block").show();
                                this.commonService.responseMessages('', index.message, 'warning');
                            }
                        }
                    }
                    this.targetdetailslength = response.data.ex_targets_achievement_plan;
                    if (response.data.hasOwnProperty("ex_targets_achievement_plan")) {
                        this.targetdetailslength = Object.keys(this.targetdetailslength).length;
                    }
                    if (this.targetdetailslength > 0) {
                        for (let tarval of this.targetdetailslength) {
                            this.salesqty = this.salesqty + parseFloat(tarval.sale_qty);
                            this.salesvalue = this.salesvalue + parseFloat(tarval.sale_value);
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
            format: 'MM-YYYY',
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
        }, 1100);
    }
    exportExcel() {
        let jsonArrrayData: any = [];
        if (this.targetdetailslength.length != 0) {
            for (let index of this.targetdetailslength) {
                if (!index.hasOwnProperty('sales_group')) {
                    index.sales_group = "  "
                }
                if (!index.hasOwnProperty('sales_group_desc')) {
                    index.sales_group_desc = "  "
                }
                if (!index.hasOwnProperty('material_group')) {
                    index.material_group = "  "
                }
                if (!index.hasOwnProperty('material_descrp')) {
                    index.material_descrp = "  "
                }
                if (!index.hasOwnProperty('plan_qty')) {
                    index.plan_qty = "  "
                }
                if (!index.hasOwnProperty('plan_value')) {
                    index.plan_value = "  "
                }
                if (!index.hasOwnProperty('qty_percent')) {
                    index.qty_percent = " ";
                }
                if (!index.hasOwnProperty('sale_qty')) {
                    index.sale_qty = " ";
                }
                if (!index.hasOwnProperty('sale_value')) {
                    index.sale_value = " ";
                }
                if (!index.hasOwnProperty('value_percent')) {
                    index.value_percent = " ";
                }
                jsonArrrayData.push(index);
            }
            let columns: any = ['sales_group', 'sales_group_desc', 'material_group', 'material_descrp', 'plan_qty', 'plan_value', 'qty_percent', 'sale_qty', 'sale_value', 'value_percent']
            let columnHeaders: any = ['Sales Group', 'Sales Group Name', 'Material Group', 'Material Description', 'Plan Qty', 'Plan Value', 'Qty Percent', 'Sale Qty', 'Sale Value', 'Value Percent']
            let jsonData: any = JSON.stringify(jsonArrrayData);
            this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Target wise Report", columns, columnHeaders, 'Target wise Report');
        }
        else {
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
