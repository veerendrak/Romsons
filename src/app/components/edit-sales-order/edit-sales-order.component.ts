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
declare var XLSX:any;
declare var XLS:any;
var count=0;
var mergeItems=[];
@Component({
  selector: 'app-edit-sales-order',
  templateUrl: './edit-sales-order.component.html',
  styleUrls: ['./edit-sales-order.component.css']
})
export class EditSalesOrderComponent implements OnInit {
    salesOrderForm:FormGroup;
@Output()
@Input() salesSeries:any=""; 
title:any;
createSalesBlock:boolean=true;
outboundDeliberyBlock:boolean=false;
billingBlock:boolean=false;
postGoodsBlock:boolean=false;
showOrderType:boolean;  
salesOrderMessage:any;
formResetFlag:boolean=false;
editOrderNum:any;
customerId:any;
bpId:any;
orgId:any;
accessObjectId:any;
payload:any;
customerList:any;
payIncoTermsList:any;
dsFlag:boolean=true;
customerShiptoParty:any;
customerNames:any;
customerListLength:any;
customerShiptoPartyLenth:any;
payIncoTermsListLength:any;
createSalesOrderItems:any;
indeterminate:boolean=false;
checked:boolean=false;
checkedObjects:any;
matnrDetails:any;
incoTermVal:any;
payTermVal:any;
manageSalesPayload:any;
calcResultsList:any;
orderNum:any;
createSalesFlag:boolean=true;
createdSales:boolean=false;
errorList:any;
errorFlag:boolean=false;
schTypeSymbol:any;
salesOrderDtlList:any;
orderTypes:any;
shipToPartyId:any;
docType:any;
reqDate:any;
purNum:any;
purDate:any;
shName:any;
sdName:any;
shNameId:any;
sdNameId:any;
displayFlag:boolean=false;
sdPartyList:any;
sdPartyListLength:any;
incoTerms1:any;
payTerms:any;
oldCustomerId:any;
headerText:any;
outBoundDelPayload:any={};    
deliveryNum:any;    
calcBtn:boolean=false;
saveBtn:boolean=false;  
totalNetval:any;
totalIgst:any;
totalCgst:any;
totalSgst:any;
totalGrossVl:any;
goodsFlag:boolean=true;
goodsIssuedFlag:boolean=false
deliveryFlag:boolean=true;
deliveredFlag:boolean=false
reqDlvrNum:any;
action:any;
extRet:any;
errorLogs:any;
cancelPayload:any={};
url:any;
createSalesOrderForm:FormGroup;
cancelBtn:boolean=false;
errorCreateDo:boolean=false;
shSubId:any;
sdSubId:any;
reasonList:any;
billBlockList:any;
orderType:any;
reasonCode:any;
billCode:any;
billDate:any;
dlvlist:any;
dlvStatus;any;
priceList:any;
priceEnable:boolean=false;
comGrpList:any;
custGroup:any;
custAddress:any;
oneTimeCustForm:FormGroup;
displayShip:boolean=false;
country:any;
state:any;
countryList:any;
states:any;
schemesFlag:boolean=true;
schemesList:any;
enableSchemes;boolean=true;
objectArrayList:any;
disableList:any;
initCount:any=0;
totalPrice:any;
totalFixSheme:any;
totalAddDisAmt:any;
totalNetVal:any;
totalIgstVal:any;
totalCgstVal:any;
totalSgstVal:any;
totalGrossVal:any;
fromPage:any;
constructor(private http: Http, private formBuilder: FormBuilder,
      private router: Router,private ref: ChangeDetectorRef,private app:AppComponent,private messagesService:MessagePropertiesService,
      private commonService:CommonService,private dateAdapter: DateAdapter<Date>,private activatedRoute:ActivatedRoute,
      private environment:EnvConfigurationService) {
  this.app.isActive=true;
  this.errorCreateDo=false;
  this.dateAdapter.setLocale('en-gb');
  this.salesOrderForm = formBuilder.group({
      hideRequired: false,
      floatLabel: 'auto',
      'req_date_h' : [''],
      'purch_no_c':[''],
      'purch_date':[''],
      'soldToParty':['']
    });
  this.createSalesOrderForm = formBuilder.group({
      hideRequired: false,
      floatLabel: 'auto',
      'customer'   : [''],
      'orderType' : ['',Validators.required],
      'invoiceNum' : [''], 
    });
  this.createSalesBlock=true;
  this.showOrderType =commonService.showOrderType;
  this.salesOrderMessage = messagesService.sales_order_details_msg;
  this.bpId=localStorage.getItem("bpId");
  this.orgId=localStorage.getItem("orgId");
  this.accessObjectId=localStorage.getItem("Sales Order");
  this.customerNames=[];
  this.customerList={};
  this.customerListLength=0;
  this.customerShiptoParty={};
  this.customerShiptoPartyLenth=0;
  this.payIncoTermsListLength=0;
  this.payload={};
  this.createSalesOrderItems=[];
  this.checkedObjects=[];
  this.matnrDetails=[];
  this.incoTermVal="";
  this.payTermVal="";
  this.manageSalesPayload={};
  this.calcResultsList={};
  this.orderNum="";
  this.createSalesFlag=true;
  this.createdSales=false;
  this.orderTypes=[];
  this.docType=null;
  this.reqDate="";
  this.purDate="";
  this.purNum="";
  this.shName="";
  this.sdName="";
  this.shNameId="";
  this.sdNameId="";
  this.sdPartyList={};
  this.sdPartyListLength=0;
  this.incoTerms1="";
  this.payTerms="";
  this.headerText="";
  this.errorList=[];
  this.calcBtn=false;
  this.saveBtn=false;
  this.totalNetval=0;
  this.totalIgst=0;
  this.totalCgst=0;
  this.totalSgst=0;
  this.totalGrossVl=0;
  this.goodsFlag=true;
  this.goodsIssuedFlag=false;
  this.deliveryFlag=true;
  this.deliveredFlag=false;
  this.reqDlvrNum="";
  this.action="";
  this.cancelPayload={};
  this.extRet=[];
  this.errorLogs=[];
  this.orderTypes=[];
  this.cancelBtn=false;
  this.shSubId="";
  this.sdSubId="";
  this.billBlockList=[];
  this.reasonList=[];
  this.orderType="";
  this.billDate="";
  this.dlvlist=[];
  this.dlvStatus="";
  this.priceList=[];
  this.priceEnable=false;
  this.comGrpList=[];
  this.custGroup="";
  this.custAddress={};
  this.oneTimeCustForm=formBuilder.group({
          hideRequired: false,
          floatLabel: 'auto',
          'firstname'   : ['', Validators.required],
          'lastname' : [''],
          'hsno' : [''],
          'country' : [''],
          'city' : ['',Validators.required],
          'stateId' : ['',Validators.required],
          'streetNo':[''],
          'postcode' : ['', [ Validators.pattern( '^[1-9][0-9]{5}$' )]],
          'email': ['', [Validators.pattern( '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$' )]],
          'phone' : ['', [Validators.pattern( '^[789]{1}[0-9]{9}$' )]],
          'bpGstinNumber': ['', [Validators.pattern( '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z][0-9A-Z]{1}$' )]],
          'bpPan': ['', [Validators.pattern( '^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$' )]],
          'drugLicNum': ['',[]],
          'street1':['',[]],
          'fax':['',[]]
        });
    this.displayShip=false;
    this.country=1;
    this.state=36;
    this.countryList=[];
    this.states=[];
    this.schemesFlag=true;
    this.schemesList=[];
    this.enableSchemes=true;
    this.objectArrayList=[];
    this.disableList=[];
    this.totalPrice=0;
    this.totalFixSheme=0;
    this.totalAddDisAmt=0;
    this.totalNetVal=0;
    this.totalIgstVal=0;
    this.totalCgstVal=0;
    this.totalSgstVal=0;
    this.totalGrossVal=0;
    this.fromPage=""
}

ngOnInit() {
   setTimeout(function(){
    $(document).ready(function(){
        console.log('calling');
    $("input[type=file]").change(function(){
          mergeItems=[];
          var file = this.files[0];
          var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
          var fileName = $( "#uploadExcel" ).val()
          fileName = fileName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
          $( "#loadingIcon" ).show();
          $( "#black-overlay" ).show();
          var errorFlag=false;
          $("#errorExcelTable").find('tbody').html('');
          var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/  
          if ($("#uploadExcel").val().toLowerCase().indexOf(".xlsx") > 0 || $("#uploadExcel").val().toLowerCase().indexOf(".xls") > 0){
              xlsxflag = true;  
              if ( typeof ( FileReader ) != "undefined" ) {
                  var reader = new FileReader();
                  reader.onload = function( e: any ) {
                      if ( e.target.result.length == 1 ) {
                          $.notify( {
                              title: '',
                              message: "No data available in the uploaded file"
                          }, {
                                  type: "warning"
                              } );
                          $( "#loadingIcon" ).hide();
                          $( "#black-overlay" ).hide();
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
                      sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/  
                          /*Convert the cell value to Json*/  
                          if (xlsxflag) {  
                              var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);  
                          }  
                          else {  
                              var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);  
                          }  
                          if (exceljson.length > 0 && cnt == 0) {  
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
                              var columns =columnSet;
                              for (var i = 0; i < exceljson.length; i++) {  
                                  //if(exceljson.length>mergeItems.length){
                                      var newObject={
                                              "mat_num":"",
                                              "qty":0,
                                              "uom":"",
                                              "desc":"",
                                              "price":0,
                                              "fix_sch":"",
                                              "sch_val":0,
                                              "add_dis":"",
                                              "dis_per_val":0,
                                              "dis_amt":0,
                                              "net_val":0,
                                              "sgst_rt":"",
                                              "sgst_val":0,
                                              "cgst_rt":"",
                                              "cgst_val":0,
                                              "igst_rt":"",
                                              "igst_val":0,
                                              "displayRow":true,
                                              "updateflag":"I",
                                              "errorMat":true
                                          }
                                      var row=jQuery.extend({}, newObject);
                                      mergeItems.push(row);
                                  //}  
                                  for (var colIndex = 0; colIndex < columns.length; colIndex++) {  
                                      var cellValue = exceljson[i][columns[colIndex]];  
                                      if (cellValue == null)  
                                          cellValue = ""; 
                                      if(colIndex==0){
                                          mergeItems[i]['mat_num']= cellValue;
                                      }else{
                                          var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                                              if(format.test(cellValue)){
                                                   var row$ = $('<tr/>');
                                                    var rowNum=i+1;
                                                    var errorLine = "Special characters are not allowed check this line Item row number "+rowNum+" "+mergeItems[i]['mat_num']+" and quantity"+cellValue
                                                    row$.append($('<td/>').html(errorLine));
                                                    $("#errorExcelTable").find('tbody').append(row$);
                                                    errorFlag=true;     
                                            }
                                          //cellValue=parseFloat(cellValue);
                                          mergeItems[i]['qty']= cellValue;
                                      }
                                      
                                      
                                      
                                  }  
                              }  
                              cnt++;  
                          }  
                      });
                      if(errorFlag){
                               $("#displayExcelErrorsModal").modal('show');
                               return false;       
                            }
                      $("#mergeItemList").click();
                      $( "#uploadExcel" ).val("");
                      $( "#loadingIcon" ).hide();
                      $( "#black-overlay" ).hide();
                      return false;
                  }
                  if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/  
                      reader.readAsArrayBuffer($("#uploadExcel")[0].files[0]);  
                  }  
                  else {  
                      reader.readAsBinaryString($("#uploadExcel")[0].files[0]);  
                  } 
                  //reader.readAsText( $( "#stockFile" )[0].files[0] );
                  $( "#loadingIcon" ).hide();
                  $( "#black-overlay" ).hide();
              } else {
                  $( "#loadingIcon" ).hide();
                  $( "#black-overlay" ).hide();
                  alert( "This browser does not support HTML5." );
              }
          }else{
              $( "#loadingIcon" ).hide();
              $( "#black-overlay" ).hide();
              alert( "Please upload a valid CSV file." ); 
          }
        });
        }); 
    },800);
    
  this.createSalesOrderItems=[
                              {
                                  "mat_num":"",
                                  "qty":0,
                                  "uom":"",
                                  "desc":"",
                                  "price":0,
                                  "fix_sch":"",
                                  "sch_val":0,
                                  "add_dis":"",
                                  "dis_per_val":0,
                                  "dis_amt":0,
                                  "net_val":0,
                                  "sgst_rt":"",
                                  "sgst_val":0,
                                  "cgst_rt":"",
                                  "cgst_val":0,
                                  "igst_rt":"",
                                  "igst_val":0,
                                  "displayRow":true,
                                  "errorMat":true
                              },
                              {
                                  "mat_num":"",
                                  "qty":0,
                                  "uom":"",
                                  "desc":"",
                                  "price":0,
                                  "fix_sch":"",
                                  "sch_val":0,
                                  "add_dis":"",
                                  "dis_per_val":0,
                                  "dis_amt":0,
                                  "net_val":0,
                                  "sgst_rt":"",
                                  "sgst_val":0,
                                  "cgst_rt":"",
                                  "cgst_val":0,
                                  "igst_rt":"",
                                  "igst_val":0,
                                  "displayRow":true,
                                  "errorMat":true
                              },
                              {
                                  "mat_num":"",
                                  "qty":0,
                                  "uom":"",
                                  "desc":"",
                                  "price":0,
                                  "fix_sch":"",
                                  "sch_val":0,
                                  "add_dis":"",
                                  "dis_per_val":0,
                                  "dis_amt":0,
                                  "net_val":0,
                                  "sgst_rt":"",
                                  "sgst_val":0,
                                  "cgst_rt":"",
                                  "cgst_val":0,
                                  "igst_rt":"",
                                  "igst_val":0,
                                  "displayRow":true,
                                  "errorMat":true
                              },
                              {
                                  "mat_num":"",
                                  "qty":0,
                                  "uom":"",
                                  "desc":"",
                                  "price":0,
                                  "fix_sch":"",
                                  "sch_val":0,
                                  "add_dis":"",
                                  "dis_per_val":0,
                                  "dis_amt":0,
                                  "net_val":0,
                                  "sgst_rt":"",
                                  "sgst_val":0,
                                  "cgst_rt":"",
                                  "cgst_val":0,
                                  "igst_rt":"",
                                  "igst_val":0,
                                  "displayRow":true,
                                  "errorMat":true
                              },
                              {
                                  "mat_num":"",
                                  "qty":0,
                                  "uom":"",
                                  "desc":"",
                                  "price":0,
                                  "fix_sch":"",
                                  "sch_val":0,
                                  "add_dis":"",
                                  "dis_per_val":0,
                                  "dis_amt":0,
                                  "net_val":0,
                                  "sgst_rt":"",
                                  "sgst_val":0,
                                  "cgst_rt":"",
                                  "cgst_val":0,
                                  "igst_rt":"",
                                  "igst_val":0,
                                  "displayRow":true,
                                  "errorMat":true
                              }
                              ]
  this.payload["address"]=true;
  this.payload["bp_id"]=this.bpId;
  this.payload["compliance"]=true;
  this.payload["incoterms"]=true;
  this.payload["org_id"]=this.orgId;
  this.payload["promotion"]=true;
  mergeItems=[];
  $(function() {
      $(document).on('click', function (e) {
        if (!$(e.target).hasClass('ajax-list')) {
              $(".ajax-searchlist").hide();
          }
      }); 
      $( "#outbound-delivery-table" ).scroll(function() {
          $(".ajax-searchlist").hide();
        });
     /* $(document).on('keyup',function(evt) {
            if (evt.keyCode == 27) {
               $(".ajax-searchlist").hide();
            }
        }); */
  });
  $(function(){
      $(document).on("input", ".numbersOnly", function() {
          this.value = this.value.replace(/[^\d]/g,'');
      });
      $(document).on("input", ".numbersOnly1", function() {
              this.value = this.value.replace(/[^\d\.]/g,'');
          });
      $(document).on("blur",".materialNumSOEdit",function(e) {
          console.log('calling load');
          var id=$(this).attr('id');
          id=id.split("-")[1];
          $("#changeMaterial").val(id);
          setTimeout(()=>{$("#material-input").click()},900); 
      });
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
      /*$('.reqDate').datetimepicker({
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
          minDate:new Date(),
          format: 'DD/MM/YYYY',
      }); */
  });
  this.activatedRoute.queryParams.subscribe(params => {
      this.action=params['action']
      if(this.router.url.includes("obd")){
       if(params['action']=="U"){
          this.title="Delivery / Edit";
      }
      if(params['action']=="DIS"){
          this.title="Delivery / Display";
      }
       this.editOrderNum =  params['orderNum'];
          this.deliveryNum = this.editOrderNum
          this.navigatePath("outbounddelivery");
          const path:any="obd/editdeliverydetails";
          this.url=path;
          $("#downloadLink").hide();
      }
      if(this.router.url.includes("billing")){
          if (params['action'] == "U") {
              this.title = "Billing / Edit";
          }
          if (params['action'] == "DIS") {
              this.title = "Billing / Display";
          }
          this.editOrderNum =  params['billId'];
          this.navigatePath("billing");
          const path: any = "billing/editbillingdetails";
          $("#downloadLink").hide();
      } 
       if(this.router.url.includes("salesorder")){
           if(params['action']=="U"){
         if(this.orderType=='ZKS'){
             this.title="Sales Order / Edit";
             this.displayShip=false;
         }else{
             this.title="Sales Return / Edit";
             this.displayShip=false;
         }
          this.fromPage=params['frompage'];
          $("#gs-GSTR1").hide();
          $("#icon-GSTR1").show();
          this.createdSales=true;
          this.createSalesFlag=false;
          $("#downloadLink").show();
      }
      if(params['action']=="DIS"){
          if(this.orderType=='ZKS'){
             this.title="Sales Order / Display";
             this.displayShip=true;
         }else{
             this.title="Sales Return / Display";
             this.displayShip=true;
         }
          this.displayFlag=true;
          $("#gs-GSTR1").hide();
          $("#icon-GSTR1").show();
          this.createdSales=true;
          this.createSalesFlag=false;
          $("#downloadLink").show();
      }
      this.editOrderNum=params["orderNum"];
      this.reqDlvrNum=params["dlvrNum"];
      const path:any="salesorder/editsalesorder";
      this.url=path;
      if(this.deliveryNum!=""){
            this.cancelBtn=true;  
          }
      this.getSalesOrderDetails();
      }
  });
  
  if($('body').hasClass('cat__menu-left--visible')){
      $(".ell-spa").removeAttr("style");
  }else{
      $(".ell-spa").attr("style","width:340px");
  }
  $(function(){
      $('#shiptoparty').change(function(){
          var value=$('#addressList option[value="'+$("#shiptoparty").val()+'"]').text().trim();
          $("#shiptoCustomerId").val(value);
          $("#addressBtn").click();
      });
      
  });
  let orderTypesUrl:any=this.environment.getRequiredApi("header_dropdown")+"?group=ORDTYPS&";
  this.commonService.getData(orderTypesUrl, "GET", "", this.accessObjectId).subscribe(response=>{
     if(response.status==0){
         this.orderTypes=response["data"].configValues;
     } 
  });
  let returnTypesUrl:any=this.environment.getRequiredApi("header_dropdown")+"?group=REASONS&";
      this.commonService.getData(returnTypesUrl, "GET", "", this.accessObjectId).subscribe(response=>{
         if(response.status==0){
             this.reasonList=response["data"].configValues;
         } 
      });
      let billTypesUrl:any=this.environment.getRequiredApi("header_dropdown")+"?group=BILLBLOCK&";
      this.commonService.getData(billTypesUrl, "GET", "", this.accessObjectId).subscribe(response=>{
         if(response.status==0){
             this.billBlockList=response["data"].configValues;
         } 
      });
   let priceStgsUrl:any=this.environment.getRequiredApi("header_dropdown")+"?group=PRCSTNGS&";
      this.commonService.getData(priceStgsUrl, "GET", "", this.accessObjectId).subscribe(response=>{
         if(response.status==0){
             this.priceList=response["data"].configValues;
             if(this.priceList.length>0){
                 let plantId:any=localStorage.getItem("plantId");
                  this.priceList.forEach(currentItem=>{
                    if(currentItem.key==plantId){
                  if(currentItem.value=='Yes'){
                       this.priceEnable=false;    
                     }else{
                         this.priceEnable=true;  
                     } 
                } 
                }); 
             }
         } 
      });
    let countriesUrl:any = this.environment.getRequiredApi("dropdown_list") + "?";
      countriesUrl=countriesUrl.replace("{obj_name}","countries");
      this.commonService.getData( countriesUrl, "GET", "", this.accessObjectId).subscribe(( response ) => {
          if(response.status==0){
              this.countryList = response["data"].objs;
          }
      });
      let stateUrl:any = this.environment.getRequiredApi( "dropdown_list_byid" )+ "?";
      stateUrl=stateUrl.replace("{obj_name}","sap_states");
      stateUrl=stateUrl.replace("{obj_id}",1);
      this.commonService.getData( stateUrl, "GET", "", this.accessObjectId).subscribe(( response ) => {
          if(response.status==0){
              this.states  = response["data"].objs;
          }
      });
    this.getEnableSchemes();
    
}
getEnableSchemes(){
let schemesUrl:any=this.environment.getRequiredApi("header_dropdown")+"?group=SCHEMESTNGS&";
      this.commonService.getData(schemesUrl, "GET", "", this.accessObjectId).subscribe(response=>{
         if(response.status==0){
             this.schemesList=response["data"].configValues;
             if(this.schemesList.length>0){
                 let plantId:any=localStorage.getItem("plantId");
                  this.schemesList.forEach(currentItem=>{
                   if(currentItem.key==plantId){
                  if(currentItem.value=='Yes'){
                       this.schemesFlag=true;
                       this.enableSchemes=true;    
                     }else{
                         this.schemesFlag=true;
                         this.enableSchemes=false;  
                     } 
                } 
                });
             }
         }  
      });    
}
navigatePath(path){
  if(path=='billing'){
      this.createSalesBlock=false;
      this.outboundDeliberyBlock=false;
      this.postGoodsBlock=false;
      this.billingBlock=true;
      this.formResetFlag = true;
      this.createdSales=true;
      this.createSalesFlag=false;
      this.goodsFlag=false;
      this.goodsIssuedFlag=true;
      this.deliveryFlag=false;
      this.deliveredFlag=true;
      $("#gs-GSTR2").attr("style","background:#036963;color:#fff");
      $("#gs-GSTR1A").attr("style","background:#036963;color:#fff");
      $("#gs-GSTR2").attr("style","background:#036963;color:#fff");
      $("#gs-GSTR2A").attr("style","background:#036963;color:#fff");
    
  }
  if(path=='outbounddelivery'){
      this.createSalesBlock=false;
      this.outboundDeliberyBlock=true;
      this.postGoodsBlock=false;
      this.billingBlock=false;
      this.formResetFlag = true;
      this.createdSales=true;
      this.createSalesFlag=false;
      $("#gs-GSTR1").hide();
      $("#icon-GSTR1").show();
      $("#gs-GSTR2").hide();
      $("#icon-GSTR2").show();
      this.goodsFlag=true;
      this.goodsIssuedFlag=false;
      this.deliveryFlag=false;
      this.deliveredFlag=true;
  }
  if(path=='createsalesorder'){
      this.createSalesBlock=true;
      this.outboundDeliberyBlock=false;
      this.postGoodsBlock=false;
      this.billingBlock=false;
      this.formResetFlag = true;
      $("#gs-GSTR2").removeAttr("style");
      setTimeout(()=>{
          var width=$("#mainContent").css("width");
          $(".outbound-footer").css("width",width);
      },50);
      
  }
  if(path=='postgoodsissue'){
      let deliveryNum:any=this.commonService.deliveryNum;
  if(deliveryNum!=""){
      $('#loadingIcon').show();
      $("#black-overlay").show();
      this.deliveryFlag=false;
      this.deliveredFlag=true;
      $("#gs-GSTR1A").attr("style","background:#036963;color:#fff");
      let url:any=this.environment.getRequiredApi("post_goods_issue")+"?delv_no="+deliveryNum+"&org_id="+this.orgId+"&bp_id="+this.bpId+"&";
  this.commonService.getData(url, "POST", "", localStorage.getItem('Outbound Delivery')).subscribe(response=>{
     if(response.status==0){
         if(response["data"].hasOwnProperty("ex_return")){
             if(response["data"]['ex_return'].length>0){
                 this.errorList=response["data"]['ex_return'];
                 for(let elist of response["data"]['ex_return']){
                     if(elist.type=='E'){
                         $('#loadingIcon').hide();
                         $("#black-overlay").hide();
                         $("#displayErrorsModal").modal("show");
                         return false;
                     }
                     
                 }
             }
            }
         $('#loadingIcon').hide();
         $("#black-overlay").hide();
         this.goodsFlag=false;
         this.goodsIssuedFlag=true;
         $("#gs-GSTR1A").removeAttr("style");
         $("#gs-GSTR1A").hide();
         $("#icon-GSTR1A").show();
         $("#refreshList").click();
         this.commonService.responseMessages("", "Post goods issue created successfully", "success");
         
     }else{
         $('#loadingIcon').hide();
         $("#black-overlay").hide();
         this.goodsFlag=true;
         this.goodsIssuedFlag=false;
         $("#gs-GSTR1A").show();
         $("#icon-GSTR1A").hide();
         $('#loadingIcon').hide();
         $("#black-overlay").hide();
         this.commonService.responseMessages("", response.message, "warning");
     } 
  }); 
  }
  } 
}
getSalesOrderDetails(){
    $('#loadingIcon').show();
    $("#black-overlay").show();
    let url:any=this.environment.getRequiredApi("get_sales_display")+"?so_num="+this.editOrderNum+"&org_id="+this.orgId+"&bp_id="+this.bpId+"&";
    this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response=>{
       if(response.status==0){
           this.salesOrderDtlList=response["data"];
           if(this.salesOrderDtlList.hasOwnProperty('ex_so_header')){
               if(this.salesOrderDtlList['ex_so_header'][0]['req_date_h']!="0000-00-00"){
                   this.reqDate=this.salesOrderDtlList['ex_so_header'][0]['req_date_h'];
               }
               if(this.salesOrderDtlList['ex_so_header'][0].hasOwnProperty('doc_type')){
                   this.orderType=this.salesOrderDtlList['ex_so_header'][0]['doc_type'];
                   this.commonService.orderType=this.orderType;
                   if(this.action=='U'){
                       if(this.orderType=='ZKS'){
                             this.title="Sales Order / Edit";
                         }else{
                             this.title="Sales Return / Edit";
                         }
                     }
                    if(this.action=='DIS'){
                       if(this.orderType=='ZKS'){
                             this.title="Sales Order / Display";
                         }else{
                             this.title="Sales Return / Display";
                         }
                        this.displayShip=true;
                   }
               }
               if(this.salesOrderDtlList['ex_so_header'][0].hasOwnProperty('ord_reason')){
                   this.reasonCode=this.salesOrderDtlList['ex_so_header'][0]['ord_reason'];
               }
               if(this.salesOrderDtlList['ex_so_header'][0].hasOwnProperty('bill_block')){
                   this.billCode=this.salesOrderDtlList['ex_so_header'][0]['bill_block'];
               }
               
               this.docType=this.salesOrderDtlList['ex_so_header'][0]['doc_type'];
               if(this.salesOrderDtlList['ex_so_header'][0]['purch_no']!=undefined){
                   this.purNum=this.salesOrderDtlList['ex_so_header'][0]['purch_no'];
               }
               if(this.salesOrderDtlList['ex_so_header'][0]['purch_date']!="0000-00-00"){
                   this.purDate=this.salesOrderDtlList['ex_so_header'][0]['purch_date'];
               }
           }
           if(this.salesOrderDtlList.hasOwnProperty("ex_business")){
               this.incoTerms1=this.salesOrderDtlList['ex_business'][0].incoterms1;
               this.payTerms=this.salesOrderDtlList['ex_business'][0].pmnttrms;
               this.billDate=this.salesOrderDtlList['ex_business'][0].bill_date;
               if(this.salesOrderDtlList['ex_business'][0].hasOwnProperty('cust_group')){
                    this.custGroup=this.salesOrderDtlList['ex_business'][0].cust_group;
               }else{
                   this.custGroup=null;
               }
           }
           this.salesOrderDtlList['ex_partners'].forEach(response=>{
               if(response.partn_role=='AG'){
                   this.customerId=response.customer;
                   this.payload['cust_id']=response.customer; 
                   let otc:any=response.acc_1_time
                   if((otc!='X' && otc=="")){
                       this.getCustomerDetails();
                       if(this.action=='DIS'){
                        this.displayShip=true;
                      }else{
                       this.displayShip=false;
                       }
                   }else{
                      this.displayShip=true;
                      this.schemesFlag=false;
                      this.enableSchemes=false;
                      this.customerList['ex_compliance']={};
                      this.customerList['ex_address']={};
                      let custAddr:any=response.address;
                   if(this.salesOrderDtlList.hasOwnProperty('ex_address')){
                       this.salesOrderDtlList['ex_address'].forEach(data=>{
                          if(data.address==custAddr){
                             this.customerList['ex_compliance'].gstin=data.name_4;
                             this.customerList['ex_compliance'].pan_no=data.name_3;
                             if(data.name_2==undefined || data.name_2==null){
                                data.name_2='';    
                             }
                             this.sdName=data.name+" "+data.name_2;
                             this.sdNameId=this.customerId;
                             this.sdSubId=this.sdNameId.replace(/\b(0(?!\b))+/g, "");
                             this.customerList['ex_compliance'].lst_no=data.district;
                             this.customerList['ex_address'].addr_number=data.address;
                             this.customerList['ex_address'].street=data.street;
                             this.customerList['ex_address'].city=data.city;
                             this.customerList['ex_address'].post_code=data.postl_code;
                             this.customerList['ex_address'].telefone=data.telephone;
                             this.customerList['ex_address'].country=data.country;
                             this.customerListLength=Object.keys(this.customerList).length;
                          } 
                       });
                    } 
                   }
               }
               if(response.partn_role=='WE'){
                   this.shipToPartyId=response.customer;
                   let otc:any=response.acc_1_time
                   if((otc!='X' && otc=="")){
                       this.getcustomerListById();
                   }else{
                       this.displayShip=true;
                       this.customerShiptoParty['ex_compliance']={};
                       this.customerShiptoParty['ex_address']={};
                      let custAddr:any=response.address;
                   if(this.salesOrderDtlList.hasOwnProperty('ex_address')){
                       this.salesOrderDtlList['ex_address'].forEach(data=>{
                          if(data.address==custAddr){
                             for(let item in data){
                                if(data[item]==undefined || data[item]=='undefined' || data[item]==null){
                                    data[item]="";   
                                }
                              }
                              if(!data.hasOwnProperty('name_2')){
                                    data['name-2']="";
                              }
                              if(!data.hasOwnProperty('name_4')){
                                    data['name_4']="";
                              }
                              if(!data.hasOwnProperty('str_suppl1')){
                                    data['str_suppl1']="";
                              }
                              if(!data.hasOwnProperty('email')){
                                    data['email']="";
                              }
                              if(!data.hasOwnProperty('name_3')){
                                    data['name_3']="";
                              }
                             this.custAddress=data;
                             this.state=data.region;
                             this.customerShiptoParty['ex_compliance'].gstin=data.name_4;
                             this.customerShiptoParty['ex_compliance'].pan_no=data.name_3;
                             if(data.name_2==undefined || data.name_2==null){
                                data.name_2='';    
                             }
                             this.shName=data.name+" "+data.name_2;
                             this.shNameId=this.shipToPartyId;
                             this.shSubId=this.sdNameId.replace(/\b(0(?!\b))+/g, "");
                             this.customerShiptoParty['ex_compliance'].lst_no=data.district;
                             this.customerShiptoParty['ex_address'].addr_number=data.address;
                             this.customerShiptoParty['ex_address'].street=data.street;
                             this.customerShiptoParty['ex_address'].city=data.city;
                             this.customerShiptoParty['ex_address'].post_code=data.postl_code;
                             this.customerShiptoParty['ex_address'].telefone=data.telephone;
                             this.customerShiptoParty['ex_address'].country=data.country;
                             this.customerShiptoPartyLenth=Object.keys(this.customerShiptoParty).length;
                          } 
                       });
                    }
                       }
                   
               }
           });
           
           if(this.salesOrderDtlList.hasOwnProperty("ex_textlines")){
               if(this.salesOrderDtlList['ex_textlines'][0].line!=undefined){
                   this.headerText=this.salesOrderDtlList['ex_textlines'][0].line;
               }
           }
           if(this.salesOrderDtlList.hasOwnProperty('ex_order_flows_out')){
                if(this.salesOrderDtlList['ex_order_flows_out'].length>0){
                    for(let dlList of this.salesOrderDtlList['ex_order_flows_out']){
                        let docStat:any="";
                        if(this.orderType=='ZKS'){
                           docStat='J' 
                        }else{
                            docStat='T'
                        }
                        if(dlList.doccategor==docStat){
                            if(this.dlvlist.length==0){
                                    this.dlvlist.push(dlList.subssddoc);
                                    this.dlvStatus= dlList.doc_cat_sd;
                            }else{
                                if(this.dlvlist.indexOf(dlList.subssddoc)==-1){
                                    this.dlvlist.push(dlList.subssddoc);    
                                }    
                            }
                          }    
                    }    
                }    
           }
           /*if(this.salesOrderDtlList.hasOwnProperty('ex_status_items')){
               if(this.salesOrderDtlList['ex_status_items'].length>0){
                   this.dlvStatus= this.salesOrderDtlList['ex_status_items'][0].deliv_stat
               }
           }*/
           if(this.salesOrderDtlList.hasOwnProperty("ex_so_items")){
               this.createSalesOrderItems=[];
           this.salesOrderDtlList['ex_so_items'].forEach(response=>{
               let object:any={};
               object['mat_num']=response.material;
               object['org_mat_num']=response.material;
               object['qty']=response.req_qty;
               object['oldqty']=response.req_qty;
               object['uom']=response.sales_unit;
               object['desc']=response.short_text;
               object['price']=0;
               object['fix_sch']=0;
               object['sch_val']=0;
               object['add_dis']="";
               object['dis_per_val']=0;
               object['dis_amt']=0;
               object['net_val']=response.net_value; 
               object['oldnetVal']=response.net_value;
               object['sgst_rt']=0;
               object['sgst_val']=0;
               object['igst_rt']=0;
               object['igst_val']=0;
               object['cgst_rt']=0;
               object['cgst_val']=0;
               object['displayRow']=true;
               object['errorMat']=true;
               object['updateflag']="U";
               object['zspe']=false;
               object['zsvl']=false;
               object['zper']=false;
               object['zval']=false;
               object['dlv_stat_i']="";
               object['dlv_stat_check']="";
               this.objectArrayList.push(response.itm_number); 
               if(this.salesOrderDtlList.hasOwnProperty('ex_status_items')){
                  if(this.salesOrderDtlList['ex_status_items'].length>0){
                   this.salesOrderDtlList['ex_status_items'].forEach(currentItem=>{
                       if(response.itm_number==currentItem.itm_number){
                           object['dlv_stat_check']=currentItem.dlv_stat_i;
                       }
                   });
                  }
               }
               if(this.salesOrderDtlList.hasOwnProperty('ex_billing_status_item')){
                  if(this.salesOrderDtlList['ex_billing_status_item'].length>0){
                   this.salesOrderDtlList['ex_billing_status_item'].forEach(currentItem1=>{
                       if(response.itm_number==currentItem1.posnr){
                           object['dlv_stat_i']=currentItem1.billstat;
                       }
                   });
                  }
               }
               
               this.createSalesOrderItems.push(object);
               
           });
           }else{
            this.objectArrayList=[];
            this.createSalesOrderItems=[
                              {
                                  "mat_num":"",
                                  "qty":0,
                                  "uom":"",
                                  "desc":"",
                                  "price":0,
                                  "fix_sch":"",
                                  "sch_val":0,
                                  "add_dis":"",
                                  "dis_per_val":0,
                                  "dis_amt":0,
                                  "net_val":0,
                                  "sgst_rt":"",
                                  "sgst_val":0,
                                  "cgst_rt":"",
                                  "cgst_val":0,
                                  "igst_rt":"",
                                  "igst_val":0,
                                  "displayRow":true,
                                  "updateflag":"I",
                                  'errorMat':true
                              },
                              {
                                  "mat_num":"",
                                  "qty":0,
                                  "uom":"",
                                  "desc":"",
                                  "price":0,
                                  "fix_sch":"",
                                  "sch_val":0,
                                  "add_dis":"",
                                  "dis_per_val":0,
                                  "dis_amt":0,
                                  "net_val":0,
                                  "sgst_rt":"",
                                  "sgst_val":0,
                                  "cgst_rt":"",
                                  "cgst_val":0,
                                  "igst_rt":"",
                                  "igst_val":0,
                                  "displayRow":true,
                                  "updateflag":"I",
                                  'errorMat':true
                              },
                              {
                                  "mat_num":"",
                                  "qty":0,
                                  "uom":"",
                                  "desc":"",
                                  "price":0,
                                  "fix_sch":"",
                                  "sch_val":0,
                                  "add_dis":"",
                                  "dis_per_val":0,
                                  "dis_amt":0,
                                  "net_val":0,
                                  "sgst_rt":"",
                                  "sgst_val":0,
                                  "cgst_rt":"",
                                  "cgst_val":0,
                                  "igst_rt":"",
                                  "igst_val":0,
                                  "displayRow":true,
                                  "updateflag":"I",
                                  'errorMat':true
                              },
                              {
                                  "mat_num":"",
                                  "qty":0,
                                  "uom":"",
                                  "desc":"",
                                  "price":0,
                                  "fix_sch":"",
                                  "sch_val":0,
                                  "add_dis":"",
                                  "dis_per_val":0,
                                  "dis_amt":0,
                                  "net_val":0,
                                  "sgst_rt":"",
                                  "sgst_val":0,
                                  "cgst_rt":"",
                                  "cgst_val":0,
                                  "igst_rt":"",
                                  "igst_val":0,
                                  "displayRow":true,
                                  "updateflag":"I",
                                  'errorMat':true
                              },
                              {
                                  "mat_num":"",
                                  "qty":0,
                                  "uom":"",
                                  "desc":"",
                                  "price":0,
                                  "fix_sch":"",
                                  "sch_val":0,
                                  "add_dis":"",
                                  "dis_per_val":0,
                                  "dis_amt":0,
                                  "net_val":0,
                                  "sgst_rt":"",
                                  "sgst_val":0,
                                  "cgst_rt":"",
                                  "cgst_val":0,
                                  "igst_rt":"",
                                  "igst_val":0,
                                  "displayRow":true,
                                  "updateflag":"I",
                                  'errorMat':true
                              }
                              ]    
           }
           let itemNumber:any=null;
           let count=0;
           if(this.salesOrderDtlList.hasOwnProperty("ex_conditions")){
               this.salesOrderDtlList['ex_conditions'].forEach(response=>{
                   if(itemNumber==null){ 
                       itemNumber=response.itm_number;
                       this.createSalesOrderItems[count]['itm_number']=response.itm_number;
                       this.createSalesOrderItems[count]['cond_st_no']=response.cond_st_no;
                       if(response.cond_type=='ZPRO'){
                           this.createSalesOrderItems[count].price=parseFloat(response.cond_value).toFixed(2);
                       }
                   }else{
                       if(itemNumber==response.itm_number){
                           if(response.cond_type=='ZSPE'){
                               this.createSalesOrderItems[count].fix_sch=Math.abs(response.cond_value);
                               this.createSalesOrderItems[count].sch_val=Math.abs(response.condvalue);
                               this.createSalesOrderItems[count]['zspe']=true;
                               this.createSalesOrderItems[count].schTypeSymbol="per";
                           }
                           if(response.cond_type=='ZSVL'){
                               this.createSalesOrderItems[count].fix_sch=Math.abs(response.cond_value);
                               this.createSalesOrderItems[count].sch_val=Math.abs(response.condvalue);
                               this.createSalesOrderItems[count]['zsvl']=true;
                               this.createSalesOrderItems[count].schTypeSymbol="val";
                           }
                           if(response.cond_type=='ZPER'){
                               this.createSalesOrderItems[count].add_dis=response.cond_type;
                               this.createSalesOrderItems[count].dis_per_val=Math.abs(response.cond_value);
                               this.createSalesOrderItems[count].dis_amt=Math.abs(response.condvalue);
                               this.createSalesOrderItems[count]['zper']=true;
                           }
                           if(response.cond_type=='ZVAL'){
                               this.createSalesOrderItems[count].add_dis=response.cond_type;
                               this.createSalesOrderItems[count].dis_per_val=Math.abs(response.cond_value);
                               this.createSalesOrderItems[count].dis_amt=Math.abs(response.condvalue);
                               this.createSalesOrderItems[count]['zval']=true;
                           }
                           if(response.cond_type=='JOIG'){
                               let rate:any=Math.abs(response.cond_value);
                               this.createSalesOrderItems[count].igst_rt=rate; 
                               this.createSalesOrderItems[count].igst_val=Math.abs(response.condvalue);
                               this.createSalesOrderItems[count]['joig']=true;
                           }
                           if(response.cond_type=='JOCG'){
                               let rate:any=Math.abs(response.cond_value);
                               this.createSalesOrderItems[count].cgst_rt=rate; 
                               this.createSalesOrderItems[count].cgst_val=Math.abs(response.condvalue);
                               this.createSalesOrderItems[count]['jocg']=true;
                           }
                           if(response.cond_type=='JOSG'){
                               let rate:any=Math.abs(response.cond_value);
                               this.createSalesOrderItems[count].sgst_rt=rate; 
                               this.createSalesOrderItems[count].sgst_val=Math.abs(response.condvalue);
                               this.createSalesOrderItems[count]['josg']=true;
                           }
                           
                       }else{
                           count++;
                           itemNumber=response.itm_number;
                           this.createSalesOrderItems[count]['itm_number']=response.itm_number;
                           if(response.cond_type=='ZPRO'){
                               this.createSalesOrderItems[count].price=parseFloat(response.cond_value).toFixed(2);
                           }
                       }
                   }
                   
               });
           }
           if(response["data"].hasOwnProperty('ex_return')){
               if(response["data"]['ex_return'].length>0){
                   this.errorList=response["data"]['ex_return'];
                   for(let elist of response["data"]['ex_return']){
                       if(elist.type=='E'){
                           this.errorFlag=true;
                           this.errorCreateDo=true;
                           $('#loadingIcon').hide();
                           $("#black-overlay").hide();
                           $("#displayDlvrErrorsModal").modal("show");
                           return false;
                       }
                   }
               }
               }
           for(let items of this.createSalesOrderItems){
               items.qty=Math.round(parseFloat(items.qty));
               items['grossValue']=parseFloat(items.net_val)+parseFloat(items.igst_val)+parseFloat(items.sgst_val)+parseFloat(items.cgst_val);
           }
           this.getPayIncoTerms();
           $('#loadingIcon').hide();
           $("#black-overlay").hide();
           setTimeout(()=>{
               var width=$("#mainContent").css("width");
               $(".outbound-footer").css("width",width);
               $(".outbound-footer").show();
           },100);
           setTimeout(()=>{this.calculateTotalValues()},300);
       }else{
           $('#loadingIcon').hide();
           $("#black-overlay").hide();
           this.commonService.responseMessages("", response.message, "warning");
       }
       this.getEnableSchemes();
    });
}
getCustomerDetails(){
  $('#loadingIcon').show();
  $("#black-overlay").show();
  let url:any=this.environment.getRequiredApi("get_customer_details")+"?";
  this.commonService.getData(url, "POST", this.payload, this.accessObjectId).subscribe(response=>{
      if(response.status==0){
         this.customerList=response["data"];
         this.customerListLength=Object.keys(this.customerList).length;
         if(this.customerList['ex_incoterms'].length>0){
             this.incoTermVal=this.customerList['ex_incoterms'].inco_term;
             this.payTermVal=this.customerList['ex_incoterms'].pay_term;
         }
         if(Object.keys(this.customerList['ex_address']).length>0){
             this.sdName=this.customerList['ex_address'].cust_name;
             this.sdNameId=this.customerList['ex_address'].cust_id;
             this.sdSubId=this.sdNameId.replace(/\b(0(?!\b))+/g, "");
             /*if(this.customerList['ex_address'].cust_grp=='AD'){
                    this.priceEnable=true;    
                 }*/
         }
          if(this.customerList.hasOwnProperty('ex_schemes')){
                  let comGroup:any=null;
                  this.comGrpList=[];
                  let object:any={};
                  let matObject:any={};
              if(this.customerList['ex_schemes'].length>0){
                         for(let ls of this.customerList['ex_schemes']){
                          if(ls.schemes.length>0){
                                for(let list of ls.schemes){
                                    list.rate=Math.abs(list.rate);
                                    list.rate_value=Math.abs(list.rate_value);
                                }
                            }
                            if(comGroup==null){
                                 comGroup=ls.comm_grp;
                                 object.groupId=ls.comm_grp;
                                 object.groupDesc=ls.comm_grp_txt;
                                 object.mtrlGroup=[];
                                 matObject.mat_id=ls.mat_id;
                                 matObject.mat_desc=ls.mat_desc;  
                                 matObject.schemes=ls.schemes;
                                 matObject.schemes.forEach(currentItem=>{
                                     currentItem.groupMatId=ls.comm_grp;
                                 });
                                 object.mtrlGroup.push(matObject);
                                 this.comGrpList.push(object);
                             }else{
                                if(comGroup==ls.comm_grp){
                                    this.comGrpList.forEach(currentItem=>{
                                        if(currentItem.groupId==ls.comm_grp){
                                             let newMatObject:any={};
                                             newMatObject.mat_id=ls.mat_id;
                                             newMatObject.mat_desc=ls.mat_desc;  
                                             newMatObject.schemes=ls.schemes;
                                             newMatObject.schemes.forEach(currentItem=>{
                                                 currentItem.groupMatId=ls.comm_grp
                                             });
                                             currentItem.mtrlGroup.push(newMatObject);  
                                        }
                                    });
                                }else{
                                       comGroup=ls.comm_grp;
                                       let object1:any={};
                                       let matObject1:any={}; 
                                       object1.groupId=ls.comm_grp;
                                       object1.groupDesc=ls.comm_grp_txt;
                                       object1.mtrlGroup=[];
                                       matObject1.mat_id=ls.mat_id;
                                       matObject1.mat_desc=ls.mat_desc;  
                                       matObject1.schemes=ls.schemes; 
                                       matObject1.schemes.forEach(currentItem=>{
                                           currentItem.groupMatId=ls.comm_grp
                                       });
                                       object1.mtrlGroup.push(matObject1);
                                       this.comGrpList.push(object1);
                                }   
                             }  
                     } 
                  }
              /*if(this.initCount==0){
                     this.saveSalesOrderItems();
                     this.initCount++;    
                }*/
              }
      }else{
          this.commonService.responseMessages("", response.message, "warning");
      }
      $('#loadingIcon').hide();
      $("#black-overlay").hide();
  })
}
getcustomerListById(){
  let response:any={}
      response["address"]=true;
      response["bp_id"]=this.bpId;
      response["compliance"]=true;
      response["incoterms"]=false;
      response["org_id"]=this.orgId;
      response["promotion"]=false;
      response["cust_id"]=this.shipToPartyId;
      let url:any=this.environment.getRequiredApi("get_customer_details")+"?";
      this.commonService.getData(url, "POST", response, this.accessObjectId).subscribe(response=>{
          if(response.status==0){
             this.customerShiptoParty=response["data"];
             this.customerShiptoPartyLenth=Object.keys(this.customerShiptoParty).length;
             if(Object.keys(this.customerShiptoParty['ex_address']).length>0){
                 this.shName=this.customerShiptoParty['ex_address'].cust_name;
                 this.shNameId=this.customerShiptoParty['ex_address'].cust_id;
                 this.shSubId=this.shNameId.replace(/\b(0(?!\b))+/g, "");
             }
          }else{
              this.commonService.responseMessages("", response.message, "warning");
          }
      })
}
getPayIncoTerms(){
  let url:any=this.environment.getRequiredApi("get_pay_inco_terms")+"?org_id="+this.orgId+"&bp_id="+this.bpId+"&";
  this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response=>{
     if(response.status==0){
        this.payIncoTermsList=response["data"]; 
        this.payIncoTermsListLength=Object.keys(this.payIncoTermsList).length;
     } 
  });
}
extractData(id,spinnerId,ajaxDropdown,event){
  let term:any=$("#"+id).val();
  if(this.customerNames.length==0){
         if(term.length>3){
              term=term.substring(0,2);  
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
      }
     
  });
  }else{
     if(term==""){
         this.customerNames=[];
         $("#"+spinnerId).hide();
     }else{
         if(event.keyCode!=13 && event.keyCode!=38 && event.keyCode!=40){
           var searchText=term;
           searchText=searchText.toUpperCase();
           $(".ajax-list").removeClass('active');
           $("#"+ajaxDropdown).find('ul > li').each(function(){
                var currentLiText = $(this).text();
                currentLiText=currentLiText.toUpperCase();
                var showCurrentLi = currentLiText.indexOf(searchText) !== -1;
                $(this).toggle(showCurrentLi);
            }); 
           $("#"+ajaxDropdown).find('ul').find('li:visible').first().addClass('active');
           $("#"+ajaxDropdown).find('ul').find('li:visible').first().focus();
          }     
    }
 if(event.keyCode==38 || event.keyCode==40 || event.keyCode==13){
        $("#"+ajaxDropdown).find('ul > li').each(function(){
              if(event.keyCode==40){
                  if($(this).hasClass('active')){
                    //console.log($(this).attr('class'));
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
}    
AddMoreLinesOfItems(){
for(let i:any=0; i<5; i++){
let newItem:any={
                    "mat_num":"",
                    "qty":0,
                    "uom":"",
                    "desc":"",
                    "price":0,
                    "fix_sch":"",
                    "sch_val":0,
                    "add_dis":"",
                    "dis_per_val":0,
                    "dis_amt":0,
                    "net_val":0,
                    "sgst_rt":"",
                    "sgst_val":0,
                    "cgst_rt":"",
                    "cgst_val":0,
                    "igst_rt":"",
                    "igst_val":0,
                    "displayRow":true,
                    "updateflag":"I",
                    'zspe':false,
                    'zsvl':false,
                    'zper':false,
                    'zval':false,
                    "errorMat":true
                    }
    this.createSalesOrderItems.push(newItem);
}
} 
selectAll(event,checkAll,tableId){
setTimeout(()=>{
    if($("#"+checkAll).is(":checked")){
         this.commonService.selectAllCheckBoxes(checkAll,tableId);
         let count:any=0;
         this.createSalesOrderItems.forEach(response=>{
             if(response.displayRow){
                 if(response.dlv_stat_i!='B' && response.dlv_stat_i!='C' && response.dlv_stat_check!='C' && response.dlv_stat_check!='B'){
                    this.checkedObjects.push(count);
                 }
             }
             count++;
         });  
     }else{
         this.commonService.selectAllCheckBoxes(checkAll,tableId);
         this.checkedObjects=[];
     }
     
     
 },300);

}
getReportList(event,tableId,i,response){
    if(response.dlv_stat_i=='C' || response.dlv_stat_i=='B'){
        return false;
    }

setTimeout(()=>{let flag:boolean=this.commonService.checkAction(tableId);
if(flag){
    this.indeterminate=false;
    this.checked=true;
}else{
    this.indeterminate=true;
}
},400);
setTimeout(()=>{
   if($("#checkbox-"+i+"-input").is(":checked")){
       this.checkedObjects.push(i);
   }else{
       if(this.checkedObjects.length>0){
           let count:any=0;
       for(let index of this.checkedObjects){
           if(index==i){
               delete this.checkedObjects[count];
           }
           count++;
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
   
},300); 
}
removeLineSelectedItems(){
    if(this.checkedObjects.length>0){
        for(let index of this.checkedObjects){
            if(index!=undefined && index!=null){
                this.createSalesOrderItems[index].displayRow=false; 
                this.createSalesOrderItems[index].qty=0;
                if(this.createSalesOrderItems[index].hasOwnProperty('valid')){
                   if(!this.createSalesOrderItems[index].valid){
                       this.createSalesOrderItems[index].uom="";
                   }
                }
            }
        }
        this.checkedObjects=[];
    }else{
        this.commonService.responseMessages("", "Please select atleast one item", "warning");
    }
    setTimeout(()=>{let flag:boolean=this.commonService.continueAction("outbound-delivery-table");
    if(flag){
        this.indeterminate=false;
        this.checked=false;
    }else{
        this.indeterminate=true;
    }
    if($("#outbound-delivery-table").find('tbody').find('tr').length==0){
        this.indeterminate=false;
        this.checked=false;
    }
    },200);
    for(let listItem of this.createSalesOrderItems){
       if(!listItem.displayRow && listItem.updateflag!='I'){
           this.disableList.push(listItem);   
       } 
    }
    this.enableButtons();
    setTimeout(()=>{this.calculateTotalValues()},300);
  }
findMaterialDetails(matnr,response,spinnerId,i,modalBlock,event){
  let term:any=matnr.value;
    //if(this.matnrDetails.length==0){
         if(term.length>2){
              term=term.substring(0,2);  
         }   
    //}
response.changeFlag=true;
if(term.length==2 && event.keyCode!=38 && event.keyCode!=40 && event.keyCode!=13){
    $("#"+spinnerId+"-"+i).show();
    let url:any=this.environment.getRequiredApi("find_matnr_num")+"?org_id="+this.orgId+"&bp_id="+this.bpId+"&material="+matnr.value+"&";
    this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response=>{
        if(response.status==0){
            this.matnrDetails=[];
          $("#"+spinnerId+"-"+i).hide();
          this.matnrDetails=response["data"].ex_mat_list;  
          $("#"+modalBlock+"-"+i).show();
          setTimeout(()=>{
               $("#"+modalBlock+"-"+i).find('ul').find('li:first').addClass('active');
               $("#"+modalBlock+"-"+i).find('ul').find('li:first').focus();
            },100);
        }else{
            $("#"+spinnerId+"-"+i).hide();
            $("#"+modalBlock+"-"+i).hide();
        }
    });
}else{
        if(event.keyCode!=13 && event.keyCode!=38 && event.keyCode!=40){
           var searchText=matnr.value;
            searchText=searchText.toUpperCase();
            $(".ajax-list").removeClass('active');
           $("#"+modalBlock+"-"+i).find('ul > li').each(function(){
                var currentLiText = $(this).text();
                currentLiText=currentLiText.toUpperCase();
                var showCurrentLi = currentLiText.indexOf(searchText) !== -1;
                $(this).toggle(showCurrentLi);
            });
            $("#"+modalBlock+"-"+i).find('ul').find('li:visible').first().addClass('active');
            $("#"+modalBlock+"-"+i).find('ul').find('li:visible').first().focus();
           }      
    }
    if(event.keyCode==38 || event.keyCode==40 || event.keyCode==13){
        $("#"+modalBlock+"-"+i).find('ul > li').each(function(){
              if(event.keyCode==40){
                  if($(this).hasClass('active')){
                    //console.log($(this).attr('class'));
                    if($(this).next().is(':visible')){
                        $(this).removeClass('active');
                        $(this).next().addClass('active');
                        $(this).next().focus();
                        $("#"+modalBlock+"-"+i).find("ul").scrollTop($(this).position().top);
                        return false;
                      }
                 }
              } 
            if(event.keyCode==13){
                  if($(this).hasClass('active')){
                    $(this).click();
                    return false;
                 }
              } 
            if(event.keyCode==38){
                  if($(this).hasClass('active')){
                    if($(this).prev().is(':visible')){
                        $(this).removeClass('active');
                        $(this).prev().focus();
                        $(this).prev().addClass('active');
                        $("#"+modalBlock+"-"+i).find("ul").scrollTop($(this).position().top);
                        return false;
                      }
                 }
              } 
        });
    }
}
expandCollapseBlock(wizardBlock,headerBlock,angleId){
if($("#"+angleId).is(":visible")){
    if(angleId=='angle-down'){
        $("#"+angleId).hide();
        $("#angle-up").show();
    }
    if(angleId=='angle-up'){
        $("#"+angleId).hide();
        $("#angle-down").show();
    }
    
}
$("#"+wizardBlock).slideToggle("slow");
$("."+headerBlock).slideToggle("slow");
}
closeModal(id){
$("#"+id).modal("hide");
    if(this.errorCreateDo){
          const path:any="salesorder";  
            this.router.navigate([path]);
    }
}
displaySchemeList(){
   if(this.customerList.hasOwnProperty('ex_schemes')){
    if(this.customerList['ex_schemes'].length==0){
        this.commonService.responseMessages("", "Schemes are not available for this customer", "warning");
        return false;
    }
    $("#displaySchemesModal").modal("show");
   }else{
      this.commonService.responseMessages("", "Schemes are not available for this customer", "warning");
        return false;  
   }
}

uploadExcel(){
$("#uploadExcel").click();
}
mergeItemsList(){
    //console.log(mergeItems);
    let mergeArray:any=[];
    for(let index of this.createSalesOrderItems){
        if(index.mat_num!="" && index.qty!=""){
            mergeArray.push(index);
        }
    }
    this.createSalesOrderItems=mergeArray.concat(mergeItems);
    //console.log(this.createSalesOrderItems);
    mergeItems=[];
    setTimeout(()=>{this.enableButtons()},200);
    return false;
    
}
populateFileds(response,matResponse,matType,countId){
    $(".ajax-searchlist").hide();
let count:any=0;
if(matResponse!=undefined){
for(let list of matResponse){
    /*if(response['mat_num']!=response['mat_num']){
        response.price=0;    
    }*/
    if(matType=='matNum'){
        if(response.mat_num!="" && response.mat_num!=undefined){
            if(list['mat_num']==response['mat_num'].toUpperCase()){
                $("#changeMaterial").val('');
                this.saveBtn = false;
                $("#sales-row-"+countId).removeAttr('style');
                response['mat_num']=list['mat_num'];
                response['uom']=list['uom'];
                response['desc']=list['mat_name'];
                //response['qty']=0;
                response['price']=0;
                response["fix_sch"]=0;
                response["sch_val"]=0;
                response["add_dis"]="";
                response["dis_per_val"]=0;
                response["dis_amt"]=0;
                response["net_val"]=0;
                response["sgst_rt"]="";
                response["sgst_val"]=0;
                response["cgst_rt"]="";
                response["cgst_val"]=0;
                response["igst_rt"]="";
                response["igst_val"]=0;
                response['zspe']=false;
                response['zsvl']=false;
                response['zper']=false;
                response['zval']=false;
                response['grossValue']=0;
                response['errorMat']=true;
                response.changeFlag=false;
                if(countId!=undefined){
                    this.changeQtyCalculations(response,countId);
                }
                return false;
            }else{
                if(response.changeFlag){
                    response['errorMat']=false; 
                }
                
            }  
        }
        
    }
    if(matType=='desc'){
        if(response['desc']!=""){
        if(list['mat_name']==response['desc'].toUpperCase()){
            response['uom']=list['uom'];
            response['mat_num']=list['mat_num'];
            response['desc']=list['mat_name'];
            //response['qty']=0;
            response['price']=0;
            response["fix_sch"]=0;
            response["sch_val"]=0,
            response["add_dis"]="";
            response["dis_per_val"]=0
            response["dis_amt"]=0;
            response["net_val"]=0;
            response["sgst_rt"]="";
            response["sgst_val"]=0;
            response["cgst_rt"]="";
            response["cgst_val"]=0;
            response["igst_rt"]="";
            response["igst_val"]=0;
            response['zspe']=false;
            response['zsvl']=false;
            response['zper']=false;
            response['zval']=false;
            response['grossValue']=0;
            if(countId!=undefined){
                this.changeQtyCalculations(response,countId);
               }
            return false;
        }
        }
       }
    }
$("#changeMaterial").val('');
}else{
    if(response!=undefined){
    response['valid']=false;
    response['errorMat']=false;
    }
}
    if(response.mat_num==""){
           response['mat_num']=response['org_mat_num'];     
    }
    this.checkMaterail(response,countId)
}
calculatePrice(typeId){
this.materialReverse(this.createSalesOrderItems);
setTimeout(()=>{
if(typeId=='save' && this.orderType!='ZKS'){
        this.saveSalesOrderItems();    
        return false;
}
$('#loadingIcon').show();
$("#black-overlay").show();
let obectList:any=[];
    for(let lst of this.createSalesOrderItems){
          if(lst.mat_num!="" && lst.mat_num!=undefined && lst.updateflag!='I' && lst.uom!=""){
              obectList.push(lst);
          }else{
            if(lst.updateflag=='I' && lst.mat_num!="" && lst.mat_num!=undefined){
              obectList.push(lst);
            }    
          } 
    }
this.createSalesOrderItems= obectList;
let initCount:any=0;
for(let item of this.createSalesOrderItems){
    if(item.displayRow){
      initCount++;      
    }else{
        if(item.updateflag=='I'){
            item.newItem=true;  
         }  
    }    
}

/*if(initCount==0){
    this.commonService.responseMessages("", "There are no items ", "warning");
    return false;
}*/
this.manageSalesPayload={};
this.manageSalesPayload['bp_id']=this.bpId;
this.manageSalesPayload['org_id']=this.orgId;
this.manageSalesPayload['testrun']="X";
this.manageSalesPayload['im_action']="S";
this.manageSalesPayload['im_sp_cust']=this.customerId;
this.manageSalesPayload['im_sh_cust']=$("#shiptoCustomerId").val();
this.manageSalesPayload['sales_header_in']={};
this.manageSalesPayload['sales_header_in']['doc_type']=this.docType;
//this.manageSalesPayload['salesdocument']=this.editOrderNum;
let reqDate:any=null;
let purDate:any=null;
if($("#reqDelDate").val()!=undefined && $("#reqDelDate").val()!=""){
    reqDate=$("#reqDelDate").val();
    reqDate=reqDate.split('/')[2]+""+reqDate.split('/')[1]+""+reqDate.split('/')[0];  
}
if($("#purchDate").val()!=null && $("#purchDate").val()!=""){
    purDate=$("#purchDate").val();
    purDate=purDate.split('/')[2]+""+purDate.split('/')[1]+""+purDate.split('/')[0]; 
}
this.manageSalesPayload['sales_header_in']['req_date_h']=reqDate;
this.manageSalesPayload['sales_header_in']['purch_no_c']=$("#purchNoc").val();
this.manageSalesPayload['sales_header_in']['purch_date']=purDate;
this.manageSalesPayload['sales_header_in']['incoterms1']=$("#incoTerms").val();
this.manageSalesPayload['sales_header_in']['incoterms2']=$("#incoTerms option:selected").text();
this.manageSalesPayload['sales_header_in']['pmnttrms']=$("#payTerms").val();
this.manageSalesPayload['sales_items_in']=[];
let itemCount1:any=1;
let orgNumber:any=null;
let highNumber:any=null;
if(this.objectArrayList.length==0){
      let newNumber:any=0;
      this.objectArrayList.push(newNumber);  
}
this.objectArrayList.sort(function(a, b) { return a - b });
//console.log(this.objectArrayList);
for(let item of this.createSalesOrderItems){
    if((item.qty!=undefined && item.mat_num!="")){
     let object:any={};
    if(item.qty==""){
        item.qty=0;
    }
    //if(item.displayRow){
        if(item.updateflag=='I'){
            if(orgNumber==null){
                highNumber=this.objectArrayList[this.objectArrayList.length-1];
                orgNumber=highNumber;    
            }else{
                if(highNumber==null){
                   highNumber=this.objectArrayList[this.objectArrayList.length-1];
                   orgNumber=highNumber;     
                }    
            }
            orgNumber=parseFloat(orgNumber)+10;
            object['itm_number']=orgNumber;
        }else{
            orgNumber=item.itm_number;
             object['itm_number']=item.itm_number;   
        }
     object['material']=item.mat_num;
     object['target_qty']=item.qty;
     object['target_qu']=item.uom;
     object['T_UNIT_ISO']=item.uom;
     this.manageSalesPayload['sales_items_in'].push(object);
    //}
    
     itemCount1++;
    }
}
let itemCount:any=1;
let orgNumber1:any=null;
let highNumber1:any=null;
let highNumber2:any=null;
this.manageSalesPayload['sales_conditions_in']=[];
for(let item of this.createSalesOrderItems){
//if(item.displayRow){
    let object:any={};
    let object1:any={};
if((item.qty!=undefined && item.mat_num!="")){
    if(item.updateflag=='I'){
            if(orgNumber1==null){
                highNumber1=this.objectArrayList[this.objectArrayList.length-1];
                orgNumber1=highNumber1;    
            }else{
                if(highNumber1==null){
                   highNumber1=this.objectArrayList[this.objectArrayList.length-1];
                   orgNumber1=highNumber1;     
                }    
            }
            orgNumber1=parseFloat(orgNumber1)+10;
        }else{
            orgNumber1=item.itm_number;
        }
    if(item.dis_per_val!=0 && item.dis_per_val!=null && item.add_dis!="" && item.add_dis!=null){
        if(item.add_dis=='ZPER'){
            object['cond_value']=-(item.dis_per_val);
        }else{
            object['cond_value']=item.dis_per_val/10;
        }
        object['cond_type']=item.add_dis;
        
        object['itm_number']=orgNumber1;
        object['cond_st_no']=item.cond_st_no;
        this.manageSalesPayload['sales_conditions_in'].push(object);
    }
        /*if(orgNumber1==null){
            orgNumber1=item.itm_number;
        }*/
        object1['cond_type']='ZPRO';
        object1['cond_value']=item.price;
        object1['itm_number']=orgNumber1;
        object1['cond_st_no']=10;
        object1['cond_p_unt']=1;
        object1['curr_iso']="INR";
        object1['cond_unit']=item.uom;
        object1['currency']='INR';
        this.manageSalesPayload['sales_conditions_in'].push(object1);
    }
    itemCount++;
  //}
} 
let url:any=this.environment.getRequiredApi("sales_order_manage")+"?";
this.commonService.getData(url, "POST", this.manageSalesPayload, this.accessObjectId).subscribe(response=>{
   if(response.status==0){
       this.calcResultsList=response["data"];
       let calculatedResults:any=response["data"];
       let count:any=0;
       let itemNumber:any=null;
       if(calculatedResults['ex_return'].length>0){
           this.errorList=calculatedResults['ex_return'];
           for(let elist of calculatedResults['ex_return']){
               if(elist.type=='E'){
                   this.errorFlag=true;
                   $('#loadingIcon').hide();
                   $("#black-overlay").hide();
                   $("#displayErrorsModal").modal("show");
                   return false;
               }
           }
       }
          let objectList:any=[];
          let noItemsflag:boolean=false;
          /*for(let listItem of this.createSalesOrderItems){
               if(listItem.displayRow){
                  objectList.push(listItem);    
               }else{
                   this.disableList.push(listItem);   
               } 
          }
           if(objectList.length==this.createSalesOrderItems.length){
                noItemsflag=true;
           }*/
      if(calculatedResults.hasOwnProperty("conditions_ex")){
      if(calculatedResults['conditions_ex'].length>0){
          let netValAmt:any=0;
          let msgCount:any=0;
          
       for(let list of calculatedResults['conditions_ex']){
           if(itemNumber==null){ 
               itemNumber=list.itm_number;
               if((this.createSalesOrderItems[count].mat_num=="" || this.createSalesOrderItems[count].qty=="")){
                       let count1:any=0;
                       for(let list of this.createSalesOrderItems){
                            if((this.createSalesOrderItems[count].mat_num=="" && this.createSalesOrderItems[count].qty=="") || this.createSalesOrderItems[count].mat_num==""){
                                count++;
                             }
                       }
                    }
               //console.log(this.createSalesOrderItems+"------"+count);
               this.createSalesOrderItems[count]['itm_number']=list.itm_number;
               this.createSalesOrderItems[count]['cond_st_no']=list.cond_st_no;
               if(list.cond_type=='ZPRO'){
                   this.createSalesOrderItems[count].price=parseFloat(list.cond_value).toFixed(2);
                   this.createSalesOrderItems[count].uom=list.cond_unit;
                   this.createSalesOrderItems[count].desc=list.refobjkey;
                   netValAmt=this.createSalesOrderItems[count].price*this.createSalesOrderItems[count].qty;
               }
               
           }else{
               if(itemNumber==list.itm_number){
                   if(list.cond_type=='ZSPE'){
                           let fixScheme:any=Math.abs(list.cond_value);
                           this.createSalesOrderItems[count].orgfix_sch=fixScheme;
                           let schVal:any=(netValAmt)*this.createSalesOrderItems[count].orgfix_sch/100;
                           this.createSalesOrderItems[count].orgsch_val=schVal;
                           if(this.schemesFlag){
                               this.createSalesOrderItems[count].fix_sch=fixScheme;
                               let schVal:any=(netValAmt)*this.createSalesOrderItems[count].fix_sch/100;
                               this.createSalesOrderItems[count].sch_val=schVal;
                           }else{
                              if(this.createSalesOrderItems[count].hasOwnProperty('dlv_stat_i')){
                               if(this.createSalesOrderItems[count].dlv_stat_i=='B' || this.createSalesOrderItems[count].dlv_stat_i=='C'){
                                  this.createSalesOrderItems[count].fix_sch=fixScheme;
                                  let schVal:any=(netValAmt)*this.createSalesOrderItems[count].fix_sch/100;
                                  this.createSalesOrderItems[count].sch_val=schVal; 
                               }else{
                                this.createSalesOrderItems[count].fix_sch=0;
                                this.createSalesOrderItems[count].sch_val=0;
                              }
                              }else{
                                this.createSalesOrderItems[count].fix_sch=0;
                                this.createSalesOrderItems[count].sch_val=0;
                              }
                           }
                           
                           netValAmt=(netValAmt)-this.createSalesOrderItems[count].sch_val;
                           this.createSalesOrderItems[count].schTypeSymbol="per";
                       }
                       if(list.cond_type=='ZSVL'){
                           let fixScheme:any=Math.abs(list.cond_value);
                           this.createSalesOrderItems[count].orgfix_sch=fixScheme;
                           this.createSalesOrderItems[count].orgsch_val=this.createSalesOrderItems[count].orgfix_sch;
                           if(this.schemesFlag){
                               this.createSalesOrderItems[count].fix_sch=fixScheme;
                               let schVal:any=this.createSalesOrderItems[count].fix_sch;
                               this.createSalesOrderItems[count].sch_val=schVal;
                           }else{
                               this.createSalesOrderItems[count].fix_sch=0;
                               this.createSalesOrderItems[count].sch_val=0
                           }
                           netValAmt=(netValAmt)-this.createSalesOrderItems[count].sch_val;
                           this.createSalesOrderItems[count].schTypeSymbol="val";
                       }
                  
                   this.createSalesOrderItems[count]['oldnetVal']=netValAmt;
                   if(list.cond_type=='ZPER'){
                       if(this.createSalesOrderItems[count].dis_per_val==""){
                           this.createSalesOrderItems[count].dis_per_val=0;
                       }
                           let percentage:any=Math.abs(list.cond_value);
                           this.createSalesOrderItems[count].dis_amt=(netValAmt*percentage)/100;
                           netValAmt=(netValAmt)-this.createSalesOrderItems[count].dis_amt;
                   }
                   if(list.cond_type=='ZVAL'){
                       if(this.createSalesOrderItems[count].dis_per_val==""){
                           this.createSalesOrderItems[count].dis_per_val=0;
                       }
                           let percentage:any=Math.abs(list.cond_value);
                           this.createSalesOrderItems[count].dis_amt=percentage;
                           netValAmt=(netValAmt)-percentage;
                   }
                   this.createSalesOrderItems[count].net_val=netValAmt;
                   if(netValAmt<0){
                           $("#amt-"+count).attr('style','border:1px solid red');
                           if(msgCount==0){
                               //this.commonService.responseMessages("", "Discount value must not be greater than net value", "warning");
                            }
                            msgCount++;
                           this.saveBtn=true;   
                        }else{
                               $("#amt-"+count).removeAttr('style'); 
                               this.saveBtn=false;
                           }
                   
                   if(list.cond_type=='JOIG'){
                       let rate:any=Math.abs(list.cond_value);
                       this.createSalesOrderItems[count].igst_rt=rate; 
                       this.createSalesOrderItems[count].igst_val=(this.createSalesOrderItems[count].net_val*rate)/100;
                   }
                   if(list.cond_type=='JOCG'){
                       let rate:any=Math.abs(list.cond_value);
                       this.createSalesOrderItems[count].cgst_rt=rate; 
                       this.createSalesOrderItems[count].cgst_val=(this.createSalesOrderItems[count].net_val*rate)/100;
                   }
                   if(list.cond_type=='JOSG'){
                       let rate:any=Math.abs(list.cond_value);
                       this.createSalesOrderItems[count].sgst_rt=rate; 
                       this.createSalesOrderItems[count].sgst_val=(this.createSalesOrderItems[count].net_val*rate)/100;
                   }
                   this.createSalesOrderItems[count]['grossValue']=this.createSalesOrderItems[count].net_val+this.createSalesOrderItems[count].igst_val+this.createSalesOrderItems[count].cgst_val+this.createSalesOrderItems[count].sgst_val
               }else{
                   itemNumber=list.itm_number;
                   count++;
                   if((this.createSalesOrderItems[count].mat_num=="" || this.createSalesOrderItems[count].qty=="")){
                       let count1:any=0;
                       for(let list of this.createSalesOrderItems){
                            if((this.createSalesOrderItems[count].mat_num=="" && this.createSalesOrderItems[count].qty=="" )|| this.createSalesOrderItems[count].mat_num==""){
                                count++;   
                                //itemNumber=this.createSalesOrderItems[count]['itm_number'];
                             }
                       }
                    }
                   this.createSalesOrderItems[count]['itm_number']=list.itm_number; 
                   
                   netValAmt=0;
                   if(list.cond_type=='ZPRO'){
                       this.createSalesOrderItems[count].price=parseFloat(list.cond_value).toFixed(2);
                       this.createSalesOrderItems[count].uom=list.cond_unit;
                       this.createSalesOrderItems[count].desc=list.refobjkey;
                       netValAmt=this.createSalesOrderItems[count].price*this.createSalesOrderItems[count].qty;
                   }
               }
           }
         
       }
   }
  }
   this.reArrangeItems();
   this.enableButtons();
   this.checked=false;
        this.indeterminate=false;
        this.checkedObjects=[];
        $("#outbound-delivery-table").find("tbody").find(".mat-checkbox-input").each(function(i){
            let id:any=$(this).attr('id');
           if(!id.includes('scheme-checkbox')){
            if($("#"+id).is(":checked")){
                $("#"+id).click();
            }
           }
        });  
   setTimeout(()=>{this.calculateTotalValues()},300);
   if(typeId=='save'){
        this.saveSalesOrderItems();    
    }else{
        $('#loadingIcon').hide();
        $("#black-overlay").hide();
       }
   }else{
       $('#loadingIcon').hide();
       $("#black-overlay").hide();
       this.commonService.responseMessages("", response.message, "warning");
   } 
});
},500);
}
/*addDiscountTotal(items,type){
    if(items.add_dis=='ZPER'){
        if(items.dis_per_val!=null && (items.net_val!=0 && items.oldnetVal!=0)){
            let percentage:any=items.dis_per_val;
           if(items.dis_per_val!=0){
               items.net_val=(items.oldnetVal*percentage)/100; 
               items.dis_amt=(items.oldnetVal*percentage)/100;
               items.igst_val=(items.net_val*items.igst_rt)/100;
               items.cgst_val=(items.net_val*items.cgst_rt)/100;
               items.sgst_val=(items.net_val*items.sgst_rt)/100;
               items.grossValue=items.net_val+items.igst_val+items.cgst_val+items.sgst_val;
           }else{
               items.dis_amt=0;
               items.net_val=items.oldnetVal;
           }
            
        }
    }
    if(items.add_dis=='ZVAL'){
        if(items.dis_per_val!=null && (items.net_val!=0 && items.oldnetVal!=0)){
            let value:any=items.dis_per_val;
        if(items.dis_per_val!=0){
            items.net_val=items.oldnetVal-value;
            items.dis_amt=value;
            items.igst_val=(items.net_val*items.igst_rt)/100;
            items.cgst_val=(items.net_val*items.cgst_rt)/100;
            items.sgst_val=(items.net_val*items.sgst_rt)/100;
            items.grossValue=items.net_val+items.igst_val+items.cgst_val+items.sgst_val;
        }else{
            items.net_val=items.oldnetVal;
            items.dis_amt=value;
        }
        }
    }
    
}*/
saveSalesOrderItems(){
    if($("#reasonTypes").val()=='' && this.orderType=='ZRKS'){
        this.commonService.responseMessages("", "Please select reason type", "warning");
        return false;
    }
    if(this.orderType=='ZKS'){
        //this.calculatePrice();        
    }
this.createSalesOrderItems=this.createSalesOrderItems.concat(this.disableList);
    
//console.log(this.createSalesOrderItems)
this.manageSalesPayload={};
$('#loadingIcon').show();
$("#black-overlay").show();
setTimeout(()=>{
    /*if(this.custGroup=='OT' && this.orderType=='ZKS'){
    if(this.oneTimeCustForm.valid){
            this.manageSalesPayload['partneraddresses']=[]; 
            let onetimeFormObject:any={};
            onetimeFormObject['name']=this.oneTimeCustForm.value['firstname'];
            onetimeFormObject['name_2']=this.oneTimeCustForm.value['lastname'];
            onetimeFormObject['house_no']=this.oneTimeCustForm.value['hsno'];
            onetimeFormObject['country']='IN'//this.oneTimeCustForm.value['country'];
            onetimeFormObject['city']=this.oneTimeCustForm.value['city'];
            onetimeFormObject['e_mail']=this.oneTimeCustForm.value['email'];
            onetimeFormObject['postl_cod1']=this.oneTimeCustForm.value['postcode'];
            onetimeFormObject['tel1_numbr']=this.oneTimeCustForm.value['phone'];
            onetimeFormObject['comm_type']='INT';
            onetimeFormObject['adr_notes']='';
            onetimeFormObject['addr_no']=1;
            onetimeFormObject['district']=this.oneTimeCustForm.value['drugLicNum'];
            onetimeFormObject['street_lng']=this.oneTimeCustForm.value['streetNo'];
            onetimeFormObject['region']=this.oneTimeCustForm.value['stateId'];
            onetimeFormObject['home_city']=this.oneTimeCustForm.value['bpGstinNumber'];
            onetimeFormObject['c_o_name']=this.oneTimeCustForm.value['bpPan'];
            onetimeFormObject['langu']="EN";
            onetimeFormObject['str_suppl1']=this.oneTimeCustForm.value['street1'];
            onetimeFormObject['fax_number']=this.oneTimeCustForm.value['fax'];
            this.manageSalesPayload['partneraddresses'].push(onetimeFormObject);
        }else{
            $("#oneTimeCustomerModal").modal('show');
            this.commonService.responseMessages("", "Please Fill address", "warning");    
        }
    }*/
this.manageSalesPayload['bp_id']=this.bpId;
this.manageSalesPayload['org_id']=this.orgId;
this.manageSalesPayload['testrun']="";
this.manageSalesPayload['im_action']="U";
this.manageSalesPayload['im_sh_cust']=$("#shiptoCustomerId").val();
this.manageSalesPayload['im_sh_cust_old']=this.shipToPartyId;
this.manageSalesPayload['salesdocument']=this.editOrderNum.replace(",", "");
this.manageSalesPayload['im_sp_cust']=this.customerId;
this.manageSalesPayload['sales_header_in_u']={};
this.manageSalesPayload['sales_header_in_u']['doc_type']=this.docType;
this.manageSalesPayload['sales_header_in_u']['purch_no_c']=$("#purchNoc").val();
this.manageSalesPayload['sales_header_in_u']['incoterms1']=$("#incoTerms").val();
this.manageSalesPayload['sales_header_in_u']['incoterms2']=$("#incoTerms option:selected").text();
this.manageSalesPayload['sales_header_in_u']['pmnttrms']=$("#payTerms").val();
if(this.schemesFlag){
    this.manageSalesPayload['im_scheme_flag']="X";   
}else{
    this.manageSalesPayload['im_scheme_flag']=" ";   
}
let reqDate:any=null;
let purDate:any=null;
if($("#reqDelDate").val()!=undefined && $("#reqDelDate").val()!=""){
    reqDate=$("#reqDelDate").val();
    reqDate=reqDate.split('/')[2]+""+reqDate.split('/')[1]+""+reqDate.split('/')[0];  
}
if($("#purchDate").val()!=null && $("#purchDate").val()!=""){
    purDate=$("#purchDate").val();
    purDate=purDate.split('/')[2]+""+purDate.split('/')[1]+""+purDate.split('/')[0]; 
}
if(this.orderType=='ZRKS'){
        let billDate:any=this.billDate.split("-");
        billDate=billDate[0]+""+billDate[1]+billDate[2];
        //this.manageSalesPayload['sales_header_in_u']['bill_block']=$("#billBlockTypes").val();;
        this.manageSalesPayload['sales_header_in_u']['ord_reason']=$("#reasonTypes").val();
        this.manageSalesPayload['sales_header_in_u']['bill_date']=billDate;
        //this.manageSalesPayload['sales_header_in']['ref_doc']=this.invoiceNum;
        this.manageSalesPayload['sales_header_in_u']['refdoc_cat']='M';
    }
this.manageSalesPayload['sales_header_in_u']['req_date_h']=reqDate;
this.manageSalesPayload['sales_header_in_u']['purch_date']=purDate;
this.manageSalesPayload['sales_items_in']=[];
this.manageSalesPayload['sales_items_inx']=[];
this.manageSalesPayload['sales_schedules_in']=[];
this.manageSalesPayload['sales_schedules_inx']=[];

let count1:any=0;

for(let item of this.createSalesOrderItems){
    if((item.qty!=undefined && item.mat_num!="" && item.mat_num!=undefined)){
      if((item.qty===0 || item.qty=="0") && item.displayRow){
        this.commonService.responseMessages("", "Quantity should not be zero ("+item.qty+") for the item "+item.mat_num+" line number ( "+(count1+1)+" )", "warning");
        $('#loadingIcon').hide();
        $("#black-overlay").hide();
          return false;    
      }
      if(item.dlv_stat_i!='B'  &&  item.dlv_stat_i!='C'){
        let object:any={};
        object['material']=item.mat_num;
        object['target_qty']=item.qty;
        object['target_qu']=item.uom;
        object['T_UNIT_ISO']=item.uom;
        object['itm_number']=item.itm_number;
        if(item.updateflag=='I'){
            object['item_categ']=this.docType;
        }
        if(this.orderType=='ZRKS'){
                object['ref_doc_it']=item.item_no;
            }
        if((item.updateflag=='I' && item.displayRow)){
            this.manageSalesPayload['sales_items_in'].push(object);
        }
        if(item.updateflag!='I'){
            //console.log(item.newItem+"----+")
            if(!item.newItem && item.updateflag!='I' && item.newItem!=undefined){
                this.manageSalesPayload['sales_items_in'].push(object);
             }else{
                //console.log(item.updateflag+"----+"+item.itm_number);
                  if(item.updateflag!='I'){
                    this.manageSalesPayload['sales_items_in'].push(object);    
                  }  
            }
        }
        let changeObject:any={};
        changeObject['material']="X";
        changeObject['target_qty']="X";
        changeObject['target_qu']="X";
        changeObject['T_UNIT_ISO']="X";
        changeObject['itm_number']=item.itm_number;
        let schObject:any={};
        schObject['itm_number']=item.itm_number;
        schObject['req_qty']=item.qty;
        let schObject1:any={};
        schObject1['itm_number']=item.itm_number;
        schObject1['req_qty']="X";
        if((item.updateflag=='I' && item.displayRow)){
            this.manageSalesPayload['sales_schedules_in'].push(schObject);
          }
        if(item.updateflag!='I'){
           if(!item.newItem && item.updateflag!='I' && item.newItem!=undefined){
            this.manageSalesPayload['sales_schedules_in'].push(schObject);
           }else{
               //console.log(item.updateflag+"----+"+item.itm_number);
                  if(item.updateflag!='I'){
                    this.manageSalesPayload['sales_schedules_in'].push(schObject);   
                  }  
            }
        }
        //console.log("-------display----"+item.itm_number);
        if(item.displayRow){
            //console.log("-------display----"+item.itm_number);
            changeObject['updateflag']=item.updateflag;
            schObject1['updateflag']=item.updateflag;
            if(item.updateflag=='I'){
                changeObject['item_categ']="x";
            }
            this.manageSalesPayload['sales_items_inx'].push(changeObject);
            this.manageSalesPayload['sales_schedules_inx'].push(schObject1);
        }else{
            //console.log("-----------"+item.itm_number);
            if(item.itm_number!=null && item.itm_number!=undefined){
                changeObject['updateflag']="D";
                schObject1['updateflag']="D";
                if(!item.newItem && item.updateflag!='I' && item.newItem!=undefined){
                    this.manageSalesPayload['sales_items_inx'].push(changeObject);
                    this.manageSalesPayload['sales_schedules_inx'].push(schObject1);
                }else{
                    //console.log(item.updateflag+"----+"+item.itm_number);
                    this.manageSalesPayload['sales_items_inx'].push(changeObject);
                    this.manageSalesPayload['sales_schedules_inx'].push(schObject1);   
            }
             }
        }
        
        count1++;
      }
    }
    
}
this.manageSalesPayload['sales_text']=[];
let object:any={};
object['text_line']=$("#header_text").val();
object['text_id']="0002";
object['langu']='E';
this.manageSalesPayload['sales_text'].push(object);
this.manageSalesPayload['testrun']="";
this.manageSalesPayload['sales_conditions_in']=[];
this.manageSalesPayload['sales_conditions_inx']=[];
for(let item of this.createSalesOrderItems){
 if(item.displayRow){
  if(item.dlv_stat_i!='B'  &&  item.dlv_stat_i!='C'){
    let object:any={};
    let changeObject:any={};
    let object1:any={};
    let object2:any={};
    let changeObject1:any={};
    let changeObject2:any={};
 if((item.qty!=undefined && item.mat_num!="")){
    if(item.dis_per_val!=0 && item.dis_per_val!=null && item.add_dis!="" && item.add_dis!=null){
        if(item.add_dis=='ZPER'){
            object['cond_value']=-(item.dis_per_val);
            if(item.zper){
                changeObject['updateflag']="U"; 
                if(item.zval){
                    let deleteObject:any={};
                    deleteObject['cond_type']="ZVAL";
                    deleteObject['itm_number']=item.itm_number;
                    deleteObject['cond_st_no']=item.cond_st_no;
                    if(deleteObject.hasOwnProperty('cond_type')){
                        this.manageSalesPayload['sales_conditions_in'].push(deleteObject);
                      }
                    deleteObject['updateflag']="D";
                    this.manageSalesPayload['sales_conditions_inx'].push(deleteObject);
                }
            }else{
                changeObject['updateflag']="I";
                if(item.zval){
                    let deleteObject:any={};
                    deleteObject['cond_type']="ZVAL";
                    deleteObject['itm_number']=item.itm_number;
                    deleteObject['cond_st_no']=item.cond_st_no;
                   if(deleteObject.hasOwnProperty('cond_type')){
                    this.manageSalesPayload['sales_conditions_in'].push(deleteObject);
                  }
                    deleteObject['updateflag']="D";
                    this.manageSalesPayload['sales_conditions_inx'].push(deleteObject);
                }
            }
        }else{
            object['cond_value']=item.dis_per_val/10;
            if(item.zval){
                changeObject['updateflag']="U";
                if(item.zper){
                    let deleteObject:any={};
                    deleteObject['cond_type']="ZPER";
                    deleteObject['itm_number']=item.itm_number;
                    deleteObject['cond_st_no']=item.cond_st_no;
                    this.manageSalesPayload['sales_conditions_in'].push(deleteObject);
                    deleteObject['updateflag']="D";
                    this.manageSalesPayload['sales_conditions_inx'].push(deleteObject);
                }
            }else{
                changeObject['updateflag']="I";
                    if(item.zper){
                        let deleteObject:any={};
                        deleteObject['cond_type']="ZPER";
                        deleteObject['itm_number']=item.itm_number;
                        deleteObject['cond_st_no']=item.cond_st_no;
                        this.manageSalesPayload['sales_conditions_in'].push(deleteObject);
                        deleteObject['updateflag']="D";
                        this.manageSalesPayload['sales_conditions_inx'].push(deleteObject);
                    }
            }
        }
        object['cond_type']=item.add_dis;
        object['itm_number']=item.itm_number;
        object['cond_st_no']=item.cond_st_no;
        if(object.hasOwnProperty('cond_type')){
            this.manageSalesPayload['sales_conditions_in'].push(object);
           }
        changeObject['cond_type']=item.add_dis;
        changeObject['itm_number']=item.itm_number;
        changeObject['cond_st_no']=item.cond_st_no;
        changeObject['cond_value']="X";
        this.manageSalesPayload['sales_conditions_inx'].push(changeObject);
        
    }
        if(item.updateflag=='I'){
            object1['updateflag']='I'
        }else{
            object1['updateflag']='U'    
        }
        object1['cond_type']='ZPRO';
        object1['cond_value']=item.price;
        object1['itm_number']=item.itm_number;
        object1['cond_st_no']=item.cond_st_no;
        object1['cond_p_unt']=1;
        object1['curr_iso']="INR";
        object1['cond_unit']=item.uom;
        object1['currency']='INR';
        if(object1.hasOwnProperty('cond_type')){
            this.manageSalesPayload['sales_conditions_in'].push(object1);
          }
        if(item.updateflag=='I'){
            changeObject1['updateflag']='I';
         }else{
            changeObject1['updateflag']='U';
        }
        changeObject1['cond_type']='ZPRO';
        changeObject1['cond_value']="X";
        changeObject1['cond_st_no']=item.cond_st_no;
        changeObject1['itm_number']=item.itm_number;
        changeObject1['cond_p_unt']=1;
        changeObject1['curr_iso']="X";
        changeObject1['cond_unit']="X";
        changeObject1['currency']='X';
        this.manageSalesPayload['sales_conditions_inx'].push(changeObject1);
        if(item.updateflag=='I'){
            object2['updateflag']='I'
         }else{
            object2['updateflag']='U'
        }
        if(item.schTypeSymbol=='per'){
            object2['cond_type']='ZSPE';
            object2['cond_p_unt']=1;
            object2['itm_number']=item.itm_number;
            object2['cond_st_no']=item.cond_st_no;
         }
        if(item.schTypeSymbol=='val'){
            object2['cond_type']='ZSVL';
            object2['curr_iso']="INR";
            object2['cond_unit']=item.uom;
            object2['currency']='INR';
            object2['cond_p_unt']=1;
            object2['itm_number']=item.itm_number;
            object2['cond_st_no']=item.cond_st_no;
         }
        if(this.schemesFlag){
            object2['cond_value']=item.orgfix_sch;
            if(object2.hasOwnProperty('cond_type')){
                this.manageSalesPayload['sales_conditions_in'].push(object2);
              }
            if(item.schTypeSymbol!=undefined){
                //if(item.orgfix_sch!=0 && item.updateflag!='I'){
                        //this.manageSalesPayload['sales_conditions_in'].push(object2);
                //}    
               }
        }else{
            if(item.hasOwnProperty('dlv_stat_i')){
                if(item.dlv_stat_i=='B' || item.dlv_stat_i=='C'){
                    this.manageSalesPayload['im_scheme_flag']="X";
                    object2['cond_value']=item.orgfix_sch;
                }
            }else{
                 object2['cond_value']=0;   
              }
            
            if(item.schTypeSymbol!=undefined){
               if(object2.hasOwnProperty('cond_type')) 
                this.manageSalesPayload['sales_conditions_in'].push(object2);
               }
        }
        
        if(item.updateflag=='I'){
            changeObject2['updateflag']='I';
         }else{
             changeObject2['updateflag']='U';   
        }
        if(item.schTypeSymbol=='per'){
            changeObject2['cond_type']='ZSPE';
            changeObject2['cond_p_unt']=0;
            changeObject2['cond_value']="X";
            changeObject2['itm_number']=item.itm_number;
            changeObject2['cond_st_no']=item.cond_st_no;
            if(!this.schemesFlag){
                this.manageSalesPayload['sales_conditions_inx'].push(changeObject2);
            }else{
                //if(item.orgfix_sch!=0 && item.updateflag!='I'){
                        this.manageSalesPayload['sales_conditions_inx'].push(changeObject2);
                //}    
            }
        }
        if(item.schTypeSymbol=='val'){
            changeObject2['cond_type']='ZSVL';
            changeObject2['curr_iso']="INR";
            changeObject2['cond_unit']=item.uom;
            changeObject2['currency']='INR';
            changeObject2['cond_p_unt']=1;
            changeObject2['cond_value']="X";
            changeObject2['itm_number']=item.itm_number;
            changeObject2['cond_st_no']=item.cond_st_no;
            if(!this.schemesFlag){
                this.manageSalesPayload['sales_conditions_inx'].push(changeObject2);
            }else{
                //if(item.orgfix_sch!=0 && item.updateflag!='I'){
                        this.manageSalesPayload['sales_conditions_inx'].push(changeObject2);
                //}    
            }
        }
 }
}
 }
}
let url:any=this.environment.getRequiredApi("sales_order_manage")+"?";
this.commonService.getData(url, "POST", this.manageSalesPayload, this.accessObjectId).subscribe(response=>{
    if(response.status==0){
        this.disableList=[];
        $('#loadingIcon').hide();
        $("#black-overlay").hide();
        if(response["data"]['ex_return'].length>0){
            this.errorList=response["data"]['ex_return'];
            for(let elist of response["data"]['ex_return']){
                if(elist.type=='E'){
                    this.errorFlag=true;
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                    $("#displayErrorsModal").modal("show");
                    return false;
                }
            }
        }
        this.manageSalesPayload={};
        $("#gs-GSTR1").removeAttr("style");
        this.objectArrayList=[];
        this.getSalesOrderDetails();
        if(this.orderType=='ZKS'){
            this.commonService.responseMessages("", "Sales order '"+this.editOrderNum+" 'Updated Succesfully", "success");
         }else{
            this.commonService.responseMessages("", "Sales order '"+this.editOrderNum+" 'Updated Succesfully", "success");
        }
        this.createSalesFlag=false;
        this.createdSales=true;
        $("#gs-GSTR1").hide();
        $("#icon-GSTR1").show();
    }else{
        $('#loadingIcon').hide();
        $("#black-overlay").hide();
        this.commonService.responseMessages("", "Error occured while creating sales order", "warning");
    }
});
},600);
}
redirectSalesOrder(){
if(this.fromPage=='PSR'){
    const path:any='pendingsalesreport';
    this.router.navigate([path],{ queryParams: {frompage:"SO"} });
}else{
    const path:any='salesorder';
    this.router.navigate([path]);    
}

}
changeQtyCalculations(items,id){
    let flag:boolean=true;
    if((items.qty=="0" || items.qty=="" || items.qty==0) && (items.mat_num!="" && items.mat_num!=undefined)){
        if($("#sales-row-" + id).attr('style')!='background:#d63e3e'){
        $("#sales-row-"+id).attr('style','background:#d63e3e');
        $("#qty-"+id).attr('style','border:1px solid red');
           if(!$('.alert-warning').is(":visible")){
                this.commonService.responseMessages("", "Quantity should not be zero/empty ("+items.qty+")", "warning");
               }
        }
            this.calcBtn=true;
            this.saveBtn=true;
            return false;    
    }else{
         $("#sales-row-"+id).removeAttr('style');
         $("#qty-"+id).removeAttr('style');
            this.calcBtn=false;
            this.saveBtn=false;
         
    }
    if(items.qty!=0 && items.price!=0){
        items.price=""+items.price;
     if(items.price.split('.').length > 2){
            $("#price-"+id).attr('style','border:1px solid red');
            this.commonService.responseMessages("", "Price value format are wrong "+items.price+"", "warning");
            this.calcBtn=true;
            this.saveBtn=true;
            return false;
        }else{
            items.price=parseFloat(items.price);
            $("#price-"+id).removeAttr('style');
            this.calcBtn=false;
            this.saveBtn=false; 
        }
     flag=this.checkLimit(items, id);
    if(flag!=false){
        $("#amt-"+id).removeAttr('style'); 
        $("#qty-"+id).removeAttr('style'); 
        this.calcBtn=false;
        this.saveBtn=false;
        flag=true;
    }
    }
    if(items.qty==""){
        items.qty=0;
    }
    
    if(items.price!=""){
        let price=items.price*items.qty;
        let percentage:any=0;
        let schVal:any=0;
        if(items.schTypeSymbol=="per"){
            percentage=(price*items.fix_sch)/100;
            schVal=percentage;
        }
        if(items.schTypeSymbol=="val"){
            percentage=price-items.fix_sch;
            schVal=items.fix_sch;
        }
        items.sch_val=schVal;
        items.sch_val=schVal;
        let netVal:any=price-schVal;
        let addPer:any;
        let disAmt:any=0;
        if(items.dis_per_val==""){
            items.dis_per_val=0;
        }else{
            /*var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if(format.test(items.dis_per_val)){
                items.dis_per_val=items.dis_per_val.replace(/[^\d\.]/g,'');
            }*/
            items.dis_per_val=parseFloat(items.dis_per_val);    
        }
        if(items.add_dis=='ZPER'){
            items.dis_per_val=parseFloat(items.dis_per_val);
            disAmt=(netVal*items.dis_per_val)/100;
            netVal=netVal-disAmt;
        }
        if(items.add_dis=='ZVAL'){
            items.dis_per_val=parseFloat(items.dis_per_val);
            disAmt=items.dis_per_val;
            netVal=netVal-disAmt;
        }
        
        items.dis_amt=disAmt;
        items.net_val=netVal;
        let igst:any;
        let cgst:any;
        let sgst:any;
        igst=(netVal*items.igst_rt)/100;
        cgst=(netVal*items.cgst_rt)/100;
        sgst=(netVal*items.sgst_rt)/100;
        items.igst_val=igst;
        items.cgst_val=cgst;
        items.sgst_val=sgst;
        let grossVal:any;
        grossVal=netVal+igst+cgst+sgst;
        items.grossValue=grossVal; 
    }
    if(!flag){
      return false;      
    }
    this.enableButtons();
    setTimeout(()=>{this.calculateTotalValues()},500);
}
enableButtons(){
    let countId:any=0;
    for(let lst of this.createSalesOrderItems){
         if((lst.qty=="0" || lst.qty=="" || lst.qty==0) && (lst.mat_num!="" && lst.mat_num!=undefined) && lst.displayRow){
            $("#sales-row-"+countId).attr('style','background:#d63e3e');  
         } 
        countId++;  
    }
    let flag:boolean=false;
    let count:any=0;
    let errorCount:any=null;
    for(let item of this.createSalesOrderItems){
        if(item.displayRow){
        if((item.qty!="" && item.qty!=0 && item.qty!="0") && item.mat_num!="" && item.mat_num!=undefined){
            if(item.net_val < 0){
                this.calcBtn=true;
                this.saveBtn=true;
                return false;
             }else{
                 this.calcBtn=false;
                 this.saveBtn=false;
                 flag=false;
             }
        }else{
            if((item.qty=="0" || item.qty=="" || item.qty==0) && item.mat_num!="" && item.mat_num!=undefined){
                errorCount=count;    
            }    
        }
      }
        count++;
    }
  
  if(errorCount!=null){
      this.commonService.responseMessages("", "Quantity value should not be zero / empty", "warning");
            this.calcBtn=true;
            this.saveBtn=true; 
  } 
} 
reArrangeItems(){
    //console.log(this.createSalesOrderItems);
    let reArrangeItems=[];
    for(let item of this.createSalesOrderItems){
        if((item.qty!="" && item.mat_num!="")){
            reArrangeItems.push(item);
        }
        if((item.qty!="" && item.mat_num=="")){
            item.displayRow=false;
            reArrangeItems.push(item);
        } 
        
    }
    this.createSalesOrderItems=reArrangeItems;
}
checkLimit(item,id){
   if(this.orderType=='ZKS'){
    if((item.price!="" && item.qty!="") && (item.price!="" && item.qty!="")){
        let limitval:any=parseFloat(item.price)*parseFloat(item.qty);
        limitval=limitval-parseFloat(item.sch_val);
        if(item.add_dis=='ZPER'){
            if(item.dis_per_val > 100){
                $("#amt-"+id).attr('style','border:1px solid red');
                this.commonService.responseMessages("", "Discount value must not be greater than net value", "warning");
                this.calcBtn=true;
                this.saveBtn=true;
                return false;
            }
        }else{
            if(item.dis_per_val > limitval && item.add_dis=='ZVAL'){
                $("#amt-"+id).attr('style','border:1px solid red');
                this.commonService.responseMessages("", "Discount value must not be greater than net value'", "warning");
                this.calcBtn=true;
                this.saveBtn=true;
                return false;
            }  
        }
        
    }
   }
  if(this.orderType=='ZRKS'){
    if(item.qty > Math.round(item.oldqty)){
        $("#qty-"+id).attr('style','border:1px solid red');
        this.commonService.responseMessages("", "Quantity must not be greater than available Quantity "+Math.round(item.oldqty)+" ", "warning");
        this.calcBtn=true;
        this.saveBtn=true;
        return false;    
    }    
  }
}
createDelivery(){
        this.commonService.saleType='Create';
        const path:any="salesorder/editsalesorder";
        let changeDate:any=new Date();
        let day:any=changeDate.getDate();
        let month:any=changeDate.getMonth()+1;
        changeDate=changeDate.getFullYear()+""+month+""+day;
        this.router.navigate([path],{queryParams: {"orderNum":this.orderNum,"fromDate":changeDate,"action":"C","fromItem":"","toItem":"",frompage:"SO"} });
        
}
createDeliveryById(){
    $("#displayDeliveryModal").modal('hide');
    this.createDelivery();
}
successDelivery(){
    this.deliveryFlag=false;
    this.deliveredFlag=true;
    $("#gs-GSTR2").hide();
    $("#icon-GSTR2").show();
}
createBilling(){
    if(this.commonService.deliveryNum!="" && this.commonService.deliveryNum!=null){
        const path: any = "billing/editbillingdetails";
        let delv_no:any=this.commonService.deliveryNum;
        let changeDate:any=new Date();
        let day:any=changeDate.getDate();
        let month:any=changeDate.getMonth()+1;
        changeDate=changeDate.getFullYear()+""+month+""+day;
        this.router.navigate([path],{ queryParams: {"delvNo":delv_no,"billDate":changeDate,"action":"C",frompage:"SO"} });
        
    }
}
closeModalId(id){
    $("#"+id).modal("hide");
    this.createSalesOrderForm.reset();
      this.createSalesOrderForm.controls['customer'].setValue("");
      this.createSalesOrderForm.controls['orderType'].setValue("");
      this.createSalesOrderForm.controls['invoiceNum'].setValue("");
}
selectedItem(response,modalBlock,textInput,hiddenInput){
    $("#"+textInput).val(response.cust_id+" - "+response.cust_name);
    $("#"+hiddenInput).val(response.cust_id);
    $("#"+modalBlock).hide();
    $("#addressBtn").click();
}
selectedMatrItem(response,modalBlock,inputId,num,item){
    if(inputId=='desc'){
        item.desc=response.mat_name;
    }
    if(inputId=='matNum'){
        item.mat_num=response.mat_num;
    }
    
    $("#"+modalBlock+"-"+num).hide();
    this.populateFileds(item,this.matnrDetails,inputId,num);
}
navigateDelivery(){
    if(this.dlvlist.length>1){
            $('#displayDeliveryModal').modal('show');
    }else{
     this.reqDlvrNum=this.dlvlist[0];
        if((this.reqDlvrNum=="" && this.action=="U") || (this.reqDlvrNum=="" && this.action=="DIS") || (this.reqDlvrNum==undefined && (this.action=="DIS" || this.action=="U"))){
        const path:any="obd/createdelivery";
        let changeDate:any=new Date();
        let day:any=changeDate.getDate();
        let month:any=changeDate.getMonth()+1;
        changeDate=changeDate.getFullYear()+""+month+""+day;
        this.router.navigate([path],{ queryParams: {"orderNum":this.editOrderNum,"fromDate":changeDate,"action":"C","fromItem":"","toItem":"",frompage:"SO"} });
            return false;
    }else{
         if(this.reqDlvrNum!=""){
          this.editDelieryById();    
         }
           
        }
   }    
}
editDelieryById(){
if(this.reqDlvrNum!="" && this.action=="U" && this.reqDlvrNum!=undefined){
        $('#displayDeliveryModal').modal('hide');
        const path:any="obd/editdeliverydetails";
        this.router.navigate([path],{ queryParams: {"orderNum":this.reqDlvrNum,"action":"U",frompage:"SO"} });
        return false;
    }
    if(this.reqDlvrNum!="" && this.action=="DIS" && this.reqDlvrNum!=undefined){
        $('#displayDeliveryModal').modal('hide');
        const path:any="obd/editdeliverydetails";
        this.router.navigate([path],{ queryParams: {"orderNum":this.reqDlvrNum,"action":"DIS",frompage:"SO"} });
        return false;
    }    
}
navigateBilling(){
   if(!$("#icon-GSTR1A").is(":visible")){
       return false;
   }
   
   let changeDate: any = new Date();
   let day: any = changeDate.getDate();
   let month: any = changeDate.getMonth() + 1;
    
    if(month.toString().length == 1){
    month = "0"+month;    
    }
   changeDate = changeDate.getFullYear() + "" + month + "" + day;
   
   if(this.deliveryNum!="" && this.action=="U"){
       const path:any="billing/createbilling";
       this.router.navigate([path],{ queryParams: {"delvNo":this.deliveryNum,"billDate": changeDate,"action":"C"} });
       return false;
   }
   if(this.deliveryNum!="" && this.action=="DIS"){
       const path:any="billing/createbilling";
       //this.router.navigate([path],{ queryParams: {"delvNo":this.reqDlvrNum,"action":"DIS"} });
       this.router.navigate([path],{ queryParams: {"delvNo":this.deliveryNum,"billDate": changeDate,"action":"C"} });
       return false;
   }
}
cancelSalesOrder(){
    if(this.orderNum==null && this.orderNum==""){
        return false;
    }
    this.cancelPayload={};
    let object = "SO";
    let selectedSalesOrders:any = [];
    this.cancelPayload["bp_id"]=this.bpId;
    this.cancelPayload["object"]="SO";
    this.cancelPayload["object_details"]=[];
    this.cancelPayload["org_id"]=this.orgId;
    let slObject:any={}
    slObject['vbeln']=this.editOrderNum;
    this.cancelPayload["object_details"].push(slObject);
  swal( {
     title: "Do you want to cancel Sales Order/Sales Return?",
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
           let url:any=this.environment.getRequiredApi("cancel_sales_order")+"?";
            this.commonService.getData(url, "POST", this.cancelPayload, this.accessObjectId).subscribe(response=>{
           //console.log(response)
             if (response.status == 0) {
               let respID = response.id;
               this.extRet = response.ex_return;
               if(response.data.hasOwnProperty("ex_return")){
                  for(let index of response.data.ex_return){
                    if (index.type=="E") {
                            this.errorList = response.data.ex_return;
                            $('#loadingIcon').hide();
                            $("#black-overlay").hide();
                            $("#displayErrorsModal").modal("show");
                        return false;
                       }
                    }
               }
                 this.commonService.responseMessages("","Sales order/return successfully cancelled", "success"); 
                 const path:any="salesorder";
                 this.router.navigate([path]);
             }
               if (response.status == 1) {
                   $('#loadingIcon').hide();
                   $("#black-overlay").hide();
                    this.commonService.responseMessages("",response.message, "warning");
                   
               }

        });

  });  
}
editSalesOrder(){
    const path:any="salesorder/editsalesorder";
    this.router.navigate([path],{ queryParams: {"orderNum":this.editOrderNum,"dlvrNum":this.reqDlvrNum,"action":"U"} });
    this.displayFlag=false;
    $(document).ready(function(){
        console.log('calling');
    $("input[type=file]").change(function(){
          mergeItems=[];
          var file = this.files[0];
          var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
          var fileName = $( "#uploadExcel" ).val()
          fileName = fileName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
          $( "#loadingIcon" ).show();
          $( "#black-overlay" ).show();
          var errorFlag=false;
          $("#errorExcelTable").find('tbody').html('');
          var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/  
          if ($("#uploadExcel").val().toLowerCase().indexOf(".xlsx") > 0 || $("#uploadExcel").val().toLowerCase().indexOf(".xls") > 0){
              xlsxflag = true;  
              if ( typeof ( FileReader ) != "undefined" ) {
                  var reader = new FileReader();
                  reader.onload = function( e: any ) {
                      if ( e.target.result.length == 1 ) {
                          $.notify( {
                              title: '',
                              message: "No data available in the uploaded file"
                          }, {
                                  type: "warning"
                              } );
                          $( "#loadingIcon" ).hide();
                          $( "#black-overlay" ).hide();
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
                      sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/  
                          /*Convert the cell value to Json*/  
                          if (xlsxflag) {  
                              var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);  
                          }  
                          else {  
                              var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);  
                          }  
                          if (exceljson.length > 0 && cnt == 0) {  
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
                              var columns =columnSet;
                              for (var i = 0; i < exceljson.length; i++) {  
                                  //if(exceljson.length>mergeItems.length){
                                      var newObject={
                                              "mat_num":"",
                                              "qty":"",
                                              "uom":"",
                                              "desc":"",
                                              "price":0,
                                              "fix_sch":"",
                                              "sch_val":0,
                                              "add_dis":"",
                                              "dis_per_val":0,
                                              "dis_amt":0,
                                              "net_val":0,
                                              "sgst_rt":"",
                                              "sgst_val":0,
                                              "cgst_rt":"",
                                              "cgst_val":0,
                                              "igst_rt":"",
                                              "igst_val":0,
                                              "displayRow":true,
                                              "updateflag":"I"
                                          }
                                      var row=jQuery.extend({}, newObject);
                                      mergeItems.push(row);
                                  //}  
                                  for (var colIndex = 0; colIndex < columns.length; colIndex++) {  
                                      var cellValue = exceljson[i][columns[colIndex]];  
                                      if (cellValue == null)  
                                          cellValue = ""; 
                                      if(colIndex==0){
                                          mergeItems[i]['mat_num']= cellValue;
                                      }else{
                                          var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                                              if(format.test(cellValue)){
                                                    var row$ = $('<tr/>');
                                                    var rowNum=i+1;
                                                    var errorLine = "Special characters are not allowed check this line Item row number "+rowNum+" "+mergeItems[i]['mat_num']+" and quantity"+cellValue
                                                    row$.append($('<td/>').html(errorLine));
                                                    $("#errorExcelTable").find('tbody').append(row$);
                                                    errorFlag=true;     
                                           }
                                          //cellValue=parseFloat(cellValue);
                                          mergeItems[i]['qty']= cellValue;
                                      }
                                      
                                      
                                      
                                  }  
                              }  
                              cnt++;  
                          }  
                      });
                      if(errorFlag){
                               $("#displayExcelErrorsModal").modal('show');
                               return false;       
                            }
                      $("#mergeItemList").click();
                      $( "#uploadExcel" ).val("");
                      $( "#loadingIcon" ).hide();
                      $( "#black-overlay" ).hide();
                      return false;
                  }
                  if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/  
                      reader.readAsArrayBuffer($("#uploadExcel")[0].files[0]);  
                  }  
                  else {  
                      reader.readAsBinaryString($("#uploadExcel")[0].files[0]);  
                  } 
                  //reader.readAsText( $( "#stockFile" )[0].files[0] );
                  $( "#loadingIcon" ).hide();
                  $( "#black-overlay" ).hide();
              } else {
                  $( "#loadingIcon" ).hide();
                  $( "#black-overlay" ).hide();
                  alert( "This browser does not support HTML5." );
              }
          }else{
              $( "#loadingIcon" ).hide();
              $( "#black-overlay" ).hide();
              alert( "Please upload a valid CSV file." ); 
          }
        });
        }); 
}
salesOrderListPrint(){
    let url:any=this.environment.getRequiredApi("print_sale_order")+"?org_id="+this.orgId+"&bp_id="+this.bpId+"&im_v_vbeln="+this.editOrderNum+"&im_v_kunnr="+this.customerId+"&access_obj_id="+this.accessObjectId+"&access_token="+localStorage.getItem("token");
    window.open(url,'_blank');
}
createNewSO(){
    $("#createSalesModal").modal('show');
}
createSalesForm(id){
      let orderType:any=$("#orderTypes").val();
      if(this.customerNames.length==0 && orderType=="ZKS"){
        this.commonService.responseMessages("","Please select valid customer", "warning"); 
          return false;   
      }
      if($("#invoice-num").val()=="" && orderType=="ZRKS"){
        this.commonService.responseMessages("","Please select valid invoice number", "warning"); 
          return false;   
      }
      $("#"+id).modal("hide");
      const path:any="salesorder/createsalesorder";
      let custId:any=$("#modal-searchInput").val();
      if(orderType=='ZKS'){
        this.router.navigate([path],{ queryParams: {"orderType":orderType,"custId":custId,"action":"C",frompage:"SO"} });    
      }else{
          let invoiceNum:any=$("#invoice-num").val();
          const path:any="salesreturn/createsalesreturn";
         this.router.navigate([path],{ queryParams: {"orderType":orderType,"invoiceNum":invoiceNum,"action":"C",frompage:"SO"} });    
      }
  }
closeModalSales(id){
    $("#"+id).modal("hide");
    this.createSalesOrderForm.reset();
      this.createSalesOrderForm.controls['customer'].setValue("");
      this.createSalesOrderForm.controls['orderType'].setValue("");
      this.createSalesOrderForm.controls['invoiceNum'].setValue("");
}
expandChildRows(index,mainres,childres,j){
    if($("#plus-"+index+"-"+j).is(":visible")){
        $("#plus-"+index+"-"+j).hide();
        $("#minus-"+index+"-"+j).show();
        let groupLength:any=$("#group-"+mainres.groupId).attr('rowspan');
        let schemesLength:any=childres['schemes'].length;
        let rowspan:any=parseFloat(groupLength)+parseFloat(schemesLength)+1;
        $("#group-"+mainres.groupId).attr('rowspan',rowspan);
        $(".mat-"+mainres.groupId+"-"+j).show();
    }else{
        if($("#minus-"+index+"-"+j).is(":visible")){
            $("#plus-"+index+"-"+j).show();
            $("#minus-"+index+"-"+j).hide();
        }
        let groupLength:any=$("#group-"+mainres.groupId).attr('rowspan');
        let schemesLength:any=childres['schemes'].length;
        let rowspan:any=parseFloat(groupLength)-(parseFloat(schemesLength)+1);
        $("#group-"+mainres.groupId).attr('rowspan',rowspan);
        $(".mat-"+mainres.groupId+"-"+j).hide();         
    }
    
}
submitAddress(){
    $("#oneTimeCustomerModal").modal('hide');    
}
editCustAddrs(){
    $("#oneTimeCustomerModal").modal('show'); 
}
enableSchemesByUser(id){
  setTimeout(()=>{
    if($("#checkbox-schemes-all-input").is(":checked")){
        this.schemesFlag=true;
    }else{
        this.schemesFlag=false;    
    }  
  },100);
   
}
calculateTotalValues(){
      let totalPrice:any=0;
      let totalFixSchVal:any=0;
      let totalAddDisVal:any=0;
      let totalNet:any=0;
      let totalIgstTaxVal:any=0;
      let totalCgstTaxVal:any=0;
      let totalSgstTaxVal:any=0;
      let totalVal:any=0;
      let count:any=0;
      this.createSalesOrderItems.forEach(currentItem=>{
          if(currentItem.mat_num!='' && currentItem.qty!='' && currentItem.displayRow){
               totalFixSchVal=parseFloat(totalFixSchVal)+parseFloat(currentItem.sch_val);
               totalAddDisVal=parseFloat(totalAddDisVal)+parseFloat(currentItem.dis_amt);
               totalNet=parseFloat(totalNet)+parseFloat(currentItem.net_val);
               totalPrice=parseFloat(totalPrice)+parseFloat(currentItem.price);
               totalIgstTaxVal=parseFloat(totalIgstTaxVal)+parseFloat(currentItem.igst_val);
               totalCgstTaxVal=parseFloat(totalCgstTaxVal)+parseFloat(currentItem.cgst_val);
               totalSgstTaxVal=parseFloat(totalSgstTaxVal)+parseFloat(currentItem.sgst_val);
               totalVal=parseFloat(totalVal)+parseFloat(currentItem.grossValue);
          }
          if(this.createSalesOrderItems.length-1==count){
            this.totalPrice=totalPrice;
            this.totalIgstVal=totalIgstTaxVal;
            this.totalCgstVal=totalCgstTaxVal;
            this.totalSgstVal=totalSgstTaxVal;
            this.totalGrossVal=totalVal;
            this.totalNetval=totalNet;
            this.totalFixSheme=totalFixSchVal;
            this.totalAddDisAmt=totalAddDisVal;
          }
          count++;
      });
}
materialReverse(response){
    let countId:any=0;
    countId=$("#changeMaterial").val();
    if(countId!="" && countId!=null && countId!=undefined){
        this.populateFileds(response[countId],this.matnrDetails,'matNum',countId);  
    }
    $(".ajax-searchlist").hide();    
}
checkMaterail(response,contId){
    if(response!=undefined && response.mat_num!="" && response.mat_num!=undefined){
       if(!response['errorMat']){
         $("#sales-row-"+contId).attr('style','background:#d63e3e');
         this.commonService.responseMessages("", "Please select valid material number", "warning");
         this.saveBtn = true;
         return false;
     }
    }
 }
}