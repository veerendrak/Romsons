import { Component, OnInit, Input,Output, EventEmitter,ChangeDetectorRef} from '@angular/core';
import { Http , Headers, Response,RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router,ActivatedRoute, Params} from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { DateAdapter } from '@angular/material';
import { MessagePropertiesService } from '../../services/message-properties.service'; 
import {EnvConfigurationService} from '../../services/env-configuration.service';
declare var $: any; 
declare var jQuery: any;
declare var swal: any;

@Component({
  selector: 'app-edit-billing-details',
  templateUrl: './edit-billing-details.component.html',
  styleUrls: ['./edit-billing-details.component.css']
})
export class EditBillingDetailsComponent implements OnInit {
        
    public billingId:string;
     bpId:any;
     orgId:any;
    public billingItemsArray:any=[];
    public billingHeaders:any={};
    public remark='';
     public editBillingPayload:any={};
    public editBillingArray=[];
    public actionType:string='';
    public billingItemObject={};
    public billingItemArray:any=[];
    public errorLogs:any=[];
    public headerTextList:any=[];
    public textHidden:boolean = false;
    
    public textVal:string;
    
    public selectedKey:string="";
    
    public textBoxObject={};
    public prevArray =[];
    
    public emptyFlag:boolean=false;
    
    public headerListId:any={};
    public deliveryNum:string;
     public remarks =[];
    billingArrayEdit:any=[];
    
    createBillingForm:FormGroup;
    billingDetMsg:any;
    
     cancelBillingPayload:any={};
    billingObjectEdit:any={};
    accessObjId:string;
    cancelBillingFlag:boolean= false;
    
    totalIgstVal: any;
    totalCgstVal: any;
    totalSgstVal: any;
    totalGrossVal: any;
    totalNetVal: any;
    totalDisAmt: any;

    
    public sch_val=0;dis_val=0;cgst_amt=0;sgst_amt=0;igst_amt=0;

   constructor(private http: Http, private formBuilder: FormBuilder,private messagesService:MessagePropertiesService,private environment:EnvConfigurationService,
          private router: Router,private ref: ChangeDetectorRef,private app:AppComponent,private commonService:CommonService,private activatedRoute:ActivatedRoute) {
       
        this.bpId=localStorage.getItem("bpId");
        this.orgId=localStorage.getItem("orgId");
        this.billingHeaders["bill_type"]="";
       this.billingHeaders["bill_date"]="";
       this.billingHeaders["sold_to_name"]="";
       this.billingHeaders["ship_to_name"]="";
       
       this.createBillingForm = formBuilder.group({
          hideRequired: false,
          floatLabel: 'auto',
          'docNumber': ['', Validators.required],
          'billingDate':['', Validators.required],
        });
       this.billingDetMsg = messagesService.billing_det_msg;
       this.accessObjId = localStorage.getItem("Billing");
       this.totalIgstVal = 0;
       this.totalCgstVal = 0;
       this.totalSgstVal = 0;
       this.totalGrossVal = 0;
       this.totalNetVal = 0;
       this.totalDisAmt = 0;
   } 
 

   ngOnInit() {

      
       
        this.textHidden = false; 
       this.cancelBillingFlag=false;
       this.headerTextList = [];
       this.getHeaderList();

       this.activatedRoute.queryParams.subscribe(params => {
           if (this.router.url.includes("billing")) {
               this.billingId = params['billId'];
               this.actionType = params['action'];
               this.deliveryNum=params['delvNo'];
               if (this.actionType == "U") {
                   this.editBillingPayload["bp_id"] = this.bpId;
                   this.editBillingPayload["org_id"] = this.orgId;
                   this.totalIgstVal = 0;
                   this.totalCgstVal = 0;
                   this.totalSgstVal = 0;
                   this.totalGrossVal = 0;
                   this.totalNetVal = 0;
                   this.totalDisAmt = 0;
               }
            this.getBillingListOnBillId(this.billingId);

           }
       });
   }
    
    
    public getBillingListOnBillId(billId){
        
        $('#loadingIcon').show();
        $("#black-overlay").show();  
         
         let url = this.environment.getRequiredApi( 'get_billing_details_billid' )+"?bill_no="+billId+"&org_id="+this.orgId+"&bp_id="+this.bpId+"&doc_type=''&";
      
        this.commonService.getData( url, 'GET', '',localStorage.getItem( 'Billing' ))
            .subscribe(( response ) => {
              
                
                if(response.status == 0){
                    this.errorLogs =[];
                    if (response.data.hasOwnProperty("ex_return")) {
                        for(let index in response.data.ex_return){
                            if ("S" != response.data.ex_return[index].type) {
                            this.errorLogs = response.data.ex_return;
                        }
                        }
                        if(this.errorLogs.length != 0){
                             $("#displayErrorsModal").modal("show");
                        }
                        $('#loadingIcon').hide();
                        $("#black-overlay").hide();
                         setTimeout(()=>{
                               var width=$("#mainContent").css("width");
                               $(".outbound-footer").css("width",width);
                               $(".outbound-footer").show();
                           },50);
                        return false;
                    }
                    if(response.data.hasOwnProperty('ex_bill_item')){
                        for(let res of response.data.ex_bill_item){
                            this.sch_val = this.sch_val + res.sch_val;
                            this.dis_val = this.dis_val + res.dis_val;
                            this.cgst_amt = this.cgst_amt + res.cgst_amt;
                            this.sgst_amt = this.sgst_amt + res.sgst_amt;
                            this.igst_amt = this.igst_amt + res.igst_amt;
                            
                           /* response.data.ex_bill_item["tot_sch_val"] = sch_val;
                            response.data.ex_bill_item["tot_dis_val"] = dis_val;
                            response.data.ex_bill_item["tot_cgst_amt"] = cgst_amt;
                            response.data.ex_bill_item["tot_sgst_amt"] = sgst_amt;
                            response.data.ex_bill_item["tot_igst_amt"] = igst_amt;*/
                        }
                       }
                     this.billingItemsArray = response.data.ex_bill_item;
                      for(let element in this.billingItemsArray){
                          this.billingItemsArray[element].fix_sch = Math.abs( this.billingItemsArray[element].fix_sch)
                          this.billingItemsArray[element].sch_val = Math.abs( this.billingItemsArray[element].sch_val)
                          this.billingItemsArray[element].dis_amt = Math.abs( this.billingItemsArray[element].dis_amt)
                          this.billingItemsArray[element].dis_val = Math.abs( this.billingItemsArray[element].dis_val)
                            this.billingItemsArray[element].sgst_rate = Math.abs(this.billingItemsArray[element].sgst_rate)
                            this.billingItemsArray[element].cgst_rate = Math.abs(this.billingItemsArray[element].cgst_rate)
                            this.billingItemsArray[element].igst_rate = Math.abs(this.billingItemsArray[element].igst_rate)
                          
                          this.totalIgstVal = this.totalIgstVal + parseFloat(this.billingItemsArray[element].igst_amt);
                          this.totalCgstVal = this.totalCgstVal + parseFloat(this.billingItemsArray[element].cgst_amt)
                          this.totalSgstVal = this.totalSgstVal + parseFloat(this.billingItemsArray[element].sgst_amt);
                          this.totalNetVal = this.totalNetVal + parseFloat(this.billingItemsArray[element].net_val);
                          this.totalDisAmt = this.totalDisAmt + parseFloat(this.billingItemsArray[element].dis_amt);
                            this.totalGrossVal = this.totalGrossVal+ parseFloat(this.billingItemsArray[element].total_amt);
                          
                        }
                     
                    
                    console.log(this.billingItemsArray);
                    
                    if(response.data.hasOwnProperty("ex_return")){
                      this.errorLogs=response.data.ex_return;
                         if(this.errorLogs.length != 0){
                             $("#displayErrorsModal").modal("show");
                        }
                  }
                    if(response.data.hasOwnProperty("ex_bill_hdr")){
                        this.billingHeaders = response.data.ex_bill_hdr[0];
                         if(this.billingHeaders.hasOwnProperty("remarks")){
                        this.remarks =  response.data.ex_bill_hdr[0].remarks; 
                        for(let remIndex in this.remarks){
                            //let remIndexCount:any=parseFloat(remIndex)+1;
                        if(this.remarks[remIndex].hasOwnProperty('tdline')){
                          this.headerListId[this.remarks[remIndex].text_id] = this.remarks[remIndex].tdline;  
                        }
                        }
                    }
                        for(let index in this.headerTextList){
                            console.log(this.headerListId[this.headerTextList[index].key])
                            if(this.headerListId[this.headerTextList[index].key] != ""){
                                this.headerTextList[index]["color"]=true;
                            }
                        }
                        console.log(this.headerTextList);
                    }
                    $("#gs-GSTR1A").hide();
                    $("#gs-GSTR1").hide();
                     $("#gs-GSTR2").hide();
                   $("#gs-GSTR2A").hide();
                    $("#icon-GSTR1A").show();
                    
                    $("#icon-GSTR1").show();
                    $("#icon-GSTR2").show();
                    $("#icon-GSTR2A").show().css("background","rgb(3, 105, 99").css("color","#fff");
                   
                  
                    
                }else{
                   this.billingItemsArray=[]; 
                   this.commonService.responseMessages("",response.message, "warning");
                }
               $('#loadingIcon').hide();
               $("#black-overlay").hide();
               setTimeout(()=>{
                   var width=$("#mainContent").css("width");
                   $(".outbound-footer").css("width",width);
                   $(".outbound-footer").show();
               },50);
            }, err => {
                  
                    console.log(err)   
                $('#loadingIcon').hide();
               $("#black-overlay").hide();
               
                //this.reqdata.responseMessages(err, err.status, 'danger');
            } );
    }
    
    public backToBillingDetails(){
        const path:any='billing';
        this.router.navigate([path]);
    }
    
    saveEditBilling() {
        $('#loadingIcon').show();
        $("#black-overlay").show();  

        let url = this.environment.getRequiredApi('manage_bill_details') + "?";


        this.editBillingPayload["im_action"] = 'EB'

        //this.billingItemObject["text_id"] = $("#header_Text").val();
        
        if (this.emptyFlag) {
            for (let index in this.headerListId) {
//                
                if(this.headerListId[index] === undefined){
                    this.headerListId[index] ="";
                }
                
                if (this.headerListId[index].length != 0) {
                    this.billingItemObject = {};
                    this.billingItemObject["billing_no"] = this.billingId;
                    this.billingItemObject["object_name"] = "VBBK";
                    this.billingItemObject["text_id"] = index;
                    this.billingItemObject["text_line"] = this.headerListId[index];
                    this.billingItemArray.push(this.billingItemObject);
                }
                
            }
        }else{
                    this.billingItemObject["billing_no"] = this.billingId;
                    this.billingItemObject["object_name"] = "VBBK";
                    this.billingItemObject["text_id"] = "";
                    this.billingItemObject["text_line"] = "";
                    this.billingItemArray.push(this.billingItemObject);
        }
       
        
        this.editBillingPayload["im_billing_no"] = this.billingItemArray;
        
      
        console.log(this.editBillingPayload);

          this.commonService.getData(url, 'POST', this.editBillingPayload, localStorage.getItem('Billing'))
            .subscribe((response) => {
                if (response.status == 0) {
                    this.billingItemObject = {};
                    this.billingItemArray=[];
                   
                    this.errorLogs =[];
                    if (response.data.hasOwnProperty("ex_return")) {
                        for(let index in response.data.ex_return){
                            if ("S" != response.data.ex_return[index].type) {
                            this.errorLogs = response.data.ex_return;
                           
                        }
                        }
                        
                        if(this.errorLogs.length != 0){
                             $("#displayErrorsModal").modal("show");
                        }
                        if(response.data.ex_return.length != 0 && "S" == response.data.ex_return[0].type){
                             this.commonService.responseMessages("", "Billing saved successfully", "success");
                             const path: any = 'billing';
                             this.router.navigate([path]);
                       /*       const path:any='billing/editbillingdetails';
        this.router.navigate([path],{ queryParams: {"billId":this.billingId,"delvNo":this.deliveryNum,"action":"DIS"} });*/
                             
                             
                        }

                    }


                    console.log(response.data);
                }
                if (response.status == 1) {
                    this.commonService.responseMessages("", response.message, "warning");
                }
                $('#loadingIcon').hide();
               $("#black-overlay").hide();

            }, err => {

                console.log(err)
                $('#loadingIcon').hide();
               $("#black-overlay").hide();

            });
        
    }
    closeModal(id) {
        $("#" + id).modal("hide");
         this.createBillingForm.reset();
        if(id =="cancel-billing"){
          this.billingObjectEdit = {};
        }
        
        
    }
    
    getHeaderList() {

        let url = this.environment.getRequiredApi('header_dropdown') + "?group=BHDRS&";

        this.commonService.getData(url, "GET", '', "")
            .subscribe((response) => {
                console.log(response);
                this.headerTextList = response.data.configValues;
                let headerList = this.headerTextList;
                for(let index in headerList){
                    this.headerListId[headerList[index].key]="";
                    
                }
                this.emptyFlag=false;
            });
    }
    
    addTextBox(key){
        
        for(let remIndex in this.remarks){
                 this.headerListId[this.remarks[remIndex].text_id] = this.remarks[remIndex].tdline;
         }
        
        for(let index in this.headerListId){
            let prevKeyVals = this.headerListId[index];
            if(index == key){
                
            }else{
                $("#header_"+index).hide();
            }    
        }
       
        $("#header_"+key).removeAttr("style");
        
        $("#header_"+key).find("textarea").val(this.headerListId[key]);
        
       
        console.log(this.headerListId);
      
        
        
    }
    onChange(event: any,key) {
        this.emptyFlag =true;
       /* for(let remIndex in this.remarks){
                 this.headerListId[this.remarks[remIndex].text_id] = this.remarks[remIndex].tdline;
         }*/
        
        
       this.headerListId[key] = event.target.value;
        
    };
    
    navigateToEditBilling(){
         //this.getHeaderList()
        const path:any='billing/editbillingdetails';
        this.router.navigate([path],{ queryParams: {"billId":this.billingId,"delvNo":this.deliveryNum,"action":"U"} });
    }
    
    createNewBilling(){
       
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
          $(".bootstrap-datetimepicker-widget").css("top", "102px");
          $(".bootstrap-datetimepicker-widget").css("left","200px")
          
      }, 100);

  } 
    removeStyles(id){
    $('#'+id).datetimepicker("hide"); 
      
        this.createBillingForm.controls['billingDate'].setValue($("#billingDate").val());
        //this.cancelBillingForm.controls['billingDate'].setValue($("#cancelBilling").val());
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
    
     cancelBilling() {

         this.cancelBillingPayload = {};
         this.cancelBillingPayload["bp_id"] = this.bpId;
         this.cancelBillingPayload["org_id"] = this.orgId;
         this.cancelBillingPayload["object"] = "SB";

        this.billingArrayEdit=[];
         this.billingObjectEdit = {};
         this.billingObjectEdit["bill_num"] = this.billingId;
         this.billingObjectEdit["del_num"] = this.deliveryNum;
         this.billingArrayEdit.push(this.billingObjectEdit);


         if (this.billingArrayEdit.length == 0) {
             this.commonService.responseMessages("", "Please Select Billings To Cancel", "warning");
             return false;
         } else {

             swal({
                 title: "Do you want to cancel the billing ?",
                 //type: "warning",
                 showCancelButton: true,
                 confirmButtonClass: "btn-default btn-primary-custom login-button-export",
                 cancelButtonClass: "btn-danger btn-danger-custom ",

                 confirmButtonText: "Ok",
                 closeOnConfirm: true
             },
                 () => {


                     $("#cancel-billing").modal("show");


                     for (let billIndex in this.billingArrayEdit) {

                         $('#cancelBilling' + this.billingArrayEdit[billIndex].bill_num).datetimepicker({
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
                     }


                 });



         }
     }
    confirmCancelBilling(id){
                             

        $(".bootstrap-datetimepicker-widget").css("position", "fixed");
        $(".bootstrap-datetimepicker-widget").css("top", "92px");
        $(".bootstrap-datetimepicker-widget").css("left", "150px");

        for (let billIndex in this.billingArrayEdit) {
            let date = $('#cancelBilling' + this.billingArrayEdit[billIndex].bill_num).val();
            if (date == "") {
                this.commonService.responseMessages("", "Please select Reversal Date", "warning");
                return false;
            }
        }
        this.closeModal(id);
        $('#loadingIcon').show();
        $("#black-overlay").show();

        this.cancelBillingPayload["object_details"] = [];

        for (let billIndex in this.billingArrayEdit) {
            let billObject = {};

            billObject["vbeln"] = this.billingArrayEdit[billIndex].bill_num;

            let delDate = $('#cancelBilling' + this.billingArrayEdit[billIndex].bill_num).val().split("-");
            if (delDate != "") {
                billObject["budat"] = delDate[2] + delDate[1] + delDate[0];
            } else {
                billObject["budat"] = "";
            }
            this.cancelBillingPayload["object_details"].push(billObject);
        }


        console.log(this.cancelBillingPayload)

        let url: any = this.environment.getRequiredApi("cancel_sales_order") + "?";
        this.commonService.getData(url, "POST", this.cancelBillingPayload, localStorage.getItem('Billing')).subscribe(response => {
            console.log(response)
            this.billingArrayEdit = [];
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
                    this.commonService.responseMessages("", "Billing is cancelled", "warning");
                    this.backToBillingDetails();
                } else {
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
    removeDateStyles(id,bill){
        $('#'+id+bill).datetimepicker("hide"); 
    }
        billingPrint(){
     
           

                let url: any = this.environment.getRequiredApi("print_billing_list") + "?org_id=" + this.orgId + "&bp_id=" + this.bpId + "&im_v_vbeln=" + this.billingId + "&access_obj_id=" + this.accessObjId + "&access_token=" + localStorage.getItem("token")+ "&action=S";
                window.open(url, '_blank');
            

        }
}
