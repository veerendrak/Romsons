import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http , Headers, Response,RequestOptions } from '@angular/http';
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
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrls: ['./billing-details.component.css']
})
export class BillingDetailsComponent implements OnInit {
    createBillingForm:FormGroup;
    billingDetMsg:any;
    billingListData:any;
      url:string;
     bpId:string;
     orgId:string;
    billingDetailsPayload:any={};
    checked:boolean=false;
    indeterminate:boolean=false;
    
    billingObjectEdit:any={};
    billingArrayEdit:any=[];
    accessObjId:string;
     errorLogs:any=[];
    cancelBillingForm:FormGroup;
    cancelBillingPayload:any={};
    
    cancelBillingFlag = false;
    
    countFlag:any=0;
    filterBillingForm:FormGroup;
    customerNames:any;
    ewayBillResponse:any;
    exportArrayList:any;
    docFlowList:any;
    subTypes:any;
    checkboxErrorMsg:any;
    
  constructor(private http: Http, private formBuilder: FormBuilder,private environment:EnvConfigurationService,
          private router: Router,private ref: ChangeDetectorRef,private app:AppComponent, private messagesService:MessagePropertiesService,
          private commonService:CommonService,private excelService: ExcelService) {
      this.app.isActive=true;
      this.createBillingForm = formBuilder.group({
          hideRequired: false,
          floatLabel: 'auto',
          'docNumber': ['', Validators.required],
          'billingDate':['', Validators.required],
        });
      
      this.cancelBillingForm = formBuilder.group({
          
          'billingDate':['', Validators.required],
        });
      this.filterBillingForm = formBuilder.group({
          
          'custName':[''],
          'frmDate':[''],
          'toDate':[''],
          'status':[''],
        });
      
       this.customerNames=[];
      this.billingDetMsg = messagesService.billing_det_msg;
       this.bpId = localStorage.getItem("bpId");
       this.orgId =localStorage.getItem("orgId");
      this.checked=false;
      this.indeterminate=false;
      this.accessObjId = localStorage.getItem("Billing");
      this.exportArrayList=[];
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
      this.checkboxErrorMsg=this.messagesService.check_box_error;
      
  }

  ngOnInit() {
    
     
        $( '#fromDateFilt' ).datetimepicker( {
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
                
            } );
      this.getBillingDetailsList();
      $(function(){
         $(document).on('click', function (e) {
              if (!$(e.target).hasClass('ajax-list')) {
                  $(".ajax-searchlist").hide();
              }
            $("#billingordertable_paginate").find('.page-link').on('click',function(e) {
              setTimeout(function(){
                 if($("#checkbox-all-input").is(":checked")){
                    $("#billingordertable").find("tbody").find(".mat-checkbox-input").each(function(i){
                        let id:any=$(this).attr('id');
                        if(!$("#"+id).is(":checked")){
                            $("#"+id).click();
                        }
                    });
                }else{
                    $("#billingordertable").find("tbody").find(".mat-checkbox-input").each(function(i){
                        let id:any=$(this).attr('id');
                        if(exportIdlist ==0){
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
      
 /*  setTimeout(function(){
                  var windowHeight = Math.round($(document).height());
                  var popupHeight = Math.round($('.modal').height())
                  var modalMarginTop = ((windowHeight - popupHeight)/2);
                  $("#billingSalesModal").css('margin-top', modalMarginTop + "px");
                  $("#displayErrorsModal").css('margin-top', modalMarginTop + "px");
                //  $("#cancel-billing").css('margin-top', modalMarginTop + "px");
          console.log(modalMarginTop)
          $("#cancel-billing").attr("style","margin-top:"+modalMarginTop+"px;");
          },1000);*/
      
      var windowHeight = $(window).height();
      var popupHeight = $('.modal').height()

      var modalMarginTop = ((windowHeight - popupHeight) / 2);

      
      $(".modal").attr("style", "margin-top:" + modalMarginTop + "px !important;");
      
  }
     applyDataTable(){
       
       setTimeout(()=>{  
           $("#billingordertable").DataTable({
             "order": [1,'desc'],
           "language": {
              "emptyTable": "No data available",
              "info": "Showing page _PAGE_ of _PAGES_",
              "infoFiltered": "(filtered from _MAX_ total records)"
            },
           
           "fnDrawCallback": function( oSettings ) {
               
                        if ( 5 >= oSettings.fnRecordsDisplay() ) {
                            $( oSettings.nTableWrapper ).find( '.dataTables_paginate' ).hide();
                            
                            $( oSettings.nTableWrapper ).find( '.dataTables_info' ).hide();
                           
                           
                        } else {
                            $( oSettings.nTableWrapper ).find( '.dataTables_paginate' ).show();
                            $(oSettings.nTableWrapper).find('.dataTables_filter').show();
                            $( oSettings.nTableWrapper ).find( '.dataTables_info' ).show();
                            $(oSettings.nTableWrapper).find('.dataTables_length').show();
                          
                        }
                    },
           "columnDefs": [ {
                "targets"  : 'no-sort',
                "orderable": false,
               },
               { type: 'currency', "targets": [8,9,10,11,12,13] } ]
          
      });
         },400);  
          setTimeout(() =>{
          $(".dataTables_scrollHeadInner").css({"width":"100%"});
          $(".table ").css({"width":"100%"}); 
          $("#billing-order-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
          },1100);
        
          setTimeout(()=>{
              var width=$("#mainContent").css("width");
              $(".outbound-footer").css("width",width);
              $(".outbound-footer").show();
          },50); 
        
    }
    getBillingDetailsList(){
        this.billingDetailsPayload["bp_id"]=this.bpId;
        this.billingDetailsPayload["org_id"]=this.orgId;
        
         $('#loadingIcon').show();
       $("#black-overlay").show();
       
        
         this.url = this.environment.getRequiredApi( 'get_billing_details' )+"?";
      
        this.commonService.getData( this.url, 'POST', this.billingDetailsPayload,localStorage.getItem("Billing"))
            .subscribe(( response ) => {
               if(response.status == '1'){
                   this.commonService.responseMessages("", response.message, "warning");
                this.billingListData=[];
                  $("#billingordertable").removeClass("billing-table-scroll")
                   $('#loadingIcon').hide();
                   $("#black-overlay").hide();
                    $("#billingordertable").DataTable().destroy();
                    this.applyDataTable();
               }else{
                this.billingListData = response.data.ex_bill_list; 
                   $("#billingordertable").DataTable().destroy();
                    this.applyDataTable();
                    $("#billingordertable").addClass("billing-table-scroll")
                   
                    
              $('#loadingIcon').hide();
              $("#black-overlay").hide(); 
               }
              
               $("#cust-name").val("")
                $("#filterCustomerId").val("")
               this.billingDetailsPayload = {};
              
                   
              
              
            
            }, err => {
                  $('#loadingIcon').hide();
              $("#black-overlay").hide();
                    console.log(err)   
            
            } );
        
        //
       // this.applyDataTable();
    }
    
    
    
    
    editBillingOrder(type) {

        let flag: boolean = this.commonService.continueAction(type);
        if (flag) {
            this.commonService.responseMessages("", this.getWarningErrorMessage('select_atleast_msg'), "warning");
            return false;
        }
        if (this.billingArrayEdit.length != 1 && !flag) {
            this.commonService.responseMessages("", this.getWarningErrorMessage('select_msg'), "warning");
            return false;
        } else {
            this.commonService.saleType = 'Edit';
            const path: any = "billing/editbillingdetails";

            this.router.navigate([path], { queryParams: { "billId": this.billingArrayEdit[0].bill_num, "delvNo": this.billingArrayEdit[0].del_num, "action": "U" } });
        }






    }
  createBillingOrder(){
      this.commonService.saleType='Create';
      $(".modal-header").find("#header-text").text("Create Billing");
      $("#billingSalesModal").modal("show");
      
       $('#billingDate').datetimepicker({
          debug:false,
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
  changePickerPos() {
      
     
      setTimeout(() => {
          $(".bootstrap-datetimepicker-widget").css("position", "fixed");
          $(".bootstrap-datetimepicker-widget").css("left", "156px");
          $(".bootstrap-datetimepicker-widget").css("top", "152px");
          $( ".bootstrap-datetimepicker-widget .datepicker table  td" ).css("padding","0px");
          
      }, 100);

  } 
  closeModal(id){
      $("#"+id).modal("hide");
      this.createBillingForm.reset();
      if(id == "displayErrorsModal"){
          this.indeterminate = false;
          this.checked = false;
      this.getBillingDetailsList();   
      }
  }
  createBillingSubmit(id){
      
      if(this.createBillingForm.value["docNumber"] == "" ||  this.createBillingForm.value["billingDate"] == ""){
          
      return false;
      }
     
      $("#"+id).modal("hide"); 
       const path:any="billing/createbilling";
      let  delv_no = this.createBillingForm.value["docNumber"];
     
      let billingDate = $("#billingDate").val();
      let splittedDateArray = billingDate.split("-");
      billingDate = splittedDateArray[2]+splittedDateArray[1]+splittedDateArray[0];
          
      this.router.navigate([path],{ queryParams: {"delvNo":delv_no,"billDate":billingDate,"action":"C"} });
      
  }
  editBillingOrderById(){
      this.commonService.saleType='Edit';
      const path:any="billing/createsalesorder";
      this.router.navigate([path]);
  }

  displayBillingDetails(selectedBillId, selectedDelNo) {
      this.commonService.saleType = 'Display';
      const path: any = "billing/editbillingdetails";
      this.router.navigate([path], { queryParams: { "billId": selectedBillId, "delvNo": selectedDelNo, "action": "DIS" } });

  }
    
  removeStyles(id) {

      if (id == "#fromDateFilt" || id == "#toDateFilt") {
          this.filterBillingForm.controls['frmDate'].setValue($("#fromDateFilt").val());
          this.filterBillingForm.controls['toDate'].setValue($("#toDateFilt").val());
      } else {
          this.createBillingForm.controls['billingDate'].setValue($("#billingDate").val());
      }
      $(id).datetimepicker("hide");

      //this.cancelBillingForm.controls['billingDate'].setValue($("#cancelBilling").val());
  }
    changeTodatePicker(id) {
        $(id).datetimepicker("hide");
        this.filterBillingForm.controls['frmDate'].setValue($("#fromDateFilt").val());
        if ($("#toDateFilt").val() != "") {
            $("#toDateFilt").datetimepicker("destroy");
        }
        var fromDateFilt=new Date();
        if($("#fromDateFilt").val().length != 0){
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
                this.billingObjectEdit = {};
                this.billingObjectEdit["bill_num"] = response.bill_doc;
                this.billingObjectEdit["del_num"] = response.delv_no;
                this.billingObjectEdit["doc_cat"] = response.doc_cat;
                this.billingObjectEdit["status"] = response.status;
                this.billingArrayEdit.push(this.billingObjectEdit);
                this.exportArrayList.push(response);
               
            } else {
                for (let i in this.billingArrayEdit) {
                    if (this.billingArrayEdit[i].bill_num == response.bill_doc) {
                        this.billingArrayEdit.splice(i, 1);
                         this.exportArrayList.splice(i, 1);
                    }
                }
                setTimeout(()=>{let flag:boolean=this.commonService.continueAction(tableId);
              if(flag){
                  this.indeterminate=false;
                  this.checked=false;
              }else{
                  this.indeterminate=true;
              }
              },200);
            }
             exportIdlist = this.exportArrayList.length;
        }, 300);


    }
    selectAll(event, checkAll, tableId) {
        
        let checkBoxArray=[];
        let mulChkFlag:boolean=false;
        exportIdlist =0;
        setTimeout(() => {
            this.commonService.selectAllCheckBoxes(checkAll, tableId)
            
              $("#billingordertable").find("tbody").find(".mat-checkbox-input").each(function(i){
                        let id:any=$(this).attr('id');
                        
                    });
            let billingRowCount = $("#billingordertable tbody tr").length;
            
            if(billingRowCount < 10){
                mulChkFlag = true;
            }
        
        if ($("#" + checkAll).is(":checked")) {
            
            setTimeout(() => {
            for (let list = 0; list < this.billingListData.length; list++) {
                
                if(mulChkFlag){
                    if ($("#checkbox-" + list + "-input").is(":checked")) {
                        this.billingObjectEdit = {};
                        this.billingObjectEdit["bill_num"] = this.billingListData[list].bill_doc;
                        this.billingObjectEdit["del_num"] = this.billingListData[list].delv_no;
                         this.billingObjectEdit["doc_cat"] = this.billingListData[list].doc_cat;
                         this.billingObjectEdit["status"] = this.billingListData[list].status;
                        this.billingArrayEdit.push(this.billingObjectEdit);
                    }
                }else{
                     this.billingObjectEdit = {};
                    this.billingObjectEdit["bill_num"] = this.billingListData[list].bill_doc;
                    this.billingObjectEdit["del_num"] = this.billingListData[list].delv_no;
                    this.billingObjectEdit["doc_cat"] = this.billingListData[list].doc_cat;
                    this.billingObjectEdit["status"] = this.billingListData[list].status;
                    this.billingArrayEdit.push(this.billingObjectEdit);
                
                }
                
                this.exportArrayList.push(this.billingListData[list]);
                   
                

            }
                },400);
            
        }else {
                this.commonService.selectAllCheckBoxes(checkAll, tableId);
                this.billingArrayEdit=[];
                this.exportArrayList=[];
            }
      
       }, 300);
    }
    cancelBilling(){
        
        this.cancelBillingPayload = {};
        this.cancelBillingPayload["bp_id"] = this.bpId;
        this.cancelBillingPayload["org_id"] = this.orgId;
        this.cancelBillingPayload["object"] = "SB";

        

        if (this.billingArrayEdit.length == 0) {
            this.commonService.responseMessages("", this.getWarningErrorMessage('select_atleast_msg'), "warning");
            return false;
        } else {
            
            swal( {
            title: "Do you want to cancel the billing ?",
            //type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-default btn-primary-custom login-button-export",
            cancelButtonClass: "btn-danger btn-danger-custom ",
            
            confirmButtonText: "Ok",
            closeOnConfirm: true
        },
                () => {
                    
                    
                     this.cancelBillingForm.reset();
                    
                    
                    $("#cancel-billing").modal("show");
                    
                    
                     for (let billIndex in this.billingArrayEdit) {
                         
                          $('#cancelBilling'+this.billingArrayEdit[billIndex].bill_num).datetimepicker({
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
                              $('#cancelBilling' + this.billingArrayEdit[billIndex].bill_num).val(" ");
                     }
                
                   
                   
                     if (this.billingArrayEdit.length >= 4) {
                         $(".cancel-billing-block").css("height", "400px");
                         $(".cancel-billing-block").css("overflow-y", "scroll");
                     } else {
                         if (this.billingArrayEdit.length <= 2) {
                             $(".cancel-billing-block").css("height", "205px");
                         } else {
                             $(".cancel-billing-block").css("height", "300px");
                         }

                         $(".cancel-billing-block").css("overflow-y", "");
                     }

                 /*   
                */
       
                
            } );
            
      
           
        }
    }
    
     billingListPrint(){
         
         let mulBill="";
         let billMsg="";
         let noPrintFlag=true;
         
         for(let printIndex of this.billingArrayEdit){
             mulBill = mulBill+printIndex.bill_num+",";
             if(printIndex.doc_cat =="Cancellation" ||printIndex.status =="Cancelled" ){
                 noPrintFlag = false;           
                 break;
             }    
         }
         mulBill = mulBill.substring(0, mulBill.lastIndexOf(","));
         
         
         if(mulBill.length == 0){
            billMsg = this.billingDetMsg.bill_select;    
         }
         if(!noPrintFlag){
            billMsg = this.billingDetMsg.bill_sel_cancel; 
         
         }
         
         
         if (mulBill.length != 0 && noPrintFlag) {
             let url: any = this.environment.getRequiredApi("print_billing_list") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&im_v_vbeln=" + mulBill + "&access_obj_id=" + this.accessObjId + "&access_token=" + localStorage.getItem("token")+"&action=S";
             window.open(url, '_blank');
         }else{
             this.commonService.responseMessages("", billMsg, "warning");
         }
    
   
   }
                         
      confirmCancelBilling(id){
                             
                            
          $(".bootstrap-datetimepicker-widget").css("position", "fixed");
         
          
          for (let billIndex in this.billingArrayEdit) {
              let date = $('#cancelBilling' + this.billingArrayEdit[billIndex].bill_num).val();
              if(date == " " || date.length == 0){
              this.commonService.responseMessages("", "Please select Reversal Date", "warning");
                  return false;
              }
          }
                          this.closeModal(id);    
                             $('#loadingIcon').show();
                             $("#black-overlay").show();
                             
                         this.cancelBillingPayload["object_details"] = [];
                                
                                  for (let billIndex in this.billingArrayEdit) {
                                     let billObject={};    
                                     
                                    billObject["vbeln"] =   this.billingArrayEdit[billIndex].bill_num;
                                      
                                      let delDate = $('#cancelBilling' + this.billingArrayEdit[billIndex].bill_num).val().split("-");
                                        if(delDate !=""){
                                    billObject["budat"] = delDate[2] + delDate[1] + delDate[0];
                                      }else{
                                          billObject["budat"] ="";  
                                        }
                                  this.cancelBillingPayload["object_details"].push(billObject);
                                }
                  
                    
                             



                   let url: any = this.environment.getRequiredApi("cancel_sales_order") + "?";
                    this.commonService.getData(url, "POST", this.cancelBillingPayload, this.accessObjId).subscribe(response => {
                        
                        this.billingArrayEdit=[];
                        this.errorLogs = [];
                        let errorObject = {};
                        if (response.status == 0) {
                            let data = response.data.ex_return;
                            if (response.data.hasOwnProperty("ex_return")) {
                                for (let index of data) {
                                    errorObject = {};
                                    if (index.type == "E") {
                                        errorObject["number"] = index.number;
                                        errorObject["message"] = index.message;
                                        errorObject["message_v1"] = index.message_v1;
                                        this.errorLogs.push(errorObject);
                                    }
                                }



                            }

                            if (this.errorLogs.length == 0) {
                                this.commonService.responseMessages("", "Billing is cancelled", "success");
                                this.indeterminate=false;
                                this.checked=false;
                                this.getBillingDetailsList();
                            }else{
                                this.cancelBillingFlag = true;
                                $("#displayErrorsModal").modal("show");
                            }

                        
                        } else {
                            this.commonService.responseMessages("", response.message, "warning");
                        }
                        $('#loadingIcon').hide();
                        $("#black-overlay").hide();
                    });      
                         
       }         
      changeCancelPickerPos(){
               setTimeout(() => {
          $(".bootstrap-datetimepicker-widget").css("position", "fixed");
          $(".bootstrap-datetimepicker-widget").css("left", "250px");
          $(".bootstrap-datetimepicker-widget").css("top", "100px");
          
      }, 100);               
      }          
      exportExcel() {
         
          let excelFlag: boolean = true;

          if (this.exportArrayList.length != 0) {
              excelFlag = false;
              this.commonexportExcel(this.exportArrayList);  
             

          } else {
             
              if (this.billingListData.length !=0) {
                  this.commonexportExcel(this.billingListData)

              }else{
              this.commonService.responseMessages("", "No data available", "warning")    
              }


          }


      }   
    
    commonexportExcel(arrayList){
         let jsonArrrayData: any = [];
         for (let index of arrayList) {
                  if (!index.hasOwnProperty('bill_doc')) {
                      index.del_num = "  "
                  }
                  if (!index.hasOwnProperty('doc_cat')) {
                      index.doc_category = "  "
                  }
                  if (!index.hasOwnProperty('bill_date')) {
                      index.del_date = ' ';
                  }
                  if (!index.hasOwnProperty('sold_to_name')) {
                      index.ship_to = ' ';
                  }
                  if (!index.hasOwnProperty('delv_no')) {
                      index.status = " ";
                  }
                  if (!index.hasOwnProperty('delv_date')) {
                      index.status = " ";
                  }
                  if (!index.hasOwnProperty('sum_iamt')) {
                      index.status = " ";
                  }
                  if (!index.hasOwnProperty('sum_camt')) {
                      index.status = " ";
                  }
                  if (!index.hasOwnProperty('sum_samt')) {
                      index.status = " ";
                  }
                  if (!index.hasOwnProperty('sum_csamt')) {
                      index.status = " ";
                  }
                  if (!index.hasOwnProperty('total_amount')) {
                      index.status = " ";
                  }
                  if (!index.hasOwnProperty('status')) {
                      index.status = " ";
                  }
                  jsonArrrayData.push(index);
              }
              let columns: any = ['bill_doc', 'doc_cat', 'bill_date', 'sold_to_name', 'delv_no', 'delv_date', 'sum_iamt', 'sum_camt', 'sum_samt', 'sum_csamt', 'total_amount', 'status']
              let columnHeaders: any = ['Invoice Number', 'Document Category', 'Invoice Date', 'Customer Name', 'Delivery Number', 'Delivery Date', 'IGST', 'CGST', 'SGST', 'CESS', 'Amount', 'Status']
              let jsonData: any = JSON.stringify(jsonArrrayData);
              this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Sales orders list", columns, columnHeaders, 'Billing');

        
    
    }
    
    
    removeDateStyles(id,bill){
        $('#'+id+bill).datetimepicker("hide"); 
    }
    
    filterBillingDetails(){
            $("#toggle-filter-billing").slideToggle();
            this.filterBillingForm.reset();
    }
    getFilteredBillingDetailsList(){
        
        if(this.filterBillingForm.value.frmDate == null  ){
            this.filterBillingForm.value.frmDate = ""
        }
         if(this.filterBillingForm.value.toDate == null  ){
            this.filterBillingForm.value.toDate = ""
        }
       
        //$("#filterCustomerId").val().length == 0 &&
        if(!( this.filterBillingForm.value.frmDate.length == 0 &&
                this.filterBillingForm.value.toDate.length == 0)
            ){
          //  this.billingDetailsPayload["cust_id"] = $("#filterCustomerId").val();
            this.billingDetailsPayload["from_date"] = this.splitDateDetails(this.filterBillingForm.value.frmDate);
            this.billingDetailsPayload["to_date"] = this.splitDateDetails(this.filterBillingForm.value.toDate);
            this.billingDetailsPayload["status"] = this.filterBillingForm.value.status;
        }
       /* if($("#filterCustomerId").val().length == 0){
            delete this.billingDetailsPayload["cust_id"];    
        }*/
        
       
        this.getBillingDetailsList();
    }
    
    extractData(id, spinnerId, ajaxDropdown,event) {
        let term: any = $("#" + id).val();
        if(this.customerNames.length==0){
         if(term.length>3){
              term=term.substring(0,3);  
         }   
         }
        if(term.length ==3 && event.keyCode!=38 && event.keyCode!=40 && event.keyCode!=13){
            $("#" + spinnerId).show();
            let url: any = this.environment.getRequiredApi("find_customers") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&cust_name=" + term + "&";
            this.commonService.getData(url, "GET", "", this.accessObjId).subscribe(response => {
                if (response.status == 0) {
                    this.customerNames = response["data"].ex_cust_list;
                    $("#" + spinnerId).hide();
                    $("#" + ajaxDropdown).show();
                    setTimeout(()=>{
               $("#"+ajaxDropdown).find('ul').find('li:first').addClass('active');
               $("#"+ajaxDropdown).find('ul').find('li:first').focus();
            },100);
                } else {
                    $("#" + spinnerId).hide();
                    $("#" + ajaxDropdown).show();
                     $("#cust-not-found").show();
                }

            });
        } else {
            if (term == "") {
                this.customerNames = [];
                $("#" + spinnerId).hide();
            } else {
                if(event.keyCode!=13 && event.keyCode!=38 && event.keyCode!=40){
                var searchText = term;
                $("#" + ajaxDropdown).find('ul > li').each(function() {
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
    
    selectedItem(response, modalBlock, textInput, hiddenInput) {
        $("#" + textInput).val(response.cust_name);
        $("#" + hiddenInput).val(response.cust_id);
        $("#" + modalBlock).hide();
    }
    
    splitDateDetails(dateVal){
        if(dateVal != null && dateVal.length != 0){
            let dateArray = dateVal.split("-");
            return dateArray[2] + dateArray[1] + dateArray[0];    
        }else{
            return null;    
        }
        
        
    }
    
     public convertDate(date){
        let dateArry = date.split("-");
        return new Date(dateArry[2],dateArry[1]-1,dateArry[0]);
    }
    
    public getSalesEwayBills(){
        
    
         let mulBill="";
         for(let printIndex of this.billingArrayEdit){
             mulBill = mulBill+printIndex.bill_num+",";
             
         }
         mulBill = mulBill.substring(0, mulBill.lastIndexOf(","));
         
         if (mulBill.length != 0) {
             let url: any = this.environment.getRequiredApi("get_sales_EBills") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&im_billing_no=" + mulBill+"&";
             this.commonService.getData(url, "GET", "", this.accessObjId).subscribe(response => {
                if (response.status == 0) {
                   if(response.data.hasOwnProperty("ex_excel_data")){
                       
                       this.ewayBillResponse = response.data.ex_excel_data;
                      
                   }
                    
                    if(this.ewayBillResponse.length !=0){
                        
                    this.exportEwayBill(this.ewayBillResponse);
                    }
                    
                   
                } else {
                     this.commonService.responseMessages("", response.message, "warning");
                }

            });
         
         
         
         }else{
             this.commonService.responseMessages("", "Please select atleast one billing", "warning");
         }
        
    }
    
    exportEwayBill(response){
        
          let jsonArrrayData:any=[];
              for(let index of response){
                  if(!index.hasOwnProperty('doc_no')){
                      index.doc_no="  "
                  }
                  if(!index.hasOwnProperty('doc_type')){
                      index.doc_type="  "
                  }
                  if(!index.hasOwnProperty('doc_date')){
                      index.doc_date=' ';
                  }
                 
                  if(!index.hasOwnProperty('from_name')){
                      index.from_name=" ";
                  }
                  if(!index.hasOwnProperty('from_gstin')){
                      index.from_gstin=" ";
                  }
                  if(!index.hasOwnProperty('from_city')){
                      index.from_city=" ";
                  }
                  if(!index.hasOwnProperty('to_name')){
                      index.to_name=" ";
                  }
                  if(!index.hasOwnProperty('to_gstin')){
                      index.to_gstin=" ";
                  }
                  if(!index.hasOwnProperty('to_city')){
                      index.to_city=" ";
                  }
                  if(!index.hasOwnProperty('to_post_code1')){
                      index.to_post_code1=" ";
                  }
                  
                   if(!index.hasOwnProperty('supply_type')){
                      index.supply_type=" ";
                  }
                   if(!index.hasOwnProperty('sub_type')){
                      index.sub_type=" ";
                  }
                  
                  
                  if (!index.hasOwnProperty('transport_name')) {
                      index.transport_name = " ";
                  }
                  
                  if (!index.hasOwnProperty('transport_id')) {
                      index.transport_id = " ";
                  }
                  if (!index.hasOwnProperty('transport_docno')) {
                      index.transport_id = " ";
                  }
                  
                  if(!index.hasOwnProperty('transport_mode')){
                      index.transport_mode=" ";
                  }
                  
                  if(!index.hasOwnProperty('transport_date')){
                      index.transport_date=" ";
                  }
                  
                  if (!index.hasOwnProperty('vehicle_no')) {
                      index.vehicle_no = " ";
                  }
                  
                  if(!index.hasOwnProperty('item_no')){
                      index.item_no=" ";
                  }
                  
                  if(!index.hasOwnProperty('product')){
                      index.product=" ";
                  }
                  if(!index.hasOwnProperty('description')){
                      index.description=" ";
                  }
                  if(!index.hasOwnProperty('hsn')){
                      index.hsn=" ";
                  }
                  if(!index.hasOwnProperty('units')){
                      index.units=" ";
                  }
                  if(!index.hasOwnProperty('qty')){
                      index.qty=" ";
                  }
                  if(!index.hasOwnProperty('assessable_value')){
                      index.assessable_value=" ";
                  }
                  if(!index.hasOwnProperty('tax_rate')){
                      index.tax_rate=" ";
                  }
                  if(!index.hasOwnProperty('cgst_amount')){
                      index.cgst_amount=" ";
                  }
                  if(!index.hasOwnProperty('sgst_amount')){
                      index.sgst_amount=" ";
                  }
                  if(!index.hasOwnProperty('igst_amount')){
                      index.igst_amount=" ";
                  }
                  jsonArrrayData.push(index);
              }
              let columns:any=['doc_no','doc_type','doc_date','from_name','from_gstin','from_city','to_name','to_gstin','to_city','to_post_code1','supply_type','sub_type',
              'transport_name','transport_id','transport_docno','transport_mode','transport_date','vehicle_no','item_no','product','description','hsn','units',
              'qty','assessable_value','tax_rate','cgst_amount','sgst_amount','igst_amount']
        
              let columnHeaders:any=['Document Number','Document Type','Document Date','From Name','From GSTIN','From City','To Name','To GSTIN','To City','To Postal Code','Supply Type','Sub Type',
              'Transport Name','Transport ID','Transport Doc No','Transport Mode','Transport Date','Vehicle No','Item No.','Product','Description','hsn',
              'Units','Qty','Assessable Value','Tax Rate','CGST','SGST','IGST']
              let jsonData:any=JSON.stringify(jsonArrrayData);
              this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "E-Way Bill",columns,columnHeaders,'E-Way Bill');
    }
getDocumentFlow(docNum){
    $('#loadingIcon').show();
    $("#black-overlay").show();
    this.docFlowList=[];
    let url:any=this.environment.getRequiredApi("get_sales_doc_flow")+"?org_id="+this.orgId+"&bp_id="+this.bpId+"&doc_num="+docNum+"&item_num=''&all_items=false&";
    this.commonService.getData(url, "GET", "", this.accessObjId).subscribe(response=>{
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
     getWarningErrorMessage(messageKey) {

        return this.checkboxErrorMsg[messageKey] + "billing";

    }
    
}
