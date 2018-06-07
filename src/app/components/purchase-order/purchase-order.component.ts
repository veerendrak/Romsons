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
    selector: 'app-purchase-order',
    templateUrl: './purchase-order.component.html',
    styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
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
    saveBtn: boolean = true;
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
    plantName: any;
    plantNameId: any;
    disableBtns: boolean = false;
    canceldisableBtns: boolean = true;
    orderNum: any;
    createSalesFlag: boolean = true;
    createdSales: boolean = false;
    purchaseDlvAddress: any;
    plantDlvAddress: any;
    plId: any;
    vendorNames: any;
    orderTypes: any;
    vendorschemes: any;
    boxList: any;
    totalPrice: any;
    totalIgstVal: any;
    totalCgstVal: any;
    totalSgstVal: any;
    totalGrossVal: any;
    customerNames: any;
    rolekaduser: any;
    vendorTypes: any;
    poType: any;
    invoiceId: any;
    dlvNumber: any;
    configvalarray: any;
    configvalid: any;
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
            'docDate': ['', Validators.required],
            'billingAddr': [],
            'shippingAddr': [],
            'customer': [],
        });
        this.purchaseOrderMessage = messagesService.purchase_order_details_msg;
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjectId = localStorage.getItem("Purchase Order");
        this.createpurchaseOrderItems = [];
        this.matnrDetails = [];
        this.checkedObjects = [];
        this.calcBtn = true;
        this.saveBtn = true;
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
        this.purchaseDlvAddress = "";
        this.plantDlvAddress = "";
        this.plantName = "";
        this.plantNameId = "";
        this.plId = "";
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
        this.customerNames = [];
        this.rolekaduser = true;
        this.vendorTypes = [];
        this.invoiceId = "";
        this.dlvNumber = "";
        this.configvalarray = [];
        this.configvalid = "";
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
        this.createpurchaseOrderItems = [
            {
                "mat_num": "",
                "qty": "",
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
                "qty": "",
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
                "qty": "",
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
                "boxSize": 0,
                "grossValue": 0,
                "displayRow": true,
                "schemesFlag": false,
                "itemNumber": '',
                "errorMat": true
            },
            {
                "mat_num": "",
                "qty": "",
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
                "qty": "",
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
        if (this.commonService.saleType == 'Create') {
            this.title = "Purchase Order/ Create";
        } else {
            this.title = "Edit Purchase Order";
        }
        if (localStorage.getItem("roleName") == "KAD User") {
            this.rolekaduser = false;
            this.purchaseOrderForm.get('customer').setValidators([Validators.required]);
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
        let matrlBoxTypeUrl: any = this.environment.getRequiredApi("header_dropdown") + "?group=MTRLS&";
        this.commonService.getData(matrlBoxTypeUrl, "GET", "", this.accessObjectId).subscribe(response => {
            if (response.status == 0) {
                this.boxList = response["data"].configValues;
            }
        });
        setTimeout(() => {
            var width = $("#mainContent").css("width");
            $(".outbound-footer").css("width", width);
        }, 500);
        mergeItems = this.createpurchaseOrderItems;
        $(() => {
            $(document).on("blur", ".materialNumPO", function(e) {
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
                                        /* $.notify({
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
                                                "qty": "",
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
                                                "itemNumber": '',
                                                "updateflag": 'I',
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
                                                        //cellValue=cellValue.replace(/,/g, "");
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
        });
        this.activatedRoute.queryParams.subscribe(params => {
            console.log(this.router.url);
            if (params['action'] == "C" && this.router.url.includes('purchaseorder')) {
                if (params['rcaction'] == "CR") {
                    this.configvalid = params["orderList"];
                    this.getRecurringOrderlist();


                }
                $("#gs-GSTR1").attr("style", "background:#036963;color:#fff");
                this.orderType = params["orderType"];
                if (this.orderType == 'ZCC') {
                    this.title = "Purchase Order / New";
                    this.poType = "Purchase Order";
                } else {
                    if (this.orderType == 'ZRN') {
                        this.title = "Purchase Return / New";
                        this.poType = "Purchase Return";
                        this.invoiceId = params['invoiceId'];
                        this.dlvNumber = params['dlvNumber']
                        this.getInvoiceDetails(this.invoiceId, this.dlvNumber);
                    }
                }

                this.vendorId = params["vendorId"];
                this.fromPage = params["frompage"];
                $("#downloadLink").show();
                this.payload["vendorId"] = this.vendorId;
                this.getPlantDetails();
                this.getVendotDetails();
                this.getSchemeList();
            }
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
    getVendotDetails() {
        let url: any = this.environment.getRequiredApi("get_vendor_details") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&";
        url = url.replace("{vendor_id}", this.vendorId);
        this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response => {
            if (response.status == 0) {
                this.purchaseDlvAddress = response['data'].ex_vendor_details;
                this.plantName = this.purchaseDlvAddress.vendor_name;
                this.plantNameId = this.vendorId;
                this.plId = this.plantNameId.replace(/\b(0(?!\b))+/g, "");
            } else {
                this.commonService.responseMessages("", response.message, "warning");
            }
        })
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
    uploadExcel() {
        $("#uploadExcel").click();
    }
    mergeItemsList() {
        let mergeArray: any = [];
        for (let index of this.createpurchaseOrderItems) {
            if (index.mat_num != "" && index.qty != "" && index.qty != 0) {
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
                defaultDate: new Date(),
                format: 'DD/MM/YYYY',
            });
        }, 500);
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
        }, 500);
    }
    findMaterialDetails(matnr, response, spinnerId, i, ajaxBlock, event) {
        console.log(event.keyCode);
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
    calculatePrice() {
        this.materialReverse(this.createpurchaseOrderItems);
        setTimeout(() => {
            if (!this.rolekaduser) {
                if ($("#modal-name").val() == "" || $("#modal-name").val() == null) {
                    this.commonService.responseMessages("", "Please enter hospital name", "warning");
                    return false;
                } else {
                    if ($("#modal-searchInput").val() == "" || $("#modal-searchInput").val() == undefined || $("#modal-searchInput").val() == null) {
                        this.commonService.responseMessages("", "Please enter valid hospital name", "warning");
                        return false;
                    }
                }
            }
            let obectList: any = [];
            for (let lst of this.createpurchaseOrderItems) {
                if (lst.qty != 0 && lst.qty != "0" && lst.qty != "" && lst.mat_num != "") {
                    obectList.push(lst);
                }
            }
            this.createpurchaseOrderItems = obectList;
            this.managepurchasePayload = {};
            $('#loadingIcon').show();
            $("#black-overlay").show();
            this.managepurchasePayload['bp_id'] = this.bpId;
            this.managepurchasePayload['org_id'] = this.orgId;
            this.managepurchasePayload['im_simulate'] = "X";
            this.managepurchasePayload['im_action'] = "C";
            this.managepurchasePayload['im_po_header'] = {};
            this.managepurchasePayload['im_po_header']['doc_type'] = this.orderType;
            this.managepurchasePayload['im_po_header']['vendor'] = this.vendorId;
            if (localStorage.getItem("roleName") == "KAD User") {
                let customerId: any = $("#modal-searchInput").val();
                this.managepurchasePayload['im_po_ref_doc'] = customerId;
            }
            this.managepurchasePayload['im_po_items'] = [];
            let objectArray: any = [];
            for (let item of this.createpurchaseOrderItems) {
                if (item.displayRow) {
                    objectArray.push(item);
                }
            }
            this.createpurchaseOrderItems = objectArray;
            let itemCount: any = 1;
            for (let item of this.createpurchaseOrderItems) {
                if (item.displayRow) {
                    if (item.mat_num != "" && item.qty != "") {
                        if (item.qty == "") {
                            item.qty = 0;
                        }
                        let object: any = {};
                        object['po_item'] = parseFloat(itemCount) * 10;
                        object['material'] = item.mat_num;
                        object['quantity'] = item.qty;
                        this.managepurchasePayload['im_po_items'].push(object);
                        itemCount++;
                    }
                }
            }
            this.managepurchasePayload['im_po_item_schedules'] = [];
            let condCount: any = 1;
            for (let item of this.createpurchaseOrderItems) {
                let object: any = {};
                if (item.mat_num != "" && item.qty != "") {
                    object['po_item'] = parseFloat(condCount) * 10;
                    object['material'] = item.mat_num;
                    object['quantity'] = item.qty;
                    let date: any = item.deldate;
                    if (date != '') {
                        date = date.split("/");
                        date = date[2] + "" + date[1] + "" + date[0];
                    }
                    object['deliv_date'] = date;
                    this.managepurchasePayload['im_po_item_schedules'].push(object);
                    condCount++;
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
                    if (response.data.hasOwnProperty('ex_mat_price')) {
                        if (response.data['ex_mat_price'].length > 0) {
                            let count: any = 0;
                            response.data['ex_mat_price'].forEach(currentItem => {
                                if ((this.createpurchaseOrderItems[count].mat_num == "" || this.createpurchaseOrderItems[count].qty == "")) {
                                    count++;
                                }
                                if (currentItem.mat_id == this.createpurchaseOrderItems[count].mat_num && Math.round(currentItem.mat_quan) == this.createpurchaseOrderItems[count].qty) {
                                    this.createpurchaseOrderItems[count].uom = currentItem.uom;
                                    this.createpurchaseOrderItems[count].desc = currentItem.mat_desc;
                                    this.createpurchaseOrderItems[count].price = currentItem.mat_price;
                                    this.createpurchaseOrderItems[count].sgst_rt = Math.round(currentItem.sgst_rate).toFixed(2);
                                    this.createpurchaseOrderItems[count].sgst_val = currentItem.sgst_value;
                                    this.createpurchaseOrderItems[count].cgst_rt = Math.round(currentItem.cgst_rate).toFixed(2);
                                    this.createpurchaseOrderItems[count].cgst_val = currentItem.cgst_value;
                                    this.createpurchaseOrderItems[count].igst_rt = Math.round(currentItem.igst_rate).toFixed(2);
                                    this.createpurchaseOrderItems[count].igst_val = currentItem.igst_value;
                                    this.createpurchaseOrderItems[count].grossValue = currentItem.net_price;
                                }
                                count++;
                            });
                        }
                    }
                    this.reArrangeItems();
                    this.enableButtons();
                    setTimeout(() => { this.calculateTotals() }, 500);
                    this.saveBtn = false;
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
            if (item.mat_num != "" && item.qty != "" && item.qty != 0 && item.qty != "0") {
                reArrangeItems.push(item);
            }

        }

        this.createpurchaseOrderItems = reArrangeItems;
    }
    changeQtyCalculations(items, id) {
        if (items.qty == "0" || items.qty == "" || items.qty == 0 && (items.mat_num != "" && items.mat_num != undefined)) {
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


        }
        if (this.orderType == 'ZRN') {
            if (items.qty > items.oldQty) {
                if ($("#sales-row-" + id).attr('style') != 'background:#d63e3e') {
                    $("#sales-row-" + id).attr('style', 'background:#d63e3e');
                    $("#qty-" + id).attr('style', 'border:1px solid red');
                    this.commonService.responseMessages("", "Quantity must not be greater than available Quantity " + items.oldQty + " ", "warning");
                    this.calcBtn = true;
                    this.saveBtn = true;
                    return false;
                }
            } else {
                $("#sales-row-" + id).removeAttr('style');
                $("#qty-" + id).removeAttr('style');


            }
        }
        if (items.qty == "") {
            items.qty = 0;
        }
        if (items.boxSize !== 0) {
            this.checkBoxLimit(items, id);
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
                "mat_num": "",
                "qty": "",
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
            this.createpurchaseOrderItems.push(newItem);
        }
        setTimeout(() => {

        }, 300);
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
    }
    savePurchaseOrderItems() {
        this.materialReverse(this.createpurchaseOrderItems);
        setTimeout(() => {
            if (!this.rolekaduser) {
                if ($("#modal-name").val() == "" || $("#modal-name").val() == null) {
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
            this.managepurchasePayload = {};
            if ($("#docDate").val() != null && $("#docDate").val() != "") {
                purDate = $("#docDate").val();
                purDate = purDate.split('/')[2] + "" + purDate.split('/')[1] + "" + purDate.split('/')[0];
            }
            this.managepurchasePayload['bp_id'] = this.bpId;
            this.managepurchasePayload['org_id'] = this.orgId;
            this.managepurchasePayload['im_action'] = "C";
            this.managepurchasePayload['im_po_header'] = {};
            this.managepurchasePayload['im_po_header']['doc_type'] = this.orderType;
            if (this.orderType == 'ZRN') {
                this.managepurchasePayload['im_po_header']['our_ref'] = this.invoiceId;
            }
            this.managepurchasePayload['im_po_header']['doc_date'] = purDate;
            this.managepurchasePayload['im_po_header']['vendor'] = this.vendorId;
            this.managepurchasePayload['im_po_status_text'] = $("#header_text").val();
            if (localStorage.getItem("roleName") == "KAD User") {
                let customerId: any = $("#modal-searchInput").val();
                this.managepurchasePayload['im_po_ref_doc'] = customerId;
            }
            this.managepurchasePayload['im_po_item_schedules'] = [];
            let condCount: any = 1;
            for (let item of this.createpurchaseOrderItems) {
                if (item.displayRow) {
                    let object: any = {};
                    if (item.mat_num != "" && item.qty != "") {
                        object['po_item'] = parseFloat(condCount) * 10;
                        object['quantity'] = item.qty;
                        let date: any = item.deldate;
                        date = date.split("/");
                        date = date[2] + "" + date[1] + "" + date[0];
                        object['deliv_date'] = date;
                        this.managepurchasePayload['im_po_item_schedules'].push(object);
                        condCount++;
                    }
                }
            }
            this.managepurchasePayload['im_po_items'] = [];
            let itemCount: any = 1;
            for (let item of this.createpurchaseOrderItems) {
                if (item.displayRow) {
                    if (item.mat_num != "" && item.qty != "") {
                        if (item.qty == "") {
                            item.qty = 0;
                        }
                        let object: any = {};
                        object['po_item'] = parseFloat(itemCount) * 10;
                        object['material'] = item.mat_num;
                        object['net_price'] = item.price;
                        this.managepurchasePayload['im_po_items'].push(object);
                        itemCount++;
                    }
                }
            }

            let url: any = this.environment.getRequiredApi("purchase_order_manage") + "?";
            this.commonService.getData(url, "POST", this.managepurchasePayload, this.accessObjectId).subscribe(response => {
                if (response.status == 0) {
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
                    }
                    if (response['data'].purchaseorder != "") {
                        this.title = "Purchase Order / Display (" + response['data'].purchaseorder + ")";
                        $("#gs-GSTR1").removeAttr("style");
                        this.managepurchasePayload = {};
                        this.commonService.responseMessages("", "" + this.poType + " " + response['data'].purchaseorder + " 'created Succesfully", "success");
                        this.disableBtns = true;
                        this.calcBtn = true;
                        this.saveBtn = true;
                        this.canceldisableBtns = false;
                        this.commonService.saleType = 'Display';
                        const path: any = "purchaseorder/editpurchaseorder";
                        this.router.navigate([path], { queryParams: { "orderNum": response['data'].purchaseorder, "action": "DIS", frompage: "PO" } });
                    }
                    this.createSalesFlag = false;
                    this.createdSales = true;
                    $("#gs-GSTR1").hide();
                    $("#icon-GSTR1").show();
                } else {
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                    this.commonService.responseMessages("", response.message, "warning");
                }
            });
        }, 800);
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
    }
    enableButtons() {
        let countId: any = 0;
        let errorFlag: boolean = false;
        for (let lst of this.createpurchaseOrderItems) {
            if ((lst.qty == "0" || lst.qty == "" || lst.qty == 0) && (lst.mat_num != "" && lst.mat_num != undefined) && lst.displayRow) {
                $("#sales-row-" + countId).attr('style', 'background:#d63e3e');
                errorFlag = true;
            } else {
                if ($("#sales-row-" + countId).attr('style') === 'background:#d63e3e' || $("#sales-row-" + countId).attr('class') === 'error-true') {
                    errorFlag = true;
                }
            }
            countId++;
        }
        if (errorFlag) {
            this.calcBtn = true;
            this.saveBtn = true;
            return false;
        } else {
            this.calcBtn = false;
            this.saveBtn = false;
        }
        let flag: boolean = false;
        let count: any = 0;
        let errorCount: any = null;
        for (let item of this.createpurchaseOrderItems) {
            if (item.displayRow) {
                if ((item.qty != "" || item.qty != 0) && item.mat_num != "" && item.mat_num != undefined) {
                    if (item.net_val < 0) {
                        this.calcBtn = true;
                        this.saveBtn = true;
                        return false;
                    }
                    else {
                        if (this.uploadExcelFlag) {
                            if (item.qty == 0 || item.qty == "0") {
                                this.calcBtn = true;
                                //this.saveBtn=true;
                                return false;
                            } else {
                                if (item.net_val == 0) {
                                    this.calcBtn = false;
                                    this.saveBtn = true;
                                    //return false;    
                                }
                            }
                        }
                        else {
                            this.calcBtn = false;
                            this.saveBtn = false;
                            flag = false;
                        }

                    }
                } else {
                    if ((item.qty == "0" || item.qty == "" || item.qty == 0) && item.mat_num != "" && item.mat_num != undefined) {
                        console.log(count)
                        errorCount = count;
                        this.calcBtn = true;
                        this.saveBtn = true;
                        return false;

                    }
                }
            }
            count++;
        }
        console.log(errorCount);
        if (errorCount != null) {
            this.commonService.responseMessages("", "Quantity  should not be zero / empty", "warning");
            this.calcBtn = true;
            this.saveBtn = true;
            return false;
        }
        setTimeout(() => { this.enableSaveBtn(); }, 1000);
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
                            $("#sales-row-" + countId).removeAttr('style');
                            this.saveBtn = false;
                            response['mat_num'] = list['mat_num'];
                            response['uom'] = list['uom'];
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
                            response['schemesFlag'] = false;
                            response['errorMat'] = true;
                            response.changeFlag = false;
                            this.getBoxSize(response);
                            this.enableSchemesFlag(response);
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
                            response['schemesFlag'] = false;
                            this.getBoxSize(response);
                            this.enableSchemesFlag(response);
                            return false;
                        }
                    }
                }
            }
        } else {
            if (response != undefined) {
                response['errorMat'] = false;
            }
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
        let path: any = "";
        if (this.fromPage == 'PI') {
            path = 'invoicedetails';
        } else {
            path = 'purchaseorder';
        }
        const rurl: any = path;
        this.router.navigate([rurl]);
    }
    removeStyles(id) {
        $('#' + id).datetimepicker("hide");
        this.purchaseOrderForm.controls['docDate'].setValue($("#docDate").val());

    }
    closeModal(id) {
        $("#" + id).modal("hide");
        this.createPurchaseOrderForm.reset();
        this.createPurchaseOrderForm.controls['docType'].setValue("");
    }
    selectedDate(id, response) {
        let date: any = $("#date-" + id).val();
        response.deldate = date;
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
    getSchemeList() {
        let url: any = this.environment.getRequiredApi("get_vendor_schemes") + "/" + this.vendorId + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&";
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
                            console.log(limit);
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
                        $("#qty-" + id).attr('style', 'border:1px solid red');
                        $("#sales-row-" + id).attr('style', 'background:#d63e3e');
                    }
                } else {
                    $("#qty-" + id).removeAttr('style');
                    $("#sales-row-" + id).removeAttr('style');
                    items.errorFlagBox = false;
                }
                setTimeout(() => { this.enableButtons(); }, 500);
            }

        });

    }
    enableSaveBtn() {
        if (localStorage.getItem("roleName") != "KAD User") {
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
    materialReverse(response) {
        let countId: any = 0;
        countId = $("#changeMaterial").val();
        if (countId != "" && countId != null && countId != undefined) {
            this.populateFileds(response[countId], this.matnrDetails, 'matNum', countId);
        }
        $(".ajax-searchlist").hide();
    }
    checkMaterail(response, contId) {
        if (response != undefined && response['mat_num'] != "" && response['mat_num'] != undefined) {
            if (!response['errorMat']) {
                $("#sales-row-" + contId).attr('style', 'background:#d63e3e');
                this.commonService.responseMessages("", "Please select valid material number", "warning");
                this.saveBtn = true;
                return false;
            }
        }
    }
    getInvoiceDetails(invoiceId, dlvNumber) {
        $('#loadingIcon').show();
        $("#black-overlay").show();
        this.createpurchaseOrderItems = [];
        let url = this.environment.getRequiredApi('pur_invoice_dis') + "?po_inv_num=" + invoiceId + "&del_num=" + dlvNumber + "&org_id=" + this.orgId + "&bp_id=" + this.bpId + "&";
        this.commonService.getData(url, 'GET', '', this.accessObjectId)
            .subscribe((response) => {
                if (response.status == 0) {
                    if (response["data"].hasOwnProperty('ex_headerdata')) {
                        if (response["data"]['ex_headerdata'].hasOwnProperty('header_txt')) {
                            this.headerText = response["data"]['ex_headerdata'].header_txt
                        }
                    }
                    if (response["data"].hasOwnProperty('ex_item_details')) {
                        for (let item of response["data"].ex_item_details) {
                            let object: any = {};
                            object['mat_num'] = item['mat_id'];
                            object['uom'] = item['uom'];
                            object['desc'] = item["mat_desc"];
                            object['qty'] = Math.round(item["qty"]);
                            object['oldQty'] = Math.round(item["qty"]);
                            let date = new Date();
                            let day: any = date.setDate(date.getDate() + 1);
                            date = new Date(day);
                            day = date.getDate();
                            if (day < 10) {
                                day = "0" + day;
                            }
                            let month: any = date.getMonth() + 1;
                            let currentDate: any = day + "/0" + month + "/" + date.getFullYear();
                            object["deldate"] = currentDate;
                            object["storloc"] = "";
                            object["plant"] = "";
                            object["net_val"] = 0;
                            object["sgst_rt"] = Math.round(item["sgst_rate"]).toFixed(2);
                            object["sgst_val"] = item["sgst_value"];
                            object["cgst_rt"] = Math.round(item["cgst_rate"]).toFixed(2);
                            object["cgst_val"] = item["cgst_value"];
                            object["igst_rt"] = Math.round(item["igst_rate"]).toFixed(2);
                            object["igst_val"] = item["igst_value"];
                            object['grossValue'] = item["tot_price"];
                            object['discount']=Math.abs(parseFloat(item['discount']));
                            object['netPrice']=item['net_price'];
                            let price:any=parseFloat(item['net_price'])/parseFloat(item.qty);
                            object['price'] = price;
                            object['schemesFlag'] = false;
                            object['updateflag'] = "U";
                            object['errorMat'] = true;
                            object['displayRow'] = true;
                            object.changeFlag = false;
                            object.boxSize = 0;
                            this.getBoxSize(object);
                            this.enableSchemesFlag(object);
                            setTimeout(() => { this.createpurchaseOrderItems.push(object) }, 100);
                        }
                    }
                    setTimeout(() => {
                        this.applyDataTableAndPicker();
                        this.calculateTotals();

                    }, 300);
                    this.saveBtn = false;
                    this.calcBtn = false;
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                } else {
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                    this.commonService.responseMessages("", response.message, "warning");
                }
                setTimeout(() => {
                    var width = $("#mainContent").css("width");
                    $(".outbound-footer").css("width", width);
                }, 500);
            });
    }
    getRecurringOrderlist() {
        this.createpurchaseOrderItems = [];
        $('#loadingIcon').show();
        $("#black-overlay").show();
        let group = "PREORDRLISTITMS";
        let parent_group = this.configvalid;
        this.configvalarray = [];
        let url = this.environment.getRequiredApi('header_dropdown') + "?group=" + group + "&parent_group=" + parent_group + "&org_id=" + this.orgId + "&";
        this.commonService.getData(url, "GET", '', this.accessObjectId).subscribe((response) => {
            console.log(response);
            let count: any = 0;
            if (response.status == 1) {
                this.createpurchaseOrderItems = [];
                this.commonService.responseMessages("", response.message, "warning");
            }
            else {
                this.configvalarray = response.data.configValues;
                let configChildArray = $.extend(true, [], this.configvalarray);
                this.createpurchaseOrderItems = configChildArray;
                let date = new Date();
                let day: any = date.setDate(date.getDate() + 1);
                date = new Date(day);
                day = date.getDate();
                if (day < 10) {
                    day = "0" + day;
                }
                let month: any = date.getMonth() + 1;
                let currentDate: any = day + "/0" + month + "/" + date.getFullYear();
                this.configvalarray.forEach(currentItem => {
                    let object: any = {};
                    object['mat_num'] = currentItem.key;
                    object['uom'] = "";
                    object['desc'] = "";
                    object['qty'] = Math.round(currentItem.value);
                    object['price'] = 0;
                    object["deldate"] = currentDate;
                    object["storloc"] = "";
                    object["plant"] = "";
                    object["net_val"] = 0;
                    object["sgst_rt"] = 0;
                    object["sgst_val"] = 0;
                    object["cgst_rt"] = 0;
                    object["cgst_val"] = 0;
                    object["igst_rt"] = 0;
                    object["igst_val"] = 0;
                    object['grossValue'] = 0;
                    object['schemesFlag'] = false;
                    object['updateflag'] = "U";
                    object['errorMat'] = true;
                    object['displayRow'] = true;
                    object.changeFlag = false;
                    object.boxSize = 0;
                    this.getBoxSize(object);
                    this.enableSchemesFlag(object);
                    setTimeout(() => { this.createpurchaseOrderItems.push(object) }, 100);
                });
            }

            this.saveBtn = false;
            this.calcBtn = false;
            this.applyDataTableAndPicker();
            $('#loadingIcon').hide();
            $("#black-overlay").hide();
            setTimeout(() => {
                var width = $("#mainContent").css("width");
                $(".outbound-footer").css("width", width);
            }, 500);
        });
    }
}
