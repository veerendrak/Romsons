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
var mergeItems=[];
@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit {
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
    orderType:any;
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
    sdName:any;
    shName:any;
    sdNameId:any;
    shNameId:any;
    totalNetval:any;
    totalIgst:any;
    totalCgst:any;
    totalSgst:any;
    totalGrossVl:any;
    manageSalesPayloadLength:any;
    calcBtn:boolean=true;
    saveBtn:boolean=true;
    goodsFlag:boolean=true;
    goodsIssuedFlag:boolean=false
    deliveryFlag:boolean=true;
    deliveredFlag:boolean=false;
    uploadExcelFlag:boolean=false;
    disableBtns:boolean=false;
    disableship:boolean=false;
    canceldisableBtns:boolean=true;
    extRet:any;
    errorLogs:any;
    cancelPayload:any={};
    createSalesOrderForm:FormGroup;
    orderTypes:any;
    custId:any;
    invoiceNum:any;
    fromPage:any;
    shcustomerId:any;
    reasonList;any;
    shSubId:any;
    sdSubId:any;
    billDate:any;
    billBlockList:any;
    billCode:any;
    priceList:any;
    priceEnable:boolean=false;
    comGrpList:any;
    oneTimeCustForm:FormGroup;
    otFlag:boolean=false;
    countryList:any;
    states:any;
    salesAddressMessage:any;
    custGroup:any;
    schemesFlag:boolean=true;
    schemesList:any;
    enableSchemes:boolean=true;
    totalPrice:any;
    totalFixSheme:any;
    totalAddDisAmt:any;
    totalNetVal:any;
    totalIgstVal:any;
    totalCgstVal:any;
    totalSgstVal:any;
    totalGrossVal:any;
    BillingList:any;
    Otcaddress:any;
    stateCode:any;
    cities:any;
  constructor(private http: Http, private formBuilder: FormBuilder,
          private router: Router,private ref: ChangeDetectorRef,private app:AppComponent,private messagesService:MessagePropertiesService,
          private commonService:CommonService,private dateAdapter: DateAdapter<Date>,private activatedRoute:ActivatedRoute,
          private environment:EnvConfigurationService) {
      this.app.isActive=true;
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
      this.createSalesBlock=true;
      this.showOrderType =commonService.showOrderType;
      this.salesOrderMessage = messagesService.sales_order_details_msg;
      this.salesAddressMessage=messagesService.oneTimeCustomer;
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
      this.shName="";
      this.sdName="";
      this.shNameId="";
      this.sdNameId="";
      this.errorList=[];
      this.totalNetval=0;
      this.totalIgst=0;
      this.totalCgst=0;
      this.totalSgst=0;
      this.totalGrossVl=0;
      this.manageSalesPayloadLength=0;
      this.calcBtn=true;
      this.saveBtn=true;
      this.goodsFlag=true;
      this.goodsIssuedFlag=false;
      this.deliveryFlag=true;
      this.deliveredFlag=false;
      this.cancelPayload={};
      this.extRet=[];
      this.errorLogs=[];
      this.orderTypes=[];
      this.custId="";
      this.invoiceNum="";
      this.fromPage="";
      this.shcustomerId="";
      this.reasonList=[];
      this.shSubId="";
      this.sdSubId="";
      this.billDate="";
      this.billBlockList=[];
      this.billCode="08";
      this.priceList=[];
      this.priceEnable=false;
      this.comGrpList=[];
      this.payIncoTermsList={};
      this.payIncoTermsList['ex_incoterms']=[];
      this.otFlag=false;
      this.countryList=[];
      this.states=[];
      this.custGroup="";
      this.schemesFlag=true;
      this.schemesList=[];
      this.enableSchemes=true;
      this.totalPrice=0;
      this.totalFixSheme=0;
      this.totalAddDisAmt=0;
      this.totalNetVal=0;
      this.totalIgstVal=0;
      this.totalCgstVal=0;
      this.totalSgstVal=0;
      this.totalGrossVal=0;
      this.stateCode=30;
      this.Otcaddress={};
      this.Otcaddress.sold_to_name="";
      this.Otcaddress.sold_to_city="";
      this.Otcaddress.sold_post_code1="";
      this.BillingList={};
      this.cities=[];
  }

  ngOnInit() {
//      this.getCitiesList();
      this.createSalesOrderItems=[
                                  {
                                      "mat_num":"",
                                      "qty":"",
                                      "uom":"",
                                      "desc":"",
                                      "price":0,
                                      "fix_sch":0,
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
                                      "grossValue":0,
                                      "displayRow":true,
                                      "schFlag":"",
                                      "errorMat":true
                                  },
                                  {
                                      "mat_num":"",
                                      "qty":"",
                                      "uom":"",
                                      "desc":"",
                                      "price":0,
                                      "fix_sch":0,
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
                                      "grossValue":0,
                                      "displayRow":true,
                                      "schFlag":"",
                                      "errorMat":true
                                  },
                                  {
                                      "mat_num":"",
                                      "qty":"",
                                      "uom":"",
                                      "desc":"",
                                      "price":0,
                                      "fix_sch":0,
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
                                      "grossValue":0,
                                      "displayRow":true,
                                      "schFlag":"",
                                      "errorMat":true
                                  },
                                  {
                                      "mat_num":"",
                                      "qty":"",
                                      "uom":"",
                                      "desc":"",
                                      "price":0,
                                      "fix_sch":0,
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
                                      "grossValue":0,
                                      "displayRow":true,
                                      "schFlag":"",
                                      "errorMat":true
                                  },
                                  {
                                      "mat_num":"",
                                      "qty":"",
                                      "uom":"",
                                      "desc":"",
                                      "price":0,
                                      "fix_sch":0,
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
                                      "grossValue":0,
                                      "displayRow":true,
                                      "schFlag":"",
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
      $(function() {
          $(document).on('click', function (e) {
            if (!$(e.target).hasClass('ajax-list')) {
                  $(".ajax-searchlist").hide();
              }
      }); 
      
       $( "#outbound-delivery-table" ).scroll(function() {
          $(".ajax-searchlist").hide();
        });
        /*$(document).on('keyup',function(evt) {
            if (evt.keyCode == 27) {
               $(".ajax-searchlist").hide();
            }
        });*/   
      });
      $(()=>{
          $(document).on("blur",".materialNumSO",function(e) {
              console.log('calling load');
              var id=$(this).attr('id');
              id=id.split("-")[1];
              $("#changeMaterial").val(id);
              setTimeout(()=>{$("#material-input").click()},900); 
          });
          $(document).on("input", ".numbersOnly", function() {
              this.value = this.value.replace(/[^\d]/g,'');
          });
          $(document).on("input", ".numbersOnly1", function() {
              this.value = this.value.replace(/[^\d\.]/g,'');
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
          
          $('.reqDate').datetimepicker({
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
              //minDate:new Date(),
              format: 'DD/MM/YYYY',
              defaultDate:new Date(),
          }); 
          $(document).ready(function(){
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
                                                  "fix_sch":0,
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
                                                  "grossValue":0,
                                                  "displayRow":true,
                                                  "schFlag":"",
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
                          $( "#uploadExcel" ).val("")
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
      });
      this.activatedRoute.queryParams.subscribe(params => {
          console.log(this.router.url);
          if(params['action']=="C" && this.router.url.includes('salesorder')){
              if(!params.hasOwnProperty('dlvType')){
                  if(params["dlvType"]!='ZQKS'){
                      this.title="Sales Order / New";
                  }
              }else{
                  this.title="Quick Delivery / New";
                  this.navigatePath("quickDelivery");
              }
              $("#gs-GSTR1").attr("style","background:#036963;color:#fff");
              this.orderType=params["orderType"];
              this.customerId=params["custId"];
              this.fromPage=params["frompage"];
              $("#downloadLink").show();
              this.payload["cust_id"]=this.customerId;
              this.getCustomerDetails();
              this.getPayIncoTerms();
          }
          if(params['action']=="C" && this.router.url.includes('salesreturn')){
              this.title="Sales Returns / New";
              $("#gs-GSTR1").attr("style","background:#036963;color:#fff");
              this.orderType=params["orderType"];
              this.invoiceNum=params["invoiceNum"];
              this.fromPage=params["frompage"];
              this.getBillingdetails();
          }
          if(params['action']=="C" && this.router.url.includes('obd')){
              this.title="Delivery / New";
              $("#gs-GSTR1").hide();
              $("#icon-GSTR1").show();
              this.createSalesFlag=false;
              this.createdSales=true;
              $("#downloadLink").hide();
              $("#gs-GSTR2").attr("style","background:#036963;color:#fff");
              this.orderNum=params['orderNum'];
              this.fromPage=params["frompage"];
              this.navigatePath("outbounddelivery");
              return false;
          }
          
           if(params['action']=="C" && this.router.url.includes("billing")){
              this.title = "Billing / Create";
               $("#downloadLink").hide();
              this.fromPage=params["frompage"];
              this.navigatePath("billing");
          }
          
      });
      
      if($('body').hasClass('cat__menu-left--visible')){
          $(".ell-spa").removeAttr("style");
      }else{
          $(".ell-spa").attr("style","width:340px");
      }
      setTimeout(()=>{
          var width=$("#mainContent").css("width");
          $(".outbound-footer").css("width",width);
      },100);
      
      /*$(function(){
          $('#shiptoparty').change(function(){
              var value=$('#addressList option[value="'+$("#shiptoparty").val()+'"]').text().trim();
              $("#shiptoCustomerId").val(value);
              $("#addressBtn").click();
          });
          
      });*/
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
          $("#gs-GSTR1").hide();
          $("#gs-GSTR2").hide();
          $("#icon-GSTR1").show();
          $("#gs-GSTR2").hide();
          $("#icon-GSTR2").show();
          $("#gs-GSTR1A").hide();
          $("#icon-GSTR1A").show();
          $("#gs-GSTR2A").attr("style","background:#036963;color:#fff");
      }
      if(path=='outbounddelivery'){
          if(this.orderNum==null || this.orderNum==""){
              this.commonService.responseMessages("", "Please create sales order", "warning");
              return false;
          }
          this.createSalesBlock=false;
          this.outboundDeliberyBlock=true;
          this.postGoodsBlock=false;
          this.billingBlock=false;
          this.formResetFlag = true;
          this.createdSales=true;
          this.createSalesFlag=false;
          this.goodsFlag=true;
          this.goodsIssuedFlag=false;
          this.deliveryFlag=true;
          this.deliveredFlag=false;
          $("#gs-GSTR2").attr("style","background:#036963;color:#fff");
          $("#gs-GSTR1A").removeAttr("style");
      }
      if(path=='quickDelivery'){
          this.createSalesBlock=true;
          this.outboundDeliberyBlock=false;
          this.postGoodsBlock=false;
          this.billingBlock=false;
          this.formResetFlag = true;
          this.createdSales=true;
          this.createSalesFlag=false;
          this.goodsFlag=true;
          this.goodsIssuedFlag=false;
          this.deliveryFlag=true;
          this.deliveredFlag=false;
          $("#gs-GSTR2").removeAttr("style");
          this.goodsFlag=true;
          this.goodsIssuedFlag=false;
          this.deliveryFlag=true;
          this.deliveredFlag=false;
          $("#gs-GSTR2").attr("style","background:#036963;color:#fff");
          $("#gs-GSTR1A").removeAttr("style");
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
          this.commonService.getData(url, "POSt", "", localStorage.getItem('Outbound Delivery')).subscribe(response=>{
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
                 this.goodsFlag=false;
                 this.goodsIssuedFlag=true;
                 $("#goods-help").hide();
                 $("#gs-GSTR1A").removeAttr("style");
                 $("#gs-GSTR1A").hide();
                 $("#icon-GSTR1A").show();
                 $("#billing-help").show();
                 $('#loadingIcon').hide();
                 $("#black-overlay").hide();
                 this.commonService.responseMessages("", "Post goods issue created successfully", "success");
                 
             }else{
                 this.goodsFlag=true;
                 this.goodsIssuedFlag=false;
                 $("#gs-GSTR1A").show();
                 $("#icon-GSTR1A").hide();
                 $('#loadingIcon').hide();
                 $("#black-overlay").hide();
                 this.commonService.responseMessages("", response.message, "success");
             } 
          }); 
          }
      }
  }
  getCustomerDetails(){
      $('#loadingIcon').show();
      $("#black-overlay").show();
      let url:any=this.environment.getRequiredApi("get_customer_details")+"?";
      this.commonService.getData(url, "POST", this.payload, this.accessObjectId).subscribe(response=>{
          if(response.status==0){
             this.customerList=response["data"];
             this.customerListLength=Object.keys(this.customerList).length;
             this.customerShiptoParty=response["data"];
             this.customerShiptoPartyLenth=Object.keys(this.customerShiptoParty).length;
             if(this.customerList.hasOwnProperty('ex_address')){
             if(Object.keys(this.customerList['ex_address']).length>0){
                 if(this.orderType=='ZKS'){
                     this.sdName=this.customerList['ex_address'].cust_name;
                     this.sdNameId=this.customerList['ex_address'].cust_id;
                     if(this.sdNameId!=undefined){
                        this.sdSubId=this.sdNameId.replace(/\b(0(?!\b))+/g, "");
                     }
                     this.shName=this.customerList['ex_address'].cust_name;
                     this.shNameId=this.customerList['ex_address'].cust_id;
                     if(this.shNameId!=undefined){
                        this.shSubId=this.shNameId.replace(/\b(0(?!\b))+/g, "");
                      }
                   }
                 if(this.customerList['ex_address'].hasOwnProperty('one_time_cust')){
                    this.custGroup=this.customerList['ex_address'].cust_grp;
                 if(this.customerList['ex_address'].one_time_cust=='X'){
                     this.custId='OT';
                     this.otFlag=true;
                     this.disableship=true;
                     this.schemesFlag=false;
                     this.enableSchemes=false;
                     this.stateCode="";
                     this.customerShiptoParty['ex_compliance']={};
                        this.customerShiptoParty['ex_address']={};
                        this.customerList['ex_compliance'].gstin="";
                        this.customerList['ex_compliance'].pan_no="";
                        this.customerList['ex_compliance'].lst_no="";
                        this.customerList['ex_address'].addr_number="";
                        this.customerList['ex_address'].street="";
                        this.customerList['ex_address'].city="";
                        this.customerList['ex_address'].post_code="";
                        this.customerList['ex_address'].telefone="";
                        this.customerList['ex_address'].email="";
                        this.customerList['ex_address'].state="";
                        this.customerList['ex_address'].country="";
                        this.customerListLength=Object.keys(this.customerList).length;
                        
                        this.customerShiptoParty['ex_compliance'].gstin="";
                        this.customerShiptoParty['ex_compliance'].pan_no="";
                        this.customerShiptoParty['ex_compliance'].lst_no="";
                        this.customerShiptoParty['ex_address'].addr_number="";
                        this.customerShiptoParty['ex_address'].street="";
                        this.customerShiptoParty['ex_address'].city="";
                        this.customerShiptoParty['ex_address'].post_code="";
                        this.customerShiptoParty['ex_address'].telefone="";
                        this.customerShiptoParty['ex_address'].email="";
                        this.customerShiptoParty['ex_address'].state="";
                        this.customerShiptoParty['ex_address'].country="";
                        if(this.orderType=='ZKS'){
                            $("#oneTimeCustomerModal").modal('show');
                         }else{
                            this.getAddress();    
                        }
                 }
                 }
                 
             }
            }
             if(this.customerList['ex_incoterms'].length>0){
                 this.incoTermVal=this.customerList['ex_incoterms'].inco_term;
                 this.payTermVal=this.customerList['ex_incoterms'].pay_term;
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
                                 let index:any=0;
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
                                             let index:any=0;
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
                                       let index:any=0;
                                       matObject1.schemes.forEach(currentItem=>{
                                           currentItem.groupMatId=ls.comm_grp
                                       });
                                       object1.mtrlGroup.push(matObject1);
                                       this.comGrpList.push(object1);
                                }   
                             }  
                     } 
                  }
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
          if(this.orderType=='ZKS'){
              response["cust_id"]=$("#shiptoCustomerId").val();
          }else{
              response["cust_id"]=this.shcustomerId;
          }
          
          let url:any=this.environment.getRequiredApi("get_customer_details")+"?";
          this.commonService.getData(url, "POST", response, this.accessObjectId).subscribe(response=>{
              if(response.status==0){
                 this.customerShiptoParty=response["data"];
                 if(Object.keys(this.customerShiptoParty['ex_address']).length>0){
                     this.shName=this.customerShiptoParty['ex_address'].cust_name;
                     this.shNameId=this.customerShiptoParty['ex_address'].cust_id;
                     if(this.shNameId!=undefined){
                         this.shSubId=this.shNameId.replace(/\b(0(?!\b))+/g, "");
                     }
                 }
                 if(this.orderType=='ZRKS'){
                    this.getAddress();    
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
AddMoreLinesOfItems(){
    for(let i:any=0; i<5; i++){
    let newItem:any={
                    "mat_num":"",
                    "qty":"",
                    "uom":"",
                    "desc":"",
                    "price":0,
                    "fix_sch":0,
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
                    "grossValue":0,
                    "displayRow":true,
                    "schFlag":"",
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
                    this.checkedObjects.push(count);
                }
                count++;
            });
        }else{
            this.commonService.selectAllCheckBoxes(checkAll,tableId);
            this.checkedObjects=[];
        }
        
        
    },300);
    
}
getReportList(event,tableId,i){
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
 this.enableButtons();
 setTimeout(()=>{this.calculateTotalValues()},300);
  }
findMaterialDetails(matnr,response,spinnerId,i,ajaxBlock,event){
    let term:any=matnr.value;
    //if(this.matnrDetails.length==0){
         if(term.length>2){
              term=term.substring(0,2);  
         }   
   // }
         response.changeFlag=true;
    if(term.length==2 && event.keyCode!=38 && event.keyCode!=40 && event.keyCode!=13){
        $("#"+spinnerId+"-"+i).show();
        let url:any=this.environment.getRequiredApi("find_matnr_num")+"?org_id="+this.orgId+"&bp_id="+this.bpId+"&material="+matnr.value+"&";
        this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response=>{
            if(response.status==0){
              this.matnrDetails=[];
              $("#"+spinnerId+"-"+i).hide();
              this.matnrDetails=response["data"].ex_mat_list; 
              $("#"+ajaxBlock+"-"+i).show();
              setTimeout(()=>{
               $("#"+ajaxBlock+"-"+i).find('ul').find('li:first').addClass('active');
               $("#"+ajaxBlock+"-"+i).find('ul').find('li:first').focus();
            },100);
            }else{
                $("#"+spinnerId+"-"+i).hide();
                $("#"+ajaxBlock+"-"+i).hide();
            }
        });
    }else{
        if(event.keyCode!=13 && event.keyCode!=38 && event.keyCode!=40){
           var searchText=matnr.value;
            searchText=searchText.toUpperCase();
            $(".ajax-list").removeClass('active');
           $("#"+ajaxBlock+"-"+i).find('ul > li').each(function(){
                var currentLiText = $(this).text();
                currentLiText=currentLiText.toUpperCase();
                var showCurrentLi = currentLiText.indexOf(searchText) !== -1;
                $(this).toggle(showCurrentLi);
            });
            $("#"+ajaxBlock+"-"+i).find('ul').find('li:visible').first().addClass('active');
            $("#"+ajaxBlock+"-"+i).find('ul').find('li:visible').first().focus();
           }     
    }
  if(event.keyCode==38 || event.keyCode==40 || event.keyCode==13){
        $("#"+ajaxBlock+"-"+i).find('ul > li').each(function(){
              if(event.keyCode==40){
                  if($(this).hasClass('active')){
                    console.log($(this).attr('class'));
                    if($(this).next().is(':visible')){
                        $(this).removeClass('active');
                        $(this).next().addClass('active');
                        $(this).next().focus();
                        $("#"+ajaxBlock+"-"+i).find("ul").scrollTop($(this).position().top);
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
                        $("#"+ajaxBlock+"-"+i).find("ul").scrollTop($(this).position().top);
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
    /*if(this.errorList.length>0){
        if(this.fromPage=="SO"){
            const path:any="salesorder";   
            this.router.navigate([path]);
        }    
    }*/
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
    let mergeArray:any=[];
    for(let index of this.createSalesOrderItems){
        if(index.mat_num!="" && index.qty!=""){
            mergeArray.push(index);
        }
    }
    if(mergeArray.length>0){
        this.uploadExcelFlag=false;  
    }else{
        this.uploadExcelFlag=true;
    }
    
    this.createSalesOrderItems=mergeArray.concat(mergeItems);
    setTimeout(()=>{this.enableButtons()},200);
}
populateFileds(response,matResponse,matType,contId){
    $(".ajax-searchlist").hide();
    if(matResponse!=undefined){
    for(let list of matResponse){ 
        if(matType=='matNum'){
            if(response['mat_num'] != "" && response['mat_num'] !=undefined) {
                if(list['mat_num']==response['mat_num'].toUpperCase()){
                    $("#changeMaterial").val('');
                    $("#sales-row-"+contId).removeAttr('style');
                    this.saveBtn = false;
                    response['mat_num']=list['mat_num'];
                    response['uom']=list['uom'];
                    response['desc']=list['mat_name'];
                    //response['qty']="";
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
                    response['grossValue']=0;
                    response['errorMat']=true;
                    response.changeFlag=false;
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
                //response['qty']="";
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
                response['grossValue']=0;
                return false;
            }
            }
        }
    }
  }else{
      if(response!=undefined){
          response['errorMat']=false;
      }
      
  }
    $("#changeMaterial").val("");
    this.checkMaterail(response,contId);
}
calculatePrice(typeId){
    this.materialReverse(this.createSalesOrderItems);
setTimeout(()=>{
    let obectList:any=[];
    for(let lst of this.createSalesOrderItems){
          if(lst.qty!=0 && lst.qty!="0" && lst.qty!="" && (lst.mat_num!="" && lst.mat_num!=undefined)){
              obectList.push(lst);
          }else{
            if(lst.qty==0 && lst.qty=="0" && lst.qty=="" && (lst.mat_num!="" && lst.mat_num!=undefined)){
                this.commonService.responseMessages("", "Quantity should not be zero/empty", "warning"); 
                return false;               
              }
          }  
    }
    this.createSalesOrderItems=obectList;
    if(typeId=='save' && this.orderType!='ZKS'){
        this.saveSalesOrderItems();    
        return false;
    }
    $('#loadingIcon').show();
    $("#black-overlay").show();
    this.manageSalesPayload={};
    this.manageSalesPayload['bp_id']=this.bpId;
    this.manageSalesPayload['org_id']=this.orgId;
    this.manageSalesPayload['testrun']="X";
    this.manageSalesPayload['im_action']="C";
    this.manageSalesPayload['im_sp_cust']=this.customerId;
    this.manageSalesPayload['im_sh_cust']=$("#shiptoCustomerId").val();
    this.manageSalesPayload['sales_header_in']={};
    this.manageSalesPayload['sales_header_in']['doc_type']=this.orderType;
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
    this.manageSalesPayload['sales_conditions_in']=[];
    let objectArray:any=[];
    for(let item of this.createSalesOrderItems){
        if(item.displayRow){
            objectArray.push(item);
        }
    }
    this.createSalesOrderItems=objectArray;
    let itemCount:any=1;
    for(let item of this.createSalesOrderItems){
        let object:any={};
        let object1:any={};
        if(item.mat_num!="" && item.qty!="" && item.qty!="0" && item.qty!=0){
            if(item.dis_per_val!=0 && item.dis_per_val!=null && item.add_dis!="" && item.add_dis!=null){
                if(item.add_dis=='ZPER'){
                    object['cond_value']=-(item.dis_per_val);
                }else{
                    object['cond_value']=item.dis_per_val/10;
                }
                object['cond_type']=item.add_dis;
                object['itm_number']=itemCount;
                object['cond_st_no']=item.cond_st_no;
                this.manageSalesPayload['sales_conditions_in'].push(object);
            }
                object1['cond_type']='ZPRO';
                object1['cond_value']=item.price;
                object1['itm_number']=itemCount;
                object1['cond_st_no']=10;
                object1['cond_p_unt']=1;
                object1['curr_iso']="INR";
                object1['cond_unit']=item.uom;
                object1['currency']='INR';
               if(!this.priceEnable){
                   this.manageSalesPayload['sales_conditions_in'].push(object1);
               }
                itemCount++;
        }
    }
    let itemCount1:any=1;
    for(let item of this.createSalesOrderItems){
        if(item.displayRow){
            if(item.mat_num!="" && item.qty!="" && item.qty!="0" && item.qty!=0){
                if(item.qty==""){
                    item.qty=0;
                }
                let object:any={};
            object['itm_number']=itemCount1;
            object['material']=item.mat_num;
            object['target_qty']=item.qty;
            object['target_qu']=item.uom;
            object['T_UNIT_ISO']=item.uom;
            this.manageSalesPayload['sales_items_in'].push(object); 
            itemCount1++;
        }
        }
    }
    let url:any=this.environment.getRequiredApi("sales_order_manage")+"?";
    this.commonService.getData(url, "POST", this.manageSalesPayload, this.accessObjectId).subscribe(response=>{
       if(response.status==0){
           this.calcResultsList=response["data"];
           let calculatedResults:any=response["data"];
           let count:any=0;
           let itemNumber:any=null;
           if(calculatedResults.hasOwnProperty("ex_return")){
           if(calculatedResults['ex_return'].length>0){
               this.errorList=calculatedResults['ex_return'];
               for(let elist of calculatedResults['ex_return']){
                   if(elist.type=='E'){
                       this.errorFlag=true;
                       this.saveBtn=true;
                       $('#loadingIcon').hide();
                       $("#black-overlay").hide();
                       $("#displayErrorsModal").modal("show");
                       return false;
                   }
                   
               }
           }
          }
        if(calculatedResults.hasOwnProperty("conditions_ex")){
       if(calculatedResults['conditions_ex'].length>0){
           this.saveBtn=false;
           this.uploadExcelFlag=false;
           let netValAmt:any=0;
           let msgCount:any=0;
           for(let list of calculatedResults['conditions_ex']){
               if(itemNumber==null){ 
                   itemNumber=list.itm_number;
                   if((this.createSalesOrderItems[count].mat_num=="" && this.createSalesOrderItems[count].qty=="") || !this.createSalesOrderItems[count].displayRow || this.createSalesOrderItems[count].mat_num=="" || this.createSalesOrderItems[count].qty=="0" || this.createSalesOrderItems[count].qty==0){
                        count++;
                    }
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
                       this.createSalesOrderItems[count]['itm_number']=list.itm_number;
                       if(list.cond_type=='ZSPE'){
                           let fixScheme:any=Math.abs(list.cond_value);
                           this.createSalesOrderItems[count].orgfix_sch=fixScheme;
                           let schVal:any=(netValAmt)*this.createSalesOrderItems[count].orgfix_sch/100;
                           this.createSalesOrderItems[count].orgsch_val=schVal;
                           if(this.schemesFlag){
                              /*if(this.createSalesOrderItems[count].schFlag=="" || this.createSalesOrderItems[count].schFlag){
                                  this.createSalesOrderItems[count]['schFlag']=true;  
                                  this.createSalesOrderItems[count].fix_sch=fixScheme;
                               }else{
                                  this.createSalesOrderItems[count].fix_sch=0;
                              }*/
                               this.createSalesOrderItems[count].fix_sch=fixScheme;
                               let schVal:any=(netValAmt)*this.createSalesOrderItems[count].fix_sch/100;
                               this.createSalesOrderItems[count].sch_val=schVal;
                           }else{
                               this.createSalesOrderItems[count].fix_sch=0;
                               this.createSalesOrderItems[count].sch_val=0;
                           }
                           
                           netValAmt=(netValAmt)-this.createSalesOrderItems[count].sch_val;
                           this.createSalesOrderItems[count].schTypeSymbol="per";
                       }
                       if(list.cond_type=='ZSVL'){
                           let fixScheme:any=Math.abs(list.cond_value);
                           this.createSalesOrderItems[count].orgfix_sch=fixScheme;
                           this.createSalesOrderItems[count].orgsch_val=this.createSalesOrderItems[count].orgfix_sch;
                           if(this.schemesFlag){
                               /*if(this.createSalesOrderItems[count].schFlag=="" || this.createSalesOrderItems[count].schFlag){
                                   this.createSalesOrderItems[count]['schFlag']=true; 
                                   this.createSalesOrderItems[count].fix_sch=fixScheme;
                               }else{
                                  this.createSalesOrderItems[count].fix_sch=0;
                              }*/
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
                               this.createSalesOrderItems[count].dis_amt=this.createSalesOrderItems[count].dis_per_val;
                               netValAmt=(netValAmt)-this.createSalesOrderItems[count].dis_amt;
                       }
                       this.createSalesOrderItems[count].net_val=netValAmt;
                       if(netValAmt<0){
                           $("#amt-"+count).attr('style','border:1px solid red');
                           if(msgCount==0){
                               this.commonService.responseMessages("", "Discount value must not be greater than net value", "warning");
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
                       count++;
                       if((this.createSalesOrderItems[count].mat_num=="" && this.createSalesOrderItems[count].qty=="") || !this.createSalesOrderItems[count].displayRow  || this.createSalesOrderItems[count].mat_num=="" || this.createSalesOrderItems[count].mat_num==0 || this.createSalesOrderItems[count].mat_num=="0"){
                            count++;
                        }
                       itemNumber=list.itm_number;
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
        setTimeout(()=>{this.calculateTotalValues()},300);
        this.checkedObjects=[];
        $("#outbound-delivery-table").find("tbody").find(".mat-checkbox-input").each(function(i){
            let id:any=$(this).attr('id');
           if(!id.includes('scheme-checkbox')){
            if($("#"+id).is(":checked")){
                $("#"+id).click();
            }
           }
        });  
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
    $('#loadingIcon').show();
    $("#black-overlay").show();
  setTimeout(()=>{
        let reqDate:any=null;
    let purDate:any=null;
    this.manageSalesPayload={};
    if(this.orderType=='ZKS' && this.custId=='OT'){
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
            $('#loadingIcon').hide();
            $("#black-overlay").hide();
            return false;    
        }    
    }
    if(this.orderType=='ZRKS' && this.custId=='OT'){
        this.manageSalesPayload['partneraddresses']=[]; 
        let onetimeFormObject:any={};
        onetimeFormObject['name']=this.shName;
        onetimeFormObject['name_2']="";
        onetimeFormObject['house_no']=this.Otcaddress.house_num;
        onetimeFormObject['country']='IN'//this.oneTimeCustForm.value['country'];
        onetimeFormObject['city']=this.Otcaddress.city;
        onetimeFormObject['e_mail']=this.Otcaddress.email;
        onetimeFormObject['postl_cod1']=this.Otcaddress.sold_post_code1;
        onetimeFormObject['tel1_numbr']="";
        onetimeFormObject['comm_type']='INT';
        onetimeFormObject['adr_notes']='';
        onetimeFormObject['addr_no']=1;
        onetimeFormObject['district']=this.Otcaddress.drug_licence;
        onetimeFormObject['street_lng']=this.Otcaddress.street;
        onetimeFormObject['region']=this.Otcaddress.region;
        onetimeFormObject['home_city']=this.Otcaddress.gstin_number;
        onetimeFormObject['c_o_name']=this.Otcaddress.pan_no;
        onetimeFormObject['langu']="EN";
        onetimeFormObject['str_suppl1']="";
        onetimeFormObject['fax_number']="";
        this.manageSalesPayload['partneraddresses'].push(onetimeFormObject);
    }
    if($("#reqDelDate").val()!=undefined && $("#reqDelDate").val()!=""){
        reqDate=$("#reqDelDate").val();
        reqDate=reqDate.split('/')[2]+""+reqDate.split('/')[1]+""+reqDate.split('/')[0];  
    }
    if($("#purchDate").val()!=null && $("#purchDate").val()!=""){
        purDate=$("#purchDate").val();
        purDate=purDate.split('/')[2]+""+purDate.split('/')[1]+""+purDate.split('/')[0]; 
    }
    this.manageSalesPayload['bp_id']=this.bpId;
    this.manageSalesPayload['org_id']=this.orgId;
    this.manageSalesPayload['testrun']="";
    this.manageSalesPayload['im_action']="C";
    if(this.schemesFlag){
        this.manageSalesPayload['im_scheme_flag']="X";   
    }else{
        this.manageSalesPayload['im_scheme_flag']=" ";   
    }
    this.manageSalesPayload['im_sp_cust']=this.customerId;
    this.manageSalesPayload['im_sh_cust']=$("#shiptoCustomerId").val();
    this.manageSalesPayload['sales_header_in']={};
    this.manageSalesPayload['sales_header_in']['doc_type']=this.orderType;
    this.manageSalesPayload['sales_header_in']['req_date_h']=reqDate;
    this.manageSalesPayload['sales_header_in']['purch_no_c']=$("#purchNoc").val();
    this.manageSalesPayload['sales_header_in']['purch_date']=purDate;
    this.manageSalesPayload['sales_header_in']['cust_group']=this.custGroup;    
    this.manageSalesPayload['sales_header_in']['incoterms1']=$("#incoTerms").val();
    this.manageSalesPayload['sales_header_in']['incoterms2']=$("#incoTerms option:selected").text();
    this.manageSalesPayload['sales_header_in']['pmnttrms']=$("#payTerms").val();
    if(this.orderType=='ZRKS'){
        let billDate:any=this.billDate.split("-");
        billDate=billDate[0]+""+billDate[1]+billDate[2];
        //this.manageSalesPayload['sales_header_in']['bill_block']=$("#billBlockTypes").val();;
        this.manageSalesPayload['sales_header_in']['ord_reason']=$("#reasonTypes").val();
        this.manageSalesPayload['sales_header_in']['bill_date']=billDate;
        this.manageSalesPayload['sales_header_in']['ref_doc']=this.invoiceNum;
        this.manageSalesPayload['sales_header_in']['refdoc_cat']='M';
    }
    this.manageSalesPayload['sales_text']=[];
    let object:any={};
    object['text_line']=$("#header_text").val();
    object['text_id']="0002";
    object['langu']='E';
    this.manageSalesPayload['sales_text'].push(object);
   if(this.orderType=='ZKS'){
        this.manageSalesPayload['sales_conditions_in']=[];
        let condCount:any=1;
        for(let item of this.createSalesOrderItems){
            let object:any={};
            let object1:any={};
            let object2:any={};
        if(item.mat_num!="" && item.qty!=""){
            if(item.dis_per_val!=0 && item.dis_per_val!=null && item.add_dis!="" && item.add_dis!=null){
                if(item.add_dis=='ZPER'){
                    object['cond_value']=-(item.dis_per_val);
                }else{
                    object['cond_value']=item.dis_per_val/10;
                }
                object['cond_type']=item.add_dis;
                object['itm_number']=condCount;
                object['cond_st_no']=10;
                this.manageSalesPayload['sales_conditions_in'].push(object);
                
            }
                object1['cond_type']='ZPRO';
                object1['cond_value']=item.price;
                object1['itm_number']=condCount;
                object1['cond_st_no']=10;
                object1['cond_p_unt']=1;
                object1['curr_iso']="INR";
                object1['cond_unit']=item.uom;
                object1['currency']='INR';
                if(!this.priceEnable){
                    this.manageSalesPayload['sales_conditions_in'].push(object1);
                }
                if(item.schTypeSymbol=='per'){
                    object2['cond_type']='ZSPE';
                    object2['cond_p_unt']=0;
                    object2['itm_number']=condCount;
                    object2['cond_st_no']=10;
                }
                if(item.schTypeSymbol=='val'){
                    object2['cond_type']='ZSVL';
                    object2['curr_iso']="INR";
                    object2['cond_unit']=item.uom;
                    object2['currency']='INR';
                    object2['cond_p_unt']=1;
                    object2['itm_number']=condCount;
                    object2['cond_st_no']=10;
                    
                } 
                if(this.schemesFlag){
                   object2['cond_value']=item.orgfix_sch; 
                   //this.manageSalesPayload['sales_conditions_in'].push(object2);
                }else{
                    object2['cond_value']=0;
                    object2['curr_iso']="INR";
                    this.manageSalesPayload['sales_conditions_in'].push(object2);    
                }
                condCount++;
          }
        }
       this.manageSalesPayload['sales_items_in']=[];
    let itemCount:any=1;
    for(let item of this.createSalesOrderItems){
        if(item.displayRow){
            if(item.mat_num!="" && item.qty!=""){
                if(item.qty==""){
                    item.qty=0;
                }
                let object:any={};
            object['itm_number']=itemCount;
            object['material']=item.mat_num;
            object['target_qty']=item.qty;
            object['target_qu']=item.uom;
            object['T_UNIT_ISO']=item.uom;
            this.manageSalesPayload['sales_items_in'].push(object); 
            itemCount++;
        }
        }
    }
    }
    if(this.orderType=='ZRKS'){
        this.manageSalesPayload['sales_items_in']=[];
        let itemCount:any=1;
        for(let item of this.createSalesOrderItems){
        if(item.displayRow){
            if(item.mat_num!="" && item.qty!=""){
                if(item.qty==""){
                    item.qty=0;
                }
                let object:any={};
            object['itm_number']=item.itemNum;
            object['material']=item.mat_num;
            object['target_qty']=item.qty;
            object['target_qu']=item.uom;
            object['T_UNIT_ISO']=item.uom;
            object['ref_doc']=this.invoiceNum;
            object['ref_doc_it']=item.itemNum;
            this.manageSalesPayload['sales_items_in'].push(object); 
        }
        }
        itemCount++;
    }    
      }
    let url:any=this.environment.getRequiredApi("sales_order_manage")+"?";
    this.commonService.getData(url, "POST", this.manageSalesPayload, this.accessObjectId).subscribe(response=>{
        if(response.status==0){
            $('#loadingIcon').hide();
            $("#black-overlay").hide();
            this.orderNum=response["data"]['salesdocument_ex'];
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
            if(this.orderNum!=""){
                this.title="Sales Order / Display ("+this.orderNum+")";
                $("#gs-GSTR1").removeAttr("style");
                this.manageSalesPayload={};
                if(this.orderType=='ZKS'){
                  this.commonService.responseMessages("", "Sales order '"+this.orderNum+" 'created Succesfully", "success");  
                }else{
                    if(this.orderType=='ZRKS'){
                        this.commonService.responseMessages("", "Sales return '"+this.orderNum+" 'created Succesfully", "success");
                    }    
                }
                
                this.disableBtns=true;
                this.disableship=true;
                this.calcBtn=true;
                this.saveBtn=true;
                this.canceldisableBtns=false;
                this.commonService.saleType='Display';
                const path:any="salesorder/editsalesorder";
                this.router.navigate([path],{ queryParams: {"orderNum":this.orderNum,"action":"DIS",frompage:"SO"} });
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
 },500);    
}
redirectSalesOrder(){
    const path:any='salesorder';
    this.router.navigate([path]);
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
    }
    if(items.qty!=0 && items.price!=0){
        items.qty=parseFloat(items.qty);
        items.price=""+parseFloat(items.price); 
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
        let disAmt:any=0;
        let netVal:any=price-schVal;
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
    /*if(items.price!=0){
        this.enableButtons();
    }else{
        this.calcBtn=false;
        this.saveBtn=true;
    }*/
    setTimeout(()=>{
        this.enableButtons();
        this.calculateTotalValues()},300);
    
}
enableButtons(){
    let countId:any=0;
    let errorFlag:boolean=false;
    for(let lst of this.createSalesOrderItems){
         if((lst.qty=="0" || lst.qty=="" || lst.qty==0) && (lst.mat_num!="" && lst.mat_num!=undefined) && lst.displayRow){
            $("#sales-row-"+countId).attr('style','background:#d63e3e'); 
             errorFlag=true;
              
         } 
        countId++;  
    }
    if(errorFlag){
        this.calcBtn=true;
        this.saveBtn=true;
        return false;    
    }else{
        this.calcBtn=false;
        this.saveBtn=false;    
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
                 if(this.uploadExcelFlag){
                     if(item.qty==0 || item.qty=="0"){
                         this.calcBtn=true;
                         //this.saveBtn=true;
                         return false;
                     }else{
                        if(item.net_val==0){
                            this.calcBtn=false;
                            this.saveBtn = true;
                            //return false;    
                        }    
                     }
                 }else{
                     this.calcBtn=false;
                     this.saveBtn=false;
                     flag=false;
                 }
                 
             }
        }else{
            if((item.qty=="0" || item.qty=="" || item.qty==0) && item.mat_num!="" && item.mat_num!=undefined){
                console.log(count)
                errorCount=count; 
                         this.calcBtn=true;
                         this.saveBtn=true;
                         return false;
                   
            }    
        }
        }
        count++;
    }
    console.log(errorCount);
   if(errorCount!=null){
            this.commonService.responseMessages("", "Quantity value should not be zero / empty", "warning");
            this.calcBtn=true;
            this.saveBtn=true; 
        }
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
reArrangeItems(){
    let reArrangeItems=[];
    for(let item of this.createSalesOrderItems){
        if(item.mat_num!="" && item.qty!="" && item.qty!=0){
            reArrangeItems.push(item);
        } 
    }
    for (let item of this.createSalesOrderItems) {
            if (item.mat_num == "" && item.qty == "") {
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
    if(item.qty > item.oldqty){
        $("#qty-"+id).attr('style','border:1px solid red');
        this.commonService.responseMessages("", "Quantity must not be greater than available Quantity "+item.oldqty+" ", "warning");
        this.calcBtn=true;
        this.saveBtn=true;
        return false;    
    }    
 }
}
createDelivery(){
    if(this.title.includes('Display')){
        this.commonService.saleType='Create';
        const path:any="obd/createdelivery";
        let changeDate:any=new Date();
        let day:any=changeDate.getDate();
        let month:any=changeDate.getMonth()+1;
        changeDate=changeDate.getFullYear()+""+month+""+day;
        this.router.navigate([path],{queryParams: {"orderNum":this.orderNum,"fromDate":changeDate,"action":"C","fromItem":"","toItem":"",frompage:"SO"} });
        
    }
}
editSalesOrder(id){
    this.commonService.saleType='Edit';
    const path:any="salesorder/editsalesorder";
    this.router.navigate([path],{ queryParams: {"orderNum":this.orderNum,"dlvrNum":"","action":"U"} });
    
}
successDelivery(){
    this.deliveryFlag=false;
    this.deliveredFlag=true;
    $("#gs-GSTR2").hide();
    $("#icon-GSTR2").show();
}
createBilling(){
    if(this.commonService.deliveryNum!="" && this.commonService.deliveryNum!=null && this.goodsIssuedFlag){
        const path:any="billing/createbilling";
        let delv_no:any=this.commonService.deliveryNum;
        let changeDate:any=new Date();
        let day:any=changeDate.getDate();
        let month:any=changeDate.getMonth()+1;
        changeDate=changeDate.getFullYear()+""+month+""+day;
        this.router.navigate([path],{ queryParams: {"delvNo":delv_no,"billDate":changeDate,"action":"C"} });
        
    }
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
    slObject['vbeln']=this.orderNum
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
           console.log(response)
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
salesOrderListPrint(){
    let url:any=this.environment.getRequiredApi("print_sale_order")+"?org_id="+this.orgId+"&bp_id="+this.bpId+"&im_v_vbeln="+this.orderNum+"&im_v_kunnr="+this.customerId+"&access_obj_id="+this.accessObjectId+"&access_token="+localStorage.getItem("token");
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
closeModalId(id){
    $("#"+id).modal("hide");
    this.createSalesOrderForm.reset();
    this.createSalesOrderForm.controls['customer'].setValue("");
      this.createSalesOrderForm.controls['orderType'].setValue("");
      this.createSalesOrderForm.controls['invoiceNum'].setValue("");
}
downloadTemplate(){
    $("#downloadLink").click();    
}
getBillingdetails(){
    $('#loadingIcon').show();
    $("#black-overlay").show();
    this.createSalesOrderItems=[];  
    let url:any = this.environment.getRequiredApi( 'get_billing_details_billid' )+"?bill_no="+this.invoiceNum+"&org_id="+this.orgId+"&bp_id="+this.bpId+"&doc_type=ZRKS&";
    this.commonService.getData( url, 'GET', '',this.accessObjectId)
            .subscribe(( response ) => {
                if(response.status==0){
                    let count:any=0;
                    this.BillingList=response;
                    if(response.data.hasOwnProperty('ex_bill_item')){
                        if(response.data.ex_bill_item.length>0){
                          for(let res of response.data.ex_bill_item){
                              let object:any={};
                                   object['mat_num']=res.material;
                                   object['qty']=Math.round(parseFloat(res.qty));
                                   object['oldqty']=Math.round(parseFloat(res.qty));
                                   object['uom']=res.uom;
                                   object['desc']=res.mat_desc;
                                   object['price']=res.rate;
                                   object['fix_sch']=Math.round(Math.abs(parseFloat(res.fix_sch)));
                                   object['sch_val']=Math.round(Math.abs(parseFloat(res.sch_val)));
                                   if(res.sch_type=='B'){
                                       object['schTypeSymbol']="val";
                                   }
                                   if(res.sch_type=='A'){
                                       object['schTypeSymbol']="per";
                                   }
                                   if(res.dis_type=='B'){
                                        object['add_dis']='ZVAL'    
                                   }
                                    if(res.dis_type=='A'){
                                        object['add_dis']='ZPER'    
                                   }
                                   object['dis_per_val']=Math.round(Math.abs(parseFloat(res.dis_val)));
                                   object['dis_amt']=Math.round(Math.abs(parseFloat(res.dis_amt)));
                                   object['net_val']=res.net_val; 
                                   object['oldnetVal']=res.net_val;
                                   object['sgst_rt']=res.sgst_rate;
                                   object['sgst_val']=res.sgst_amt;
                                   object['igst_rt']=res.igst_rate;
                                   object['igst_val']=res.igst_amt;
                                   object['cgst_rt']=res.cgst_rate;
                                   object['cgst_val']=res.cgst_amt;
                                   object['displayRow']=true;
                                   object['updateflag']="U";
                                   object['grossValue']=res.total_amt;
                                   object['zspe']=false;
                                   object['zsvl']=false;
                                   object['zper']=false;
                                   object['zval']=false;
                                   object['itemNum']=res.item_no;
                                   this.createSalesOrderItems.push(object);     
                              count++;
                    }  
                        }
                    }
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
                    if(response.data.hasOwnProperty("ex_bill_hdr")){
                        this.customerId=response.data['ex_bill_hdr'][0].sold_to_num;
                        this.payload["cust_id"]=this.customerId;
                        this.shcustomerId=response.data['ex_bill_hdr'][0].ship_to_num;
                        this.billDate=response.data['ex_bill_hdr'][0].bill_date;
                        this.getCustomerDetails();
                        this.getPayIncoTerms();
                        this.getcustomerListById();
                    }
                    this.saveBtn=false;
                    setTimeout(()=>{this.calculateTotalValues()},200);
                    $('#loadingIcon').hide();
                   $("#black-overlay").hide();
                }else{
                   $('#loadingIcon').hide();
                   $("#black-overlay").hide(); 
                   this.commonService.responseMessages("", response.message, "warning");
                }
     });
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
                        this.customerList['ex_compliance']={};
                        this.customerList['ex_address']={};
                        this.customerShiptoParty['ex_compliance']={};
                        this.customerShiptoParty['ex_address']={};
                        this.shName=this.oneTimeCustForm.value['firstname']+" "+this.oneTimeCustForm.value['lastname'];
                        this.sdName=this.oneTimeCustForm.value['firstname']+" "+this.oneTimeCustForm.value['lastname'];
                        this.customerList['ex_compliance'].name=this.oneTimeCustForm.value['firstname']+" "+this.oneTimeCustForm.value['lastname'];
                        this.customerList['ex_compliance'].gstin=this.oneTimeCustForm.value['bpGstinNumber'];
                        this.customerList['ex_compliance'].pan_no=this.oneTimeCustForm.value['bpPan'];
                        this.customerList['ex_compliance'].lst_no=this.oneTimeCustForm.value['drugLicNum'];
                        this.customerList['ex_address'].addr_number="-";
                        this.customerList['ex_address'].street=this.oneTimeCustForm.value['hsno']+","+this.oneTimeCustForm.value['streetNo']+" , "+this.oneTimeCustForm.value['street1'];
                        this.customerList['ex_address'].city=this.oneTimeCustForm.value['city'];
                        this.customerList['ex_address'].post_code=this.oneTimeCustForm.value['postcode'];
                        this.customerList['ex_address'].telefone=this.oneTimeCustForm.value['phone'];
                        this.customerList['ex_address'].email=this.oneTimeCustForm.value['email'];
                        this.customerList['ex_address'].state=$( "#state_id option:selected" ).text().trim();
                        this.customerList['ex_address'].country="IN";
                        this.customerListLength=Object.keys(this.customerList).length;
                        this.customerShiptoParty['ex_compliance'].name=this.oneTimeCustForm.value['firstname']+" "+this.oneTimeCustForm.value['lastname'];
                        this.customerShiptoParty['ex_compliance'].gstin=this.oneTimeCustForm.value['bpGstinNumber'];
                        this.customerShiptoParty['ex_compliance'].pan_no=this.oneTimeCustForm.value['bpPan'];
                        this.customerShiptoParty['ex_compliance'].lst_no=this.oneTimeCustForm.value['drugLicNum'];
                        this.customerShiptoParty['ex_address'].addr_number="-";
                        this.customerShiptoParty['ex_address'].street=this.oneTimeCustForm.value['hsno']+","+this.oneTimeCustForm.value['streetNo']+" , "+this.oneTimeCustForm.value['street1'];
                        this.customerShiptoParty['ex_address'].city=this.oneTimeCustForm.value['city'];
                        this.customerShiptoParty['ex_address'].post_code=this.oneTimeCustForm.value['postcode']
                        this.customerShiptoParty['ex_address'].telefone=this.oneTimeCustForm.value['phone'];
                        this.customerShiptoParty['ex_address'].email=this.oneTimeCustForm.value['email'];
                        this.customerShiptoParty['ex_address'].state=$( "#state_id option:selected" ).text().trim();
                        this.customerShiptoParty['ex_address'].country="IN";
                        this.customerShiptoPartyLenth=Object.keys(this.customerShiptoParty).length;
                        $("#oneTimeCustomerModal").modal('hide');    
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
enableSchemesByMaterial(item,id){
   setTimeout(()=>{
    if($("#scheme-checkbox-"+id+"-input").is(':checked')){
          item.fix_sch=item.orgfix_sch;
          item.schFlag=true;
          this.changeQtyCalculations(item,id);  
    }else{
        item.fix_sch=0;
        item.schFlag=false;
        this.changeQtyCalculations(item,id);    
    }    
   },100);    
}
selectAllSchemes(event,tableId){
    setTimeout(()=>{
        if($("#schemes-all-checkbox-input").is(':checked')){
            $("#"+tableId).find("tbody").find(".mat-checkbox-input").each(function(i){
            let id:any=$(this).attr('id');
           if(id.includes('scheme-checkbox')){
            if(!$("#"+id).is(":checked")){
                $("#"+id).click();
                var test=id.split('-');
                var btnid=test[2];
                $("#shcemes-button-"+btnid).click();
            }
           }
        });    
        }else{
            $("#"+tableId).find("tbody").find(".mat-checkbox-input").each(function(i){
            let id:any=$(this).attr('id');
           if(id.includes('scheme-checkbox')){
            if($("#"+id).is(":checked")){
                $("#"+id).click();
                var test=id.split('-');
                var btnid=test[2];
                $("#shcemes-button-"+btnid).click();
            }
           }
        });    
        }
    },100)    
}
getAddress(){
    let response:any=this.BillingList;
    this.Otcaddress=response["data"]['ex_bill_hdr'][0];
    if(response["data"].hasOwnProperty('ex_bill_hdr')){
                         this.sdName=response["data"]['ex_bill_hdr'][0].sold_to_name;
                         this.oneTimeCustForm.value['firstname']=this.sdName;
                         this.sdNameId=response["data"]['ex_bill_hdr'][0].sold_to_num;
                         if(this.sdNameId!=undefined){
                            this.sdSubId=this.sdNameId.replace(/\b(0(?!\b))+/g, "");
                         }
                         this.shName=response["data"]['ex_bill_hdr'][0].ship_to_name;
                         this.shNameId=response["data"]['ex_bill_hdr'][0].ship_to_num;
                         if(this.shNameId!=undefined){
                            this.shSubId=this.shNameId.replace(/\b(0(?!\b))+/g, "");
                          }
                        this.customerList['ex_compliance']={};
                        this.customerList['ex_address']={};
                        this.customerShiptoParty['ex_compliance']={};
                        this.customerShiptoParty['ex_address']={};
                        this.customerList['ex_compliance'].gstin=response["data"]['ex_bill_hdr'][0].gstin_number;
                        this.customerList['ex_compliance'].pan_no=response["data"]['ex_bill_hdr'][0].pan_no;
                        this.customerList['ex_compliance'].lst_no=response["data"]['ex_bill_hdr'][0].drug_licence;
                        this.customerList['ex_address'].addr_number="-";
                        this.customerList['ex_address'].street=response["data"]['ex_bill_hdr'][0].street;
                        this.customerList['ex_address'].state=response["data"]['ex_bill_hdr'][0].sold_to_state;
                        this.customerList['ex_address'].city=response["data"]['ex_bill_hdr'][0].sold_to_city;
                        this.oneTimeCustForm.value['city']=response["data"]['ex_bill_hdr'][0].sold_to_city;
                        this.customerList['ex_address'].post_code=response["data"]['ex_bill_hdr'][0].sold_post_code1;
                        this.oneTimeCustForm.value['postcode']=response["data"]['ex_bill_hdr'][0].sold_post_code1;
                        this.customerList['ex_address'].telefone=response["data"]['ex_bill_hdr'][0].telephone;
                        this.oneTimeCustForm.value['phone']="";
                        this.customerList['ex_address'].country=response["data"]['ex_bill_hdr'][0].sold_to_country;
                        this.oneTimeCustForm.value['country']="IN"
                        this.customerListLength=Object.keys(this.customerList).length;
                        
                        this.customerShiptoParty['ex_compliance'].gstin=response["data"]['ex_bill_hdr'][0].gstin_number;
                        this.oneTimeCustForm.value['bpGstinNumber']=response["data"]['ex_bill_hdr'][0].gstin_number;
                        this.customerShiptoParty['ex_compliance'].pan_no=response["data"]['ex_bill_hdr'][0].pan_no;
                        this.oneTimeCustForm.value['bpPan']=response["data"]['ex_bill_hdr'][0].pan_no;
                        this.customerShiptoParty['ex_compliance'].lst_no=response["data"]['ex_bill_hdr'][0].drug_licence;
                        this.oneTimeCustForm.value['drugLicNum']=response["data"]['ex_bill_hdr'][0].drug_licence;
                        this.customerShiptoParty['ex_address'].addr_number="-";
                        this.customerShiptoParty['ex_address'].street=response["data"]['ex_bill_hdr'][0].street;;
                        this.customerShiptoParty['ex_address'].state=response["data"]['ex_bill_hdr'][0].ship_to_state;
                        this.customerShiptoParty['ex_address'].city=response["data"]['ex_bill_hdr'][0].ship_to_city;
                        this.customerShiptoParty['ex_address'].post_code=response["data"]['ex_bill_hdr'][0].ship_post_code1;
                        this.customerShiptoParty['ex_address'].telefone=response["data"]['ex_bill_hdr'][0].telephone;
                        this.customerShiptoParty['ex_address'].country=response["data"]['ex_bill_hdr'][0].ship_to_country;
                        this.customerShiptoPartyLenth=Object.keys(this.customerShiptoParty).length;
                        
                    }    
}
editAddress(){
   $("#oneTimeCustomerModal").modal('show'); 
}
getCitiesList(stateId){
    this.oneTimeCustForm.controls['city'].setValue('');
      let citiesUrl:any = this.environment.getRequiredApi( "dropdown_list_byid" )+ "?";
  citiesUrl=citiesUrl.replace("{obj_name}","cities");
  citiesUrl=citiesUrl.replace("{obj_id}",stateId);
  this.commonService.getData( citiesUrl, "GET", "", this.accessObjectId).subscribe(( response ) => {
      if(response.status==0){
          this.cities  = response["data"].objs;
      }
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
    if(response!=undefined && response['mat_num'] != "" && response['mat_num'] !=undefined) {
     if(!response['errorMat']){
         $("#sales-row-"+contId).attr('style','background:#d63e3e');
         this.commonService.responseMessages("", "Please select valid material number", "warning");
         this.saveBtn = true;
         return false;
     }
    }
 }
}
