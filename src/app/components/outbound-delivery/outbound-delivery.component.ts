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
declare var otable:any;

@Component({
  selector: 'app-outbound-delivery',
  templateUrl: './outbound-delivery.component.html',
  styleUrls: ['./outbound-delivery.component.css']
})
export class OutboundDeliveryComponent implements OnInit {
    deliveryForm: FormGroup;
    outboundDeliveryMsg:any;
    bpId:any;
    orgId:any;
    accessObjectId:any;
    customerNames:any;
    orderNum:any;
    fromDate:any;
    fromItem:any;
    toItem:any;
    shName:any;
    shId:any;
    deliveryList:any;
    indeterminate:boolean=false;
    checked:boolean=false;
    outboundDelievryItemsList:any;
    headerList:any;
    docDate:any;
    plGiDate:any;
    acGiDate:any;
    totalWeight:any;
    weightType:any;
    numPack:any;
    createDeliveryForm:FormGroup;
    shAddress:any;
    shComplince:any;
    dsFlag:boolean=true;
    errorList:any;
    errorFlag:boolean=false;
    deliveryNum:any;
    itemNumbers:any;
    saveBtn:boolean=false;
    reqSimPayload:any;
    checkedObjects:any;
    checkboxLength:any;
    batchNumbers:any;
    disableBtns:boolean=false;
    canceldisableBtns:boolean=true;
    extRet:any;
    errorLogs:any;
    cancelPayload:any={};
    selectedBatchNums:any;
    dlType:any;
    errorCreateDo;boolean=false;
    fromPage;any;
    soNum:any;
    shNameId:any;
    orderType:any;
    batchstockList:any;
    batchNumsList:any;
    batchSaveFlag:boolean=false;
    aeDate:any;
  constructor(private http: Http, private formBuilder: FormBuilder,
          private router: Router,private ref: ChangeDetectorRef,private app:AppComponent,private messagesService:MessagePropertiesService,
          private commonService:CommonService,private dateAdapter: DateAdapter<Date>,private activatedRoute:ActivatedRoute,
          private environment:EnvConfigurationService) { 
      this.app.isActive=true;
      this.deliveryForm = formBuilder.group({
          hideRequired: false,
          floatLabel: 'auto',
          'shippingPoint': ['', Validators.required],
          'date': ['', Validators.required],
          'orderNum': ['', Validators.required],
          'DocDate': ['', Validators.required],
          'PGiDate': [''],
          'GiDate': [''],
          'NoPackage': ['', Validators.required],
          'totWeight': ['', Validators.required],
        });
      this.createDeliveryForm = formBuilder.group({
          hideRequired: false,
          floatLabel: 'auto',
         'outboundDate': ['', Validators.required],
         'outboundOrder':['', Validators.required],
         'frmItem':[''],
         'toItem':['']
        });
      this.bpId=localStorage.getItem("bpId");
      this.orgId=localStorage.getItem("orgId");
      this.accessObjectId=localStorage.getItem("Sales Order");
      this.outboundDeliveryMsg = messagesService.outbound_delivery_msg;
      this.customerNames=[];
      this.orderNum=null;
      this.deliveryList={};
      this.shId="";
      this.shName="";
      this.fromItem=""
      this.toItem="";
      this.outboundDelievryItemsList=[];
      this.headerList=[];
      this.docDate="";
      this.plGiDate="";
      this.acGiDate="";
      this.numPack="";
      this.totalWeight="";
      this.weightType="";
      this.shName="";
      this.shAddress={
        "addr_number":"",
        "house_number":"",
        "street":"",
        "city":"",
        "state":"",
        "post_code":"",
        "telefone":"",
        "country":"",  
      };
      this.shComplince={
        "gstin":"",
        "lst_no":"",   
      };
      this.dsFlag=true;
      this.errorList=[];
      this.itemNumbers=[];
      this.saveBtn=false;
      this.reqSimPayload={};
      this.checkedObjects=[];
      this.checkboxLength=0;
      this.batchNumbers=[];
      this.canceldisableBtns=true;
      this.cancelPayload={};
      this.extRet=[];
      this.errorLogs=[];
      this.selectedBatchNums=[];
      this.fromPage="";
      this.soNum="";
      this.shNameId=""
      this.orderType="";
      this.batchstockList=[];
      this.batchNumsList=[];
      this.batchSaveFlag=false;
  }

  ngOnInit() {
      $(()=>{
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
      });
      this.activatedRoute.queryParams.subscribe(params => {
          console.log(this.router.url);
          if(params['action']=="C" && this.router.url.includes('obd')){
              this.orderNum=params['orderNum'];
              this.fromDate=params["fromDate"];
              this.fromItem=params["fromItem"];
              this.toItem=params["toItem"];
              this.fromPage=params["frompage"];
              this.soNum=params['orderNum'];
          }
          
      });
      this.reqSimPayload['bp_id']=this.bpId;
      this.reqSimPayload['org_id']=this.orgId;
      this.reqSimPayload['im_action']="SD";
      this.reqSimPayload['im_salesorder']=this.orderNum;
      this.reqSimPayload['im_selection_date']=this.fromDate;
      this.reqSimPayload['im_from_item']=this.fromItem;
      this.reqSimPayload['im_to_item']=this.toItem;
      this.getSimulationDetails(this.reqSimPayload);
  }
getSimulationDetails(reqSimPayload){
    $('#loadingIcon').show();
    $("#black-overlay").show();
    let url:any=this.environment.getRequiredApi("get_simulation_dlvr_details")+"?";
    this.commonService.getData(url, "POST", reqSimPayload, this.accessObjectId).subscribe(response=>{
       if(response.status==0){
           if(response["data"]['e_created_deliveries']==0){
               if(response["data"].hasOwnProperty('ex_return')){
                   if(response["data"]['ex_return'].length>0){
                       this.errorList=response["data"]['ex_return'];
                       for(let elist of response["data"]['ex_return']){
                           if(elist.type=='E'){
                               this.errorFlag=true;
                               $('#loadingIcon').hide();
                               $("#black-overlay").hide();
                               $("#displayDlvrErrorsModal").modal("show");
                               if(this.dlType!='Add'){
                                this.errorCreateDo=true;    
                               }else{
                                   this.errorCreateDo=false;
                               }
                               return false;
                           }
                       }
                   }
               }else{
                   this.commonService.responseMessages("", "Invalid sales order to simulate", "warning");
               }
               
               $('#loadingIcon').hide();
               $("#black-overlay").hide();
               return false;
           }
           this.outboundDelievryItemsList=[];
           this.itemNumbers=[];
           this.deliveryList={};
           this.deliveryList=response["data"];
           if(this.deliveryList.hasOwnProperty(['ex_address'])){
               this.shAddress=this.deliveryList['ex_address'];
               this.shName=this.shAddress['cust_name'];
               this.shId=this.shAddress['cust_id'];
               if(this.shId!=undefined){
                this.shNameId=this.shId.replace(/\b(0(?!\b))+/g, "");
               }
           }
           if(this.deliveryList.hasOwnProperty(['ex_compliance'])){
               this.shComplince=this.deliveryList['ex_compliance'];
           }
           if(Object.keys(this.shComplince).length==0){
                 this.shComplince.gstin=this.shAddress.gstin_num;
                 this.shComplince.lst_no=this.shAddress.dl_num;   
           }
            
           if(this.deliveryList.hasOwnProperty('ch_delivery_tables')){
               if(this.deliveryList['ch_delivery_tables'].hasOwnProperty('likp')){
                   if(this.deliveryList['ch_delivery_tables'].likp.length>0){
                       this.headerList=this.deliveryList['ch_delivery_tables'].likp;
                       if(this.headerList[0].bldat!='0000-00-00'){
                           this.docDate=this.headerList[0].bldat;
                           this.docDate=this.docDate.replace( /(\d{4})-(\d{2})-(\d{2})/ , "$3/$2/$1");
                       }
                       
                       if (this.headerList[0].aedat != '0000-00-00') {
                           this.aeDate = this.headerList[0].aedat;
                       } else {
                           this.aeDate = this.docDate
                       }
                       
                       if(this.headerList[0].wadat!='0000-00-00'){
                           this.plGiDate=this.headerList[0].wadat;
                       }
                       if(this.headerList[0].wadat_ist!='0000-00-00'){
                           this.acGiDate=this.headerList[0].wadat_ist;
                           this.acGiDate=this.acGiDate.replace( /(\d{4})-(\d{2})-(\d{2})/ , "$3/$2/$1");
                       }else{
                           let date:any=new Date();
                           let month:any=date.getMonth()+1;
                           let day:any=date.getDate();
                           if(day<10){
                                   day="0"+day;
                            }
                            if(month<10){
                                   month="0"+month;
                            }
                           let year:any=date.getFullYear(); 
                           this.acGiDate=day+"/"+month+"/"+year;
                       }
                       this.totalWeight=this.headerList[0].btgew;
                       this.weightType=this.headerList[0].gewei;
                       this.numPack=this.headerList[0].anzpk;
                       this.orderType=this.headerList[0].lfart;
                       this.commonService.orderType=this.orderType;
                       if(this.orderType=='ZRKS'){
                        $("#pgi").text("Post Goods Receipt");    
                       }
                   }
                
               }
               let itemList:any="";
               if(this.deliveryList['ch_delivery_tables'].hasOwnProperty('lips')){
                   if(this.deliveryList['ch_delivery_tables'].lips.length>0){
                       this.deliveryList['ch_delivery_tables']["lips"].forEach(currentItem=>{
                           currentItem.updateFlag="U";
                           currentItem.displayRow=true;
                           if(!currentItem.hasOwnProperty('charg')){
                               currentItem.batchNum=""
                               currentItem.batchDTRFlag=false;
                               currentItem.vmeng=0;
                               currentItem.oldlfimg=currentItem.lfimg;
                               this.itemNumbers.push(currentItem);
                           }
                       });
                       for(let index of this.deliveryList['ch_delivery_tables']["lips"]){
                           if(index.hasOwnProperty("charg")){
                              if(this.deliveryList.hasOwnProperty('ch_batch_mat_stock')){
                               this.deliveryList['ch_batch_mat_stock'].forEach(currentItem=>{
                                   if(currentItem.hasOwnProperty("charg")){
                                       if(index.charg==currentItem.charg && index.matnr==currentItem.matnr){
                                           index.clabs=currentItem.clabs;
                                           index.clabs=Math.round(parseFloat(index.clabs));
                                           index.lfimg=Math.round(parseFloat(index.lfimg));
                                       }  
                                   }
                               });
                              }
                           }
                       }
                       if(this.itemNumbers.length>0){
                           for(let index of this.itemNumbers){
                               index.state='';
                               this.outboundDelievryItemsList.push(index);
                               this.deliveryList['ch_delivery_tables']["lips"].forEach(currentItem=>{
                                   if(index.posnr==currentItem.uecha){
                                       currentItem.batchNum=index.posnr;
                                       currentItem.state='';
                                       currentItem.batchDTRFlag=false;
                                       currentItem.lfimg = Math.round(parseFloat(currentItem.lfimg));
                                       this.outboundDelievryItemsList.push(currentItem);
                                   }
                               });
                           }
                       }
                       if(this.itemNumbers.length==0){
                          this.deliveryList['ch_delivery_tables']["lips"].forEach(currentItem=>{
                              currentItem.batchNum=currentItem.uecha;
                              currentItem.state='returns';
                              currentItem.batchDTRFlag=false;
                              currentItem.lfimg = Math.round(parseFloat(currentItem.lfimg));
                              currentItem.oldlfimg = Math.round(parseFloat(currentItem.lfimg));
                              if(!this.deliveryList.hasOwnProperty('ch_batch_mat_stock')){
                                currentItem.clabs=Math.round(parseFloat(currentItem.lfimg));    
                              }
                              this.outboundDelievryItemsList.push(currentItem);
                          });
                       }
                       let count:any=0;
                       if(this.deliveryList.hasOwnProperty('ch_open_quantity')){
                           for(let item of this.itemNumbers){
                               this.deliveryList['ch_open_quantity'].forEach(currentItem=>{
                                   if(currentItem.posnr==item.vgpos
                                           && currentItem.vbeln==item.vgbel){
                                       item['vmeng']=currentItem.vmeng;
                                   }
                                   count++;
                               }); 
                           }
                                  
                       }
                       if(this.deliveryList.hasOwnProperty('ch_avail_stock')){
                           for(let item of this.itemNumbers){
                                this.deliveryList['ch_avail_stock'].forEach(index=>{
                                    if(index.mat_no==item.matnr){
                                        item.available_qty=index.available_qty;
                                        item.reserved_qty=index.reserved_qty;
                                        item.total_quantity=index.total_quantity;    
                                    }
                                 });
                               }
                       }
                     //this.outboundDelievryItemsList=this.deliveryList['ch_delivery_tables']["lips"];
                   if(this.orderType=='ZKS'){
                    let countItm: any =null;
                    let delvQty: any = null;
                    let batchLength: any = 0;
                    let length:any=0;
                    this.outboundDelievryItemsList.forEach(currentItem => {
                        if(currentItem.batchNum==""){
                            if(countItm==null){
                              countItm=0;      
                            }else{
                                    console.log(this.outboundDelievryItemsList[countItm].posnr+"--"+batchLength);
                                    this.outboundDelievryItemsList[countItm].batchLength=batchLength;
                                    countItm=countItm+batchLength+1;
                                    /*let length1:any=countItm-batchLength;
                                    length1=Math.abs(length1);
                                    for(let i=length1; i<=countItm; i++){
                                              this.outboundDelievryItemsList[i].batchLength=batchLength;  
                                        }*/
                                    batchLength=0;
                                    delvQty = null;
                            }
                           }
                           if(currentItem.displayRow){
                                    if (this.outboundDelievryItemsList[countItm].vgbel == currentItem.vgbel && currentItem.batchNum != "" && this.outboundDelievryItemsList[countItm].posnr == currentItem.batchNum) {
                                        if (delvQty == null) {
                                            delvQty = parseFloat(currentItem.lfimg);
                                        } else {
                                            delvQty = delvQty + parseFloat(currentItem.lfimg);
                                        }
                                        this.outboundDelievryItemsList[countItm].lfimg = delvQty;
                                        for(let index of this.itemNumbers){
                                            if(index.posnr==this.outboundDelievryItemsList[countItm].posnr && this.outboundDelievryItemsList[countItm].batchNum==''){
                                              index.oldlfimg= delvQty; 
                                            }
                                        }
                                        this.outboundDelievryItemsList[countItm].oldlfimg = delvQty;
                                        for(let index of this.itemNumbers){
                                            if(index.posnr==this.outboundDelievryItemsList[countItm].posnr){
                                                index.lfimg=delvQty;
                                            }    
                                        }
                                        this.outboundDelievryItemsList[countItm].vmeng = this.outboundDelievryItemsList[countItm].vmeng;
                                        batchLength++;
                                    }
                                  }
                        
                        length=countItm+batchLength+1;
                        console.log(length);
                        if(this.outboundDelievryItemsList.length==length){
                            this.outboundDelievryItemsList[countItm].batchLength=batchLength;
                            /*let length2:any=countItm-batchLength;
                            length2=Math.abs(length2);
                            let totalCount:any=countItm+batchLength;
                            for(let i=length2; i<=totalCount; i++){
                                      this.outboundDelievryItemsList[i].batchLength=batchLength;  
                                }*/
                        }    
                            
                    });
                    
                    let batchLength1:any=0;
                    this.outboundDelievryItemsList.forEach(currentItem=>{
                       if(currentItem.displayRow){
                        if(currentItem.batchNum==''){
                            batchLength1=currentItem.batchLength;    
                        }else{
                           currentItem.batchLength=batchLength1;    
                        }    
                       } 
                    });
                  }
                   }
               }
               
              
           }
           var aeDate = this.aeDate;
           var giDate = this.acGiDate;
           var dcdate = this.docDate;
           setTimeout(()=>{
                                $('#docDate').datetimepicker({
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
                                  maxDate:new Date(),
                                  format: 'DD/MM/YYYY',
                                  minDate:aeDate,
                              }); 
                                $('#giDate').datetimepicker({
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
                                    maxDate:new Date(),
                                    format: 'DD/MM/YYYY',
                                    minDate:aeDate,
                                });
                                console.log(giDate);
                                //$('#giDate').val(giDate);
                                $('#docDate').val(dcdate);
                         },50); 
           
           $('#loadingIcon').hide();
           $("#black-overlay").hide();
           
       }else{
           this.commonService.responseMessages("", response.message, "warning");
           $('#loadingIcon').hide();
           $("#black-overlay").hide();
       } 
       $("#download-help").hide();
       setTimeout(()=>{
          var width=$("#mainContent").css("width");
          $(".outbound-footer").css("width",width);
          $(".outbound-footer").show();
      },50);
    });
}
selectAll(event,checkAll,tableId){
    setTimeout(()=>{
       if($("#"+checkAll).is(":checked")){
            this.commonService.selectAllCheckBoxes(checkAll,tableId);
            let count:any=0;
            this.outboundDelievryItemsList.forEach(response=>{
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
getReportList(event,tableId,i,response){
    setTimeout(()=>{let flag:boolean=this.commonService.checkAction(tableId);
    if(flag){
        this.indeterminate=false;
        this.checked=true;
    }else{
        this.indeterminate=true;
    }
    },400);
   setTimeout(()=>{
        if ($("#checkbox-" + i + "-input").is(":checked")) {
                this.checkedObjects.push(i);
                if (response.batchNum == "") {
                    this.outboundDelievryItemsList.forEach(currentItem => {
                        if (currentItem.batchNum != "" && currentItem.uecha == response.posnr) {
                            i++;
                            if(!currentItem.batchDTRFlag){
                                this.checkedObjects.push(i);
                            }
                        }
                    });
                }
            } else {
                if (this.checkedObjects.length > 0) {
                    let count: any = 0;
                    for (let index of this.checkedObjects) {
                                    if (index == i) {
                                        delete this.checkedObjects[count];
                                    }
                                    count++;
                      }
                    count=0;
                    console.log(response.posnr);
                    if (response.batchNum == "") {
                        this.outboundDelievryItemsList.forEach(currentItem => {
                            if (currentItem.batchNum != "" && currentItem.uecha == response.posnr) {
                                i++;
                                let indexCount:any=0;
                                for (let index of this.checkedObjects) {
                                    if (index == i) {
                                        delete this.checkedObjects[count];
                                    }
                                    count++;
                                }
                            }
                            
                        });
                    }
                }
                setTimeout(() => {
                    let flag: boolean = this.commonService.continueAction(tableId);
                    if (flag) {
                        this.indeterminate = false;
                        this.checked = false;
                        this.checkedObjects=[];
                    } else {
                        this.indeterminate = true;
                    }
                }, 200);
            }
       
   },300); 
}
expandChildRows(childrow,itemId,icon,index,orderId){
    if($("#plus-"+index).is(":visible")){
        $("#plus-"+index).hide();
        $("#minus-"+index).show();
        $("."+childrow+"-"+itemId+"-"+orderId).show(); 
        
    }else{
        if($("#minus-"+index).is(":visible")){
            $("#plus-"+index).show();
            $("#minus-"+index).hide();
        }
        $("."+childrow+"-"+itemId+"-"+orderId).hide();          
    }
    
}
expandAllrows(){
    if($(".child-row").is(":visible")){
        $(".child-row").hide();
        $(".plus-circle-icon").show();
        $(".minus-circle-icon").hide();
    }else{
        $(".child-row").show();
        $(".plus-circle-icon").hide();
        $(".minus-circle-icon").show(); 
    }
}
displayAddSalesModal(id){
    $("#salesForm")[0].reset();
    $("#outboundDeliveryModal").modal("show");
    this.dlType=id;
}
closeModal(id){
    $("#"+id).modal("hide");
    $("#salesForm")[0].reset();
    this.createDeliveryForm.reset();
    if(this.errorCreateDo && this.fromPage=="SO"){
          const path:any="salesorder";  
            this.router.navigate([path]);
    }
}
addSalesOrder(id){
    if(this.dlType=='Add'){
        let docDate:any=$("#sFiterfromDate").val();
        docDate=docDate.split("/");
        docDate=docDate[2]+""+docDate[1]+""+docDate[0];
        let reqSimPayload:any={};
        reqSimPayload['bp_id']=this.bpId;
        reqSimPayload['org_id']=this.orgId;
        reqSimPayload['im_action']="SD";
        reqSimPayload['im_salesorder']=$("#orderNum").val().trim();
        reqSimPayload['im_selection_date']=docDate;
        reqSimPayload['im_from_item']=$("#fromItem").val();
        reqSimPayload['im_to_item']=$("#toItem").val();
        reqSimPayload['ch_delivery_tables']={};
        reqSimPayload['im_delivery_tables_inx']=[];
        reqSimPayload['ch_open_quantity']=[];
        if(Object.keys(this.deliveryList).length>0){
            let docdate:any=$("#docDate").val();
            docdate=docdate.split("/");
            docdate=docdate[2]+""+docdate[1]+""+docdate[0];
            let planedGidate:any=$("#plndGiDate").val();
            planedGidate=planedGidate.split("/");
            planedGidate=planedGidate[2]+""+planedGidate[1]+""+planedGidate[0];
            let Gidate:any=$("#giDate").val();
            Gidate=Gidate.split("/");
            Gidate=Gidate[2]+""+Gidate[1]+""+Gidate[0];
            let numPackages=$("#numPackVal").val();
            this.deliveryList['ch_delivery_tables']['likp'][0].bldat=docdate;
            this.deliveryList['ch_delivery_tables']['likp'][0].wadat=planedGidate;
            this.deliveryList['ch_delivery_tables']['likp'][0].anzpk=numPackages;
            reqSimPayload['ch_delivery_tables']['likp']=this.deliveryList['ch_delivery_tables'].likp;
            reqSimPayload['ch_open_quantity']=this.deliveryList['ch_open_quantity'];
            reqSimPayload['ch_delivery_tables']['lips']=[];
            reqSimPayload['ch_batch_mat_stock']=this.deliveryList['ch_batch_mat_stock'];
            let dlvrQty:any=0; 
            let count:any=0;
            let batchCount:any=0;
            for(let item of this.outboundDelievryItemsList){
                let dlxItem:any={};
                if(item.batchNum==""){
                    dlvrQty=item.lfimg;
                    if(item.batchLength=="" || item.batchLength==0){
                        let dlxItem1:any={};
                        dlxItem1['main_item_num']=item.posnr;
                        reqSimPayload['im_delivery_tables_inx'].push(dlxItem1);     
                    }
                }
                if(item.batchNum!=""){
                    batchCount++;
                    dlxItem['item_num']=item.posnr;
                    dlxItem['qty']=item.lfimg;
                    dlxItem['ref_item_num']=item.vgpos;
                    dlxItem['main_item_num']=item.batchNum;
                    dlxItem['upd_flag']=item.updateFlag;
                    dlxItem['so_num']=item.vgbel;
                    reqSimPayload['im_delivery_tables_inx'].push(dlxItem);
                    /*let refDlvrytoSales:any={};
                    refDlvrytoSales['sales_unit']=item.meins;
                    refDlvrytoSales['ref_doc']=item.vgbel;
                    refDlvrytoSales['ref_item']=item.vgpos;
                    refDlvrytoSales['dlv_qty']=dlvrQty;
                    reqSimPayload['im_dlvreftosalesorder'].push(refDlvrytoSales);*/
                }
                if(item.displayRow){
                    reqSimPayload['ch_delivery_tables']['lips'].push(item);
                }
            }
        }
        
        $("#"+id).modal("hide"); 
        this.getSimulationDetails(reqSimPayload);
    }else{
        $("#"+id).modal("hide"); 
        const path:any="obd/createdelivery";
        let fromDate:any=$("#sFiterfromDate").val();
        fromDate=fromDate.split("/");
        let changeDate:any=fromDate[2]+fromDate[1]+fromDate[0];
        let orderNum:any=$("#orderNum").val();
        orderNum=orderNum.trim();
        let fromItem:any=$("#fromItem").val();
        let toItem:any=$("#toItem").val();
        let reqSimPayload: any = {};
            reqSimPayload['bp_id'] = this.bpId;
            reqSimPayload['org_id'] = this.orgId;
            reqSimPayload['im_action'] = "SD";
            reqSimPayload['im_salesorder'] = $("#orderNum").val();
            reqSimPayload['im_selection_date'] = changeDate;
            reqSimPayload['im_from_item'] = $("#fromItem").val();
            reqSimPayload['im_to_item'] = $("#toItem").val();
            this.getSimulationDetails(reqSimPayload);
        this.router.navigate([path],{ queryParams: {"orderNum":orderNum,"fromDate":changeDate,"action":"C","fromItem":fromItem,"toItem":toItem,frompage:"DL"} });
        
    }
}
changeQtyValidation(item,id){
    if(this.orderType=='ZKS'){
        this.changeDeleiveryQty();
        }
    let count:any=0;
    
    if(item.lfimg==""){
        item.lfimg=0; 
    }
    if(this.orderType=='ZRKS'){
        if(item.lfimg > item.oldlfimg){
            $("#batch-qty-"+id).attr('style','border:1px solid red');
                this.commonService.responseMessages("", "Quantity value should not be greater than open quantity "+item.oldlfimg+"", "warning");
                this.saveBtn=true;
                return false;    
        }else{
            $("#batch-qty-"+id).removeAttr('style');
            this.saveBtn=false;
        }    
    }
    if(this.orderType=='ZKS'){
    this.outboundDelievryItemsList.forEach(currentItem=>{
        if(currentItem.hasOwnProperty("charg")){
            if(item.charg==currentItem.charg && item.matnr==currentItem.matnr){
                if(parseFloat(currentItem.lfimg) > parseFloat(currentItem.clabs)){
                    $(".batch-"+item.vgpos).attr('style','border:1px solid red');
                    this.commonService.responseMessages("", "Quantity value should not be greater than open quantity", "warning");
                    this.saveBtn=true;
                    return false;
                }else{
                    if(parseFloat(currentItem.lfimg) <= parseFloat(currentItem.clabs)){
                        $(".batch-"+item.vgpos).removeAttr('style');
                        this.saveBtn=false;
                    }
                }
            }  
        }
    });
    for(let index of this.itemNumbers){
        let vmeng:any=index.vmeng;
        if(item.uecha==index.posnr){
            if(!index.hasOwnProperty('vmeng')){
                index.vmeng=index.oldlfimg;
            }
            if((vmeng!="" && vmeng==null) || vmeng==0){
                vmeng=index.oldlfimg;    
            }
            if(parseFloat(index.lfimg) > parseFloat(vmeng)){
                $(".batch-"+item.vgpos).attr('style','border:1px solid red');
                this.commonService.responseMessages("", "Quantity value should not be greater than open quantity "+vmeng+"", "warning");
                this.saveBtn=true;
                return false;
            }else{
                if(parseFloat(index.lfimg) <= parseFloat(vmeng)){
                    $(".batch-"+item.vgpos).removeAttr('style');
                    this.saveBtn=false;
                } 
           let avlQty:any=0;
           if(index.hasOwnProperty('available_qty')){
                if(index.available_qty!="" && index.available_qty!=null){
                        avlQty=parseFloat(index.available_qty);
                    }
               }else{
                    avlQty=vmeng;
                }
            if(parseFloat(index.lfimg) > parseFloat(avlQty)){
                $(".batch-"+item.vgpos).attr('style','border:1px solid red');
                this.commonService.responseMessages("", "Quantity value should not be greater than available quantity "+avlQty+"", "warning");
                this.saveBtn=true;
                return false;
            }else{
                if(parseFloat(index.lfimg) <= parseFloat(avlQty)){
                    $(".batch-"+item.vgpos).removeAttr('style');
                    this.saveBtn=false;
                } 
              }
        }
        
       } 
    }
   }
    
}

changeDeleiveryQty() {
    let countItm: any =null;
    let delvQty: any = null;
    let batchLength: any = 0;
    let length1:any=0;
    this.outboundDelievryItemsList.forEach(currentItem => {
        if(currentItem.batchNum==""){
            if(countItm==null){
              countItm=0;      
            }else{
                console.log(batchLength+"--"+countItm);
                this.outboundDelievryItemsList[countItm].batchLength=batchLength;
                countItm=countItm+batchLength+1;
                /*let length1:any=countItm-batchLength;
                for(let i=length1; i<=countItm; i++){
                          this.outboundDelievryItemsList[i].batchLength=batchLength-1;  
                    }*/
                batchLength=0;
                delvQty = null;
            }
           }
        
           //if(currentItem.displayRow){
                    if (this.outboundDelievryItemsList[countItm].vgbel == currentItem.vgbel && currentItem.batchNum != "" && this.outboundDelievryItemsList[countItm].posnr == currentItem.batchNum) {
                        if (delvQty == null) {
                            delvQty = parseFloat(currentItem.lfimg);
                        } else {
                            delvQty = delvQty + parseFloat(currentItem.lfimg);
                        }
                        this.outboundDelievryItemsList[countItm].lfimg = delvQty;
                        for(let index of this.itemNumbers){
                            if(index.posnr==this.outboundDelievryItemsList[countItm].posnr){
                                index.lfimg=delvQty;
                            }    
                        }
                        this.outboundDelievryItemsList[countItm].vmeng = this.outboundDelievryItemsList[countItm].vmeng;
                        batchLength++;
                    }
                  //}
                        console.log(batchLength+"--"+countItm);
                        let length:any=countItm+batchLength+1;
                        if(this.outboundDelievryItemsList.length==length){
                            this.outboundDelievryItemsList[countItm].batchLength=batchLength;
                            let length2:any=countItm-batchLength;
                            /*length2=Math.abs(length2);
                            let totalCount:any=countItm+batchLength;
                            for(let i=length2; i<=totalCount; i++){
                                if(i<=this.outboundDelievryItemsList.length){
                                      this.outboundDelievryItemsList[i].batchLength=batchLength;
                                    }  
                                }*/
                        }   
            
    });
                    let batchLength1:any=0;
                    this.outboundDelievryItemsList.forEach(currentItem=>{
                       if(currentItem.displayRow){
                        if(currentItem.batchNum==''){
                            batchLength1=currentItem.batchLength;    
                        }else{
                           currentItem.batchLength=batchLength1;    
                        }    
                       } 
                    });   
    }
createDelivery(){
    if($("#outbound-delivery-table").find('tbody').find('tr').hasClass('highLight-color-0')){
        this.commonService.responseMessages("", "The Stock is not defined for the Delivery Line Item. You cannot Save The Delivery until Stock is available /Deleting Deficit Line Item.", "warning");
        return false;    
    }
    $('#loadingIcon').show();
    $("#black-overlay").show();
    let requestPayload:any={};
    requestPayload['bp_id']=this.bpId;
    requestPayload['im_action']="CD";
    requestPayload['org_id']=this.orgId;
    requestPayload['ch_delivery_tables']={};
    let docdate:any=$("#docDate").val();
    docdate=docdate.split("/");
    docdate=docdate[2]+""+docdate[1]+""+docdate[0];
    let planedGidate:any=$("#plndGiDate").val();
    planedGidate=planedGidate.split("/");
    planedGidate=planedGidate[2]+""+planedGidate[1]+""+planedGidate[0];
    let Gidate:any=$("#giDate").val();
    if(Gidate!="undefined" && Gidate!="" && Gidate!=null){
        Gidate=Gidate.split("/");
        Gidate=Gidate[2]+""+Gidate[1]+""+Gidate[0]; 
    }else{
        Gidate="";  
    }
    let numPackages=$("#numPackVal").val();
    if(this.deliveryList['ch_delivery_tables'].hasOwnProperty('likp')){
      if(this.deliveryList['ch_delivery_tables']['likp'].length>0){
        this.deliveryList['ch_delivery_tables']['likp'][0].bldat=docdate;
        this.deliveryList['ch_delivery_tables']['likp'][0].wadat=planedGidate;
        this.deliveryList['ch_delivery_tables']['likp'][0].wadat_ist=Gidate;
        this.deliveryList['ch_delivery_tables']['likp'][0].anzpk=numPackages;
        requestPayload['ch_delivery_tables']['likp']=this.deliveryList['ch_delivery_tables'].likp;
        }
    }
    requestPayload['ch_delivery_tables']['lips']=[];
    requestPayload['im_delivery_tables_inx']=[];
    requestPayload['im_dlvreftosalesorder']=[];
    let dlvrQty:any=0; 
    for(let item of this.outboundDelievryItemsList){
        let dlxItem:any={};
        if(item.batchNum==""){
            dlvrQty=item.lfimg
        }
        if(item.batchNum!=""){
            dlxItem['item_num']=item.posnr;
            if(item.updateFlag=='D'){
                dlxItem['qty']=0;
            }else{
                dlxItem['qty']=item.lfimg; 
            }
            dlxItem['ref_item_num']=item.vgpos;
            dlxItem['upd_flag']=item.updateFlag;
            dlxItem['so_num']=item.vgbel;
            dlxItem['main_item_num']=item.batchNum;
            if(!item.batchDTRFlag){
                //requestPayload['im_delivery_tables_inx'].push(dlxItem);
            }
            if(this.orderType=='ZRKS'){
                 if(item.displayRow){
                    let refDlvrytoSales:any={};
                    refDlvrytoSales['sales_unit']=item.meins;
                    refDlvrytoSales['ref_doc']=item.vgbel;
                    refDlvrytoSales['ref_item']=item.vgpos;
                    refDlvrytoSales['dlv_qty']=item.lfimg;
                    requestPayload['im_dlvreftosalesorder'].push(refDlvrytoSales);  
                }else{
                    if(item.updateFlag=='D'){
                        let itemObject:any={};
                        itemObject['item_num']=item.posnr;
                        itemObject['ref_item_num']=item.vgpos;
                        itemObject['upd_flag']=item.updateFlag;
                        itemObject['so_num']=item.vgbel;
                        requestPayload['im_delivery_tables_inx'].push(itemObject);
                    
                    }
                }
              }
        }else{
            if(this.orderType=='ZKS'){
                if(item.displayRow){
                    if(!item.batchDTRFlag){
                    let refDlvrytoSales:any={};
                    refDlvrytoSales['sales_unit']=item.meins;
                    refDlvrytoSales['ref_doc']=item.vgbel;
                    refDlvrytoSales['ref_item']=item.vgpos;
                    refDlvrytoSales['dlv_qty']=item.oldlfimg;
                    requestPayload['im_dlvreftosalesorder'].push(refDlvrytoSales); 
                 } 
                }
                    if(item.updateFlag=='D' && !item.batchDTRFlag){
                        let itemObject:any={};
                        itemObject['item_num']=item.posnr;
                        itemObject['ref_item_num']=item.vgpos;
                        itemObject['upd_flag']=item.updateFlag;
                        itemObject['so_num']=item.vgbel;
                        //requestPayload['im_delivery_tables_inx'].push(itemObject);
                    
                    //}
                }
               }
             
        }
        if(item.displayRow){
            requestPayload['ch_delivery_tables']['lips'].push(item);
        }
    }
    let url:any=this.environment.getRequiredApi("get_simulation_dlvr_details")+"?";
    this.commonService.getData(url, "POST", requestPayload, this.accessObjectId).subscribe(response=>{
       if(response.status==0){
           if(response["data"].hasOwnProperty('ex_delivery')){
                this.deliveryNum=response["data"]["ex_delivery"];
            }else{
                if(response["data"].hasOwnProperty('ex_return')){
                   if(response["data"]['ex_return'].length>0){
                       this.errorList=response["data"]['ex_return'];
                       for(let elist of response["data"]['ex_return']){
                           if(elist.type=='E'){
                               this.errorFlag=true;
                               $('#loadingIcon').hide();
                               $("#black-overlay").hide();
                               $("#displayDlvrErrorsModal").modal("show");
                               return false;
                           }
                       }
                   }
                   }      
           }
           this.commonService.deliveryNum=this.deliveryNum;
           $('#loadingIcon').hide();
           $("#black-overlay").hide();
           this.commonService.responseMessages("", "Delivery "+this.deliveryNum+" created successfully", "success");
           if(this.deliveryNum!=""){
               $("#successDlvry").click();
               $("#goods-help").show();
               this.saveBtn=true;
               this.disableBtns=true;
               let title:any="Deliver Display / ("+this.deliveryNum+")";
               $(".page-title").text(title);
               this.canceldisableBtns=false;
               const path:any="obd/editdeliverydetails";
               this.router.navigate([path],{ queryParams: {"orderNum":this.deliveryNum,"action":"DIS",frompage:this.fromPage} });
           }
       }else{
           $('#loadingIcon').hide();
           $("#black-overlay").hide();
           this.commonService.responseMessages("", response.message, "warning");
       } 
    });
    
}
redirectDelievryList(){
    if(this.fromPage=="SO"){
       const path:any='salesorder';
        this.router.navigate([path]); 
    }else{
        const path:any='obd';
        this.router.navigate([path]);    
    } 
}
removeLineSelectedItems(){
    if(this.checkedObjects.length>0){
        for(let index of this.checkedObjects){
            if(index!=undefined && index!=null){
                this.outboundDelievryItemsList[index].displayRow=false;
                this.outboundDelievryItemsList[index].updateFlag="D";
                this.outboundDelievryItemsList.forEach(currentItem=>{
                   if(currentItem.batchNum==""){
                       if(this.outboundDelievryItemsList[index].uecha==currentItem.posnr){
                           currentItem.lfimg=parseFloat(currentItem.lfimg)-parseFloat(this.outboundDelievryItemsList[index].lfimg);
                           return false;
                       }
                   } 
                });
                this.outboundDelievryItemsList[index].lfimg=0;
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
    if(this.orderType=='ZKS'){
        setTimeout(()=>{this.changeDeleiveryQty();},300);
    }
  }
changePickerPos(){
    setTimeout(()=>{
        $(".bootstrap-datetimepicker-widget").css("position","fixed");
        $(".bootstrap-datetimepicker-widget").css("top","102px");
    },100);
} 
removeStyles(id){
    $('#'+id).datetimepicker("hide");   
    this.createDeliveryForm.controls['outboundDate'].setValue($("#sFiterfromDate").val());
}
cancelSalesOrder(){
    if(this.deliveryNum==null && this.deliveryNum==""){
        return false;
    }
    this.cancelPayload={};
    let object = "SO";
    let selectedSalesOrders:any = [];
    this.cancelPayload["bp_id"]=this.bpId;
    this.cancelPayload["object"]="OBD";
    this.cancelPayload["object_details"]=[];
    this.cancelPayload["org_id"]=this.orgId;
    let slObject:any={}
    slObject['vbeln']=this.deliveryNum
    this.cancelPayload["object_details"].push(slObject);
  swal( {
     title: "Do you want to cancel the delivery order?",
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
                 this.commonService.responseMessages("","Delivery order successfully cancelled", "success"); 
                 const path:any="obd";
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
editDeliveryOrder(){
    this.commonService.saleType = 'Edit';
    const path: any = "obd/editdeliverydetails";
    this.router.navigate([path], { queryParams: { "orderNum": this.deliveryNum, "action": "U",frompage:"SO" } });
}
getStockDetails(){
    let flag:boolean=false;
    let matNum:any=0;
    let count:any=0;
    if(this.checkedObjects.length==0){
        this.commonService.responseMessages("", "Please select atleast one item", "warning");
        return false;
    }else{
         for(let index of this.checkedObjects){
           if(index!=undefined){
            if(this.outboundDelievryItemsList[index].batchLength==0 && this.outboundDelievryItemsList[index].batchNum==''){
                this.commonService.responseMessages("", "No batches for this item", "warning");
                return false    
            }
            if(this.outboundDelievryItemsList[index].batchNum==''){
                if(this.outboundDelievryItemsList[index].displayRow){
                  flag=true;  
                  matNum=this.outboundDelievryItemsList[index].matnr;
                  count++; 
                 }
            } 
           }   
         }   
    }
    if(!flag){
        this.commonService.responseMessages("", "Please select any one item", "warning");
        return false;
    }else{
        if(flag && count>1){
            this.commonService.responseMessages("", "Please select only one item", "warning");
            return false;    
        }    
    }
    $('#loadingIcon').show();
    $("#black-overlay").show();
    this.batchstockList=[];
    let itemNumList:any=[];
    let url:any = this.environment.getRequiredApi( 'get_inventory_stock' )+"?bp_id="+this.bpId+"&org_id="+this.orgId+"&mat_num="+matNum+"&";
    this.commonService.getData(url, 'GET','',this.accessObjectId).subscribe(( response ) => {
        if(response.status==0){
            this.batchstockList=[];
            itemNumList=[];
            response.data['ex_stock_dets'].forEach(currentItem=>{
            if(this.checkedObjects.length>0){
                 let countLength:any=0;
                 let batchPosnr:any=0;
                 for(let index of this.checkedObjects){
                    if(index!=undefined){
                    if(this.outboundDelievryItemsList[index].batchNum==''){
                        countLength=0;
                        if(currentItem.mat_no==this.outboundDelievryItemsList[index].matnr){
                            batchPosnr=0;
                            this.outboundDelievryItemsList[index].batch_stock=currentItem.batch_stock;
                            let startRow:any={};
                            startRow=jQuery.extend({}, this.outboundDelievryItemsList[index]);
                            itemNumList.push(startRow);
                            countLength=this.outboundDelievryItemsList[index].batchLength;
                        } 
                    }
                   }
                 }
              }
           });
                let batchstockList1:any=[];
                itemNumList.forEach(res=>{
                    batchstockList1.push(res);
                        res.batch_stock.forEach(currentIndex=>{
                              currentIndex.vgbel=res.vgbel;
                              currentIndex.vgpos=res.vgpos;
                              currentIndex.matnr=res.matnr;
                              currentIndex.arktx=res.arktx;
                              currentIndex.meins=res.meins;
                              currentIndex.insert=false;
                              batchstockList1.push(currentIndex); 
                        });
                });
                let stockCount:any=0;
                let batchLength:any=0;
                let batchPosnr:any=0;
                let posItem:any=0;
                batchstockList1.forEach(resList=>{
                 if(resList.batchNum==''){
                     batchLength=resList.batchLength; 
                     batchPosnr=0;
                     posItem=resList.posnr;
                     resList.oldlfimg=resList.lfimg; 
                     this.batchstockList.push(resList); 
                 }
                 if(!resList.hasOwnProperty('batchNum')){
                     for(let index of this.checkedObjects){
                         if(index!=undefined){
                           if(this.outboundDelievryItemsList[index].batchNum!=''){
                               if(resList.batch_no==this.outboundDelievryItemsList[index].charg){
                                    resList.posnr= this.outboundDelievryItemsList[index].posnr;  
                                    resList.lfimg= this.outboundDelievryItemsList[index].lfimg; 
                                    resList.batchNum=posItem;
                                    resList.uecha=this.outboundDelievryItemsList[index].uecha;
                                    resList.uom=this.outboundDelievryItemsList[index].uom;
                                    resList.vrkme=this.outboundDelievryItemsList[index].uom;
                                    resList.umvkz=this.outboundDelievryItemsList[index].umvkz;
                                    resList.umvkn=this.outboundDelievryItemsList[index].umvkn;
                                    resList.insert=true;
                                    this.batchstockList.push(resList);
                                }
                           }
                       }
                     }
                  }
                  stockCount++;
                });
                let batchLength1:any=0;
                let batchPosnr1:any=0;
                let posItem1:any=0;
                batchstockList1.forEach(resList=>{
                 if(resList.batchNum==''){
                     batchLength1=resList.batchLength; 
                     batchPosnr1=0;
                     posItem1=resList.posnr;  
                 }
                 if(!resList.hasOwnProperty('batchNum') && !resList.insert){
                     //for(let index of this.checkedObjects){
                           //if(this.outboundDelievryItemsList[index].batchNum!=''){
                               //if(resList.batch_no!=this.outboundDelievryItemsList[index].charg){
                                  if(batchPosnr1==0){
                                      batchPosnr1=this.outboundDelievryItemsList[batchLength1].posnr;
                                 }
                                 batchPosnr1=parseFloat(batchPosnr1)+1
                                 resList.posnr="";
                                 resList.uom=this.outboundDelievryItemsList[batchLength1].uom;
                                 resList.vrkme=this.outboundDelievryItemsList[batchLength1].uom;
                                 resList.umvkz=this.outboundDelievryItemsList[batchLength1].umvkz;
                                 resList.umvkn=this.outboundDelievryItemsList[batchLength1].umvkn;
                                 resList.uecha=posItem1;
                                 resList.batchNum=posItem1;
                                 resList.lfimg=0; 
                                 this.batchstockList.push(resList);
                               //}
                           //}
                       //}
                  }
                });
            $('#loadingIcon').hide();
            $("#black-overlay").hide();
            $("#displayBatchDetermination").modal('show');
    }else{
            $('#loadingIcon').hide();
            $("#black-overlay").hide();
            this.commonService.responseMessages("", response.message, "warning");
        }
  });
 }
batchQtyValidation(batchList,id){
    if(batchList.lfimg==""){
       batchList.lfimg=0;     
    }
    let qty:any=parseFloat(batchList.lfimg);
    let totQty:any=parseFloat(batchList.available_qty);
    if(qty>totQty){
         this.commonService.responseMessages("", "Quantity "+qty+" is greaterthan  total quantity "+totQty+"", "warning");
         $("#batchdr-qty-"+id).attr('style','border:1px solid red'); 
         this.batchSaveFlag=true;
         return false; 
    }else{
         $("#batchdr-qty-"+id).removeAttr('style'); 
    }
    let batchQty:any=null;
    let count:any=1;
    this.batchstockList.forEach(currentItem=>{
       if(currentItem.batchNum!=''){
           if(batchQty==null){
            batchQty=parseFloat(currentItem.lfimg);
           }else{
            batchQty= batchQty+parseFloat(currentItem.lfimg);   
           }    
       } 
       if(this.batchstockList.length==count){
           if(batchQty > this.batchstockList[0].oldlfimg){
                $('.batchDr').attr('style','border:1px solid red');
               this.commonService.responseMessages("", "Quantity "+batchQty+" is greaterthan  total quantity "+this.batchstockList[0].lfimg+"", "warning");
               this.batchSaveFlag=true;
               return false;   
           }else{
               $('.batchDr').removeAttr('style');
           }
           this.batchstockList[0].lfimg=batchQty;
       }
       count++;
    });
   setTimeout(()=>{this.enableBatchSaveBtn()},400);
}
enableBatchSaveBtn(){
    if($('.batchDr').css('border')!='1px solid rgb(255, 0, 0)'){
        this.batchSaveFlag=false;
    }    
}
saveBatchSplit(){
 let count:any=0;
 let newBatchSplitList:any=[];
 for(let index of this.outboundDelievryItemsList){
     if(this.checkedObjects.indexOf(count)!=-1){
         index.displayRow=false;
         index.updateFlag="D";
         index.batchDTRFlag=true;
     }
     if(index.batchNum!=''){
       if(this.batchNumsList.indexOf(index.posnr)==-1){
            this.batchNumsList.push(index.posnr);  
       }  
     }
     count++;
 }
newBatchSplitList=this.outboundDelievryItemsList;
this.batchNumsList.sort(function(a, b) { return a - b });
let concatStockList:any=[]
 this.batchstockList.forEach(currentItem=>{
    if(currentItem.batchNum==''){
        currentItem.displayRow=true;
        currentItem.state='';
        concatStockList.push(currentItem);    
    }else{
        if(currentItem.lfimg!=0 && currentItem!=""){
            currentItem.displayRow=true;
            currentItem.charg=currentItem.batch_no;
            currentItem.state='';
           concatStockList.push(currentItem);     
        }    
    } 
 });

let generatePosnr:any=0;
concatStockList.forEach(indexItem=>{
   if(indexItem.batchNum!='' && indexItem.posnr==""){
       console.log(this.batchNumsList[this.batchNumsList.length-1]);
       let highBtNum:any=this.batchNumsList[this.batchNumsList.length-1];
       if(generatePosnr==0){
            generatePosnr= parseFloat(highBtNum)+1;   
       }else{
           generatePosnr=parseFloat(generatePosnr)+1; 
       }
       indexItem.posnr=generatePosnr;
   } 
});
this.outboundDelievryItemsList=[];
console.log(newBatchSplitList);
this.outboundDelievryItemsList=concatStockList.concat(newBatchSplitList); 
$("#displayBatchDetermination").modal('hide');  
this.checkedObjects=[]; 
this.indeterminate=false;
this.checked=false;
}
}