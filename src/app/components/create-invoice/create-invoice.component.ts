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


@Component({
    selector: 'app-create-invoice',
    templateUrl: './create-invoice.component.html',
    styleUrls: ['./create-invoice.component.css']
})
export class CreateInvoiceComponent implements OnInit {
    checked: boolean = false;
    indeterminate: boolean = false;
    invoiceMessages: any;
    createInvoiceForm: FormGroup;
    title: any;
    taxChecked: boolean;
    itemDetailsArray: any;
    public deliveryItemObject = {};
    public deliveryItemArray = [];
    public createFlag: boolean;
    public createInvoicePayload: any = {};
    public errorLogs: any = [];
    genDisplayInvoiceDetArray: any = [];
    public responseAddress: any = {};
    outBoundDeliveryFormObject: any = [];
    accessObjectId: any;
    bpId: any;
    orgId: any;
    InvoiceDocNum: any;
    deliveryNumber: any;
    totalPrice: any;
    totalIgstVal: any;
    totalCgstVal: any;
    totalSgstVal: any;
    totalGrossVal: any;
    public emptyFlag: boolean = false;
    fromPage:any;
    customerData:string;
    purchaseDlvAddress: any;
    plantDlvAddress: any;
    plId: any;
    vendorNames: any;
    plantName: any;
    plantNameId: any;
    constructor(private http: Http, private formBuilder: FormBuilder, private messagesService: MessagePropertiesService, private environment: EnvConfigurationService,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private commonService: CommonService, private activatedRoute: ActivatedRoute) {
        this.app.isActive = true;
        //   this.dateAdapter.setLocale('en-gb');
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjectId = localStorage.getItem("Purchase Invoice");
        this.createInvoiceForm = formBuilder.group({
            // 'invRef': ['', Validators.required],
            'invDate': ['', Validators.required],
            'posDate': ['', Validators.required],
            // 'invAmt': ['', [Validators.required, Validators.pattern('^[0-9]{1}[0-9]+\.?[0-9]*$')]],
            //['', [Validators.required,Validators.pattern('/^(?!-0$)-?(?!0*(?:\.0*)$|0+\d)(?:\d+(?:\.\d{1,2})?|\.\d{1,2})$/')]],//
            'bslineDate': ['', Validators.required],
            'remarks': ['']
        });
        this.checked = false;
        this.indeterminate = false;
        this.taxChecked = true;
        this.invoiceMessages = this.messagesService.invoice_details_msgs;
        this.itemDetailsArray = [];
        this.totalPrice = 0;
        this.totalIgstVal = 0;
        this.totalCgstVal = 0;
        this.totalSgstVal = 0;
        this.totalGrossVal = 0;
        this.fromPage="";
         this.customerData="";
         this.purchaseDlvAddress = "";
         this.plantDlvAddress = "";
         this.plantName = "";
         this.plantNameId = "";
         this.plId = "";
    }

    ngOnInit() {
        this.title = "Invoice / Create";
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['action'] == "C") {
                this.deliveryNumber = params['refNum'];
            }
            this.fromPage=params['frompage'];
            $("#gs-GSTR1A").attr("style", "background:#036963;color:#fff");
            this.getInvoiceDetailsWithDeliveryNum(this.deliveryNumber);
        });

        $('#txt_invoicedate').datetimepicker({
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
        setTimeout(() => {
            var width = $("#mainContent").css("width");
            $(".outbound-footer").css("width", width);
        }, 50);

        $('#txt_postingdate').datetimepicker({
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
        $('#txt_baselinedate').datetimepicker({
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
    }

    getInvoiceDetailsWithDeliveryNum(deliveryNum) {
        $('#loadingIcon').show();
        $("#black-overlay").show();
        this.createFlag = true;
        this.createInvoicePayload["im_delivery_no"] = deliveryNum;
        this.createInvoicePayload["bp_id"] = this.bpId;
        this.createInvoicePayload["org_id"] = this.orgId;
        this.createInvoicePayload["im_action"] = 'SI';
        this.createInvoicePayload["action"] = 'CRETINV';
        var date = new Date();
        var day = date.getDate().toString();;
        var month = date.getMonth() + 1;
        var newMonth = month.toString();
        var year = date.getFullYear();
        if (newMonth.length <= 10) newMonth = "0" + month;
        if (day.length <= 1) day = "0" + day;
        var today = year + newMonth + day;
        let baselinedate = $('#txt_baselinedate').val();
        if (baselinedate == "") {
            this.createInvoicePayload["im_baseline_date"] = today;
        }
        else {
            this.createInvoicePayload["im_baseline_date"] = $('#txt_baselinedate').val();
        }
        let invoicedate = $('#txt_invoicedate').val();
        if (invoicedate == "") {
            this.createInvoicePayload["im_document_date"] = today;
        }
        else {
            this.createInvoicePayload["im_document_date"] = $('#txt_invoicedate').val();
        }
        let postingdate = $('#txt_invoicedate').val();
        if (postingdate == "") {
            this.createInvoicePayload["im_posting_date"] = today;
        }
        else {
            this.createInvoicePayload["im_posting_date"] = $('#txt_postingdate').val();
        }
        this.createInvoicePayload["im_header_text"] = $('#txt_remarks').val();
        console.log(this.createInvoicePayload);
        let url = this.environment.getRequiredApi('manage_invoice_details') + "?";
        this.commonService.getData(url, 'POST', this.createInvoicePayload, this.accessObjectId)
            .subscribe((response) => {
                this.errorLogs = [];
                if (response.status == 0) {
                    let data = response.data.ex_return;
                    if (response.data.hasOwnProperty("ex_return")) {
                        for (let index of data) {
                            if (index.type == "E") {
                                this.errorLogs = response.data.ex_return;
                                break;
                            }
                        }
                        if (this.errorLogs.length != 0) {
                            $('#loadingIcon').hide();
                            $("#black-overlay").hide();
                            $("#displayErrorsModal").modal("show");
                        }
                        $('#loadingIcon').hide();
                        $("#black-overlay").hide();
                    }
                    if (response.data.hasOwnProperty("ex_calculated_data")) {
                        this.genDisplayInvoiceDetArray = response.data.ex_calculated_data;
                        console.log(this.genDisplayInvoiceDetArray);
                        this.calculateTotals();
                    }
                    if (response.data.hasOwnProperty("ex_price_difference")) {
                        $("#txt_pricediff").val(response.data.ex_price_difference);
                    }
                     if(response.data.hasOwnProperty("ex_cust_details")){
                         if(response.data['ex_cust_details'].hasOwnProperty("cust_name"))
                            this.customerData=response.data['ex_cust_details'].cust_id+"-"+response.data['ex_cust_details'].cust_name;
                    }
                    if(response.data.hasOwnProperty('ex_vendor_details')){
                        this.purchaseDlvAddress = response['data'].ex_vendor_details;
                        this.plantName = this.purchaseDlvAddress.vendor_name;
                        this.plantNameId=this.purchaseDlvAddress.vendor_code;
                        if(this.plantNameId!=undefined){
                            this.plId = this.plantNameId.replace(/\b(0(?!\b))+/g, "");
                        }
                    }
                } else {
                    this.commonService.responseMessages("", response.message, "warning");
                    this.outBoundDeliveryFormObject = [];
                }
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                console.log(this.outBoundDeliveryFormObject)
            }, err => {
                console.log(err);
                $('#loadingIcon').hide();
                $("#black-overlay").hide();

            });
    }
    createInvoiceDetails() {
        $('#loadingIcon').show();
        $("#black-overlay").show();
        this.createFlag = false;
        let url = this.environment.getRequiredApi('manage_invoice_details') + "?";
        this.createInvoicePayload["im_delivery_no"] = this.deliveryNumber;
        this.createInvoicePayload["bp_id"] = this.bpId;
        this.createInvoicePayload["org_id"] = this.orgId;
        this.createInvoicePayload["im_action"] = 'CI';
        this.createInvoicePayload["action"] = 'CRETINV';
        let splittedBaselineDateArray = $('#txt_baselinedate').val().split("-");
        this.createInvoicePayload["im_baseline_date"] = splittedBaselineDateArray[2] + "-" + splittedBaselineDateArray[1] + "-" + splittedBaselineDateArray[0];
        let splitteddocDateArray = $('#txt_invoicedate').val().split("-");
        this.createInvoicePayload["im_document_date"] = splitteddocDateArray[2] + "-" + splitteddocDateArray[1] + "-" + splitteddocDateArray[0];
        let splittedpostingDateArray = $('#txt_postingdate').val().split("-");
        this.createInvoicePayload["im_posting_date"] = splittedpostingDateArray[2] + "-" + splittedpostingDateArray[1] + "-" + splittedpostingDateArray[0];
        this.createInvoicePayload["im_header_text"] = $('#txt_remarks').val();
        console.log(this.createInvoicePayload);
        this.commonService.getData(url, 'POST', this.createInvoicePayload, this.accessObjectId)
            .subscribe((response) => {
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                this.errorLogs = [];
                if (response.status == 0) {
                    let data = response.data.ex_return;
                    if (response.data.hasOwnProperty("ex_return")) {
                        for (let index of data) {
                            //errorObject = {};
                            if (index.type == "E") {
                                //   this.commonService.responseMessages("", response.data.ex_return[0].message, "warning");
                                this.errorLogs = response.data.ex_return;
                            }
                            if (index.type == "I") {
                                this.commonService.responseMessages("", "Invoice (" + response.data.ex_return[0].message_v1 + ")  created successfully", "success");
                                const path: any = "invoicedetails/editInvoice";
                                this.router.navigate([path], { queryParams: { "po_inv_num": response.data.ex_return[0].message_v1, "delvNo": this.deliveryNumber, "action": "DIS" } });
                            }
                        }
                    }
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                }
                if (response.status == 1) {
                    this.commonService.responseMessages("", response.message, "warning");
                }
            }, err => {

                console.log(err)
                $('#loadingIcon').hide();
                $("#black-overlay").hide();

            });
    }
    redirectToListView() {
        if(this.fromPage!="PO"){
            const path: any = 'invoicedetails';
            this.router.navigate([path]);
       }else{
           const path: any = 'purchaseorder';
            this.router.navigate([path]); 
        }
    }
    removeStyles() {
        this.createInvoiceForm.controls['invDate'].setValue($("#txt_invoicedate").val());
        this.createInvoiceForm.controls['posDate'].setValue($("#txt_postingdate").val());
        this.createInvoiceForm.controls['bslineDate'].setValue($("#txt_baselinedate").val());
    }
    closeModal(id) {
        $("#" + id).modal("hide");
        this.createInvoiceForm.reset();
        if (id == "displayErrorsModal") {
            this.redirectToListView();
        }
    }
    calculateTotals() {
        let totalPrice: any = 0;
        let totalIgstTaxVal: any = 0;
        let totalCgstTaxVal: any = 0;
        let totalSgstTaxVal: any = 0;
        let totalVal: any = 0;
        let count: any = 0;
        this.genDisplayInvoiceDetArray.forEach(currentItem => {
            if (currentItem.mat_num != '' && currentItem.qty != '') {
                // totalPrice = parseFloat(totalPrice) + parseFloat(currentItem.price);
                totalIgstTaxVal = parseFloat(totalIgstTaxVal) + parseFloat(currentItem.igst_amt);
                totalCgstTaxVal = parseFloat(totalCgstTaxVal) + parseFloat(currentItem.cgst_amt);
                totalSgstTaxVal = parseFloat(totalSgstTaxVal) + parseFloat(currentItem.sgst_amt);
                totalVal = parseFloat(totalVal) + parseFloat(currentItem.net_amount);
            }
            if (this.genDisplayInvoiceDetArray.length - 1 == count) {
                this.totalPrice = totalPrice;
                this.totalIgstVal = totalIgstTaxVal;
                this.totalCgstVal = totalCgstTaxVal;
                this.totalSgstVal = totalSgstTaxVal;
                this.totalGrossVal = totalVal;

            }
            count++;
        });
    }
}
