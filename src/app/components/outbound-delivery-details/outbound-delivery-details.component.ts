import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { ExcelService } from '../../services/excel.service';
import { MessagePropertiesService } from '../../services/message-properties.service';
import { EnvConfigurationService } from '../../services/env-configuration.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
var exportIdlist:number;

@Component({
    selector: 'app-outbound-delivery-details',
    templateUrl: './outbound-delivery-details.component.html',
    styleUrls: ['./outbound-delivery-details.component.css']
})
export class OutboundDeliveryDetailsComponent implements OnInit {

    createDeliveryForm: FormGroup;
    filterOutboundDelForm:FormGroup;
    checked: boolean = false;
    indeterminate: boolean = false;
    outboundMessage: any;
    outBoundDelPayload: any = {};
    url: string;
    bpId: string;
    orgId: string;
    outBoundDeliveryList: any;
    deliveryListItem: any = [];
    accessObjectId: any;
    checkboxLength: any;
    dlvrsDocArray: any;
    cancelPayload: any = {};
    cancelpgiPayload: any = {};
    errorLogs: any;
    extRet: any;
    extpgiRet: any;
    cancelObjectNums: any = [];
    customerNames:any;
    checkArray: any = [];
    selectedPgiList: any = [];
    selectedPgiListObject = {};
    cancelPgiFlag:boolean=false;
    dlListPayload:any={};
    docFlowList:any;
    subTypes:any;
    exportIdArrays:any;
    exportArrayList:any;
    checkboxErrorMsg:any;
    
    
    constructor(private http: Http, private formBuilder: FormBuilder, private environment: EnvConfigurationService,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private excelService: ExcelService) {
        this.app.isActive = true;
        this.createDeliveryForm = formBuilder.group({
            hideRequired: false,
            floatLabel: 'auto',
            'outboundDate': ['', Validators.required],
            'outboundOrder': ['', Validators.required],
            'frmItem': [''],
            'toItem': ['']
        });
        this.checked = false;
        this.indeterminate = false;
        this.outboundMessage = messagesService.outbound_delivery_msg;
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjectId = localStorage.getItem('Outbound Delivery');
        this.checkboxLength = 0;
        this.dlvrsDocArray = null;
        this.docFlowList=[];
        this.subTypes={
        "C":"Sales Order",
        "J":"Delivery Order",
        "R":"Post Goods Issue",
        "M":"Billing",
        "H":"Sales Return",
        "T":"Delivery Return",
        "N":"Invoice Cancellation",
        "h":"Goods Issue Return",
        "O":"Credit Memo",
        "S":"Credit Memo Cancellation"
          
        }        
        this.customerNames=[]; 
           this.filterOutboundDelForm = formBuilder.group({
          hideRequired: false,
          floatLabel: 'auto',
          'custName'   : ['', Validators.required],
          'fromDate' : ['', Validators.required], 
          'toDate' : ['', Validators.required], 
          'status' : ['', Validators.required], 
         
        });
        this.exportArrayList=[];
        this.checkboxErrorMsg=this.messagesService.check_box_error;
    }

    ngOnInit() {

        
         $( '.datepicker-init-sale' ).datetimepicker( {
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
          } );


        this.commonService.deliveryNum="";

        this.cancelPgiFlag=false;
         this.outBoundDelPayload["bp_id"] = this.bpId;
         this.outBoundDelPayload["org_id"] = this.orgId;
        this.getSalesOutboundDeliveryList();
        $(function(){
            $(document).on('click', function (e) {
                 if (!$(e.target).hasClass('ajax-list')) {
                  $(".ajax-searchlist").hide();
                     
              }
            $("#delivery-order-table_paginate").find('.page-link').on('click',function(e) {
              setTimeout(function(){
                 if($("#checkbox-all-input").is(":checked")){
                    $("#delivery-order-table").find("tbody").find(".mat-checkbox-input").each(function(i){
                        let id:any=$(this).attr('id');
                        if(!$("#"+id).is(":checked")){
                            $("#"+id).click();
                        }
                    });
                }else{
                    $("#delivery-order-table").find("tbody").find(".mat-checkbox-input").each(function(i){
                        let id:any=$(this).attr('id');
                        if(exportIdlist == 0){
                        if($("#"+id).is(":checked")){
                            $("#"+id).click();
                        }    
                        }
                        
                    });
                } 
              },300);
            });
          }); 
            
        });
    }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    getSalesOutboundDeliveryList() {
        this.outBoundDelPayload["bp_id"] = this.bpId;
        this.outBoundDelPayload["org_id"] = this.orgId;
         this.selectedPgiList=[]; this.selectedPgiListObject = {};
        this.exportArrayList=[];this.checkboxLength = 0;
        this.dlvrsDocArray="";
        
        $('#loadingIcon').show();
        $("#black-overlay").show();
        this.url = this.environment.getRequiredApi('get_sales_outbound_delivery_list') + "?";

        this.commonService.getData(this.url, 'POST', this.outBoundDelPayload, localStorage.getItem('Outbound Delivery'))
            .subscribe((response) => {
                if (response.status == '1') {
                    this.commonService.responseMessages("", response.message, "warning");
                    this.outBoundDeliveryList = [];
                     this.filterOutboundDelForm.reset();
                     this.filterOutboundDelForm.controls['status'].setValue(""); 
                } else {
                    let soDetObject = {};
                    let soDetArray = [];
                    this.outBoundDeliveryList = response.data.ex_delivery_list;
                    $("#delivery-order-table").DataTable().destroy();
                }
                this.applyDataTable();
                this.outBoundDelPayload={};
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
            }, err => {
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                console.log(err)

            });

    }

    applyDataTable() {
        setTimeout(() => {
            $("#delivery-order-table").DataTable({
                "order": [[1, 'desc']],
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
                columnDefs: [{
                    "targets": 'no-sort',
                    "orderable": false
                }],

            });
        }, 400);
        setTimeout(() => {
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
        }, 600);
        setTimeout(() => {
            var width = $("#mainContent").css("width");
            $(".outbound-footer").css("width", width);
            $(".outbound-footer").show();
        }, 50);

    }

    displayDeliveryItemDetails(delNum, items) {
        $("#itemDetailsPopup").modal("show");
        this.deliveryListItem = items;
        this.deliveryListItem["deliveryItem"] = delNum;
    }

    createDeliveryOrder(type) {
        this.commonService.saleType = 'Create';
        $("#outboundDeliveryModal").modal("show");
        $('#sFiterfromDate').datetimepicker({
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
            format: 'DD/MM/YYYY'
        });
    }
    closeModal(id) {
        $("#" + id).modal("hide");
        this.createDeliveryForm.reset();
        if (id == "cancel-outbound-delivery") {
            this.getSalesOutboundDeliveryList()
        }
    }
    createDeliverySubmit(id) {
        $("#" + id).modal("hide");
        const path: any = "obd/createdelivery";
        let fromDate: any = $("#sFiterfromDate").val();
        fromDate = fromDate.split("/");
        let changeDate: any = fromDate[2] + fromDate[1] + fromDate[0];
        let orderNum: any = $("#orderNum").val();
        orderNum = orderNum.trim();
        let fromItem: any = $("#fromItem").val();
        let toItem: any = $("#toItem").val();
        this.router.navigate([path], { queryParams: { "orderNum": orderNum, "fromDate": changeDate, "action": "C", "fromItem": fromItem, "toItem": toItem } });
    }
    editDeliveryOrderById() {
        this.commonService.saleType = 'Edit';
        const path: any = "obd/createsalesorder";
        this.router.navigate([path]);
    }
    printSelectedReports(type) {
        if (this.selectedPgiList.length != 1) {
            if(this.selectedPgiList.length == 0){
            this.commonService.responseMessages("",  this.getWarningErrorMessage('select_atleast_msg'), "warning");    
            }else{
                this.commonService.responseMessages("",this.getWarningErrorMessage('select_msg'), "warning"); 
            }
           
            return false
        }
        else {

            let url: any = this.environment.getRequiredApi("print_delivery_list") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&im_v_vbeln=" + this.selectedPgiList[0].del_no + "&access_obj_id=" + this.accessObjectId + "&access_token=" + localStorage.getItem("token");
            window.open(url, '_blank');
        }
    }
    selectAll(event, checkAll, tableId) {
         exportIdlist =0;
        setTimeout(() => {
            if ($("#" + checkAll).is(":checked")) {
                this.commonService.selectAllCheckBoxes(checkAll, tableId);
                let count: any = 0;
                this.checkboxLength = 100;
                this.outBoundDeliveryList.forEach(currentItem=>{
                    this.selectedPgiListObject = {};
                //this.checkArray.push(response.del_nu    
                this.selectedPgiListObject["act_pg_date"] = currentItem.act_pgi_date;
                this.selectedPgiListObject["del_no"] = currentItem.del_num;
                this.selectedPgiList.push(this.selectedPgiListObject);
                  this.exportArrayList.push(currentItem); 
                    
                if (this.dlvrsDocArray == null || this.dlvrsDocArray == "") {
                      this.dlvrsDocArray = currentItem.del_num;
                  } else {
                      this.dlvrsDocArray = this.dlvrsDocArray + "," + currentItem.del_num;
                  }
                    
                    
                });
            } else {
                this.commonService.selectAllCheckBoxes(checkAll, tableId);
                this.checkboxLength = 0;
                this.selectedPgiList=[];
                 this.exportArrayList =[];
                this.dlvrsDocArray = "";
            }
            
        }, 300);

    }
    getReportList(event, tableId, i, response) {
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
                this.selectedPgiListObject = {};
                //this.checkArray.push(response.del_nu    
                this.selectedPgiListObject["act_pg_date"] = response.act_pgi_date;
                this.selectedPgiListObject["del_no"] = response.del_num;
                this.selectedPgiList.push(this.selectedPgiListObject);

                if (this.dlvrsDocArray == null || this.dlvrsDocArray == "") {
                    this.dlvrsDocArray = response.del_num;
                } else {
                    this.dlvrsDocArray = this.dlvrsDocArray + "," + response.del_num;
                }
                this.checkboxLength++;
                this.exportArrayList.push(response);
            } else {
                for (let i in this.selectedPgiList) {
                    if (this.selectedPgiList[i].del_no == response.del_num) {
                        this.selectedPgiList.splice(i, 1);

                    }
                }
                if (this.dlvrsDocArray.includes(",")) {
                    this.dlvrsDocArray = this.dlvrsDocArray.replace(response.del_num, "");
                    this.dlvrsDocArray = this.dlvrsDocArray.replace(/^,|,$/g, '');
                } else {
                    this.dlvrsDocArray = "";
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
                
                 for (let i in this.exportArrayList) {
                    if (this.exportArrayList[i].del_num == response.del_num) {
                        this.exportArrayList.splice(i, 1);
                        
                    }
                }
               
                
            }
            exportIdlist = this.exportArrayList.length;


        }, 300);
    }
    getSoList(itemList) {
        $("#itemDetailsPopup").modal("show");
        this.deliveryListItem = [];
        for (let soList of itemList) {
            this.deliveryListItem.push(soList.so_num);
        }
        console.log(this.deliveryListItem);
    }

    displayDeliveryDetails(items) {
        this.commonService.saleType = 'Display';
        const path: any = "obd/editdeliverydetails";
        this.router.navigate([path], { queryParams: { "orderNum": items.del_num, "action": "DIS" } });
    }
    changePickerPos() {
        setTimeout(() => {
            $(".bootstrap-datetimepicker-widget").css("position", "fixed");
            $(".bootstrap-datetimepicker-widget").css("top", "88.5px");
            $(".bootstrap-datetimepicker-widget").css("left", "18px");
             //$(".bootstrap-datetimepicker-widget").css("top", "163px");
            //$(".bootstrap-datetimepicker-widget").css("left", "367.938px");
            $(".bootstrap-datetimepicker-widget").css("height", "auto");
            $( ".bootstrap-datetimepicker-widget .datepicker table  td" ).css("padding","0px");
        }, 100);
    }
    
    changeCancelPickerPos(){
        setTimeout(() => {
            $(".bootstrap-datetimepicker-widget").css("position", "fixed");
            
            $(".bootstrap-datetimepicker-widget").css("top", "163px");
            $(".bootstrap-datetimepicker-widget").css("left", "367.938px");
            $(".bootstrap-datetimepicker-widget").css("height", "auto");
            $( ".bootstrap-datetimepicker-widget .datepicker table  td" ).css("padding","0px");
        }, 100);
    }
    removeStyles(id) {
        $('#' + id).datetimepicker("hide");
        this.createDeliveryForm.controls['outboundDate'].setValue($("#sFiterfromDate").val());
    }
    editDeliveryOrder(type) {
        if (this.checkboxLength > 1 || this.checkboxLength == 0) {
            if(this.checkboxLength == 0)
             this.commonService.responseMessages("", this.getWarningErrorMessage('select_atleast_msg'), "warning");
            else
            this.commonService.responseMessages("", this.getWarningErrorMessage('select_msg'), "warning");
            
            return false;
        } else {
            if (this.checkboxLength == 1) {
                this.commonService.saleType = 'Edit';
                const path: any = "obd/editdeliverydetails";
                this.router.navigate([path], { queryParams: { "orderNum": this.dlvrsDocArray, "action": "U" } });
            }
        }

    }

    cancelOutboundDlivery(tableId) {
        
        if (this.selectedPgiList == 0) {
            this.commonService.responseMessages("", this.getWarningErrorMessage('select_atleast_msg'), "warning");
            return false;
        }
        this.cancelPayload = {};

        let object = "OBD";
        let selectedDeliveryNo: any = [];
        this.cancelPayload["bp_id"] = this.bpId;
        this.cancelPayload["object"] = "OBD";
        this.cancelPayload["org_id"] = this.orgId;
        this.cancelPayload["object_details"] = [];
        let plObject: any = {}
        for (let index in this.selectedPgiList) {
            plObject = {}
            plObject["vbeln"] = this.selectedPgiList[index].del_no;
            this.cancelPayload["object_details"].push(plObject);
        }

        

        swal({
            title: "Do you want to cancel selected outbound delivery?",
            //text: "Do you want to delete branch?",
            showCancelButton: true,
            cancelButtonClass: "cancel-button-export btn-primary-custom",
            confirmButtonClass: "login-button-export btn-primary-custom",
            confirmButtonText: "Ok",
            closeOnConfirm: true
        },

            () => {
                $('#loadingIcon').show();                
                $("#black-overlay").show();
                if (this.checkboxLength == 0) {
                     this.commonService.responseMessages("", this.getWarningErrorMessage('select_atleast_msg'), "warning");
                    return false;
                } else {
                    let url: any = this.environment.getRequiredApi("cancel_sales_order") + "?";
                    this.commonService.getData(url, "POST", this.cancelPayload, this.accessObjectId).subscribe(response => {
                        
                        this.selectedPgiList=[];
                        if (response.status == 0) {
                            let respID = response.id;
                            this.extRet = response.ex_return;


                            //this.errorLogs= data.ex_return;
                            if (response.data.hasOwnProperty("ex_return")) {
                                for (let index of response.data.ex_return) {
                                    if (index.type == "E") {
                                        this.errorLogs = response.data.ex_return;
                                        $('#loadingIcon').hide();
                                        $("#black-overlay").hide();
                                        $("#cancel-outbound-delivery").modal("show");
                                        this.cancelPgiFlag=false;
                                        this.indeterminate=false;
                                        this.checked=false;
                                        return false;
                                    }
                                }

                            }
                            this.commonService.responseMessages("", "Outbound delivery successfully cancelled", "success");
                            this.indeterminate = false;
                            this.checked = false;
                            this.getSalesOutboundDeliveryList();
                        }
                        if (response.status == 1) {
                            this.commonService.responseMessages("", response.message, "warning");
                        }
                        $('#loadingIcon').hide();
                        $("#black-overlay").hide();
                    });
                    //window.open(url,'_blank');
                }

            });
    }
    exportExcel() {
         let excelFlag: boolean = true;

          if (this.exportArrayList.length != 0) {
              excelFlag = false;
              this.commonExportExcel(this.exportArrayList);  
             

          } else {
             
              if (this.outBoundDeliveryList.length !=0) {
                  this.commonExportExcel(this.outBoundDeliveryList)

              }else{
              this.commonService.responseMessages("", "No data available", "warning")    
              }


          }
        
       
    }
    
    commonExportExcel(list){
        
    let jsonArrrayData: any = [];
        if (list.length != 0) {

            for (let index of list) {
                if (!index.hasOwnProperty('del_num')) {
                    index.del_num = "  "
                }
                if (!index.hasOwnProperty('doc_category')) {
                    index.doc_category = "  "
                }
                if (!index.hasOwnProperty('del_date')) {
                    index.del_date = ' ';
                }
                if (!index.hasOwnProperty('ship_to')) {
                    index.ship_to = ' ';
                }
                if (!index.hasOwnProperty('status')) {
                    index.status = " ";
                }
                let soNums: any = "";
                for (let item of index.item) {
                    if (soNums == "") {
                        soNums = item.so_num;
                    } else {
                        soNums = soNums + "," + item.so_num;
                    }
                }
                index.so_num = soNums;
                jsonArrrayData.push(index);
            }
            let columns: any = ['del_num', 'doc_category', 'del_date', 'ship_to', 'status', 'so_num']
            let columnHeaders: any = ['Delivery Number', 'Document Category', 'Delivery Date', 'Ship to party', 'Status', 'Sales Order Numbers']
            let jsonData: any = JSON.stringify(jsonArrrayData);
            this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Sales orders list", columns, columnHeaders, 'Delivery');

        } 
    
    
    }


    cancelPGI(tableId) {
        if (this.selectedPgiList == 0) {
            this.commonService.responseMessages("", "Please select at least one outbound delivery", "warning");
            return false;
        }
        swal({
            title: "Do you want to cancel selected PGI/PGR?",
            //text: "Do you want to delete branch?",
            showCancelButton: true,
            cancelButtonClass: "cancel-button-export btn-primary-custom",
            confirmButtonClass: "login-button-export btn-primary-custom",
            confirmButtonText: "Ok",
            closeOnConfirm: true
        },

            () => {

                // this.cancelBillingForm.reset(    
                $("#cancel-pgi").modal("show");


                this.cancelpgiPayload = {};
                let object = "PGI";
                let selectedDeliveryNo: any = [];
                this.cancelpgiPayload["bp_id"] = this.bpId;
                this.cancelpgiPayload["object"] = "PGI";
                this.cancelpgiPayload["org_id"] = this.orgId;
                this.cancelpgiPayload["object_details"] = [];
//$( "#cpg" ).find( "td div ul li .datepicker table tbody td" ).css("padding","0px");

                for (let index in this.selectedPgiList) {



                    $('#date_picker' + this.selectedPgiList[index].del_no).datetimepicker({
                        debug: false,
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
                        maxDate: new Date()
                    });

                     $('#date_picker' + this.selectedPgiList[index].del_no).val("");

                }
            
           
                if(this.selectedPgiList.length >= 4){
                     $(".out-cancel-pgi-modal-body").css("height","400px");
                    $(".out-cancel-pgi-modal-body").css("overflow-y","scroll");
                }else{
                    if(this.selectedPgiList.length <= 2){
                        $(".out-cancel-pgi-modal-body").css("height","205px");
                    }else{
                        $(".out-cancel-pgi-modal-body").css("height","300px");    
                    }
                    
                    $(".out-cancel-pgi-modal-body").css("overflow-y","");
                }



            });
    }

    proceedToCancel() {
        
        
        
        for (let billIndex in this.selectedPgiList) {
            let delvyNum = this.selectedPgiList[billIndex].del_no;
            let date = $('#date_picker' + delvyNum).val()
            if (date == ""|| date.length == 0) {
                this.commonService.responseMessages("", "Please select Reversal Date", "warning");
                return false;
            }
            
          }
        
        $('#loadingIcon').show();
        $("#black-overlay").show();

        let plpgiObject: any = {}
        for (let index in this.selectedPgiList) {
            plpgiObject = {}
            let delvyNum = this.selectedPgiList[index].del_no;
            plpgiObject["vbeln"] = delvyNum;
            let delDate = $('#date_picker' + delvyNum).val().split("-");

            plpgiObject["budat"] = delDate[2] + delDate[1] + delDate[0];
            this.cancelpgiPayload["object_details"].push(plpgiObject);
        }
        

        let url: any = this.environment.getRequiredApi("cancel_sales_order") + "?";
        this.commonService.getData(url, "POST", this.cancelpgiPayload, this.accessObjectId).subscribe(response => {
            
            this.selectedPgiList = [];
            this.errorLogs = [];
            if (response.status == 0) {

                this.extpgiRet = response.ex_return;


                //this.errorLogs= data.ex_return;
                if (response.data.hasOwnProperty("ex_return")) {
                    for (let index of response.data.ex_return) {
                        if (index.msgty != "S") {
                            this.errorLogs = response.data.ex_return;
                            this.indeterminate=false;
                             this.checked=false;
                            break;
                        }
                    }

                }
                if (this.errorLogs.length != 0) {
                    this.cancelPgiFlag=true;
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                    $("#cancel-outbound-delivery").modal("show");


                } else {
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                    this.commonService.responseMessages("", "PGI/PGR successfully cancelled", "success");
                    this.getSalesOutboundDeliveryList();
                }
            }
            if (response.status == 1) {
                this.commonService.responseMessages("", response.message, "warning");
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
            }

        });


        this.closeModal('cancel-pgi')
    }
    displayItemsList(label, id) {
        $("#" + label + "" + id).show();
    }
    hideItemsList(label, id) {
        $("#" + label + "" + id).hide();
    }
    /* removeStyles(id){
    $('#'+id).datetimepicker("hide"); 
      
        this.createBillingForm.controls['billingDate'].setValue($("#billingDate").val());
        this.cancelBillingForm.controls['billingDate'].setValue($("#cancelBilling").val());
    }
    
     changeCancelPickerPos(){
               setTimeout(() => {
          $(".bootstrap-datetimepicker-widget").css("position", "fixed");
          $(".bootstrap-datetimepicker-widget").css("top", "92px");
          $(".bootstrap-datetimepicker-widget").css("left","150px")
          
      }, 100);               
      }*/
getDocumentFlow(docNum){
    $('#loadingIcon').show();
    $("#black-overlay").show();
    this.docFlowList=[];
    let url:any=this.environment.getRequiredApi("get_sales_doc_flow")+"?org_id="+this.orgId+"&bp_id="+this.bpId+"&doc_num="+docNum+"&item_num=''&all_items=false&";
    this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response=>{
        if(response.status==0){
            if(response.data.hasOwnProperty("ex_return")){
                      for(let index of response.data.ex_return){
                        if (index.type=="E") {
                                this.errorLogs = response.data.ex_return;
                                $("#cancel-sales-order").modal("show");
                                $('#loadingIcon').hide();
                                $("#black-overlay").hide();
                            return false;
                           }
                        }
                   }
            if(response['data'].hasOwnProperty('ex_document_flow')){
                let orderNum:any="";
                let itemNum:any="";
                let invoiceNum:any=""
                let returnOrdNum:any="";
                let count:any=0;
                let objectList:any=[];
                this.docFlowList=response['data'].ex_document_flow;
                /*for(let flow of response['data'].ex_document_flow){
                  if(flow.vbtyp_n=='C'){
                      objectList.push(flow);
                  }
                }
                for(let flow1 of objectList){
                    orderNum="";
                    this.docFlowList.push(flow1);
                    for(let flowLi of response['data'].ex_document_flow){
                       if(flowLi.vbtyp_n!='C'){
                        if(orderNum=="" && flow1.vbeln==flowLi.docnuv
                        && (flow1.posnn==flowLi.itemnum || flow1.posnn==flowLi.itemnuv)){
                            flowLi.child=false;
                            this.docFlowList.push(flowLi);
                            orderNum=flowLi.docnum;  
                        }else{
                           if(orderNum==flowLi.docnum && flow1.vbeln==flowLi.docnuv && (flow1.posnn==flowLi.itemnum || flow1.posnn==flowLi.itemnuv)){
                               flowLi.child=true; 
                               this.docFlowList.push(flowLi);
                           }else{
                               if(flowLi.vbtyp_n=='R'){
                                  if(orderNum==flowLi.docnuv && (flow1.posnn==flowLi.itemnum || flow1.posnn==flowLi.itemnuv)){
                                        flowLi.child=true; 
                                        this.docFlowList.push(flowLi);
                                  }
                              } 
                              if(flowLi.vbtyp_n=='M'){
                                  if(orderNum==flowLi.docnuv && (flow1.posnn==flowLi.itemnum || flow1.posnn==flowLi.itemnuv)){
                                        flowLi.child=true; 
                                        this.docFlowList.push(flowLi);
                                      invoiceNum=flowLi.docnum;
                                  }
                              }
                              if(flowLi.vbtyp_n=='N'){
                                  if(orderNum==flowLi.docnuv && (flow1.posnn==flowLi.itemnum || flow1.posnn==flowLi.itemnuv)){
                                        flowLi.child=true; 
                                        this.docFlowList.push(flowLi);
                                  }
                              }
                              if(flowLi.vbtyp_n=='H'){
                                  if(invoiceNum==flowLi.docnuv && (flow1.posnn==flowLi.itemnum || flow1.posnn==flowLi.itemnuv)){
                                        flowLi.child=true; 
                                        this.docFlowList.push(flowLi);
                                  }
                              }
                              if(flowLi.vbtyp_n=='T'){
                                  if(orderNum==flowLi.docnuv && flow1.posnn==flowLi.itemnum || flow1.posnn==flowLi.itemnuv){
                                        flowLi.child=true; 
                                        this.docFlowList.push(flowLi);
                                        returnOrdNum=flowLi.docnum;
                                  }
                              }
                              if(flowLi.vbtyp_n=='O'){
                                  if(returnOrdNum==flowLi.docnuv && (flow1.posnn==flowLi.itemnum || flow1.posnn==flowLi.itemnuv)){
                                        flowLi.child=true; 
                                        this.docFlowList.push(flowLi);
                                  }
                              } 
                              if(flowLi.vbtyp_n=='S'){
                                  if(returnOrdNum==flowLi.docnuv && (flow1.posnn==flowLi.itemnum || flow1.posnn==flowLi.itemnuv)){
                                        flowLi.child=true; 
                                        this.docFlowList.push(flowLi);
                                  }
                              }
                             if(flowLi.vbtyp_n=='h'){
                                  if(orderNum==flowLi.docnuv && flow1.posnn==flowLi.itemnum || flow1.posnn==flowLi.itemnuv){
                                        flowLi.child=true; 
                                        this.docFlowList.push(flowLi);
                                  }
                              } 
                           } 
                        }
                      }
                    }
                    
                }*/
                //this.docFlowList=response['data'].ex_document_flow;
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                $("#docFlowList").modal('show');
            }
        }else{
            $('#loadingIcon').hide();
            $("#black-overlay").hide();
            this.commonService.responseMessages("",response.message, "warning");    
        }
        
    });
}
   showFilters(){
  $("#filter-block").slideToggle();  
}
getFilterData(){
    if($("#cust-name").val()!=null && $("#cust-name").val()!=""){
        this.outBoundDelPayload['im_ship_to']=$("#filterCustomerId").val();
    }else{
        $("#filterCustomerId").val('');
        this.outBoundDelPayload['im_ship_to']=null;    
    }
        
    let delvNo = $("#delvryNum").val();
    let fromDate:any=$("#from-date").val();
    if(fromDate != ""){
        fromDate = fromDate.split("/");
        fromDate = fromDate[2] + "" + fromDate[1] + "" + fromDate[0];
         this.outBoundDelPayload['from_date']=fromDate;
    }
    
    let toDate:any=$("#to-date").val();
    if(toDate != ""){
        toDate = toDate.split("/");
        toDate = toDate[2] + "" + toDate[1] + "" + toDate[0];
        this.outBoundDelPayload['to_date']=toDate;
    }
    
    
    this.outBoundDelPayload['status']=$("#so-status").val();
   
    
    this.getSalesOutboundDeliveryList();
}
extractData(id,spinnerId,ajaxDropdown,event){
    let term:any=$("#"+id).val();
    if(this.customerNames.length==0){
         if(term.length>3){
              term=term.substring(0,3);  
         }   
    }
    if(term.length ==3 && event.keyCode!=38 && event.keyCode!=40 && event.keyCode!=13){
        $("#"+spinnerId).show();
        let url:any=this.environment.getRequiredApi("find_customers")+"?org_id="+this.orgId+"&bp_id="+this.bpId+"&cust_name="+term+"&";
    this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response=>{
        if(response.status==0){
            this.customerNames=response["data"].ex_cust_list;
            $("#"+spinnerId).hide();
            $("#"+ajaxDropdown).show();
            setTimeout(()=>{
               $("#"+ajaxDropdown).find('ul').find('li:first').addClass('active');
               $("#"+ajaxDropdown).find('ul').find('li:first').focus();
            },100);
        }else{
            $("#"+spinnerId).hide();
            $("#"+ajaxDropdown).show();
            $("#cust-not-found").show();
        }
       
    });
    }else{
       if(term==""){
           this.customerNames=[];
           $("#"+spinnerId).hide();
       }else{
          if(event.keyCode!=13 && event.keyCode!=38 && event.keyCode!=40){
           var searchText=term;
           $("#"+ajaxDropdown).find('ul > li').each(function(){
                var currentLiText = $(this).text(),
                    showCurrentLi = currentLiText.indexOf(searchText) !== -1;
                $(this).toggle(showCurrentLi);
            });
           }     
       }
    }
    if(event.keyCode==38 || event.keyCode==40 || event.keyCode==13){
        $("#"+ajaxDropdown).find('ul > li').each(function(){
              if(event.keyCode==40){
                  if($(this).hasClass('active')){
                    console.log($(this).attr('class'));
                    if($(this).next().is(':visible')){
                        $(this).removeClass('active');
                        $(this).next().addClass('active');
                        $(this).next().focus();
                        $("#"+ajaxDropdown).find("ul").scrollTop($(this).position().top);
                        return false;
                      }
                 }
              } 
            if(event.keyCode==13){
                  if($(this).hasClass('active')){
                    $(this).click();
                 }
              } 
            if(event.keyCode==38){
                  if($(this).hasClass('active')){
                    if($(this).prev().is(':visible')){
                        $(this).removeClass('active');
                        $(this).prev().focus();
                        $(this).prev().addClass('active');
                        $("#"+ajaxDropdown).find("ul").scrollTop($(this).position().top);
                        return false;
                      }
                 }
              } 
        });
    }
}
    
    selectedItem(response,modalBlock,textInput,hiddenInput){
    $("#"+textInput).val(response.cust_name);
    $("#"+hiddenInput).val(response.cust_id);
    $("#"+modalBlock).hide();
}
    
     getWarningErrorMessage(messageKey) {

        return this.checkboxErrorMsg[messageKey] + "outbound delivery";

    }
}
