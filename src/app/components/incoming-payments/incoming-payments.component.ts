import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { DateAdapter } from '@angular/material';
import { MessagePropertiesService } from '../../services/message-properties.service';
import { EnvConfigurationService } from '../../services/env-configuration.service';
declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-incoming-payments',
    templateUrl: './incoming-payments.component.html',
    styleUrls: ['./incoming-payments.component.css']
})
export class IncomingPaymentsComponent implements OnInit {

    incommingPayemnt: FormGroup;
    incomingPaymentsMessages: any;
    url: string;
    bpId: string;
    orgId: string;
    accessObjectId: any;
    customerpayload: any;
    customerNames: any;
    constructor(private http: Http, private formBuilder: FormBuilder, private environment: EnvConfigurationService, private messagesService: MessagePropertiesService,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private commonService: CommonService, private dateAdapter: DateAdapter<Date>) {

        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjectId = localStorage.getItem("Incoming Payment");
        this.incommingPayemnt = formBuilder.group({
            "im_amount": ['', Validators.required],
            "im_customer_account": ['', Validators.required],
            "im_document_date": ['', Validators.required],
            "im_posting_date": ['', Validators.required],
            //"im_profit_center": ['', Validators.required],
            "im_reference": ['', Validators.required],
            "im_text": ['']

        });
        this.incomingPaymentsMessages = messagesService.incoming_payments_msg;
        this.customerNames = [];
    }

    ngOnInit() {
        $(()=>{
            $(document).on("input", ".numbersOnly", function() {
              this.value = this.value.replace(/[^\d\.]/g,'');
          });    
        })
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
        setTimeout(() => {
            var width = $("#mainContent").css("width");
            $(".outbound-footer").css("width", width);
        }, 50);

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

    }
    postincomingpayment() {
        if (this.customerNames.length == 0) {
            this.commonService.responseMessages("", "Please select valid customer account", "warning");
            return false;
        }
        $("#loadingIcon").show();
        $("#black-overlay").show();
        this.url = this.environment.getRequiredApi('post_incoming_payment') + "?";
        this.customerpayload = this.incommingPayemnt.value;
        this.customerpayload.bp_id = this.bpId;
        this.customerpayload.org_id = this.orgId;
        this.customerpayload.im_customer_account = $("#modal-searchInput").val();
        let splittedpostingDateArray = this.incommingPayemnt.value.im_posting_date.split("-");
        this.customerpayload.im_posting_date = splittedpostingDateArray[2] + "-" + splittedpostingDateArray[1] + "-" + splittedpostingDateArray[0];
        let splitteddocDateArray = this.incommingPayemnt.value.im_document_date.split("-");
        this.customerpayload.im_document_date = splitteddocDateArray[2] + "-" + splitteddocDateArray[1] + "-" + splitteddocDateArray[0];
        this.commonService.getData(this.url, "POST", this.customerpayload, this.accessObjectId).subscribe((response) => {
            if (response.status == 1) {
                $("#loadingIcon").hide();
                $("#black-overlay").hide();
                this.commonService.responseMessages('', response.message, 'warning');
            } else {
                $("#loadingIcon").hide();
                $("#black-overlay").hide();
                this.commonService.responseMessages('', response.data.ex_msgv3, 'success');
                this.incommingPayemnt.reset();

            }
        });
    }

    removeStyles(id) {
        $('#' + id).datetimepicker("hide");
        this.incommingPayemnt.controls['im_posting_date'].setValue($("#txt_postingdate").val());
        this.incommingPayemnt.controls['im_document_date'].setValue($("#txt_invoicedate").val());

    }
    redirectincomingpaymentlist() {
        const path: any = 'incomingpay';
        this.router.navigate([path]);
    }
    extractData(id, spinnerId, ajaxDropdown) {
        let term: any = $("#" + id).val();
        if (term.length == 3) {
            $("#" + spinnerId).show();
            let url: any = this.environment.getRequiredApi("find_customers") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&cust_name=" + term + "&";
            this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response => {
                if (response.status == 0) {
                    this.customerNames = response["data"].ex_cust_list;
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
}
