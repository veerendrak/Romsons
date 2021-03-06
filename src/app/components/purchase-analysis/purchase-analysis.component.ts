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
    selector: 'app-purchase-analysis',
    templateUrl: './purchase-analysis.component.html',
    styleUrls: ['./purchase-analysis.component.css']
})
export class PurchaseAnalysisComponent implements OnInit {
    public poanalysisdetailsForm: FormGroup;
    public bpId: string;
    public orgId: string;
    public accessObjId: string;
    public poanalysisdetailsList: any = [];
    public material: any;
    public ajaxDropdown = false;
    public screenType: any;
    public actionFlag: any;
    public customertypeList: any;
    public emptyFlag: boolean = false;
    public cdListLength: any;
    public gstrdetailslength: any;
    rolekaduser: any;
    
    public quantity:number=0;
    public grossVal:number=0;
    public delPendingQty:number=0;
    public delPending:number=0;
    public invPendingQty:number=0;
    public invPending:number=0;
    
    
    constructor(private http: Http, private formBuilder: FormBuilder, private environment: EnvConfigurationService,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private excelService: ExcelService) {
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjId = localStorage.getItem("Reports Gallery")

        this.poanalysisdetailsForm = new FormBuilder().group(
            {
                'frmDate': ['', Validators.required],
                'toDate': ['', Validators.required]
            }
        );
        this.actionFlag = true;
        this.poanalysisdetailsList = [];
        this.cdListLength = 0;
        this.gstrdetailslength = 0;
        this.rolekaduser = true;
        this.quantity = 0;
        this.grossVal = 0;
        this.delPendingQty = 0;
        this.delPending = 0;
        this.invPendingQty = 0;
        this.invPending = 0;
    }
    ngOnInit() {
        if (localStorage.getItem("roleName") == "KAD User") {
            this.rolekaduser = false;
        }
        else {
            this.rolekaduser = true;
        }
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
    getpoAnalysisReport() {
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
        gstrPayload["company_code"] = "RMSS";
        gstrPayload["bp_id"] = this.bpId;
        gstrPayload["org_id"] = this.orgId;
        let url = "";
        url = this.environment.getRequiredApi('get_me2n_details') + "?bp_id=" + this.bpId + "&org_id=" + this.orgId + "&from_date=" + fromDate + "&to_date=" + toDate + "&";
        this.commonService.getData(url, 'GET', '', this.accessObjId)
            .subscribe((response) => {
                console.log(response);
                $("#purchase-analysis-order-table").DataTable().destroy();
                if (response.status == '1') {
                    this.poanalysisdetailsList = [];
                    this.commonService.responseMessages('', response.message, 'warning');
                } else {
                    if(response.data.hasOwnProperty('ex_me2n_output')){
                        this.poanalysisdetailsList = response.data.ex_me2n_output;
                        this.quantity = 0;
                        this.grossVal = 0;
                        this.delPendingQty = 0;
                        this.delPending = 0;
                        this.invPendingQty = 0;
                        this.invPending = 0;
                        this.poanalysisdetailsList.forEach((items)=>{
                            this.quantity = this.quantity + parseFloat(items.quantity);
                            this.grossVal = this.grossVal + parseFloat(items.gross_price);
                            this.delPendingQty = this.delPendingQty + parseFloat(items.deliv_qty_pending);
                            this.delPending = this.delPending + parseFloat(items.deliv_val_pending);
                            this.invPendingQty = this.invPendingQty + parseFloat(items.inv_qty_pending);
                            this.invPending =this.invPending + parseFloat(items.inv_val_pending);
                        })
                   }
                    $("#filter-block").hide();
                    let data = response.data.ex_return;
                    if (response.data.hasOwnProperty("ex_return")) {
                        for (let index of data) {
                            if (index.type == "E") {
                                this.poanalysisdetailsList = [];
                                this.gstrdetailslength = 0;
                                this.commonService.responseMessages('', index.message, 'warning');
                            }
                         if (index.id == "E") {
                                this.poanalysisdetailsList = [];
                                this.gstrdetailslength = 0;
                                this.commonService.responseMessages('', index.message, 'warning');
                            }
                        }
                    }
                }

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
        this.poanalysisdetailsForm.controls['frmDate'].setValue($("#frmDate").val());
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
        this.poanalysisdetailsForm.controls['frmDate'].setValue($("#frmDate").val());
        this.poanalysisdetailsForm.controls['toDate'].setValue($("#toDate").val());
    }
    applyDataTable() {
        setTimeout(() => {
            $("#purchase-analysis-order-table").DataTable({
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
                { type: 'currency', "targets": [7,9,11] }]
            });
            $("#purchase-analysis-order-table").css("display", "table !important")
        }, 500);

        setTimeout(() => {
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
            //$("#cust-info-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
        }, 1100);
    }
    exportExcel() {
        let jsonArrrayData: any = [];
        if (this.poanalysisdetailsList.length != 0) {
            for (let index of this.poanalysisdetailsList) {
                if (!index.hasOwnProperty('vendor_sup_plant')) {
                    index.vendor_sup_plant = "  "
                }
                if (!index.hasOwnProperty('pur_doc_num')) {
                    index.pur_doc_num = "  "
                }
                if (!index.hasOwnProperty('doc_date')) {
                    index.doc_date = ' ';
                }
                if (!index.hasOwnProperty('material')) {
                    index.material = ' ';
                }
                if (!index.hasOwnProperty('mat_desc')) {
                    index.mat_desc = " ";
                }
                if (!index.hasOwnProperty('deliv_qty_pending')) {
                    index.deliv_qty_pending = " ";
                }
                if (!index.hasOwnProperty('deliv_val_pending')) {
                    index.deliv_val_pending = " ";
                }
                if (!index.hasOwnProperty('inv_qty_pending')) {
                    index.inv_qty_pending = " ";
                }
                if (!index.hasOwnProperty('inv_val_pending')) {
                    index.inv_val_pending = " ";
                }
                if (!index.hasOwnProperty('quantity')) {
                    index.quantity = " ";
                }
                if (!index.hasOwnProperty('uom')) {
                    index.uom = " ";
                }
                if (!index.hasOwnProperty('gross_price')) {
                    index.gross_price = " ";
                }
                jsonArrrayData.push(index);
            }
            let columns: any = ['vendor_sup_plant', 'pur_doc_num', 'doc_date', 'material', 'mat_desc', 'deliv_qty_pending', 'deliv_val_pending', 'inv_qty_pending', 'inv_val_pending', 'quantity', 'uom', 'gross_price']
            let columnHeaders: any = ['Vendor Plant', 'PO No', 'Doc Date', 'Material', 'Description', 'Del Qty Pending', 'Del Value Pending', 'Inv Qty Pending', 'Inv Value Pending', 'Qty', 'UOM', 'Gross Value']
            let jsonData: any = JSON.stringify(jsonArrrayData);
            this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "ME2N List", columns, columnHeaders, 'ME2N');

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