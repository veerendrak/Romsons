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
var exportIdlist: number;

@Component({
    selector: 'app-purchase-order-details',
    templateUrl: './purchase-order-details.component.html',
    styleUrls: ['./purchase-order-details.component.css']
})
export class PurchaseOrderDetailsComponent implements OnInit {

    createPurchaseOrderForm: FormGroup;
    createSalesOrderPage: boolean = false;
    salesOrderDetails: boolean = false;
    saleType: any;
    checked: boolean = false;
    indeterminate: boolean = false;
    purchaseOrderMessages: any
    bpId: any;
    orgId: any;
    accessObjectId: any;
    filterPOForm: FormGroup;
    purchaseOrderDetailsList: any;
    purchaseOrderDetailslength: any;
    purchaseListPayload: any;
    dataTableRowsCount: any;
    orderTypes: any;
    vendorNames: any;
    checkboxLength: any;
    salesDocArray: any;
    poNum: any;
    exportArrayList: any;
    exportIdArrays: any;
    exportObjId: any;
    checkboxErrorMsg: any;
    postatus: any;
    vendorTypes: any;
    rolekaduser: any;
    constructor(private http: Http, private formBuilder: FormBuilder,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private environment: EnvConfigurationService, private excelService: ExcelService) {
        this.app.isActive = true;
        this.salesOrderDetails = true;
        this.createPurchaseOrderForm = formBuilder.group({
            hideRequired: false,
            floatLabel: 'auto',
            'vendorName': ['', Validators.required],
            'docType': ['', Validators.required],
        });
        this.filterPOForm = formBuilder.group({

            'custName': [''],
            'frmDate': [''],
            'toDate': [''],
            'status': [''],
        });
        this.checked = false;
        this.indeterminate = false;
        this.purchaseOrderMessages = messagesService.purchase_order_details_msg;
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjectId = localStorage.getItem("Purchase Order");
        this.purchaseListPayload = {};
        this.purchaseOrderDetailsList = [];
        this.purchaseOrderDetailslength = 0;
        this.orderTypes = [];
        this.vendorNames = [];
        this.checkboxLength = 0;
        this.salesDocArray = null;
        this.poNum = "";
        this.exportArrayList = [];
        this.checkboxErrorMsg = this.messagesService.check_box_error;
        this.vendorTypes = [];
        this.rolekaduser = true;
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
        if (localStorage.getItem("roleName") == "KAD User") {
            this.rolekaduser = false;
        }
        else {
            this.rolekaduser = true;
        }
        this.salesDocArray = null;
        this.purchaseListPayload['bp_id'] = this.bpId;
        this.purchaseListPayload['vendor'] = null;
        this.purchaseListPayload['from_date'] = null;
        this.purchaseListPayload['org_id'] = this.orgId;
        this.purchaseListPayload['status'] = null;
        this.purchaseListPayload['to_date'] = null;
        this.exportObjId = {};
        this.exportIdArrays = [];
        this.getpurchaseOrderList();
        this.applyDataTable();
        setTimeout(() => {
            var width = $("#mainContent").css("width");
            $(".outbound-footer").css("width", width);
        }, 50);
        let orderTypesUrl: any = this.environment.getRequiredApi("header_dropdown") + "?group=PURTYPS&";
        this.commonService.getData(orderTypesUrl, "GET", "", this.accessObjectId).subscribe(response => {
            if (response.status == 0) {
                this.orderTypes = response["data"].configValues;
            }
        });
        let vendorTypesUrl: any = this.environment.getRequiredApi("header_dropdown") + "?group=VENDORTYPS&";
        this.commonService.getData(vendorTypesUrl, "GET", "", this.accessObjectId).subscribe(response => {
            if (response.status == 0) {
                this.vendorTypes = response["data"].configValues;
            }
        });


        $(function() {
            $(document).on('click', function(e) {
                if (!$(e.target).hasClass('ajax-list')) {
                    $(".ajax-searchlist").hide();
                }
            });
            $(document).on('click', function(e) {

                $("#purchase-order-table_paginate").find('.page-link').on('click', function(e) {
                    setTimeout(function() {
                        if ($("#checkbox-all-input").is(":checked")) {
                            $("#purchase-order-table").find("tbody").find(".mat-checkbox-input").each(function(i) {
                                let id: any = $(this).attr('id');
                                if (!$("#" + id).is(":checked")) {
                                    $("#" + id).click();
                                }
                            });
                        } else {
                            $("#purchase-order-table").find("tbody").find(".mat-checkbox-input").each(function(i) {
                                let id: any = $(this).attr('id');

                                if (exportIdlist == 0) {
                                    if ($("#" + id).is(":checked")) {
                                        $("#" + id).click();
                                    }
                                }
                            });
                        }
                    }, 300);
                });
            });
        });
    }
    changeTodatePicker(id) {
        $(id).datetimepicker("hide");
        this.filterPOForm.controls['frmDate'].setValue($("#fromDateFilt").val());
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
            this.filterPOForm.controls['frmDate'].setValue($("#fromDateFilt").val());
            this.filterPOForm.controls['toDate'].setValue($("#toDateFilt").val());
        }
        $(id).datetimepicker("hide");
    }
    createSalesOrder(type) {

        this.commonService.saleType = 'Create';
        this.commonService.showOrderType = false;
        $("#createPurchaseModal").modal("show");
    }
    closeModal(id) {
        $("#" + id).modal("hide");
        this.createPurchaseOrderForm.reset();
        this.createPurchaseOrderForm.controls['docType'].setValue("");
    }
    createPurchaseForm(id) {
        let orderType: any = $("#orderTypes").val();//ZNB
        if (this.vendorNames.length == 0 && orderType == "ZKS") {
            this.commonService.responseMessages("", "Please select valid vendor", "warning");
            return false;
        }
        $("#" + id).modal("hide");
        const path: any = "purchaseorder/savepurchaseorder";
        let vendorId: any = $("#modal-searchInput").val();
        if (vendorId == "" || vendorId == null) {
            this.commonService.responseMessages("", "Please select valid vendor", "warning");
            return false;
        }
        this.router.navigate([path], { queryParams: { "orderType": orderType, "vendorId": vendorId, "action": "C", frompage: "PO" } });

    }
    editPurchaseOrder(type) {
        if (this.checkboxLength > 1 || this.checkboxLength == 0) {
            if (this.checkboxLength == 0) {
                this.commonService.responseMessages("", this.getWarningErrorMessage('select_atleast_msg'), "warning");
            } else {
                this.commonService.responseMessages("", this.getWarningErrorMessage('select_msg'), "warning");
            }
            return false
        }
        else {
            if (this.checkboxLength == 1) {
                let ponum = "";
                let Msg = "";
                let noPrintFlag = true;
                for (let printIndex of this.exportIdArrays) {
                    ponum = ponum + printIndex.po_number + ",";
                    if (printIndex.status != "Pending") {
                        noPrintFlag = false;
                        break;
                    }
                }
                if (!noPrintFlag) {
                    Msg = "Select Pending Purchase Order";
                    this.commonService.responseMessages("", Msg, "warning");
                } else {
                    let orderType: any = "";
                    let vendorId: any = ""
                    this.commonService.saleType = 'Edit';
                    this.commonService.showOrderType = true;
                    const path: any = "purchaseorder/editpurchaseorder";
                    this.router.navigate([path], { queryParams: { "orderNum": this.salesDocArray, "action": "U", frompage: "PO" } });
                }
            }
        }
    }
    displayDetails(list) {
        this.commonService.saleType = 'Display';
        const path: any = "purchaseorder/editpurchaseorder";
        if (list.hasOwnProperty('po_number')) {
            this.poNum = list.po_number;
            this.postatus = list.status;
        }
        this.router.navigate([path], { queryParams: { "orderNum": this.poNum, "action": "DIS", frompage: "PO", "postatus": this.postatus } });
    }
    selectAll(event, checkAll, tableId) {
        this.exportArrayList = [];
        this.exportIdArrays = [];
        exportIdlist = 0;
        setTimeout(() => {
            this.commonService.selectAllCheckBoxes(checkAll, tableId);
            setTimeout(() => {
                if ($("#checkbox-all-input").is(":checked")) {
                    this.checkboxLength = 100;
                    let countInputChecked = 0;
                    let indexCount = 0;
                    this.purchaseOrderDetailsList.forEach(currenItem => {
                        if (this.salesDocArray == null || this.salesDocArray == "") {
                            this.salesDocArray = currenItem.po_number;
                        } else {
                            this.salesDocArray = this.salesDocArray + "," + currenItem.po_number;
                        }
                        this.exportArrayList.push(currenItem);
                        this.exportObjId = {};
                        this.exportObjId["poNum"] = currenItem.po_number;
                        this.exportObjId["status"] = currenItem.status;
                        this.exportObjId["checkBoxId"] = "checkbox-" + indexCount + "-input";
                        this.exportIdArrays.push(this.exportObjId);
                        indexCount++;
                    });
                } else {
                    this.checkboxLength = 0;
                    this.salesDocArray = null;
                    this.salesDocArray = "";
                    this.exportArrayList = [];
                    this.exportIdArrays = [];
                }
            }, 400)

        }, 300);
    }
    getReportList(response, tableId, i) {
        setTimeout(() => {
            let flag: boolean = this.commonService.checkAction(tableId);
            if (flag) {
                this.indeterminate = false;
                this.checked = true;
            } else {
                this.indeterminate = true;
            }
        }, 400);
        setTimeout(() => {
            if ($("#checkbox-" + i + "-input").is(":checked")) {
                this.exportObjId = {};
                if (response.hasOwnProperty('del_order')) {
                }
                if (this.salesDocArray == null || this.salesDocArray == "") {
                    this.salesDocArray = response.po_number;
                } else {
                    this.salesDocArray = this.salesDocArray + "," + response.sales_doc;
                }
                this.checkboxLength++;
                this.exportArrayList.push(response);
                this.exportObjId["poNum"] = response.po_number;
                this.exportObjId["status"] = response.status;
                this.exportObjId["checkBoxId"] = "checkbox-" + i + "-input";
                this.exportIdArrays.push(this.exportObjId);
                exportIdlist = this.exportIdArrays.length;
            } else {
                //              this.printOrderNum="";
                //              this.reqDelDate="";
                if (this.salesDocArray.includes(",")) {
                    this.salesDocArray = this.salesDocArray.replace(response.sales_doc, "");
                    this.salesDocArray = this.salesDocArray.replace(/^,|,$/g, '');
                } else {
                    this.salesDocArray = "";
                }
                this.checkboxLength = parseInt(this.checkboxLength) - 1;
                setTimeout(() => {
                    let flag: boolean = this.commonService.continueAction(tableId);
                    if (flag) {
                        this.indeterminate = false;
                        this.checked = false;
                    } else {
                        this.indeterminate = true;
                    }
                }, 200);
                //              this.dlvrNum="";
                for (let i in this.exportArrayList) {
                    if (this.exportArrayList[i].po_number == response.po_number) {
                        this.exportArrayList.splice(i, 1);
                        this.exportIdArrays.splice(i, 1);
                    }
                }
                exportIdlist = this.exportIdArrays.length;
            }
        }, 300);
    }
    printSelectedReports(type) {
        if (this.checkboxLength > 1 || this.checkboxLength == 0) {
            if (this.checkboxLength == 0) {
                this.commonService.responseMessages("", this.getWarningErrorMessage('select_atleast_msg'), "warning");
            } else {
                this.commonService.responseMessages("", this.getWarningErrorMessage('select_msg'), "warning");
            }
        }
        else {
            if (this.checkboxLength == 1) {
                let url: any = this.environment.getRequiredApi("print_purchase_order") + "?bp_id=" + this.bpId + "&org_id=" + this.orgId + "&im_v_vbeln=" + this.salesDocArray + "&access_obj_id=" + this.accessObjectId + "&access_token=" + localStorage.getItem("token");
                window.open(url, '_blank');
            }
        }
    }
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
                },
                { type: 'currency', "targets": [7] }],
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
    extractData(id, spinnerId, ajaxDropdown, event) {
        let term: any = $("#" + id).val();
        if (this.vendorNames.length == 0) {
            if (term.length > 3) {
                term = term.substring(0, 3);
            }
        }
        if (term.length == 3 && event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
            $("#" + spinnerId).show();
            let url: any = this.environment.getRequiredApi("find_vendors") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&vendor=" + term + "&";
            this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response => {
                if (response.status == 0) {
                    this.vendorNames = response["data"].ex_vendor_list;
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
                this.vendorNames = [];
                $("#" + spinnerId).hide();
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
        $("#" + textInput).val(response.vendor_name);
        $("#" + hiddenInput).val(response.vendor_id);
        $("#" + modalBlock).hide();
    }
    exportExcel() {
        if (this.exportArrayList.length != 0) {
            this.commonExportExcel(this.exportArrayList);
        } else {

            if (this.purchaseOrderDetailsList.length != 0) {
                this.commonExportExcel(this.purchaseOrderDetailsList)

            } else {
                this.commonService.responseMessages("", "No data available", "warning")
            }
        }
    }

    commonExportExcel(list) {
        let jsonArrrayData: any = [];

        if (list.length != 0) {
            for (let index of list) {
                if (!index.hasOwnProperty('po_number')) {
                    index.po_number = "  "
                }
                if (!index.hasOwnProperty('vendor_name')) {
                    index.vendor_name = "  "
                }
                if (!this.rolekaduser) {
                    if (!index.hasOwnProperty('hospital_code')) {
                        index.hospital_code = ' ';
                    }
                    if (!index.hasOwnProperty('hospital_name')) {
                        index.hospital_name = ' ';
                    }
                }
                if (!index.hasOwnProperty('po_date')) {
                    index.po_date = ' ';
                }
                if (!index.hasOwnProperty('po_amount')) {
                    index.po_amount = ' ';
                }
                if (!index.hasOwnProperty('status')) {
                    index.status = " ";
                }
                if (!index.hasOwnProperty('po_deliv_status')) {
                    index.po_deliv_status = " ";
                }
                if (!index.hasOwnProperty('doc_type')) {
                    index.doc_type = " ";
                }
                jsonArrrayData.push(index);
            }
            let columns: any;
            let columnHeaders: any;
            if (!this.rolekaduser) {
                columns = ['po_number', 'vendor_name', 'hospital_code', 'hospital_name', 'po_date', 'po_amount', 'status', 'po_deliv_status', 'doc_type']
                columnHeaders = ['PO No', 'Vendor Name', 'Hospital Code', 'Hospital Name', 'PO Date', 'Amount', 'Status', 'Supply Status', 'Doc Category']
            } else {
                columns = ['po_number', 'vendor_name', 'po_date', 'po_amount', 'status', 'po_deliv_status', 'doc_type']
                columnHeaders = ['PO No', 'Vendor Name', 'PO Date', 'Amount', 'Status', 'Supply Status', 'Doc Category']

            }
            let jsonData: any = JSON.stringify(jsonArrrayData);
            this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Purchase Order List", columns, columnHeaders, 'PurchaseOrder');
        }
    }

    getWarningErrorMessage(messageKey) {
        return this.checkboxErrorMsg[messageKey] + "purchase Order";
    }
    filterPODetails() {
        $("#toggle-filter-billing").slideToggle();
        this.filterPOForm.reset();
    }
    getFilteredPOList() {
        if (this.filterPOForm.value.frmDate == null) {
            this.filterPOForm.value.frmDate = ""
        }
        if (this.filterPOForm.value.toDate == null) {
            this.filterPOForm.value.toDate = ""
        }
        if (!(this.filterPOForm.value.frmDate.length == 0 &&
            this.filterPOForm.value.toDate.length == 0)
        ) {
            this.purchaseListPayload['from_date'] = this.splitDateDetails(this.filterPOForm.value.frmDate);
            this.purchaseListPayload['to_date'] = this.splitDateDetails(this.filterPOForm.value.toDate);
        }
        this.getpurchaseOrderList();
    }
    splitDateDetails(dateVal) {
        if (dateVal != null && dateVal.length != 0) {
            let dateArray = dateVal.split("-");
            return dateArray[2] + dateArray[1] + dateArray[0];
        } else {
            return null;
        }
    }
}
