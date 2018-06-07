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
    selector: 'app-purchase-order-report',
    templateUrl: './purchase-order-report.component.html',
    styleUrls: ['./purchase-order-report.component.css']
})
export class PurchaseOrderReportComponent implements OnInit {
    public poreportdetailsForm: FormGroup;
    public bpId: string;
    public orgId: string;
    public accessObjId: string;
    public poreportdetailsList: any = [];
    public material: any;
    public ajaxDropdown = false;
    public screenType: any;
    public actionFlag: any;
    public customertypeList: any;
    public emptyFlag: boolean = false;
    public cdListLength: any;
    public gstrdetailslength: any;
    public NEWporeportdetailsList: any = [];
    grossAmt:any;
    sgstAmt:any;
    cgstAmt:any;
    igstAmt:any;
    rtgrossAmt:any;
    rtsgstAmt:any;
    rtcgstAmt:any;
    rtigstAmt:any;
    constructor(private http: Http, private formBuilder: FormBuilder, private environment: EnvConfigurationService,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private excelService: ExcelService) {
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjId = localStorage.getItem("Reports Gallery")
        this.poreportdetailsForm = new FormBuilder().group(
            {
                'frmDate': ['', Validators.required],
                'toDate': ['', Validators.required]
            }
        );
        this.actionFlag = true;
        this.poreportdetailsList = [];
        this.cdListLength = 0;
        this.gstrdetailslength = 0;
        this.grossAmt=0;
        this.sgstAmt=0;
        this.cgstAmt=0;
        this.igstAmt=0;
        this.rtgrossAmt=0;
        this.rtsgstAmt=0;
        this.rtcgstAmt=0;
        this.rtigstAmt=0;
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
        this.poreportdetailsList = [];
        this.applyDataTable();
        
    }
    getpoReportDetails() {
        this.grossAmt=0;
        this.sgstAmt=0;
        this.cgstAmt=0;
        this.igstAmt=0;
        this.rtgrossAmt=0;
        this.rtsgstAmt=0;
        this.rtcgstAmt=0;
        this.rtigstAmt=0;
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
        let url = "";
        url = this.environment.getRequiredApi('get_poreport_details') + "?bp_id=" + this.bpId + "&org_id=" + this.orgId + "&from_date=" + fromDate + "&to_date=" + toDate + "&";
        this.commonService.getData(url, 'GET', '', this.accessObjId)
            .subscribe((response) => {
                console.log(response);
                if (response.status == '1') {
                    this.poreportdetailsList = [];
                    this.commonService.responseMessages('', response.message, 'warning');
                } else {
                    if(response.data.hasOwnProperty('ex_po_list')){
                    this.poreportdetailsList = response.data.ex_po_list;
                    for(let index of this.poreportdetailsList){
                       if(index.doc_type=='Order'){
                           this.grossAmt=this.grossAmt+parseFloat(index.po_amount);
                           for(let item of index.item_details){
                               if(item.hasOwnProperty('igst_value')){
                                   this.igstAmt=this.igstAmt+parseFloat(item.igst_value);
                               }
                               if(item.hasOwnProperty('cgst_value')){
                                   this.cgstAmt=this.cgstAmt+parseFloat(item.cgst_value);
                                   this.sgstAmt=this.sgstAmt+parseFloat(item.cgst_value);
                               }
                               
                           } 
                       }
                       if(index.doc_type=='Returns'){
                           this.rtgrossAmt=this.rtgrossAmt+parseFloat(index.po_amount);
                           for(let item of index.item_details){
                               if(item.hasOwnProperty('igst_value')){
                                   this.rtigstAmt=this.rtigstAmt+parseFloat(item.igst_value);
                               }
                               if(item.hasOwnProperty('cgst_value')){
                                   this.rtcgstAmt=this.rtcgstAmt+parseFloat(item.cgst_value);
                                   this.rtsgstAmt=this.rtsgstAmt+parseFloat(item.cgst_value);
                               }
                               
                           } 
                       }
                        
                     }
                    }
                    $("#filter-block").hide();
                    var InvoiceTable = [];
                    var totqty = 0;
                    let data = response.data.ex_return;
                    if (response.data.hasOwnProperty("ex_return")) {
                        for (let index of data) {
                            if (index.type == "E") {
                                this.poreportdetailsList = [];
                                this.gstrdetailslength = 0;
                                this.commonService.responseMessages('', index.message, 'warning');
                            }
                        }
                    }
                }
                $("#purchase-report-table").DataTable().destroy();
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
            $("#purchase-report-table").DataTable({
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
                },
                { type: 'currency', "targets": [9,10,11,12,13,14] }],
                
            });
            // $("#purchase-report-table").css("display", "table !important")
        }, 500);

        setTimeout(() => {
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
            //$("#cust-info-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
        }, 1100);
        setTimeout(()=>{
            var width=$("#mainContent").css("width");
            $(".outbound-footer").css("width",width);
        },200);
    }
    exportExcel() {
        let jsonArrrayData: any = [];
        let count = 0;
        if (this.poreportdetailsList.length != 0) {
            for (let index of this.poreportdetailsList) {

                for (let items of this.poreportdetailsList[count].item_details) {
                    let listObj: any = {};
                    if (!index.hasOwnProperty('po_number')) {
                        listObj.po_number = " ";
                    }
                    else {
                        listObj.po_number = index.po_number;
                    }
                    if (!index.hasOwnProperty('status')) {
                        listObj.status = "  "
                    }
                    else {
                        listObj.status = index.status;
                    }
                    if (!index.hasOwnProperty('vendor_name')) {
                        listObj.vendor_name = ' ';
                    }
                    else {
                        listObj.vendor_name = index.vendor_name;
                    }
                    if (!index.hasOwnProperty('po_date')) {
                        listObj.po_date = ' ';
                    }
                    else {
                        listObj.po_date = index.po_date;
                    }
                    if (!index.hasOwnProperty('po_amount')) {
                        listObj.po_amount = " ";
                    }
                    else {
                        listObj.po_amount = index.po_amount;
                    }
                    if (!items.hasOwnProperty('mat_id')) {
                        listObj.mat_id = " ";
                    }
                    else {
                        listObj.mat_id = items.mat_id;
                    }
                    if (!items.hasOwnProperty('mat_desc')) {
                        listObj.mat_desc = " ";
                    }
                    else {
                        listObj.mat_desc = items.mat_desc;
                    }
                    if (!items.hasOwnProperty('mat_quan')) {
                        listObj.mat_quan = " ";
                    }
                    else {
                        listObj.mat_quan = items.mat_quan;
                    }
                    if (!items.hasOwnProperty('uom')) {
                        listObj.uom = " ";
                    }
                    else {
                        listObj.uom = items.uom;
                    }
                    if (!items.hasOwnProperty('mat_price')) {
                        listObj.mat_price = " ";
                    }
                    else {
                        listObj.mat_price = items.mat_price;
                    }
                    if (!items.hasOwnProperty('cgst_value')) {
                        listObj.cgst_value = " ";
                    }
                    if (!items.hasOwnProperty('cgst_value')) {
                        listObj.cgst_value = " ";
                    }
                    else {
                        listObj.cgst_value = items.cgst_value;
                    }
                    if (!items.hasOwnProperty('cgst_value')) {
                        listObj.cgst_value = " ";
                    }
                    else {
                        listObj.cgst_value = items.cgst_value;
                    }
                    if (!items.hasOwnProperty('igst_value')) {
                        listObj.igst_value = " ";
                    }
                    else {
                        listObj.igst_value = items.igst_value;
                    }
                    if (!items.hasOwnProperty('net_price')) {
                        listObj.net_price = " ";
                    }
                    else {
                        listObj.net_price = items.net_price;
                    }

                    jsonArrrayData.push(listObj);
                }

                count++;
            }
            let columns: any = ['po_number', 'status', 'vendor_name', 'po_date', 'po_amount', 'mat_id', 'mat_desc', 'mat_quan', 'uom', 'mat_price', 'cgst_value', 'cgst_value', 'igst_value', 'net_price']
            let columnHeaders: any = ['PO No', 'Status', 'Vendor Name', 'PO Date', 'PO Amount', 'Material', 'Description', 'Qty', 'UOM', 'Price', 'S/UGST', 'CGST', 'IGST', 'Net Value']
            let jsonData: any = JSON.stringify(jsonArrrayData);
            this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "PO List", columns, columnHeaders, 'PO');

        } else {
            this.commonService.responseMessages("", "No Data Available To Export", "warning")
        }
    }
    navigateToRepGallery() {
        const path: any = "rptsgallery";
        this.router.navigate([path]);
    }
    showFilters(){
        $("#filter-block").slideToggle();  
    }
}