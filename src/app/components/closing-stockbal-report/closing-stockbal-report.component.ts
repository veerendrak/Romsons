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
  selector: 'app-closing-stockbal-report',
  templateUrl: './closing-stockbal-report.component.html',
  styleUrls: ['./closing-stockbal-report.component.css']
})
export class ClosingStockbalReportComponent implements OnInit {

  bpId:any;
  orgId:any;
  accessObjectId:any;
  downloadUrl:any;
  pageNum:any;
  pageSize:any;
  sortBy:any;
  stockBalanceList:any;
  stockBalanceListLength:any;
  paginationCount:any;
  paginationArray:any;
  startIndex:any;
  endIndex:any;
  totalEndCount:any;
  sortOrder:any;
  stockBalanceStatus:any;
  sortNum:any;
  searchFilterByMaterialCd:any;
  stockListDetails:any;
  changedStockListDetails:any;
  searchBy:any;
  statusDesc:any;
  constructor(private http: Http, private formBuilder: FormBuilder,
          private router: Router,private ref: ChangeDetectorRef,private app:AppComponent, private messagesService:MessagePropertiesService,
          private commonService:CommonService,private environment:EnvConfigurationService,private excelService: ExcelService) {
        this.app.isActive=true;
        this.bpId=localStorage.getItem("bpId");
        this.orgId=localStorage.getItem("orgId");
        this.accessObjectId=localStorage.getItem("Closing Stock Report");
        this.pageNum=1;
        this.pageSize=10;
        this.sortBy=null;
        this.stockBalanceList=[];
        this.stockBalanceListLength=0;
        this.paginationArray=[];
        this.sortOrder="asc";
        this.sortBy="omOrgBusinessPartners.erpRefId,asc";
        this.sortNum=1;
        this.searchFilterByMaterialCd="";
        this.stockListDetails={};
        this.changedStockListDetails=[];
        this.stockBalanceStatus=""
        this.searchBy=""; 
        this.statusDesc={
            "D":"Downloaded",
            "L":"Locked",
            "U":"Uploaded",
            "":" "
        }         
}

  ngOnInit() {
      this.getClosingStockReport();
  }
getClosingStockReport(){
    $("#stock-table").hide();
      $('#loadingIcon').show();
      $("#black-overlay").show();
    var filterVal=$("#filterSearch").val();
    this.searchBy=filterVal;
    let url:any;
      if(this.searchBy!=null && this.searchBy!=undefined){
          url=this.environment.getRequiredApi('get_closing_stock_report')+"?bp_id="+this.bpId+"&org_id="+this.orgId+"&pg_num="+this.pageNum+"&pg_size="+this.pageSize+"&sort_by="+this.sortBy+"&search_by="+this.searchBy+"&";
      }else{
          url=this.environment.getRequiredApi('get_closing_stock_report')+"?bp_id="+this.bpId+"&org_id="+this.orgId+"&pg_num="+this.pageNum+"&pg_size="+this.pageSize+"&sort_by="+this.sortBy+"&";
      }
    this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response=>{
        if(response.status==0){
            let downloadUrl:any="";
            this.pageNum=response["data"].pg_num;
            this.pageSize=response["data"].pg_size;
            this.sortBy=response["data"].sort_by;
            let recordsCount:number=response["data"].ttl_cnt;
            let recordsSize:number=response["data"].pg_size;
            let pagePer:number=recordsCount % recordsSize;
            this.paginationCount=recordsCount/recordsSize;
            if(pagePer==0){
                this.paginationCount= this.paginationCount;     
              }else{
                 this.paginationCount=this.paginationCount+1; 
              }
            this.paginationArray=[];
            for(let i=1; i<=this.paginationCount; i++){
                let j=i;
                this.paginationArray.push(j);    
            }
            this.startIndex=0;
            this.endIndex=this.paginationArray.length;
            this.totalEndCount=this.endIndex-1;
            var columnList=this.sortNum;
            var columnOrder=this.sortOrder;
            var orderArray;
            var arrayColumn=[];
            this.stockListDetails={};
            this.stockBalanceList=[];
            orderArray=[[this.sortNum,this.sortOrder]];
                this.stockListDetails=response;
                this.stockBalanceList=response["data"].op_bal_list;
                this.stockBalanceListLength=this.stockBalanceList.length;
                if(this.stockBalanceList.length>0){
                    this.stockBalanceList.forEach(currentItem=>{
                       downloadUrl=this.environment.getRequiredApi("dnld_closing_stock_report")+"?bp_id="+currentItem.bp_id+"&org_id="+currentItem.org_id+"&access_obj_id="+this.accessObjectId+"&access_token="+localStorage.getItem("token");
                       currentItem.actionUrl=downloadUrl; 
                    });
                }
                var pageno=this.pageNum;
                var total=this.paginationArray.length;
                $("#stock-balance-table").DataTable().destroy();
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
                setTimeout(function(){
                    var table = $('#stock-balance-table').DataTable({
                       "order": orderArray,
                       retrieve:true,
                       "language": {
                           "emptyTable":     "No data available",
                           
                       },
                       columnDefs: [ {
                                    "targets": 'no-sort',
                                     "orderable": false
                               } ],
                       bPaginate: false,
                       bInfo:false
                             });
                    $('.pageNum').each(function(i){
                        $(this).removeClass('active-1');
                        $("#previous").removeAttr('style');
                        $("#next").removeAttr('style');
                        $("#"+pageno).addClass('active-1');
                      var selectpreviousPage=pageno-2;
                      var currentpage=pageno-1
                      var selectnextpage=pageno;
                        if(total>5){
                            var count=5;
                          if(i<count){
                              if(pageno!=5 && pageno<5 ){
                                      $("#previous-wrapper").hide(); 
                                      $(this).parent().show();
                                  }else{
                                   $("#previous-wrapper").show(); 
                                  $("#previous-wrapper").attr('style','margin-left:-6px;');
                                  $("#page-0").show();
                                   $(this).parent().hide();
                                   $("#page-"+selectpreviousPage).show();
                                  $("#page-"+currentpage).show();
                              }
                          }else{
                            $(this).parent().hide();
                            $("#next-wrapper").show();
                              if(pageno>=5){
                                  $("#page-"+selectpreviousPage).show();
                                  $("#page-"+currentpage).show();
                                  $("#page-"+selectnextpage).show();
                                  }
                              var tCount=total-1;
                              var nextCount=total-4;
                            if(i==tCount){
                               $(this).attr('style','margin-left:-6px;');
                               $(this).parent().show();
                            } 
                            if(selectnextpage==total || selectnextpage==tCount || selectpreviousPage==nextCount){
                                $(this).removeAttr('style');
                                $("#next-wrapper").hide();
                            }
                          }    
                        }else{
                            $(this).parent().show();
                        }
                         if(pageno==1){
                              $("#previous").attr('style','background:#f2f4f8; cursor:text;color:#6d6c6c !important;');    
                         }else{
                            if(pageno==total){
                               $("#next").attr('style','background:#f2f4f8; cursor:text;color:#6d6c6c !important;'); 
                            }  
                         }  
                         $("#stock-table").show();
                         setTimeout(()=>{
                             var width=$("#mainContent").css("width");
                             $(".outbound-footer").css("width",width);
                             $(".outbound-footer").show();
                         },150);
                  });
                    
                    $('#stock-balance-table_filter input').val(filterVal);
                    $("#searchStock").remove();
                    $("#stock-balance-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
                    $('#stock-balance-table_filter input').unbind();
                    $('#stock-balance-table_filter input').bind('keyup', function(e) {
                        console.log( 'Currently applied global search: '+this.value);
                        var value=this.value;
                        if(value!=""){
                            $("#filterSearch").val(value); 
                        }else{
                            $("#filterSearch").val(value);
                            $("#refeshStockBalance").click();
                        }
                });
                    $('.searchStock').click(function() {
                        $("#refeshStockBalance").click();
                    });
                    $("#stock-table").show();
                },500);
            
        }else{
            $("#stock-balance-table").DataTable().destroy();
            this.stockBalanceList=[];
            this.stockBalanceListLength=0;
            this.paginationArray=[];
            $('#loadingIcon').hide();
            $("#black-overlay").hide();
            orderArray=[[this.sortNum,this.sortOrder]];
            setTimeout(()=>{
                
                $("#stock-balance-table").DataTable({
                    retrieve:true,
                    bPaginate:false,
                    "language": {
                        "emptyTable": "No data available",
                        "info": "Showing page _PAGE_ of _PAGES_",
                        "infoFiltered": "(filtered from _MAX_ total records)",
                        
                      },
                      columnDefs: [ {
                          "targets": 'no-sort',
                           "orderable": false
                     } ],
                     "bInfo":false
                });
                $("#searchStock").remove();
                $("#stock-balance-table_filter").append("<i class='fa fa-search searchStock' id='searchStock'></i>");
                $('#stock-balance-table_filter input').val(filterVal);
                $('#stock-balance-table_filter input').unbind();
                $('#stock-balance-table_filter input').bind('keyup', function(e) {
                    console.log( 'Currently applied global search: '+this.value);
                    var value=this.value;
                    if(value!=""){
                        $("#filterSearch").val(value); 
                    }else{
                        $("#filterSearch").val(value);
                        $("#refeshStockBalance").click();
                    }
            });
                $('.searchStock').click(function() {
                    $("#refeshStockBalance").click();
                });
                $("#stock-table").show();
                setTimeout(()=>{
                    var width=$("#mainContent").css("width");
                    $(".outbound-footer").css("width",width);
                    $(".outbound-footer").show();
                    $("#desc-2").attr('style','min-width:335px !important');
                },200);
            },500);
            
            this.commonService.responseMessages("", response.message, "warning");
            
        } 
        
     });

}
navigatePreviousPage(){
    let pageNum:number=parseInt(this.pageNum);
    pageNum=pageNum-1;
    if(pageNum!=0){
       this.pageNum=pageNum;
       this.pageSize=$("#showPageSize").val();
       this.getClosingStockReport();
    }else{
        return false    
    }
}
navigateNextPage(pageNum){
    this.pageNum=parseInt(pageNum);
    this.pageSize=$("#showPageSize").val();
     this.getClosingStockReport();
}
navigatePageNext(){
    let pageNum:number=parseInt(this.pageNum);
     pageNum=pageNum+1;
     let count:number=this.paginationArray.length;
     if(pageNum<=count){
         this.pageNum=pageNum;
         this.pageSize=$("#showPageSize").val();  
         this.getClosingStockReport();
    }else{
         return false    
     } 
}
filterPageSizeRecords(){
    this.pageNum=1;
    this.pageSize=$("#showPageSize").val();
    this.getClosingStockReport();

}
sortByColumn(sortByField,sortNumber,columnId){
    this.sortNum="";
        this.sortNum=sortNumber;
    if($("#"+columnId+"-"+sortNumber).hasClass("sorting_asc")){
        this.sortOrder='desc'
        this.sortBy=sortByField+","+this.sortOrder;
    }else{
        this.sortOrder='asc'
        this.sortBy=sortByField+","+this.sortOrder;
    }
   this.getClosingStockReport(); 
}
}
