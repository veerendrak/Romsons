import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { DateAdapter } from '@angular/material';
import { MessagePropertiesService } from '../../services/message-properties.service';
import {EnvConfigurationService} from '../../services/env-configuration.service';
declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var XLSX: any;
declare var XLS: any;
var mergeItems = [];
@Component({
    selector: 'app-edit-purchase-order',
    templateUrl: './edit-purchase-order.component.html',
    styleUrls: ['./edit-purchase-order.component.css']
})
export class EditPurchaseOrderComponent implements OnInit {

    purchaseOrderForm: FormGroup;
    createPurchaseOrderForm: FormGroup;
    @Output()
    @Input() salesSeries: any = "";
    title: any;
    bpId: any;
    orgId: any;
    accessObjectId: any;
    purchaseOrderMessage: any;
    formResetFlag: boolean = false;
    formEditObj: any;
    createpurchaseOrderItems: any;
    indeterminate: boolean = false;
    checked: boolean = false;
    checkedObjects: any;
    matnrDetails: any;
    calcBtn: boolean = true;
    saveBtn: boolean = false;
    uploadExcelFlag: boolean = false;
    managepurchasePayload: any;
    manageSalesPayloadLength: any;
    vendorId: any;
    orderType: any;
    calcResultsList: any;
    errorList: any;
    errorFlag: boolean = false;
    fromPage: any;
    vendorList: any;
    vendorListLength: any;
    sdName: any;
    shName: any;
    sdNameId: any;
    shNameId: any;
    sdSubId: any;
    shSubId: any;
    payload: any;
    disableBtns: boolean = false;
    canceldisableBtns: boolean = true;
    orderNum: any;
    createSalesFlag: boolean = true;
    createdSales: boolean = false;
    poNum: any;
    purchaseOrderDtlList: any;
    doc_Date: any;
    displayFlag: boolean = false;
    purchaseDlvAddress: any;
    plantDlvAddress: any;
    vendorNames: any;
    hospitalName: any;
    orderTypes: any;
    vendorschemes: any;
    boxList: any;
    totalPrice: any;
    totalIgstVal: any;
    totalCgstVal: any;
    totalSgstVal: any;
    totalGrossVal: any;
    actionType: any;
    objectArrayList: any;
    disableList: any;
    customerNames: any;
    rolekaduser: any;
    cdListLength: any;
    postatus: any;
    editbtn: any;
    vendorTypes: any;
    createdPurchase: boolean = true;
    createPurchaseFlag: boolean = false;
    grFlag: boolean = true;
    grClFlag: boolean = false;
    purchaseBlock: boolean = true;
    goodsreceiptBlock: boolean = false;
    invoiceBlock: boolean = false;
    grNum: any;
    createGRForm: FormGroup;
    purInvId: any;
    dlvNum: any;
    createPurInvForm: FormGroup;
    selectedReferenceType: any;
    disableHsp: boolean = false;
    headerText: any;
    constructor(private http: Http, private formBuilder: FormBuilder,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private dateAdapter: DateAdapter<Date>, private activatedRoute: ActivatedRoute, private environment: EnvConfigurationService) {
        this.app.isActive = true;
        this.dateAdapter.setLocale('en-gb');
        this.purchaseOrderForm = formBuilder.group({
            'docType': ['', Validators.required],
            'vendorCode': ['', Validators.required],
            'vendorName': [],
            'customer': [],
            'docDate': ['', Validators.required],
            'billingAddr': [],
            'shippingAddr': []
        });
        this.createPurInvForm = formBuilder.group({
            'reference': ['', Validators.required],
            'refNum': ['', Validators.required],
        });
        this.createGRForm = formBuilder.group({
            'docType': ['', Validators.required],
            'dlvNumber': ['', Validators.required]
        })
        this.purchaseOrderMessage = messagesService.purchase_order_details_msg;
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjectId = localStorage.getItem("Purchase Order");
        this.createpurchaseOrderItems = [];
        this.matnrDetails = [];
        this.checkedObjects = [];
        this.calcBtn = true;
        this.saveBtn = false;
        this.editbtn = false;
        this.managepurchasePayload = {};
        this.calcResultsList = {};
        this.errorList = [];
        this.vendorList = {};
        this.vendorListLength = 0;
        this.manageSalesPayloadLength = 0;
        this.fromPage = "";
        this.shName = "";
        this.sdName = "";
        this.shNameId = "";
        this.sdNameId = "";
        this.sdSubId = "";
        this.shSubId = "";
        this.payload = {};
        this.orderNum = "";
        this.createSalesFlag = true;
        this.createdSales = false;
        this.poNum = "";
        this.purchaseOrderDtlList = [];
        this.doc_Date = "";
        this.purchaseDlvAddress = "";
        this.plantDlvAddress = "";
        this.createPurchaseOrderForm = formBuilder.group({
            hideRequired: false,
            floatLabel: 'auto',
            'vendorName': ['', Validators.required],
            'docType': ['', Validators.required],
        });
        this.vendorNames = [];
        this.orderTypes = [];
        this.vendorschemes = [];
        this.boxList = [];
        this.totalPrice = 0;
        this.totalIgstVal = 0;
        this.totalCgstVal = 0;
        this.totalSgstVal = 0;
        this.totalGrossVal = 0;
        this.actionType = "";
        this.objectArrayList = [];
        this.disableList = [];
        this.customerNames = [];
        this.rolekaduser = false;
        this.cdListLength = 0;
        this.vendorTypes = [];
        this.createPurchaseFlag = false;
        this.createdPurchase = true;
        this.grFlag = true;
        this.grClFlag = false;
        this.purchaseBlock = true;
        this.goodsreceiptBlock = false;
        this.invoiceBlock = false;
        this.grNum = "";
        this.purInvId = "";
        this.dlvNum = "";
        this.selectedReferenceType = "";
        this.disableHsp = false;
        this.headerText = "";
    }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    ngOnInit() {
        setTimeout(function() {
            $(document).ready(function() {
                $("input[type=file]").change(function() {
                    mergeItems = [];
                    var file = this.files[0];
                    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
                    var fileName = $("#uploadExcel").val()
                    fileName = fileName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ' ');
                    $("#loadingIcon").show();
                    $("#black-overlay").show();
                    var errorFlag = false;
                    $("#errorExcelTable").find('tbody').html('');
                    var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
                    if ($("#uploadExcel").val().toLowerCase().indexOf(".xlsx") > 0 || $("#uploadExcel").val().toLowerCase().indexOf(".xls") > 0) {
                        xlsxflag = true;
                        if (typeof (FileReader) != "undefined") {
                            var reader = new FileReader();
                            reader.onload = function(e: any) {
                                if (e.target.result.length == 1) {
                                    /*$.notify({
                                        title: '',
                                        message: "No data available in the uploaded file"
                                    }, {
                                            type: "warning"
                                        });*/
                                    $("#loadingIcon").hide();
                                    $("#black-overlay").hide();
                                    return false;
                                }

                                var rowslist = e.target.result;
                                if (xlsxflag) {
                                    var workbook = XLSX.read(rowslist, { type: 'binary' });
                                }
                                else {
                                    var workbook = XLS.read(rowslist, { type: 'binary' });
                                }
                                /*Gets all the sheetnames of excel in to a variable*/
                                var sheet_name_list = workbook.SheetNames;

                                var cnt = 0;
                                sheet_name_list.forEach(function(y) { /*Iterate through all sheets*/
                                    /*Convert the cell value to Json*/
                                    if (xlsxflag) {
                                        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                                    }
                                    else {
                                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                                    }
                                    if (exceljson.length > 200) {
                                        $.notify({
                                            title: '',
                                            message: "Data Items Limit is exceeded"
                                        }, {
                                                type: "warning"
                                            });
                                        return false;
                                    }
                                    if (exceljson.length == 0) {
                                        /*$.notify({
                                            title: '',
                                            message: "No data available in the uploaded file"
                                        }, {
                                                type: "warning"
                                            });*/
                                        return false;
                                    }
                                    if (exceljson.length > 0 && cnt == 0) {
                                        mergeItems = [];
                                        var columnSet = [];
                                        for (var i = 0; i < exceljson.length; i++) {
                                            var rowHash = exceljson[i];
                                            for (var key in rowHash) {
                                                if (rowHash.hasOwnProperty(key)) {
                                                    if ($.inArray(key, columnSet) == -1) {
                                                        columnSet.push(key);
                                                    }
                                                }
                                            }
                                        }
                                        var columns = columnSet;
                                        for (var i = 0; i < exceljson.length; i++) {
                                            //if (exceljson.length > mergeItems.length) {
                                            var newObject = {
                                                "mat_num": "",
                                                "qty": 0,
                                                "uom": "",
                                                "desc": "",
                                                "price": 0,
                                                "deldate": "",
                                                "storloc": "",
                                                "plant": "",
                                                "net_val": "",
                                                "sgst_rt": "",
                                                "sgst_val": 0,
                                                "cgst_rt": "",
                                                "cgst_val": 0,
                                                "igst_rt": "",
                                                "igst_val": 0,
                                                "grossValue": 0,
                                                "displayRow": true,
                                                "updateflag": "I",
                                                "itemNumber": '',
                                                "disable": false,
                                                "errorMat": true
                                            }
                                            var row = jQuery.extend({}, newObject);
                                            mergeItems.push(row);
                                            //}
                                            for (var colIndex = 0; colIndex < columns.length; colIndex++) {
                                                var cellValue = exceljson[i][columns[colIndex]];
                                                if (cellValue == null)
                                                    cellValue = "";
                                                if (colIndex == 0) {
                                                    mergeItems[i]['mat_num'] = cellValue;
                                                }
                                                else {
                                                    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                                                    if (format.test(cellValue)) {
                                                        var row$ = $('<tr/>');
                                                        var rowNum = i + 1;
                                                        var errorLine = "Special characters are not allowed check this line Item row number " + rowNum + " " + mergeItems[i]['mat_num'] + " and quantity" + cellValue
                                                        row$.append($('<td/>').html(errorLine));
                                                        $("#errorExcelTable").find('tbody').append(row$);
                                                        errorFlag = true;
                                                    }
                                                    //cellValue=parseFloat(cellValue);
                                                    mergeItems[i]['qty'] = cellValue;
                                                }



                                            }
                                        }
                                        cnt++;
                                    }
                                });
                                if (errorFlag) {
                                    $("#displayExcelErrorsModal").modal('show');
                                    return false;
                                }
                                $("#mergeItemList").click();
                                $("#uploadExcel").val("")
                            }
                            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                                reader.readAsArrayBuffer($("#uploadExcel")[0].files[0]);
                            }
                            else {
                                reader.readAsBinaryString($("#uploadExcel")[0].files[0]);
                            }
                            //reader.readAsText( $( "#stockFile" )[0].files[0] );
                            $("#loadingIcon").hide();
                            $("#black-overlay").hide();
                        } else {
                            $("#loadingIcon").hide();
                            $("#black-overlay").hide();
                            alert("This browser does not support HTML5.");
                        }
                    } else {
                        $("#loadingIcon").hide();
                        $("#black-overlay").hide();
                        alert("Please upload a valid CSV file.");
                    }
                });
            });
        }, 800);
        this.createpurchaseOrderItems = [
            {
                "mat_num": "",
                "qty": 0,
                "uom": "",
                "desc": "",
                "price": 0,
                "deldate": "",
                "storloc": "",
                "plant": "",
                "net_val": "",
                "sgst_rt": "",
                "sgst_val": 0,
                "cgst_rt": "",
                "cgst_val": 0,
                "igst_rt": "",
                "igst_val": 0,
                "grossValue": 0,
                "boxSize": 0,
                "displayRow": true,
                "schemesFlag": false,
                "itemNumber": '',
                "errorMat": true
            },
            {
                "mat_num": "",
                "qty": 0,
                "uom": "",
                "desc": "",
                "price": 0,
                "deldate": "",
                "storloc": "",
                "plant": "",
                "net_val": "",
                "sgst_rt": "",
                "sgst_val": 0,
                "cgst_rt": "",
                "cgst_val": 0,
                "igst_rt": "",
                "igst_val": 0,
                "grossValue": 0,
                "boxSize": 0,
                "displayRow": true,
                "schemesFlag": false,
                "itemNumber": '',
                "errorMat": true
            },
            {
                "mat_num": "",
                "qty": 0,
                "uom": "",
                "desc": "",
                "price": 0,
                "deldate": "",
                "storloc": "",
                "plant": "",
                "net_val": "",
                "sgst_rt": "",
                "sgst_val": 0,
                "cgst_rt": "",
                "cgst_val": 0,
                "igst_rt": "",
                "igst_val": 0,
                "grossValue": 0,
                "boxSize": 0,
                "displayRow": true,
                "schemesFlag": false,
                "itemNumber": '',
                "errorMat": true
            },
            {
                "mat_num": "",
                "qty": 0,
                "uom": "",
                "desc": "",
                "price": 0,
                "deldate": "",
                "storloc": "",
                "plant": "",
                "net_val": "",
                "sgst_rt": "",
                "sgst_val": 0,
                "cgst_rt": "",
                "cgst_val": 0,
                "igst_rt": "",
                "igst_val": 0,
                "grossValue": 0,
                "boxSize": 0,
                "displayRow": true,
                "schemesFlag": false,
                "itemNumber": '',
                "errorMat": true
            },
            {
                "mat_num": "",
                "qty": 0,
                "uom": "",
                "desc": "",
                "price": 0,
                "deldate": "",
                "storloc": "",
                "plant": "",
                "net_val": "",
                "sgst_rt": "",
                "sgst_val": 0,
                "cgst_rt": "",
                "cgst_val": 0,
                "igst_rt": "",
                "igst_val": 0,
                "grossValue": 0,
                "boxSize": 0,
                "displayRow": true,
                "schemesFlag": false,
                "itemNumber": '',
                "errorMat": true
            }
        ]
        //        if (this.commonService.saleType == 'Create') {
        //            this.title = "Purchase Order/ Create";
        //        } else {
        //            this.title = "Edit Purchase Order";
        //        }
        if (localStorage.getItem("roleName") == "KAD User") {
            this.rolekaduser = false;
        }
        else {
            this.rolekaduser = true;
        }
        this.applyDataTableAndPicker();
        if ($('body').hasClass('cat__menu-left--visible')) {
            $(".ell-spa").removeAttr("style");
        }
        else {
            $(".ell-spa").attr("style", "width:450px");
        }

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
        setTimeout(() => {
            var width = $("#mainContent").css("width");
            $(".outbound-footer").css("width", width);
        }, 50);
        mergeItems = this.createpurchaseOrderItems;
        $(() => {
            $(document).on("blur", ".materialNum", function(e) {
                console.log('calling load');
                var id = $(this).attr('id');
                id = id.split("-")[1];
                $("#changeMaterial").val(id);
                setTimeout(() => { $("#material-input").click() }, 900);
            });
            $(document).on("input", ".numbersOnly", function() {
                this.value = this.value.replace(/[^\d]/g, '');
            });
            $(document).on('click', function(e) {
                if (!$(e.target).hasClass('ajax-list')) {
                    $(".ajax-searchlist").hide();
                }
            });
            $("#purchase-order-table").scroll(function() {
                $(".ajax-searchlist").hide();
            });
        });
        this.activatedRoute.queryParams.subscribe(params => {
            console.log(this.router.url);

            if (this.router.url.includes("purchaseorder")) {
                if (params['action'] == "U") {
                    this.disableHsp = false;
                    //this.title = "Purchase Order / Edit (" + params["orderNum"] + ")";
                }
                if (params['action'] == "DIS") {
                    //this.title = "Purchase Order / Display (" + params["orderNum"] + ")";
                    this.disableHsp = true;
                    this.displayFlag = true;
                    this.postatus = params['postatus'];
                    this.commonService.postatus = this.postatus;
                    if (this.postatus == "Released") {
                        this.editbtn = true;
                        this.disableHsp = true;
                    }
                }
                // $("#gs-GSTR1").attr("style", "background:#036963;color:#fff");
                this.actionType = params['action']
                this.orderType = params["orderType"];
                this.vendorId = params["vendorId"];
                this.fromPage = params["frompage"];
                $("#gs-GSTR1").hide();
                $("#icon-GSTR1").show();
            }

            if (this.router.url.includes("goodsreceipt")) {
                this.purchaseBlock = false;
                this.goodsreceiptBlock = true;
                this.invoiceBlock = false;
                this.postatus = this.commonService.postatus;
                let grNum: any = params['grNumber'];
                if (params['action'] == "DIS") {
                    this.title = "Goods Receipt / Display (" + grNum + ")";
                }
                $("#gs-GSTR2").attr("style", "background:#036963;color:#fff");
                this.createPurchaseFlag = false;
                this.createdPurchase = true;
                this.grFlag = false;
                this.grClFlag = true;
                $("#gs-GSTR1").hide();
                $("#icon-GSTR1").show();
                this.navigatePath('goodsreceipt');
                return false;
            }
            if (this.router.url.includes("invoicedetails")) {
                this.purchaseBlock = false;
                this.goodsreceiptBlock = false;
                this.invoiceBlock = true;
                this.postatus = this.commonService.postatus;
                let piNum: any = params['po_inv_num']
                if (params['action'] == "DIS") {
                    this.title = "Purchase Invoice / Display (" + piNum + ")";
                }
                $("#gs-GSTR1A").attr("style", "background:#036963;color:#fff");
                this.createPurchaseFlag = false;
                this.createdPurchase = true;
                this.grFlag = false;
                this.grClFlag = true;
                this.navigatePath('purchaseinvoice');
                return false;

            }
            this.poNum = params["orderNum"];
            this.getSchemeList();
            this.getpurchaseorderDetails();
            this.getPlantDetails();

        });
    }
    selected_customerItem(response, modalBlock, textInput, hiddenInput) {
        if (response.cust_name == null && response.cust_name == undefined) {
            $("#" + textInput).val(response.cust_id);
        } else {
            let val: any = response.cust_id + "-" + response.cust_name;
            $("#" + textInput).val(val);
        }

        $("#" + hiddenInput).val(response.cust_id);
        $("#" + modalBlock).hide();
    }
    extract_customerData(id, spinnerId, ajaxDropdown, event) {
        let term: any = $("#" + id).val();
        if (term == "" || term == null) {
            $("#modal-searchInput").val("");
        }
        if (this.customerNames.length == 0) {
            if (term.length > 3) {
                term = term.substring(0, 3);
            }
        }
        if (term.length == 3 && event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
            $("#" + spinnerId).show();
            let url: any = this.environment.getRequiredApi("find_customers") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&cust_name=" + term + "&";
            this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response => {
                if (response.status == 0) {
                    this.customerNames = response["data"].ex_cust_list;
                    this.cdListLength = Object.keys(this.customerNames).length;
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
                this.cdListLength = 0;
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
    editPurchaseOrder() {

        const path: any = "purchaseorder/editpurchaseorder";
        this.router.navigate([path], { queryParams: { "orderNum": this.poNum, "action": "U", frompage: "PO" } });
        this.displayFlag = false;
        if (this.postatus == 'Pending') {
            this.disableHsp = false;
        }
        this.applyDataTableAndPicker();
        $(document).ready(function() {
            $("input[type=file]").change(function() {
                mergeItems = [];
                var file = this.files[0];
                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
                var fileName = $("#uploadExcel").val()
                fileName = fileName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ' ');
                $("#loadingIcon").show();
                $("#black-overlay").show();
                var errorFlag = false;
                $("#errorExcelTable").find('tbody').html('');
                var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
                if ($("#uploadExcel").val().toLowerCase().indexOf(".xlsx") > 0 || $("#uploadExcel").val().toLowerCase().indexOf(".xls") > 0) {
                    xlsxflag = true;
                    if (typeof (FileReader) != "undefined") {
                        var reader = new FileReader();
                        reader.onload = function(e: any) {
                            if (e.target.result.length == 1) {
                                /*$.notify({
                                     title: '',
                                     message: "No data available in the uploaded file"
                                 }, {
                                         type: "warning"
                                     });*/
                                $("#loadingIcon").hide();
                                $("#black-overlay").hide();
                                return false;
                            }

                            var rowslist = e.target.result;
                            if (xlsxflag) {
                                var workbook = XLSX.read(rowslist, { type: 'binary' });
                            }
                            else {
                                var workbook = XLS.read(rowslist, { type: 'binary' });
                            }
                            /*Gets all the sheetnames of excel in to a variable*/
                            var sheet_name_list = workbook.SheetNames;

                            var cnt = 0;
                            sheet_name_list.forEach(function(y) { /*Iterate through all sheets*/
                                /*Convert the cell value to Json*/
                                if (xlsxflag) {
                                    var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                                }
                                else {
                                    var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                                }
                                if (exceljson.length > 200) {
                                    $.notify({
                                        title: '',
                                        message: "Data Items Limit is exceeded"
                                    }, {
                                            type: "warning"
                                        });
                                    return false;
                                }
                                if (exceljson.length == 0) {
                                    /*$.notify({
                                        title: '',
                                        message: "No data available in the uploaded file"
                                    }, {
                                            type: "warning"
                                        });*/
                                    return false;
                                }
                                if (exceljson.length > 0 && cnt == 0) {
                                    mergeItems = [];
                                    var columnSet = [];
                                    for (var i = 0; i < exceljson.length; i++) {
                                        var rowHash = exceljson[i];
                                        for (var key in rowHash) {
                                            if (rowHash.hasOwnProperty(key)) {
                                                if ($.inArray(key, columnSet) == -1) {
                                                    columnSet.push(key);
                                                }
                                            }
                                        }
                                    }
                                    var columns = columnSet;
                                    for (var i = 0; i < exceljson.length; i++) {
                                        //if (exceljson.length > mergeItems.length) {
                                        var newObject = {
                                            "mat_num": "",
                                            "qty": 0,
                                            "uom": "",
                                            "desc": "",
                                            "price": 0,
                                            "deldate": "",
                                            "storloc": "",
                                            "plant": "",
                                            "net_val": "",
                                            "sgst_rt": "",
                                            "sgst_val": 0,
                                            "cgst_rt": "",
                                            "cgst_val": 0,
                                            "igst_rt": "",
                                            "igst_val": 0,
                                            "grossValue": 0,
                                            "displayRow": true,
                                            "updateflag": "I",
                                            "itemNumber": '',
                                            "disable": false,
                                            "errorMat": true
                                        }
                                        var row = jQuery.extend({}, newObject);
                                        mergeItems.push(row);
                                        //}
                                        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
                                            var cellValue = exceljson[i][columns[colIndex]];
                                            if (cellValue == null)
                                                cellValue = "";
                                            if (colIndex == 0) {
                                                mergeItems[i]['mat_num'] = cellValue;
                                            }
                                            else {
                                                var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                                                if (format.test(cellValue)) {
                                                    var row$ = $('<tr/>');
                                                    var rowNum = i + 1;
                                                    var errorLine = "Special characters are not allowed check this line Item row number " + rowNum + " " + mergeItems[i]['mat_num'] + " and quantity" + cellValue
                                                    row$.append($('<td/>').html(errorLine));
                                                    $("#errorExcelTable").find('tbody').append(row$);
                                                    errorFlag = true;
                                                }
                                                //cellValue=parseFloat(cellValue);
                                                mergeItems[i]['qty'] = cellValue;
                                            }



                                        }
                                    }
                                    cnt++;
                                }
                            });
                            if (errorFlag) {
                                $("#displayExcelErrorsModal").modal('show');
                                return false;
                            }
                            $("#mergeItemList").click();
                            $("#uploadExcel").val("")
                        }
                        if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                            reader.readAsArrayBuffer($("#uploadExcel")[0].files[0]);
                        }
                        else {
                            reader.readAsBinaryString($("#uploadExcel")[0].files[0]);
                        }
                        //reader.readAsText( $( "#stockFile" )[0].files[0] );
                        $("#loadingIcon").hide();
                        $("#black-overlay").hide();
                    } else {
                        $("#loadingIcon").hide();
                        $("#black-overlay").hide();
                        alert("This browser does not support HTML5.");
                    }
                } else {
                    $("#loadingIcon").hide();
                    $("#black-overlay").hide();
                    alert("Please upload a valid CSV file.");
                }
            });
        });

    }
    getPlantDetails() {
        let url: any = this.environment.getRequiredApi("get_plant_details") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&";
        this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response => {
            if (response.status == 0) {
                this.plantDlvAddress = response['data'].ex_plant_details;
            } else {
                this.commonService.responseMessages("", response.message, "warning");
            }
        })
    }
    getpurchaseorderDetails() {
        this.commonService.grNum = "";
        this.commonService.purInvId = "";
        this.commonService.dlvNum = "";
        $('#loadingIcon').show();
        $("#black-overlay").show();
        let url: any = this.environment.getRequiredApi("get_purchase_order_display") + "?po_num=" + this.poNum + "&org_id=" + this.orgId + "&bp_id=" + this.bpId + "&";
        this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response => {
            if (response.status == 0) {
                this.purchaseOrderDtlList = response["data"];
                if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_header')) {
                    if (this.purchaseOrderDtlList['ex_po_header']['doc_date'] != "0000-00-00") {
                        let date: any = this.purchaseOrderDtlList['ex_po_header']['doc_date'];

                        if (date != '' && date != undefined) {
                            date = date.split("-");
                        }

                        this.doc_Date = date[2] + "/" + date[1] + "/" + date[0];
                        //$('#docDate').val(this.doc_Date);
                        this.shNameId = this.purchaseOrderDtlList['ex_po_header']['vendor'];
                        this.shSubId = this.shNameId.replace(/\b(0(?!\b))+/g, "");
                        let vendor: any = this.shSubId + "-" + this.purchaseOrderDtlList['ex_po_header']['vend_name'];
                        $('#txt_vendor').val(vendor);
                    }
                    if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_address')) {
                        this.purchaseDlvAddress = this.purchaseOrderDtlList['ex_po_address'];
                    }
                    if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_gr_num')) {
                        this.grNum = this.purchaseOrderDtlList.ex_po_gr_num;
                        this.commonService.grNum = this.grNum;
                    }
                    if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_inv_id')) {
                        this.purInvId = this.purchaseOrderDtlList.ex_po_inv_id;
                        this.commonService.purInvId = this.purInvId;
                    }
                    if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_del_note')) {
                        this.dlvNum = this.purchaseOrderDtlList.ex_po_del_note;
                        this.commonService.dlvNum = this.dlvNum;
                    }
                    if (this.purchaseOrderDtlList.hasOwnProperty('ex_header_texts')) {
                        if (this.purchaseOrderDtlList['ex_header_texts'].length > 0) {
                            if (this.purchaseOrderDtlList['ex_header_texts'][0].hasOwnProperty('text_line')) {
                                this.headerText = this.purchaseOrderDtlList['ex_header_texts'][0].text_line
                            }
                        }
                    }
                    if (this.purchaseOrderDtlList.hasOwnProperty('ex_cust_details')) {
                        if (this.purchaseOrderDtlList['ex_cust_details'].hasOwnProperty('cust_id')) {
                            this.hospitalName = this.purchaseOrderDtlList['ex_cust_details']['cust_id'] + "-" + this.purchaseOrderDtlList['ex_cust_details']['cust_name'];
                            if (this.purchaseOrderDtlList['ex_cust_details']['cust_id'] != 'undefined' && this.purchaseOrderDtlList['ex_cust_details']['cust_name'] != 'undefined') {
                                $('#txt_hospital').val(this.hospitalName);
                                $("#modal-searchInput").val(this.purchaseOrderDtlList['ex_cust_details']['cust_id']);
                            }
                        }
                    }
                    if (this.purchaseOrderDtlList['ex_po_header'].hasOwnProperty('doc_type')) {
                        this.orderType = this.purchaseOrderDtlList['ex_po_header']['doc_type'];
                        this.commonService.orderType = this.orderType;
                        if (this.orderType == 'ZCC' || this.orderType == 'ZNB') {
                            if (this.actionType == "U") {
                                this.title = "Purchase Order / Edit (" + this.poNum + ")";
                            }
                            if (this.actionType == "DIS") {
                                this.title = "Purchase Order / Display (" + this.poNum + ")";
                                this.displayFlag = true;
                            }
                        } else {
                            if (this.orderType == 'ZRN') {
                                if (this.actionType == "U") {
                                    this.title = "Purchase Return / Edit (" + this.poNum + ")";
                                }
                                if (this.actionType == "DIS") {
                                    this.title = "Purchase Return / Display (" + this.poNum + ")";
                                    this.displayFlag = true;
                                }
                            } else {
                                if (this.actionType == "U") {
                                    this.title = "Purchase Order / Edit (" + this.poNum + ")";
                                }
                                if (this.actionType == "DIS") {
                                    this.title = "Purchase Order / Display (" + this.poNum + ")";
                                    this.displayFlag = true;
                                }
                            }
                        }
                    }

                }
                if (this.purchaseOrderDtlList.hasOwnProperty('ex_status_items')) {
                    if (this.purchaseOrderDtlList['ex_status_items'].length > 0) { }
                    //this.dlvStatus= this.salesOrderDtlList['ex_status_items'][0].deliv_stat   
                }
                if (this.purchaseOrderDtlList.hasOwnProperty("ex_items")) {
                    this.createpurchaseOrderItems = [];

                    this.purchaseOrderDtlList['ex_items'].forEach(response => {
                        let object: any = {};
                        object['poNumber'] = response.po_number;
                        object['itemNumber'] = response.po_item;
                        object['mat_num'] = response.material;
                        object['org_mat_num'] = response.material;
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
                        object['boxSize'] = 0;
                        object['schemesFlag'] = false;
                        object['updateflag'] = "U";
                        object['zspe'] = false;
                        object['zsvl'] = false;
                        object['zper'] = false;
                        object['zval'] = false;
                        object['grossValue'] = 0;
                        object['disable'] = true;
                        object['errorMat'] = true;
                        this.objectArrayList.push(response.po_item);
                        if (this.purchaseOrderDtlList.hasOwnProperty('ex_mat_price')) {
                            if (this.purchaseOrderDtlList.ex_mat_price.length > 0) {
                                this.purchaseOrderDtlList.ex_mat_price.forEach(currentItem => {
                                    if (currentItem.item_no == response.po_item) {
                                        object['uom'] = currentItem.uom;
                                        object['desc'] = currentItem.mat_desc;
                                        object['price'] = currentItem.mat_price;
                                        object['grossValue'] = currentItem.net_price;
                                        object['sgst_rt'] = Math.round(parseFloat(currentItem.sgst_rate)).toFixed(2);
                                        object['sgst_val'] = currentItem.sgst_value;
                                        object['igst_rt'] = Math.round(parseFloat(currentItem.igst_rate)).toFixed(2);
                                        object['igst_val'] = currentItem.igst_value;
                                        object['cgst_rt'] = Math.round(parseFloat(currentItem.cgst_rate)).toFixed(2);
                                        object['cgst_val'] = currentItem.cgst_value;
                                    }
                                });
                            }
                        }
                        this.createpurchaseOrderItems.push(object);
                    });
                } else {
                    this.objectArrayList = [];
                    this.createpurchaseOrderItems = [
                        {
                            "mat_num": "",
                            "qty": 0,
                            "uom": "",
                            "desc": "",
                            "price": 0,
                            "deldate": "",
                            "storloc": "",
                            "plant": "",
                            "net_val": "",
                            "sgst_rt": "",
                            "sgst_val": 0,
                            "cgst_rt": "",
                            "cgst_val": 0,
                            "igst_rt": "",
                            "igst_val": 0,
                            "grossValue": 0,
                            "boxSize": 0,
                            "displayRow": true,
                            "schemesFlag": false,
                            "itemNumber": '',
                            "updateflag": "I",
                            "disable": false,
                            "errorMat": true

                        },
                        {
                            "mat_num": "",
                            "qty": 0,
                            "uom": "",
                            "desc": "",
                            "price": 0,
                            "deldate": "",
                            "storloc": "",
                            "plant": "",
                            "net_val": "",
                            "sgst_rt": "",
                            "sgst_val": 0,
                            "cgst_rt": "",
                            "cgst_val": 0,
                            "igst_rt": "",
                            "igst_val": 0,
                            "grossValue": 0,
                            "boxSize": 0,
                            "displayRow": true,
                            "schemesFlag": false,
                            "itemNumber": '',
                            "updateflag": "I",
                            "disable": false,
                            "errorMat": true
                        },
                        {
                            "mat_num": "",
                            "qty": 0,
                            "uom": "",
                            "desc": "",
                            "price": 0,
                            "deldate": "",
                            "storloc": "",
                            "plant": "",
                            "net_val": "",
                            "sgst_rt": "",
                            "sgst_val": 0,
                            "cgst_rt": "",
                            "cgst_val": 0,
                            "igst_rt": "",
                            "igst_val": 0,
                            "grossValue": 0,
                            "boxSize": 0,
                            "displayRow": true,
                            "schemesFlag": false,
                            "itemNumber": '',
                            "updateflag": "I",
                            "disable": false,
                            "errorMat": true
                        },
                        {
                            "mat_num": "",
                            "qty": 0,
                            "uom": "",
                            "desc": "",
                            "price": 0,
                            "deldate": "",
                            "storloc": "",
                            "plant": "",
                            "net_val": "",
                            "sgst_rt": "",
                            "sgst_val": 0,
                            "cgst_rt": "",
                            "cgst_val": 0,
                            "igst_rt": "",
                            "igst_val": 0,
                            "grossValue": 0,
                            "boxSize": 0,
                            "displayRow": true,
                            "schemesFlag": false,
                            "itemNumber": '',
                            "updateflag": "I",
                            "disable": false,
                            "errorMat": true
                        },
                        {
                            "mat_num": "",
                            "qty": 0,
                            "uom": "",
                            "desc": "",
                            "price": 0,
                            "deldate": "",
                            "storloc": "",
                            "plant": "",
                            "net_val": "",
                            "sgst_rt": "",
                            "sgst_val": 0,
                            "cgst_rt": "",
                            "cgst_val": 0,
                            "igst_rt": "",
                            "igst_val": 0,
                            "grossValue": 0,
                            "boxSize": 0,
                            "displayRow": true,
                            "schemesFlag": false,
                            "itemNumber": '',
                            "updateflag": "I",
                            "disable": false,
                            "errorMat": true
                        }
                    ]
                }
                let itemNumber: any = null;
                let count = 0;
                if (this.purchaseOrderDtlList.hasOwnProperty("ex_item_schedules")) {
                    this.purchaseOrderDtlList['ex_item_schedules'].forEach(response => {
                        itemNumber = response.po_item;
                        if (response.deliv_date != 'unde-fi-ne' && response.deliv_date != '') {
                            let date: any = response.deliv_date;
                            if (date != '' && date != undefined) {
                                date = date.split("-");
                                this.createpurchaseOrderItems[count].deldate = date[2] + "/" + date[1] + "/" + date[0];
                            }
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
                if (this.vendorschemes.length > 0) {
                    this.createpurchaseOrderItems.forEach(currentItem => {
                        this.vendorschemes.forEach(index => {
                            if (index.mat_id == currentItem.mat_num) {
                                if (index.schemes.length > 0) {
                                    index.schemes.forEach(indexItem => {
                                        if (indexItem.rate != null && indexItem.rate != 0) {
                                            currentItem['schemesFlag'] = true;
                                        }
                                        if (indexItem.rate_value != null && indexItem.rate_value != 0) {
                                            currentItem['schemesFlag'] = true;
                                        }
                                    });
                                }
                            }
                        })
                    })
                }
                let matrlBoxTypeUrl: any = this.environment.getRequiredApi("header_dropdown") + "?group=MTRLS&";
                this.commonService.getData(matrlBoxTypeUrl, "GET", "", this.accessObjectId).subscribe(response => {
                    if (response.status == 0) {
                        this.boxList = response["data"].configValues;
                        this.getBoxAndSchemes();
                    }
                });
                //  this.getPayIncoTerms();
                setTimeout(() => { this.calculateTotals() }, 500);
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
    uploadExcel() {
        $("#uploadExcel").click();
    }
    mergeItemsList() {
        let mergeArray: any = [];
        for (let index of this.createpurchaseOrderItems) {
            if (index.mat_num != "" && index.qty != "") {
                mergeArray.push(index);
            }
        }
        if (mergeArray.length > 0) {
            this.uploadExcelFlag = false;
        } else {
            this.uploadExcelFlag = true;
        }
        this.createpurchaseOrderItems = mergeArray.concat(mergeItems);
        for (let index of this.createpurchaseOrderItems) {
            if (index.mat_num != "" && index.qty != "") {
                index.errorFlagBox = false;
                let date = new Date();
                let day: any = date.setDate(date.getDate() + 1);
                date = new Date(day);
                day = date.getDate();
                if (day < 10) {
                    day = "0" + day;
                }
                let month: any = date.getMonth() + 1;
                let currentDate: any = day + "/0" + month + "/" + date.getFullYear();
                index.deldate = currentDate;
                this.enableSchemesFlag(index);
                if (this.boxList.length > 0) {
                    this.boxList.forEach(currentItem => {
                        if (currentItem.key == index['mat_num']) {
                            let limit: any;
                            index.boxSize = currentItem.addField2;
                            index.boxLimit = currentItem.addField3;
                            if (parseFloat(index.qty) < parseFloat(index.boxSize)) {
                                if (localStorage.getItem("roleName") != "KAD User") {
                                    index.errorFlagBox = true;
                                }
                            } else {
                                if (parseFloat(index.qty) > parseFloat(index.boxSize)) {
                                    limit = parseFloat(index.qty) / parseFloat(index.boxSize);
                                    if (typeof limit === 'number') {  // it is a number
                                        if (limit % 1 != 0) {
                                            if (localStorage.getItem("roleName") != "KAD User") {
                                                index.errorFlagBox = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
        setTimeout(() => {
            this.enableSaveBtn();
            this.enableButtons();
            this.applyDataTableAndPicker();
        }, 100);
    }
    applyDataTableAndPicker() {

        setTimeout(() => {
            $('.datepicker-init-sale').datetimepicker({
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
                format: 'DD/MM/YYYY',
            });
            $('input[id^="date-"]').datetimepicker({
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
                format: 'DD/MM/YYYY',
            });
        }, 500);

    }
    findMaterialDetails(matnr, response, spinnerId, i, ajaxBlock, event) {
        let term: any = matnr.value;
        //if(this.matnrDetails.length==0){
        if (term.length > 2) {
            term = term.substring(0, 2);
        }
        //}
        response.changeFlag = true;
        if (term.length == 2 && event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
            $("#" + spinnerId + "-" + i).show();
            let url: any = this.environment.getRequiredApi("find_matnr_num") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&material=" + matnr.value + "&";
            this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response => {
                if (response.status == 0) {
                    this.matnrDetails = [];
                    $("#" + spinnerId + "-" + i).hide();
                    this.matnrDetails = response["data"].ex_mat_list;
                    $("#" + ajaxBlock + "-" + i).show();
                    setTimeout(() => {
                        $("#" + ajaxBlock + "-" + i).find('ul').find('li:first').addClass('active');
                        $("#" + ajaxBlock + "-" + i).find('ul').find('li:first').focus();
                    }, 100);
                } else {
                    $("#" + spinnerId + "-" + i).hide();
                    $("#" + ajaxBlock + "-" + i).hide();

                }
            });
        } else {
            if (event.keyCode != 13 && event.keyCode != 38 && event.keyCode != 40) {
                var searchText = matnr.value;
                searchText = searchText.toUpperCase();
                $(".ajax-list").removeClass('active');
                $("#" + ajaxBlock + "-" + i).find('ul > li').each(function() {
                    var currentLiText = $(this).text();
                    currentLiText = currentLiText.toUpperCase();
                    var showCurrentLi = currentLiText.indexOf(searchText) !== -1;
                    $(this).toggle(showCurrentLi);
                });
                $("#" + ajaxBlock + "-" + i).find('ul').find('li:visible').first().addClass('active');
                $("#" + ajaxBlock + "-" + i).find('ul').find('li:visible').first().focus();
            }
        }
        if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13) {
            $("#" + ajaxBlock + "-" + i).find('ul > li').each(function() {
                if (event.keyCode == 40) {
                    if ($(this).hasClass('active')) {
                        console.log($(this).attr('class'));
                        if ($(this).next().is(':visible')) {
                            $(this).removeClass('active');
                            $(this).next().addClass('active');
                            $(this).next().focus();
                            $("#" + ajaxBlock + "-" + i).find("ul").scrollTop($(this).position().top);
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
                            $("#" + ajaxBlock + "-" + i).find("ul").scrollTop($(this).position().top);
                            return false;
                        }
                    }
                }
            });
        }
    }
    selectAll(event, checkAll, tableId) {
        setTimeout(() => {
            if ($("#" + checkAll).is(":checked")) {
                this.commonService.selectAllCheckBoxes(checkAll, tableId);
                let count: any = 0;
                this.createpurchaseOrderItems.forEach(response => {
                    if (response.displayRow) {
                        this.checkedObjects.push(count);
                    }
                    count++;
                });
            } else {
                this.commonService.selectAllCheckBoxes(checkAll, tableId);
                this.checkedObjects = [];
            }


        }, 300);

    }
    getReportList(event, tableId, i) {
        setTimeout(() => {
            let flag: boolean = this.commonService.checkAction(tableId);
            if (flag) {
                this.indeterminate = false;
                this.checked = true;
            }
            else {
                this.indeterminate = true;
            }
        }, 400);
        setTimeout(() => {
            if ($("#checkbox-" + i + "-input").is(":checked")) {
                this.checkedObjects.push(i);
            }
            else {
                if (this.checkedObjects.length > 0) {
                    let count: any = 0;
                    for (let index of this.checkedObjects) {
                        if (index == i) {
                            delete this.checkedObjects[count];
                        }
                        count++;
                    }
                }
                setTimeout(() => {
                    let flag: boolean = this.commonService.continueAction(tableId);
                    if (flag) {
                        this.indeterminate = false;
                        this.checked = false;
                    }
                    else {
                        this.indeterminate = true;
                    }
                }, 200);
            }

        }, 300);
    }
    calculatePrice(typeId) {
        this.materialReverse(this.createpurchaseOrderItems);
        setTimeout(() => {
            if (!this.rolekaduser) {
                if ($("#txt_hospital").val() == "" || $("#txt_hospital").val() == null) {
                    this.commonService.responseMessages("", "Please enter hospital name", "warning");
                    return false;
                } else {
                    if ($("#modal-searchInput").val() == "" || $("#modal-searchInput").val() == undefined || $("#modal-searchInput").val() == null) {
                        this.commonService.responseMessages("", "Please enter valid hospital name", "warning");
                        return false;
                    }
                }
            }
            if ($("#purchase-order-table").find('tbody').find('tr').length == 0) {
                if (typeId == 'save') {
                    this.savePurchaseOrderItems();
                    return false;
                }
            }
            if(this.orderType=='ZRN'){
                if (typeId == 'save') {
                    this.savePurchaseOrderItems();
                    return false;
                }
            }
            let obectList: any = [];
            for (let lst of this.createpurchaseOrderItems) {
                if (lst.mat_num != "" && lst.mat_num != undefined && lst.updateflag != 'I' && lst.uom != "") {
                    obectList.push(lst);
                } else {
                    if (lst.updateflag == 'I' && lst.mat_num != "" && lst.mat_num != undefined) {
                        obectList.push(lst);
                    }
                }
            }
            this.createpurchaseOrderItems = obectList;
            this.managepurchasePayload = {};
            $('#loadingIcon').show();
            $("#black-overlay").show();
            this.managepurchasePayload = {};
            let purDate: any;
            if ($("#docDate").val() != null && $("#docDate").val() != "") {
                purDate = $("#docDate").val();
                purDate = purDate.split('/')[2] + "" + purDate.split('/')[1] + "" + purDate.split('/')[0];
            }
            this.managepurchasePayload['bp_id'] = this.bpId;
            this.managepurchasePayload['org_id'] = this.orgId;
            this.managepurchasePayload['im_action'] = "U";
            this.managepurchasePayload['im_ch_testrun'] = "X";
            this.managepurchasePayload['im_ch_ebeln'] = this.poNum;
            this.managepurchasePayload['im_ch_poheader'] = {};
            this.managepurchasePayload['im_ch_poheader']['po_number'] = this.poNum;
            this.managepurchasePayload['im_ch_poheaderx'] = {};
            this.managepurchasePayload['im_ch_poheaderx']['po_number'] = "X";
            this.managepurchasePayload['im_ch_poitems'] = [];
            this.managepurchasePayload['im_ch_pocond'] = [];
            this.managepurchasePayload['im_ch_pocondx'] = [];
            let condCount1: any = 1;
            let oldNum1: any = 0;
            let orgNumber: any = null;
            let highNumber: any = null;
            if (this.objectArrayList.length == 0) {
                let newNumber: any = 0;
                this.objectArrayList.push(newNumber);
            }
            this.objectArrayList.sort(function(a, b) { return a - b });

            for (let item of this.createpurchaseOrderItems) {
                if ((item.updateflag == 'I' && item.displayRow) || (item.updateflag == 'U' || item.updateflag == 'D')) {
                    let object: any = {};
                    if ((item.qty != undefined && item.mat_num != "")) {

                        if (item.updateflag == 'I') {
                            if (orgNumber == null) {
                                if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_last_item')) {
                                    highNumber = this.purchaseOrderDtlList.ex_po_last_item
                                } else {
                                    highNumber = this.objectArrayList[this.objectArrayList.length - 1];
                                }
                                orgNumber = highNumber;
                            } else {
                                if (highNumber == null) {
                                    if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_last_item')) {
                                        highNumber = this.purchaseOrderDtlList.ex_po_last_item
                                    } else {
                                        highNumber = this.objectArrayList[this.objectArrayList.length - 1];
                                    }
                                    orgNumber = highNumber;
                                }
                            }
                            orgNumber = parseFloat(orgNumber) + 10;
                            object['po_item'] = orgNumber;
                            item.itemNumber = orgNumber;
                        } else {
                            orgNumber = item.itemNumber;
                            object['po_item'] = item.itemNumber;
                        }
                        /*if (item.itemNumber == '') {
                            if(oldNum1!=0){
                                oldNum1=oldNum1.replace(/\b(0(?!\b))+/g, "");
                             }
                            oldNum1=parseFloat(oldNum1)/10;
                            oldNum1=oldNum1+1;
                            object['po_item'] = parseFloat(oldNum1) * 10;
                            oldNum1="0"+object['po_item'];
                        } else {
                            object['po_item'] = item.itemNumber;
                            oldNum1=item.itemNumber;
                        }*/
                        if (item.updateflag == 'D') {
                            object['delete_ind'] = 'X';
                        }
                        object['material'] = item.mat_num;
                        object['quantity'] = item.qty;
                        object['orderpr_un'] = item.uom;
                        //if (item.updateflag != 'I') {
                        object['net_price'] = item.price;
                        //}
                        this.managepurchasePayload['im_ch_poitems'].push(object);
                        condCount1++;
                    }
                }
            }
            this.managepurchasePayload['im_ch_poitemx'] = [];
            let condCount2: any = 1;
            let oldNum: any = 0;
            let orgNumber1: any = null;
            let highNumber1: any = null;
            if (this.objectArrayList.length == 0) {
                let newNumber: any = 0;
                this.objectArrayList.push(newNumber);
            }
            this.objectArrayList.sort(function(a, b) { return a - b });
            for (let item of this.createpurchaseOrderItems) {
                if ((item.updateflag == 'I' && item.displayRow) || (item.updateflag == 'U' || item.updateflag == 'D')) {
                    let object: any = {};
                    if ((item.qty != undefined && item.mat_num != "")) {
                        if (item.updateflag == 'I') {
                            if (orgNumber1 == null) {
                                if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_last_item')) {
                                    highNumber1 = this.purchaseOrderDtlList.ex_po_last_item;
                                } else {
                                    highNumber1 = this.objectArrayList[this.objectArrayList.length - 1];
                                }
                                orgNumber1 = highNumber1;
                            } else {
                                if (highNumber1 == null) {
                                    if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_last_item')) {
                                        highNumber1 = this.purchaseOrderDtlList.ex_po_last_item
                                    } else {
                                        highNumber1 = this.objectArrayList[this.objectArrayList.length - 1];
                                    }
                                    orgNumber1 = highNumber1;
                                }
                            }
                            orgNumber1 = parseFloat(orgNumber1) + 10;
                            object['po_item'] = orgNumber1;
                        } else {
                            orgNumber1 = item.itemNumber;
                            object['po_item'] = item.itemNumber;
                        }
                        /*if (item.itemNumber == '') {
                            if(oldNum!=0){
                                oldNum=oldNum.replace(/\b(0(?!\b))+/g, "");
                             }
                            oldNum=parseFloat(oldNum)/10;
                            oldNum=oldNum+1;
                            object['po_item'] = parseFloat(oldNum) * 10;
                            oldNum="0"+object['po_item'];
                        } else {
                            object['po_item'] = item.itemNumber;
                            oldNum=item.itemNumber;
                        }*/
                        if (item.updateflag == 'D') {
                            object['delete_ind'] = 'X';
                        }
                        object['po_itemx'] = 'X';
                        object['plant'] = "X"
                        object['material'] = "X";
                        object['quantity'] = "X";
                        object['orderpr_un'] = "X";
                        //if (item.updateflag != 'I') {
                        object['net_price'] = "X";
                        //}
                        this.managepurchasePayload['im_ch_poitemx'].push(object);
                        condCount2++;
                    }
                }
            }

            this.managepurchasePayload['im_ch_schedule'] = [];
            let condCount: any = 1;
            let oldNum2: any = 0;
            let orgNumber2: any = null;
            let highNumber2: any = null;
            if (this.objectArrayList.length == 0) {
                let newNumber: any = 0;
                this.objectArrayList.push(newNumber);
            }
            this.objectArrayList.sort(function(a, b) { return a - b });
            for (let item of this.createpurchaseOrderItems) {
                if ((item.updateflag == 'I' && item.displayRow) || (item.updateflag == 'U' || item.updateflag == 'D')) {
                    let object: any = {};
                    if ((item.qty != undefined && item.mat_num != "")) {
                        if (item.updateflag == 'I') {
                            if (orgNumber2 == null) {
                                if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_last_item')) {
                                    highNumber2 = this.purchaseOrderDtlList.ex_po_last_item
                                } else {
                                    highNumber2 = this.objectArrayList[this.objectArrayList.length - 1];
                                }
                                orgNumber2 = highNumber2;
                            } else {
                                if (highNumber2 == null) {
                                    if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_last_item')) {
                                        highNumber2 = this.purchaseOrderDtlList.ex_po_last_item
                                    } else {
                                        highNumber2 = this.objectArrayList[this.objectArrayList.length - 1];
                                    }
                                    orgNumber2 = highNumber2;
                                }
                            }
                            orgNumber2 = parseFloat(orgNumber2) + 10;
                            object['po_item'] = orgNumber2;
                        } else {
                            orgNumber2 = item.itemNumber;
                            object['po_item'] = item.itemNumber;
                        }
                        /*if (item.itemNumber == '') {
                            if(oldNum2!=0){
                                oldNum2=oldNum2.replace(/\b(0(?!\b))+/g, "");
                             }
                            oldNum2=parseFloat(oldNum2)/10;
                            oldNum2=oldNum2+1;
                            object['po_item'] = parseFloat(oldNum2) * 10;
                            oldNum2="0"+object['po_item'];
                        } else {
                            object['po_item'] = item.itemNumber;
                            oldNum2=item.itemNumber;
                        }*/
                        object['po_itemx'] = 'X';
                        object['quantity'] = item.qty;
                        let date: any = item.deldate;
                        if (date != "") {
                            date = date.split("/");
                            date = date[2] + "" + date[1] + "" + date[0];
                        }
                        object['delivery_date'] = date;
                        this.managepurchasePayload['im_ch_schedule'].push(object);
                        condCount++;
                    }
                }
            }
            this.managepurchasePayload['im_ch_poschedulex'] = [];
            let condCount3: any = 1;
            let oldNum3: any = 0;
            let orgNumber3: any = null;
            let highNumber3: any = null;
            if (this.objectArrayList.length == 0) {
                let newNumber: any = 0;
                this.objectArrayList.push(newNumber);
            }
            this.objectArrayList.sort(function(a, b) { return a - b });
            for (let item of this.createpurchaseOrderItems) {
                if ((item.updateflag == 'I' && item.displayRow) || (item.updateflag == 'U' || item.updateflag == 'D')) {
                    let object: any = {};
                    if ((item.qty != undefined && item.mat_num != "")) {
                        if (item.updateflag == 'I') {
                            if (orgNumber3 == null) {
                                if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_last_item')) {
                                    highNumber3 = this.purchaseOrderDtlList.ex_po_last_item
                                } else {
                                    highNumber3 = this.objectArrayList[this.objectArrayList.length - 1];
                                }
                                orgNumber3 = highNumber3;
                            } else {
                                if (highNumber3 == null) {
                                    if (this.purchaseOrderDtlList.hasOwnProperty('ex_po_last_item')) {
                                        highNumber3 = this.purchaseOrderDtlList.ex_po_last_item
                                    } else {
                                        highNumber3 = this.objectArrayList[this.objectArrayList.length - 1];
                                    }
                                    orgNumber3 = highNumber3;
                                }
                            }
                            orgNumber3 = parseFloat(orgNumber3) + 10;
                            object['po_item'] = orgNumber3;
                        } else {
                            orgNumber3 = item.itemNumber;
                            object['po_item'] = item.itemNumber;
                        }

                        /*if (item.itemNumber == '') {
                            if(oldNum3!=0){
                                oldNum3=oldNum3.replace(/\b(0(?!\b))+/g, "");
                             }
                            oldNum3=parseFloat(oldNum3)/10;
                            oldNum3=oldNum3+1;
                            object['po_item'] = parseFloat(oldNum3) * 10;
                            oldNum3="0"+object['po_item'];
                        } else {
                            object['po_item'] = item.itemNumber;
                            oldNum3=item.itemNumber;
                        }*/
                        object['po_itemx'] = 'X';
                        object['quantity'] = "X";
                        let date: any = "X";
                        if (date != "") {
                            date = date.split("/");
                            date = date[2] + "" + date[1] + "" + date[0];
                        }
                        object['delivery_date'] = "X";
                        this.managepurchasePayload['im_ch_poschedulex'].push(object);
                        condCount3++;
                    }
                }
            }
            let url: any = this.environment.getRequiredApi("purchase_order_manage") + "?";
            this.commonService.getData(url, "POST", this.managepurchasePayload, this.accessObjectId).subscribe(response => {
                if (response.status == 0) {
                    let calculatedResults: any = response["data"];
                    let count: any = 0;
                    let itemNumber: any = null;
                    if (calculatedResults.hasOwnProperty("ex_return")) {
                        if (calculatedResults['ex_return'].length > 0) {
                            this.errorList = calculatedResults['ex_return'];
                            for (let elist of calculatedResults['ex_return']) {
                                if (elist.type == 'E') {
                                    this.errorFlag = true;
                                    this.saveBtn = true;
                                    $('#loadingIcon').hide();
                                    $("#black-overlay").hide();
                                    $("#displayErrorsModal").modal("show");
                                    return false;
                                }

                            }
                        }
                    }
                    if (response.data.hasOwnProperty('ch_item_mat_price')) {
                        if (response.data['ch_item_mat_price'].length > 0) {
                            let count: any = 0;
                            response.data['ch_item_mat_price'].forEach(currentItem => {
                                this.createpurchaseOrderItems.forEach(index => {
                                    if (parseFloat(currentItem.item_no) == parseFloat(index.itemNumber)) {
                                        index.uom = currentItem.uom;
                                        index.desc = currentItem.mat_desc;
                                        index.price = currentItem.mat_price;
                                        index.sgst_rt = Math.round(currentItem.sgst_rate).toFixed(2);
                                        index.sgst_val = currentItem.sgst_value;
                                        index.cgst_rt = Math.round(currentItem.cgst_rate).toFixed(2);
                                        index.cgst_val = currentItem.cgst_value;
                                        index.igst_rt = Math.round(currentItem.igst_rate).toFixed(2);
                                        index.igst_val = currentItem.igst_value;
                                        index.grossValue = currentItem.net_price;
                                        index.itemNumber = currentItem.item_no;
                                    }
                                });
                                count++;
                            });
                        }
                    }
                    this.reArrangeItems();
                    this.enableButtons();
                    setTimeout(() => {
                        this.calculateTotals();
                        if (typeId == 'save') {
                            this.savePurchaseOrderItems();
                        }
                    }, 500);
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                } else {
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                    this.commonService.responseMessages("", response.message, "warning");
                }
            });
        }, 800);
    }
    reArrangeItems() {
        let reArrangeItems = [];
        for (let item of this.createpurchaseOrderItems) {
            if (item.mat_num != "" && item.qty != "") {
                reArrangeItems.push(item);
            }

        }
        for (let item of this.createpurchaseOrderItems) {
            if (item.mat_num != "" && item.qty == "") {
                reArrangeItems.push(item);
            }

        }
        for (let item of this.createpurchaseOrderItems) {
            if (item.mat_num == "" && item.qty == "") {
                reArrangeItems.push(item);
            }

        }
        this.createpurchaseOrderItems = reArrangeItems;
    }
    changeQtyCalculations(items, id) {
        if ((items.qty == "0" || items.qty == "" || items.qty == 0) && (items.mat_num != "" && items.mat_num != undefined)) {
            if ($("#sales-row-" + id).attr('style') != 'background:#d63e3e') {
                $("#sales-row-" + id).attr('style', 'background:#d63e3e');
                $("#qty-" + id).attr('style', 'border:1px solid red');
                if (!$('.alert-warning').is(":visible")) {
                    this.commonService.responseMessages("", "Quantity should not be zero/empty (" + items.qty + ")", "warning");
                }
            }
            this.calcBtn = true;
            this.saveBtn = true;
            return false;
        } else {
            $("#sales-row-" + id).removeAttr('style');
            $("#qty-" + id).removeAttr('style');
            this.calcBtn = false;
            this.saveBtn = false;

        }
        if (items.qty == "") {
            items.qty = 0;
        }
        if (items.qty != 0) {
            this.vendorschemes.forEach(currentItem => {
                if (currentItem.mat_id == items['mat_num']) {
                    currentItem.schemes.forEach(index => {
                        let maxQty: any;
                        let fullQty: boolean = false;
                        if (index.max_quan.includes('+')) {
                            maxQty = index.max_quan.split("+")[0];
                            fullQty = true;
                        } else {
                            maxQty = index.max_quan;
                        }
                        let qty: any = Math.round(items.qty);
                        let minQty = Math.round(index.min_quan);
                        maxQty = Math.round(maxQty);
                        if (qty >= minQty && (qty <= maxQty || fullQty)) {
                            if (index.rate != "" && index.rate != 0) {
                                //$("#sales-row-"+id).css('border-left','5px solid #00504c');
                                let title: any = "There is a scheme available for this " + items['mat_num'] + " " + index.rate + "%";
                                $("#sales-row-" + id).attr('title', title);
                                return false;
                            }
                            if (index.rate_value != "" && index.rate_value != 0) {
                                //$("#sales-row-"+id).css('border-left','5px solid #00504c');
                                let title: any = "There is a scheme available for this " + items['mat_num'] + " " + index.rate_value;
                                $("#sales-row-" + id).attr('title', title);
                                return false;
                            }
                        }
                    });

                }
            });
        }
        if (items.price != "") {
            let price = items.price * items.qty;
            let percentage: any = 0;
            let disAmt: any = 0;
            let netVal: any = price;// - schVal;
            items.net_val = netVal;
            let igst: any;
            let cgst: any;
            let sgst: any;
            igst = (netVal * items.igst_rt) / 100;
            cgst = (netVal * items.cgst_rt) / 100;
            sgst = (netVal * items.sgst_rt) / 100;
            items.igst_val = igst;
            items.cgst_val = cgst;
            items.sgst_val = sgst;
            let grossVal: any;
            grossVal = netVal + igst + cgst + sgst;
            items.grossValue = grossVal;
        }
        if (items.price != 0) {
            this.enableButtons();
        } else {
            this.calcBtn = false;
            this.saveBtn = true;
        }
        if (items.boxSize !== 0) {
            this.checkBoxLimit(items, id);
        }
        setTimeout(() => { this.calculateTotals() }, 500);
    }
    AddMoreLinesOfItems() {
        let length: any = $("#purchase-order-table").find('tbody').find('tr').length;
        if (length >= 200) {
            this.commonService.responseMessages("", "Added Data Limit is Exceeded", "warning");
            return false;
        }
        for (let i: any = 0; i < 5; i++) {
            let newItem: any = {
                "itemNumber": "",
                "mat_num": "",
                "qty": 0,
                "uom": "",
                "desc": "",
                "price": 0,
                "deldate": "",
                "storloc": "",
                "plant": "",
                "net_val": "",
                "sgst_rt": "",
                "sgst_val": 0,
                "cgst_rt": "",
                "cgst_val": 0,
                "igst_rt": "",
                "igst_val": 0,
                "grossValue": 0,
                "boxSize": 0,
                "displayRow": true,
                "schemesFlag": false,
                "updateflag": "I",
                "disable": false,
                "errorMat": true
            }
            this.createpurchaseOrderItems.push(newItem);
        }
        setTimeout(() => {
            $('input[id^="date-"]').datetimepicker({
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
                format: 'DD/MM/YYYY',
            });
        }, 200)
    }
    savePurchaseOrderItems() {
        if (!this.rolekaduser) {
            if ($("#txt_hospital").val() == "" || $("#txt_hospital").val() == null) {
                this.commonService.responseMessages("", "Please enter hospital name", "warning");
                return false;
            } else {
                if ($("#modal-searchInput").val() == "" || $("#modal-searchInput").val() == undefined || $("#modal-searchInput").val() == null) {
                    this.commonService.responseMessages("", "Please enter valid hospital name", "warning");
                    return false;
                }
            }
        }
        if ($("#purchase-order-table").find('tbody').find('tr').hasClass('error-true')) {
            this.commonService.responseMessages("", "Invalid quantity, it should be convertible to boxes", "warning");
            return false;
        }
        $('#loadingIcon').show();
        $("#black-overlay").show();
        let purDate: any = null;
        this.createpurchaseOrderItems;
        //this.createpurchaseOrderItems=this.createpurchaseOrderItems.concat(this.disableList);
        this.managepurchasePayload = {};
        if ($("#docDate").val() != null && $("#docDate").val() != "") {
            purDate = $("#docDate").val();
            purDate = purDate.split('/')[2] + "" + purDate.split('/')[1] + "" + purDate.split('/')[0];
        }
        this.managepurchasePayload['bp_id'] = this.bpId;
        this.managepurchasePayload['org_id'] = this.orgId;
        this.managepurchasePayload['im_action'] = "U";
        this.managepurchasePayload['im_ch_ebeln'] = this.poNum;
        this.managepurchasePayload['im_ch_poheader'] = {};
        this.managepurchasePayload['im_ch_poheader']['po_number'] = this.poNum;
        this.managepurchasePayload['im_ch_poheaderx'] = {};
        this.managepurchasePayload['im_ch_poheaderx']['po_number'] = "X";
        this.managepurchasePayload['im_ch_poitems'] = [];
        this.managepurchasePayload['im_ch_pocond'] = [];
        this.managepurchasePayload['im_ch_pocondx'] = [];
        this.managepurchasePayload['im_po_status_text'] = $("#header_text").val();
        if (localStorage.getItem("roleName") == "KAD User") {
            let customerId: any = $("#modal-searchInput").val();
            this.managepurchasePayload['im_po_ref_doc'] = customerId;
        }
        let condCount1: any = 0;
        for (let item of this.createpurchaseOrderItems) {
            let object: any = {};
            if (item.mat_num != "" && item.qty != "") {
                object['po_item'] = item.itemNumber;
                if (item.updateflag == 'D') {
                    object['delete_ind'] = 'X';
                }
                object['material'] = item.mat_num;
                object['quantity'] = item.qty;
                object['orderpr_un'] = item.uom;
                object['net_price'] = item.price;
                if (item.displayRow) {
                    this.managepurchasePayload['im_ch_poitems'].push(object);
                } else {
                    if (item.updateflag != 'I') {
                        this.managepurchasePayload['im_ch_poitems'].push(object);
                    }
                }
                condCount1++;
            }
        }
        this.managepurchasePayload['im_ch_poitemx'] = [];
        let condCount2: any = 0;
        for (let item of this.createpurchaseOrderItems) {
            let object: any = {};
            if (item.mat_num != "" && item.qty != "") {
                object['po_item'] = item.itemNumber;
                object['po_itemx'] = 'X';
                if (item.updateflag == 'D') {
                    object['delete_ind'] = 'X';
                }
                object['po_itemx'] = 'X';
                object['plant'] = 'X';
                object['material'] = "X";
                object['quantity'] = "X";
                object['orderpr_un'] = "X";
                object['net_price'] = "X";
                if (item.displayRow) {
                    this.managepurchasePayload['im_ch_poitemx'].push(object);
                } else {
                    if (item.updateflag != 'I') {
                        this.managepurchasePayload['im_ch_poitemx'].push(object);
                    }
                }
                condCount2++;
            }
        }

        this.managepurchasePayload['im_ch_schedule'] = [];
        let condCount: any = 1;
        for (let item of this.createpurchaseOrderItems) {
            let object: any = {};
            if (item.mat_num != "" && item.qty != "") {
                object['po_item'] = item.itemNumber;
                object['po_itemx'] = 'X';
                object['quantity'] = item.qty;
                if (item.updateflag == 'D') {
                    object['delete_ind'] = 'X';
                }
                let date: any = item.deldate;
                if (date != "") {
                    date = date.split("/");
                    date = date[2] + "" + date[1] + "" + date[0];
                }
                object['delivery_date'] = date;
                if (item.displayRow) {
                    this.managepurchasePayload['im_ch_schedule'].push(object);
                } else {
                    if (item.updateflag != 'I') {
                        this.managepurchasePayload['im_ch_schedule'].push(object);
                    }
                }
                condCount++;
            }
        }
        this.managepurchasePayload['im_ch_poschedulex'] = [];
        let condCount3: any = 1;
        for (let item of this.createpurchaseOrderItems) {
            let object: any = {};
            if (item.mat_num != "" && item.qty != "") {
                object['po_item'] = item.itemNumber;
                object['po_itemx'] = 'X';
                object['quantity'] = "X";
                if (item.updateflag == 'D') {
                    object['delete_ind'] = 'X';
                }
                let date: any = item.deldate;
                if (date != "") {
                    date = date.split("/");
                    date = date[2] + "" + date[1] + "" + date[0];
                }
                object['delivery_date'] = "X";
                if (item.displayRow) {
                    this.managepurchasePayload['im_ch_poschedulex'].push(object);
                } else {
                    if (item.updateflag != 'I') {
                        this.managepurchasePayload['im_ch_poschedulex'].push(object);
                    }
                }
                condCount3++;
            }
        }

        let url: any = this.environment.getRequiredApi("purchase_order_manage") + "?";
        this.commonService.getData(url, "POST", this.managepurchasePayload, this.accessObjectId).subscribe(response => {
            if (response.status == 0) {
                this.disableList = [];
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                if (response["data"]['ex_return'].length > 0) {
                    this.errorList = response["data"]['ex_return'];
                    for (let elist of response["data"]['ex_return']) {
                        if (elist.type == 'E') {
                            this.errorFlag = true;
                            $('#loadingIcon').hide();
                            $("#black-overlay").hide();
                            $("#displayErrorsModal").modal("show");
                            return false;
                        }
                    }
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                    this.managepurchasePayload = {};
                    this.commonService.responseMessages("", "Purchase order '" + this.poNum + " 'Updated Succesfully", "success");
                    const path: any = "purchaseorder/editpurchaseorder";
                    this.router.navigate([path], { queryParams: { "orderNum": this.poNum, "action": "DIS", frompage: "PO" } });
                }
            } else {
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                this.commonService.responseMessages("", response.message, "warning");
            }
        });
    }
    removeLineSelectedItems() {
        if (this.checkedObjects.length > 0) {
            this.checkedObjects=this.checkedObjects.filter(function(e){ return e!=undefined});
            if(this.createpurchaseOrderItems.length==this.checkedObjects.length && this.orderType=='ZRN'){
                this.commonService.responseMessages("", "Cannot be remove all items", "warning");
                return false;
            }
            for (let index of this.checkedObjects) {
                if (index != undefined && index != null) {
                    this.createpurchaseOrderItems[index].displayRow = false;
                    if (this.createpurchaseOrderItems[index].updateflag != 'I') {
                        this.createpurchaseOrderItems[index].updateflag = 'D';
                        if (this.createpurchaseOrderItems[index].hasOwnProperty('valid')) {
                            if (!this.createpurchaseOrderItems[index].valid) {
                                this.createpurchaseOrderItems[index].uom = "";
                            }
                        }
                    }
                }
            }
            this.checkedObjects = [];
        } else {
            this.commonService.responseMessages("", "Please select atleast one item", "warning");
        }
        setTimeout(() => {
            let flag: boolean = this.commonService.continueAction("purchase-order-table");
            if (flag) {
                this.indeterminate = false;
                this.checked = false;
            }
            else {
                this.indeterminate = true;
            }
            if ($("#purchase-order-table").find('tbody').find('tr').length == 0) {
                this.indeterminate = false;
                this.checked = false;
            }

        }, 200);
        this.enableButtons();
        setTimeout(() => { this.calculateTotals() }, 500);
        for (let listItem of this.createpurchaseOrderItems) {
            if (!listItem.displayRow && listItem.updateflag != 'I') {
                this.disableList.push(listItem);
            }
        }
    }
    enableButtons() {
        let countId: any = 0;
        for (let lst of this.createpurchaseOrderItems) {
            if ((lst.qty == "0" || lst.qty == "" || lst.qty == 0) && (lst.mat_num != "" && lst.mat_num != undefined)) {
                $("#sales-row-" + countId).attr('style', 'background:#d63e3e');
            }
            countId++;
        }
        let flag: boolean = false;
        let count: any = 0;
        let errorCount: any = null;
        for (let item of this.createpurchaseOrderItems) {
            if (item.displayRow) {
                if ((item.qty != "" && item.qty != 0 && item.qty != "0") && (item.mat_num != "" && item.mat_num != undefined)) {
                    if (item.net_val < 0) {
                        this.calcBtn = true;
                        this.saveBtn = true;
                        return false;
                    }
                    else {
                        this.calcBtn = false;
                        this.saveBtn = false;
                        flag = false;
                    }
                } else {
                    if ((item.qty == "0" || item.qty == "" || item.qty == 0) && (item.mat_num != "" && item.mat_num != undefined)) {
                        errorCount = count;
                    }
                }
            }
            count++;
        }
        if (errorCount != null) {
            this.commonService.responseMessages("", "Quantity should not be zero / empty", "warning");
            this.calcBtn = true;
            this.saveBtn = true;
        }
        setTimeout(() => { this.enableSaveBtn(); }, 300);
    }
    populateFileds(response, matResponse, matType, countId) {
        $(".ajax-searchlist").hide();
        let date = new Date();
        let day: any = date.setDate(date.getDate() + 1);
        date = new Date(day);
        day = date.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        let month: any = date.getMonth() + 1;
        let currentDate: any = day + "/0" + month + "/" + date.getFullYear();
        if (matResponse != undefined) {
            for (let list of matResponse) {
                if (matType == 'matNum') {
                    if (response['mat_num'] != "" && response['mat_num'] != undefined) {
                        if (list['mat_num'] == response['mat_num'].toUpperCase()) {
                            $("#changeMaterial").val('');
                            this.saveBtn = false;
                            response['mat_num'] = list['mat_num'];
                            response['uom'] = list['uom'];
                            response['desc'] = list['mat_name'];
                            //response['qty'] = "";
                            response['price'] = 0;
                            response["deldate"] = currentDate;
                            response["storloc"] = "";
                            response["plant"] = "";
                            //                    response["dis_per_val"]=0;
                            //                    response["dis_amt"]=0;
                            response["net_val"] = 0;
                            response["sgst_rt"] = "";
                            response["sgst_val"] = 0;
                            response["cgst_rt"] = "";
                            response["cgst_val"] = 0;
                            response["igst_rt"] = "";
                            response["igst_val"] = 0;
                            response['grossValue'] = 0;
                            response['errorMat'] = true;
                            response.changeFlag = false;
                            this.getBoxSize(response);
                            this.enableSchemesFlag(response);
                            if (countId != undefined) {
                                this.changeQtyCalculations(response, countId);
                            }
                            return false;
                        } else {
                            if (response.changeFlag) {
                                response['errorMat'] = false;
                            }
                        }
                    }

                }
                if (matType == 'desc') {
                    if (response['desc'] != "") {
                        if (list['mat_name'] == response['desc'].toUpperCase()) {
                            response['uom'] = list['uom'];
                            response['mat_num'] = list['mat_num'];
                            response['desc'] = list['mat_name'];
                            //response['qty'] = "";
                            response['price'] = 0;
                            response["deldate"] = currentDate;
                            response["storloc"] = "";
                            response["plant"] = "";
                            response["net_val"] = 0;
                            response["sgst_rt"] = "";
                            response["sgst_val"] = 0;
                            response["cgst_rt"] = "";
                            response["cgst_val"] = 0;
                            response["igst_rt"] = "";
                            response["igst_val"] = 0;
                            response['grossValue'] = 0;
                            this.getBoxSize(response);
                            this.enableSchemesFlag(response);
                            if (countId != undefined) {
                                this.changeQtyCalculations(response, countId);
                            }
                            return false;
                        }
                    }
                }
            }
        } else {
            if (response != undefined) {
                response['valid'] = false;
                response['errorMat'] = false;
            }
        }
        if (response.mat_num == "") {
            response['mat-num'] = response.org_mat_num;
        }
        $("#changeMaterial").val('');
        this.checkMaterail(response, countId);
    }

    selectedMatrItem(response, modalBlock, inputId, num, item) {
        if (inputId == 'desc') {
            item.desc = response.mat_name;
        }
        if (inputId == 'matNum') {
            item.mat_num = response.mat_num;
        }

        $("#" + modalBlock + "-" + num).hide();
        this.populateFileds(item, this.matnrDetails, inputId, num);
    }
    redirectPurchaseOrder() {
        const path: any = 'purchaseorder';
        this.router.navigate([path]);
    }
    cancelPurchaseOrder() {
    }
    purchaseOrderListPrint() {
    }
    removeStyles(id) {
        $('#' + id).datetimepicker("hide");
        this.purchaseOrderForm.controls['docDate'].setValue($("#docDate").val());

    }
    createNewPO() {
        $("#createPurchaseModal").modal("show");
    }
    createPurchaseForm(id) {
        let orderType: any = $("#orderTypes").val();//ZNB
        $("#" + id).modal("hide");
        const path: any = "purchaseorder/savepurchaseorder";
        let vendorId: any = $("#modal-searchInput").val();
        if (vendorId == "" || vendorId == null) {
            this.commonService.responseMessages("", "Please select valid vendor", "warning");
            return false;
        }
        this.router.navigate([path], { queryParams: { "orderType": orderType, "vendorId": vendorId, "action": "C", frompage: "PO" } });
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

    closeModal(id) {
        $("#" + id).modal("hide");
    }
    selectedDate(id, response) {
        let date: any = $("#date-" + id).val();
        response.deldate = date;
    }
    getSchemeList() {
        let url: any = this.environment.getRequiredApi("get_vendor_schemes") + "/" + this.poNum + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&";
        this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response => {
            if (response.status == 0) {
                if (response["data"].hasOwnProperty('ex_schemes')) {
                    this.vendorschemes = response["data"].ex_schemes;
                    if (this.vendorschemes.length > 0) {
                        for (let ls of this.vendorschemes) {
                            ls.rate = Math.abs(ls.rate);
                            ls.rate_value = Math.abs(ls.rate_value);
                            if (ls.schemes.length > 0) {
                                for (let list of ls.schemes) {
                                    list.rate = Math.abs(list.rate);
                                    list.rate_value = Math.abs(list.rate_value);
                                }
                            }
                        }
                    }
                }
            } else {
                this.commonService.responseMessages("", response.message, "warning");
                return false;
            }

        });

    }
    displaySchemes() {
        this.getSchemeList();
        if (this.vendorschemes.length == 0) {
            this.commonService.responseMessages("", "Schemes are not available for this vendor", "warning");
            return false;
        }
        $("#displaySchemesModal").modal("show");
    }
    closeModalId(id) {
        $("#" + id).modal("hide");
    }
    displaySchemeByMtrl(id, item) {
        if (item.schemesFlag) {
            $("#schemes-" + id).show();
        }
    }
    hideSchemeByMtrl(id, item) {
        $("#schemes-" + id).hide();
    }
    getBoxSize(response) {
        if (this.boxList.length > 0) {
            this.boxList.forEach(currentItem => {
                if (currentItem.key == response['mat_num']) {
                    response.boxSize = currentItem.addField2;
                    response.boxLimit = currentItem.addField3;
                }
            });
        }
    }
    checkBoxLimit(items, id) {
        let count: any = 0;
        let errorFlagBox: boolean = false;
        let list: any = [];
        this.createpurchaseOrderItems.forEach(currentItem => {
            if (currentItem.boxSize != null && currentItem.boxSize != 0 && currentItem.boxSize != "") {
                if (currentItem.mat_num == items.mat_num) {
                    list.push(count);
                    let limit: any;
                    if (parseFloat(items.qty) < parseFloat(currentItem.boxSize)) {
                        if (localStorage.getItem("roleName") != "KAD User") {
                            errorFlagBox = true;
                        }
                    } else {
                        if (parseFloat(items.qty) > parseFloat(currentItem.boxSize)) {
                            limit = parseFloat(items.qty) / parseFloat(currentItem.boxSize);
                            if (typeof limit === 'number') {  // it is a number
                                if (limit % 1 != 0) {
                                    if (localStorage.getItem("roleName") != "KAD User") {
                                        errorFlagBox = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            count++;
            if (this.createpurchaseOrderItems.length == count) {
                if (errorFlagBox) {
                    if (localStorage.getItem("roleName") != "KAD User") {
                        items.errorFlagBox = true;
                        $("#sales-row-" + id).attr('style', 'background:#d63e3e');
                        $("#qty-" + id).attr('style', 'border:1px solid red');
                    }
                } else {
                    $("#sales-row-" + id).removeAttr('style');
                    $("#qty-" + id).removeAttr('style');
                    items.errorFlagBox = false;
                }
                setTimeout(() => { this.enableSaveBtn(); }, 300);
            }

        });

    }
    enableSaveBtn() {
        var flag = false;
        $('.error-true').each(function() {
            flag = true;
        });
        if (flag) {
            this.commonService.responseMessages("", "Invalid quantity, it should be convertible to boxes", "warning");
            this.saveBtn = true;
            return false;
        } else {
            this.saveBtn = false;
        }
    }
    enableSchemesFlag(items) {
        this.vendorschemes.forEach(currentItem => {
            if (currentItem.mat_id == items['mat_num']) {
                currentItem.schemes.forEach(index => {
                    if (index.rate != "" && index.rate != 0) {
                        items.schemesFlag = true;
                        return false;
                    }
                    if (index.rate_value != "" && index.rate_value != 0) {
                        items.schemesFlag = true;
                        return false;
                    }
                });

            }
        });
    }
    getBoxAndSchemes() {
        this.createpurchaseOrderItems.forEach(currentItem => {
            this.boxList.forEach(index => {
                if (index.key == currentItem.mat_num) {
                    currentItem.boxSize = index.addField2;
                }
            });
        });
    }
    printSelectedReports() {
        let url: any = this.environment.getRequiredApi("print_purchase_order") + "?bp_id=" + this.bpId + "&org_id=" + this.orgId + "&im_v_vbeln=" + this.poNum + "&access_obj_id=" + this.accessObjectId + "&access_token=" + localStorage.getItem("token");
        window.open(url, '_blank');
    }
    calculateTotals() {
        let totalPrice: any = 0;
        let totalIgstTaxVal: any = 0;
        let totalCgstTaxVal: any = 0;
        let totalSgstTaxVal: any = 0;
        let totalVal: any = 0;
        let count: any = 0;
        this.createpurchaseOrderItems.forEach(currentItem => {
            if (currentItem.mat_num != '' && currentItem.qty != '' && currentItem.displayRow) {
                totalPrice = parseFloat(totalPrice) + parseFloat(currentItem.price);
                totalIgstTaxVal = parseFloat(totalIgstTaxVal) + parseFloat(currentItem.igst_val);
                totalCgstTaxVal = parseFloat(totalCgstTaxVal) + parseFloat(currentItem.cgst_val);
                totalSgstTaxVal = parseFloat(totalSgstTaxVal) + parseFloat(currentItem.sgst_val);
                totalVal = parseFloat(totalVal) + parseFloat(currentItem.grossValue);
            }
            if (this.createpurchaseOrderItems.length - 1 == count) {
                this.totalPrice = totalPrice;
                this.totalIgstVal = totalIgstTaxVal;
                this.totalCgstVal = totalCgstTaxVal;
                this.totalSgstVal = totalSgstTaxVal;
                this.totalGrossVal = totalVal;

            }
            count++;
        });
    }
    navigatePath(path) {
        if (path == 'purchaseinvoice') {
            this.purchaseBlock = false;
            this.goodsreceiptBlock = false;
            this.invoiceBlock = true;
            this.createdPurchase = true;
            this.createPurchaseFlag = false;
            this.grFlag = false;
            this.grClFlag = true;
            $("#gs-GSTR1").hide();
            $("#icon-GSTR1").show();
            $("#gs-GSTR2").hide();
            $("#icon-GSTR2").show();
            $("#gs-GSTR1A").hide();
            $("#icon-GSTR1A").show();
            $("#icon-GSTR1A").attr("style", "background:#036963;color:#fff");
        }
        if (path == 'goodsreceipt') {
            this.createPurchaseFlag = false;
            this.goodsreceiptBlock = true;
            this.purchaseBlock = false;
            this.invoiceBlock = false;
            this.createdPurchase = true;
            $("#gs-GSTR1").hide();
            $("#icon-GSTR1").show();
            $("#gs-GSTR2").hide();
            $("#icon-GSTR2").show();
            this.grFlag = false;
            this.grClFlag = true;
        }
    }
    createGR() {
        this.grNum = this.commonService.grNum;
        if (this.grNum != "" && this.grNum != null) {
            const path: any = "goodsreceipt/editGR";
            this.router.navigate([path], { queryParams: { "grNumber": this.grNum, "action": "DIS", frompage: "PO" } });
        } else {
            if (this.dlvNum != "" && this.dlvNum != null) {
                $("#createGRModal").modal('show');
            } else {
                this.commonService.responseMessages("", "Please create delivery for this PO", "warning");
                return false;
            }
        }
    }
    createGRSubmit(id) {
        this.commonService.saleType = 'Create';
        let orderType: any = $("#orderTypes").val();
        let dlvNumber: any = $("#refNumber").val();
        const path: any = "goodsreceipt/createGR";
        $("#createGRModal").modal('hide');
        this.router.navigate([path], { queryParams: { "orderType": orderType, "dlvNumber": dlvNumber, "action": "C", frompage: "PO" } });
    }
    createInvoice() {
        this.purInvId = this.commonService.purInvId;
        if (this.grClFlag) {
            if (this.purInvId != "" && this.purInvId != null) {
                this.commonService.saleType = 'Edit';
                const path: any = "invoicedetails/editInvoice";
                this.router.navigate([path], { queryParams: { "po_inv_num": this.purInvId, "del_number": this.dlvNum, "fiscal": "", "action": "DIS", frompage: "PO" } });
            } else {
                //$("#purInvModal").modal('show'); 
                this.dlvNum = this.commonService.dlvNum;
                this.commonService.saleType = 'Create';
                const path: any = "invoicedetails/createInvoice";
                this.router.navigate([path], { queryParams: { "refNum": this.dlvNum, "action": "C", frompage: "PO" } });
            }
        }
    }
    navigateToCreate(id) {
        this.closeModal(id);
        this.commonService.saleType = 'Create';
        const path: any = "invoicedetails/createInvoice";
        this.router.navigate([path], { queryParams: { "refNum": this.createPurInvForm.value["refNum"], "action": "C", frompage: "PO" } });
    }
    changeReferecneType(referenceType) {
        if (referenceType.length != 0) {
            if (referenceType == "D") {
                this.selectedReferenceType = "Delivery Note";
            } else {
                this.selectedReferenceType = "PO Number";

            }
        } else {
            this.selectedReferenceType = "";
        }

    }
    materialReverse(response) {
        let countId: any = 0;
        countId = $("#changeMaterial").val();
        if (countId != "" && countId != null && countId != undefined) {
            this.populateFileds(response[countId], this.matnrDetails, 'matNum', countId);
        }
        $(".ajax-searchlist").hide();
    }
    checkMaterail(response, contId) {
        if (response != undefined && response.mat_num != "" && response.mat_num != undefined) {
            if (!response['errorMat']) {
                $("#sales-row-" + contId).attr('style', 'background:#d63e3e');
                this.commonService.responseMessages("", "Please select valid material number", "warning");
                this.saveBtn = true;
                return false;
            }
        }
    }
}
