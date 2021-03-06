import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { DateAdapter } from '@angular/material';
import { MessagePropertiesService } from '../../services/message-properties.service';
import { ExcelService } from '../../services/excel.service';
import {EnvConfigurationService} from '../../services/env-configuration.service';
declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-release-purchase-order',
    templateUrl: './release-purchase-order.component.html',
    styleUrls: ['./release-purchase-order.component.css']
})
export class ReleasePurchaseOrderComponent implements OnInit {

    checked: boolean = false;
    indeterminate: boolean = false;
    purchaseOrderMessages: any
    bpId: any;
    orgId: any;
    accessObjectId: any;
    sdName: any;
    shName: any;
    sdNameId: any;
    shNameId: any;
    sdSubId: any;
    shSubId: any;
    purchaseOrderDetailsList: any;
    purchaseOrderDetailslength: any;
    purchaseListPayload: any;
    dataTableRowsCount: any;
    orderTypes: any;
    vendorNames: any;
    checkboxLength: any;
    salesDocArray: any;
    poNum: any;
    createpurchaseOrderItems: any;
    purchaseOrderDtlList: any;
    doc_Date: any;
    displayFlag: boolean = false;
    purchaseDlvAddress: any;
    plantDlvAddress: any;
    errorList: any;
    errorFlag: boolean = false;
    vendor: any;
    purchasepayload: any;
    plantcode: any;
    plantname: any;
    full_address: any;
    headerText:any;
    constructor(private http: Http, private formBuilder: FormBuilder,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private environment: EnvConfigurationService, private excelService: ExcelService) {
        this.app.isActive = true;
        this.checked = false;
        this.indeterminate = false;
        this.purchaseOrderMessages = messagesService.purchase_order_details_msg;
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjectId = localStorage.getItem("Release Purchase Order");
        this.purchaseListPayload = {};
        this.purchaseOrderDetailsList = [];
        this.purchaseOrderDetailslength = 0;
        this.orderTypes = [];
        this.vendorNames = [];
        this.checkboxLength = 0;
        this.salesDocArray = null;
        this.poNum = "";
        this.createpurchaseOrderItems = [];
        this.purchaseOrderDtlList = [];
        this.doc_Date = "";
        this.purchaseDlvAddress = "";
        this.plantDlvAddress = "";
        this.shName = "";
        this.sdName = "";
        this.shNameId = "";
        this.sdNameId = "";
        this.sdSubId = "";
        this.shSubId = "";
        this.errorList = {};
        this.vendor = "";
        this.headerText="";
    }
    ngOnInit() {
        this.salesDocArray = null;
        this.purchaseListPayload['bp_id'] = this.bpId;
        this.purchaseListPayload['vendor'] = null;
        this.purchaseListPayload['from_date'] = null;
        this.purchaseListPayload['org_id'] = this.orgId;
        this.purchaseListPayload['status'] = null;
        this.purchaseListPayload['action'] = "P";
        this.purchaseListPayload['to_date'] = null;
        this.getpurchaseOrderList();
        //this.getPlantDetails();
        $("#purchase-order-table").DataTable({
            // bSort:false,
            //  bPaginate:false,
            "order": [0],
            "language": {
                "emptyTable": "No data available",
                "info": "Showing page _PAGE_ of _PAGES_",
                "infoFiltered": "(filtered from _MAX_ total records)"
            },
            //  "bInfo":false,
            //  "bFilter":false,
            "fnDrawCallback": function(oSettings) {
                if (10 >= oSettings.fnRecordsDisplay()) {
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
        setTimeout(() => {
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
            $("#sales-order-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
        }, 1100);
        setTimeout(() => {
            var width = $("#mainContent").css("width");
            $(".outbound-footer").css("width", width);
        }, 50);

    }

    closeModal(id) {
        $("#" + id).modal("hide");
        // this.createPurchaseOrderForm.reset(); 
    }
    //    getPlantDetails() {
    //        let url: any = this.environment.getRequiredApi("get_plant_details") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&";
    //        this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response => {
    //            if (response.status == 0) {
    //                this.plantDlvAddress = response['data'].ex_plant_details;
    //            } else {
    //                this.commonService.responseMessages("", response.message, "warning");
    //            }
    //        })
    //    }
    getpurchaseOrderList() {
        $("#sales-table").hide();
        $('#loadingIcon').show();
        $("#black-overlay").show();
        let url: any = this.environment.getRequiredApi("get_purchase_order_list") + "?"
        this.commonService.getData(url, "POST", this.purchaseListPayload, this.accessObjectId).subscribe((response) => {
            if (response.status == 0) {
                this.purchaseOrderDetailsList = response["data"].ex_po_list;
                this.purchaseOrderDetailslength = this.purchaseOrderDetailsList.length;
            } else {
                this.purchaseOrderDetailsList = [];
                this.purchaseOrderDetailslength = this.purchaseOrderDetailsList.length;
                this.commonService.responseMessages("", response.message, "warning")
            }

            $("#purchase-order-table").DataTable().destroy();
            $('#loadingIcon').hide();
            $("#black-overlay").hide();
            this.applyDataTable();

        });
    }
    applyDataTable() {
        setTimeout(() => {
            var table = $('#purchase-order-table').DataTable({
                "order": [[1, 'desc']],
                retrieve: true,
                "language": {
                    "emptyTable": "No data available",
                    "info": "Showing page _PAGE_ of _PAGES_",
                    "infoFiltered": "(filtered from _MAX_ total records)",
                    "searchPlaceholder": "Search..."
                },
                columnDefs: [{
                    "targets": 'no-sort',
                    "orderable": false
                }],
                "fnDrawCallback": function(oSettings) {
                    if (10 >= oSettings.fnRecordsDisplay()) {
                        $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                        //     $(oSettings.nTableWrapper).find('.dataTables_filter').hide();
                        $(oSettings.nTableWrapper).find('.dataTables_info').hide();
                        //$(oSettings.nTableWrapper).find('.dataTables_length').hide();
                    } else {
                        $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                        //    $(oSettings.nTableWrapper).find('.dataTables_filter').show();
                        $(oSettings.nTableWrapper).find('.dataTables_info').show();
                        //  $(oSettings.nTableWrapper).find('.dataTables_length').show();
                    }
                },
            });
            this.dataTableRowsCount = table.page.info().recordsTotal;
            console.log(this.dataTableRowsCount + '-------');
            $('#purchase-order-table_filter input').val();
            $("#searchStock").remove();
            $("#purchase-order-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
            $("#purchase-table-table").show();
            setTimeout(() => {
                var width = $("#mainContent").css("width");
                $(".outbound-footer").css("width", width);
                $(".outbound-footer").show();
            }, 50);
        }, 500);
        setTimeout(() => {
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
        }, 600);
    }
    GetApproveDetails(ponum, plant) {
        $("#bussinessModal").modal("show");
        this.poNum = ponum;
        this.plantcode = plant;
        this.getpurchaseorderDetails();
    }
    displayDetails(list) {
        $("#bussinessModal").modal("show");
        if (list.hasOwnProperty('po_number')) {
            this.poNum = list.po_number;
            this.plantcode = list.plant;
        }
        this.getpurchaseorderDetails();
    }

    getpurchaseorderDetails() {
        this.headerText="";
        $('#loadingIcon').show();
        $("#black-overlay").show();
        let url: any = this.environment.getRequiredApi("get_purchase_order_display") + "?po_num=" + this.poNum + "&org_id=" + this.orgId + "&bp_id=" + this.bpId + "&plant_code=" + this.plantcode + "&";
        this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response => {
            if (response.status == 0) {
                this.purchaseOrderDtlList = response["data"];
                if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_header')) {
                    if (this.purchaseOrderDtlList['ex_po_header']['doc_date'] != "0000-00-00") {
                        let splittedpostingDateArray = this.purchaseOrderDtlList['ex_po_header']['doc_date'].split("-");
                        this.doc_Date = splittedpostingDateArray[2] + "-" + splittedpostingDateArray[1] + "-" + splittedpostingDateArray[0];
                        this.shNameId = this.purchaseOrderDtlList['ex_po_header']['vendor'];
                        this.shSubId = this.shNameId.replace(/\b(0(?!\b))+/g, "");
                        this.vendor = this.shSubId + "-" + this.purchaseOrderDtlList['ex_po_header']['vend_name'];
                    }
                    if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_address')) {
                        this.purchaseDlvAddress = this.purchaseOrderDtlList['ex_po_address'];
                    }
                    if (this.purchaseOrderDtlList['ex_po_header'].hasOwnProperty('doc_type')) {
                    }
                }
                if(this.purchaseOrderDtlList.hasOwnProperty('ex_header_texts')){
                    if(this.purchaseOrderDtlList['ex_header_texts'].length>0){
                     if(this.purchaseOrderDtlList['ex_header_texts'][0].hasOwnProperty('text_line')){
                         this.headerText=this.purchaseOrderDtlList['ex_header_texts'][0].text_line
                     }
                    }
                 }
                if (this.purchaseOrderDtlList.hasOwnProperty('ex_status_items')) {
                    if (this.purchaseOrderDtlList['ex_status_items'].length > 0) { }
                }
                if (this.purchaseOrderDtlList.hasOwnProperty('ex_delivery_address')) {
                    this.plantname = this.purchaseOrderDtlList['ex_delivery_address']['plant_id'] + "-" + this.purchaseOrderDtlList['ex_delivery_address']['plant_name'];
                    this.full_address = this.purchaseOrderDtlList['ex_delivery_address']['full_address'];
                }
                if (this.purchaseOrderDtlList.hasOwnProperty("ex_items")) {
                    this.createpurchaseOrderItems = [];

                    this.purchaseOrderDtlList['ex_items'].forEach(response => {
                        let object: any = {};
                        object['mat_num'] = response.material;
                        object['qty'] = response.quantity;
                        object['uom'] = response.unit;
                        object['desc'] = response.short_text;
                        object['price'] = 0;
                        object['deldate'] = "";
                        object['sgst_rt'] = 0;
                        object['sgst_val'] = 0;
                        object['igst_rt'] = 0;
                        object['igst_val'] = 0;
                        object['cgst_rt'] = 0;
                        object['cgst_val'] = 0;
                        object['displayRow'] = true;
                        object['updateflag'] = "U";
                        object['zspe'] = false;
                        object['zsvl'] = false;
                        object['zper'] = false;
                        object['zval'] = false;
                        object['grossValue'] = 0;
                        if (this.purchaseOrderDtlList.hasOwnProperty('ex_mat_price')) {
                            if (this.purchaseOrderDtlList.ex_mat_price.length > 0) {
                                this.purchaseOrderDtlList.ex_mat_price.forEach(currentItem => {
                                    if (currentItem.item_no == response.po_item) {
                                        object['uom'] = currentItem.uom;
                                        object['desc'] = currentItem.mat_desc;
                                        object['price'] = currentItem.mat_price;
                                        object['grossValue'] = currentItem.net_price;
                                        object['sgst_rt'] = Math.round(parseFloat(currentItem.sgst_rate)).toFixed(2);
                                        object['sgst_val'] = Math.round(parseFloat(currentItem.sgst_value)).toFixed(2);
                                        object['igst_rt'] = Math.round(parseFloat(currentItem.igst_rate)).toFixed(2);;
                                        object['igst_val'] = Math.round(parseFloat(currentItem.igst_value)).toFixed(2);;
                                        object['cgst_rt'] = Math.round(parseFloat(currentItem.cgst_rate)).toFixed(2);;
                                        object['cgst_val'] = Math.round(parseFloat(currentItem.cgst_value)).toFixed(2);;
                                    }
                                });
                            }
                        }
                        this.createpurchaseOrderItems.push(object);

                    });
                }
                let itemNumber: any = null;
                let count = 0;
                if (this.purchaseOrderDtlList.hasOwnProperty("ex_item_schedules")) {
                    this.purchaseOrderDtlList['ex_item_schedules'].forEach(response => {
                        itemNumber = response.po_item;
                        if (response.deliv_date != 'unde-fi-ne' && response.deliv_date != '') {
                            this.createpurchaseOrderItems[count].deldate = response.deliv_date;
                        }
                        count++;
                    });
                }
                if (response["data"].hasOwnProperty('ex_return')) {
                    if (response["data"]['ex_return'].length > 0) {
                        this.errorList = response["data"]['ex_return'];
                        for (let elist of response["data"]['ex_return']) {
                            if (elist.type == 'E') {
                                this.errorFlag = true;
                                // this.errorCreateDo = true;
                                $('#loadingIcon').hide();
                                $("#black-overlay").hide();
                                $("#displayDlvrErrorsModal").modal("show");
                                return false;
                            }
                        }
                    }
                }
                for (let items of this.createpurchaseOrderItems) {
                    items.qty = Math.round(parseFloat(items.qty));
                }
                //  this.getPayIncoTerms();
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                setTimeout(() => {
                    var width = $("#mainContent").css("width");
                    $(".outbound-footer").css("width", width);
                    $(".outbound-footer").show();
                }, 100);
            } else {
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                this.commonService.responseMessages("", response.message, "warning");
            }

        });
    }
    releasepurchaseorder() {
        $("#loadingIcon").show();
        $("#black-overlay").show();
        let url: any = this.environment.getRequiredApi('release_purchase_order') + "?po_number=" + this.poNum + "&org_id=" + this.orgId + "&bp_id=" + this.bpId + "&plant_code=" + this.plantcode + "&";
        this.commonService.getData(url, "POST", "", this.accessObjectId).subscribe((response) => {
            if (response.status == 1) {
                $("#loadingIcon").hide();
                $("#black-overlay").hide();
                this.commonService.responseMessages('', response.message, 'warning');
            } else {
                if (response.data.ex_release_status == "") {
                    this.commonService.responseMessages('', response['ex_return'].message, 'warning');
                }
                else {
                    $("#loadingIcon").hide();
                    $("#black-overlay").hide();
                    this.commonService.responseMessages('', this.poNum + " " + response.data.ex_release_status, 'success');
                    //  this.customerDetailsForm.reset();
                    $('#bussinessModal_divpopup')[0].reset();
                    $('#bussinessModal').modal("hide");
                    this.getpurchaseOrderList();
                }
            }
        });
    }
    //    rejectpurchaseorder() {
    //    }
}

