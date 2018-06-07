import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http , Headers, Response,RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { ExcelService } from '../../services/excel.service';
import { MessagePropertiesService } from '../../services/message-properties.service';
import {EnvConfigurationService} from '../../services/env-configuration.service';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';


declare var $: any; 
declare var jQuery: any;
declare var swal: any;

@Component({
  selector: 'app-customer-delarwise-report',
  templateUrl: './customer-delarwise-report.component.html',
  styleUrls: ['./customer-delarwise-report.component.css']
})
export class CustomerDelarwiseReportComponent implements OnInit {

  filterDelarwiseReportForm:FormGroup;
  customerNames:any;
  bpId:any;
  orgId:any;
  accessObjectId:any;
  delarWiseReportMessages:any;
  delarshipRptList:any;
  errorLogs:any;
  mddAmt:any;
  pcdAmt:any;
  kadAmt:any;
  userType:any;
  constructor(private http: Http, private formBuilder: FormBuilder,
          private router: Router,private ref: ChangeDetectorRef,private app:AppComponent, private messagesService:MessagePropertiesService,
          private commonService:CommonService,private environment:EnvConfigurationService,private excelService: ExcelService) { 
     this.app.isActive=true;
     this.filterDelarwiseReportForm = formBuilder.group({
          hideRequired: false,
          floatLabel: 'auto',
          'plant'   : [''],
          'plantTo' : [''],
          'billToDate' : [''],
          'billDate' : ['', Validators.required],
          'custName' : [''], 
          'custToName':[''],
          'disChanel' : [''],
          'todisChanel':[''],
          'salesgroup':['']
        });
     this.bpId=localStorage.getItem("bpId");
     this.orgId=localStorage.getItem("orgId");
     this.accessObjectId=localStorage.getItem("Reports Gallery");
     this.customerNames=[];
     this.delarWiseReportMessages = messagesService.delarwisereposrt_msg;
     this.delarshipRptList=[];
     this.errorLogs=[];
     this.mddAmt=0;
     this.pcdAmt=0;
     this.kadAmt=0;
     this.userType=localStorage.getItem("bpType");
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
    $(function() {
          $(document).on('click', function (e) {
            if (!$(e.target).hasClass('ajax-list')) {
                  $(".ajax-searchlist").hide();
              }
           });
            
        });
    this.applyDataTable();
  }
applyDataTable(){
      setTimeout(()=>{
          var table = $('#delarwise-report-table').DataTable({
             "order": [[0,'asc']],
              "bPaginate": false,
                "bInfo": false,
             retrieve:true,
             "language": {
                 "emptyTable": "No data available",
                 "info": "Showing page _PAGE_ of _PAGES_",
                 "infoFiltered": "(filtered from _MAX_ total records)",
                // "searchPlaceholder" : "Search..."
               },
             columnDefs: [ {
                          "targets": 'no-sort',
                           "orderable": false
                     },
                 { type: 'currency', "targets": [6,7,8] } ],
             "fnDrawCallback": function(oSettings) {
                 if (10 >= oSettings.fnRecordsDisplay()) {
                   $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
              //     $(oSettings.nTableWrapper).find('.dataTables_filter').hide();
                   $(oSettings.nTableWrapper).find('.dataTables_info').hide();
                   //$(oSettings.nTableWrapper).find('.dataTables_length').hide();
                 } else {
               $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
             //    $(oSettings.nTableWrapper).find('.dataTables_filter').show();
                 $(oSettings.nTableWrapper).find('.dataTables_info').show();
                   //  $(oSettings.nTableWrapper).find('.dataTables_length').show();
                 }
               },
                   });
          $('#delarwise-report-table_filter input').val();
          $("#searchStock").remove();
         // $("#sales-order-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
         // $("#sales-table").show();
          setTimeout(()=>{
              var width=$("#mainContent").css("width");
              $(".outbound-footer").css("width",width);
              $(".outbound-footer").show();
          },50);
      },500);
      setTimeout(() =>{
          $(".dataTables_scrollHeadInner").css({"width":"100%"});
          $(".table ").css({"width":"100%"});    
          },600);
  }
changeValidate(id){
        let date:any=$("#"+id).val();
        if(id=="bill-to-date"){
            this.filterDelarwiseReportForm.controls['billToDate'].setValue(date);
        }else{
            this.filterDelarwiseReportForm.controls['billDate'].setValue(date);
        }
        
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
            
        }
    });
    }else{
       if(term==""){
           this.customerNames=[];
           $("#"+spinnerId).hide();
           $("#filterCustomerId").val("");
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
selectedItem(response,modalBlock,textInput,hiddenInput){
    if(response.cust_name==null && response.cust_name==undefined){
        $("#"+textInput).val(response.cust_id);
    }else{
        let cutname:any=response.cust_id+"-"+response.cust_name;
        $("#"+textInput).val(cutname);    
    }
    
    $("#"+hiddenInput).val(response.cust_id);
    $("#"+modalBlock).hide();
}
getFilterData(){
    this.mddAmt=0;
    this.pcdAmt=0;
    this.kadAmt=0;
    $('#loadingIcon').show();
    $("#black-overlay").show();
    let payload:any={};
    let blgDate:any=null;
    let convertDate:any=null;
    let convertToDate:any=null;
    blgDate=$("#bill-date").val();
    if(blgDate!=undefined && blgDate!=""){
        blgDate=blgDate.split('/'); 
        convertDate=blgDate[2]+""+blgDate[1]+""+blgDate[0];       
    }
    payload['from_bill_date']=convertDate;
    let blgtoDate:any=null;
    blgtoDate=$("#bill-to-date").val();
    if(blgtoDate!=undefined && blgtoDate!=""){
        blgtoDate=blgtoDate.split('/'); 
        convertToDate=blgtoDate[2]+""+blgtoDate[1]+""+blgtoDate[0];       
    }
    payload['to_bill_date']=convertToDate;
    if(this.userType=='SS' || this.userType=='KAD'){
        payload['from_ship_point']=localStorage.getItem("plantId");
    }else{
        payload['from_ship_point']=null;
    }
    payload['to_ship_point']=null;
    payload['from_customer']=null;
    payload['to_customer']=null;
    payload['from_dist_channel']=null
    payload['to_dist_channel']=null;
    payload['sales_group']=null;
   
    if($("#filterCustomerId").val()!=""){
       payload['from_customer']=$("#filterCustomerId").val(); 
    }
    if($("#filterCustomerId-1").val()!=""){
       payload['to_customer']=$("#filterCustomerId-1").val(); 
    }
    if($("#salesgroup").val()!=""){
        payload['sales_group']=$("#salesgroup").val();
    }
    if(this.userType!='SS' && this.userType!='KAD'){
        if($("#plant").val()!=""){
           payload['from_ship_point']=$("#plant").val().toUpperCase();
        }
        if($("#plantTo").val()!=""){
           payload['to_ship_point']=$("#plant").val(); 
        }
        if($("#dischanel").val()!=""){
           payload['from_dist_channel']=$("#dischanel").val(); 
        }
        if($("#todischanel").val()!=""){
           payload['to_dist_channel']=$("#todischanel").val(); 
        }
    }
    payload['bp_id']=this.bpId;
    payload['org_id']=this.orgId;
    let url:any=this.environment.getRequiredApi("get_delarwise_sales_rpt")+"?";
    this.commonService.getData(url, "POST", payload, this.accessObjectId).subscribe((response)=>{
          if(response.status==0){
              if(response['data'].hasOwnProperty('ex_dealerwsie_list')){
                this.delarshipRptList=response['data'].ex_dealerwsie_list;
                $("#filter-block").hide();
                for(let dlList of this.delarshipRptList){
                    this.mddAmt=this.mddAmt+parseFloat(dlList.mdd);
                    this.pcdAmt=this.pcdAmt+parseFloat(dlList.pcd);
                    this.kadAmt=this.kadAmt+parseFloat(dlList.kad);
                }
               }
              if(response['data'].hasOwnProperty('ex_return')){
                for(let index of response.data.ex_return){
                        if (index.type=="E") {
                            this.errorLogs = response.data.ex_return;
                            $("#delarwiseReport-errors").modal("show");
                            $('#loadingIcon').hide();
                            $("#black-overlay").hide();
                            //this.filterDelarwiseReportForm.reset();
                            //$("#filterCustomerId").val("");
                            return false;
                           }
                        }    
              }
              //this.filterDelarwiseReportForm.reset();
              //$("#filterCustomerId").val("");
          }else{
            this.commonService.responseMessages("", response.message, "warning")    
          }
        
        $('#loadingIcon').hide();
        $("#black-overlay").hide();
        $('#delarwise-report-table').DataTable().destroy();
        this.applyDataTable();
     });    
}
closeModal(id){
      $("#"+id).modal("hide");
}
navigateToRepGallery(){
    const path: any = "rptsgallery";
    this.router.navigate([path]);
    }
exportExcel(){
    if(this.delarshipRptList.length>0){
        for(let index of this.delarshipRptList){
            if(!index.hasOwnProperty('sold_to_party')){
                index.sold_to_party="";
            }
            if(!index.hasOwnProperty('sold_to_name')){
                index.sold_to_name="";
            }
            if(!index.hasOwnProperty('ship_to_party')){
                index.ship_to_party="";
            }
            if(!index.hasOwnProperty('ship_to_name')){
                index.ship_to_name="";
            }
            if(!index.hasOwnProperty('city')){
                index.city="";
            }
            if(!index.hasOwnProperty('state')){
                index.state="";
            }
            if(!index.hasOwnProperty('mdd')){
                index.mdd="";
            }
            if(!index.hasOwnProperty('pcd')){
                index.pcd="";
            }if(!index.hasOwnProperty('kad')){
                index.kad="";
            }
        }
        let jsonArrrayData: any = [];
        let columnHeaders:any=['Sold to party','Name','Ship to party','Ship to party Name(Hospital)','City','State','MDD','PCD','KAD'];
        let columns:any=['sold_to_party','sold_to_name','ship_to_party','ship_to_name','city','state','mdd','pcd','kad']
        jsonArrrayData=this.delarshipRptList;
        let jsonData: any = JSON.stringify(jsonArrrayData);
    this.excelService.JSONToCSVConvertor(jsonArrrayData, "", "Dealers Report", columns, columnHeaders, 'dealer_Report');
    }else{
        this.commonService.responseMessages("", "No Data Available To Export", "warning")  
    }
}
showFilters(){
    $("#filter-block").slideToggle();  
}
}
