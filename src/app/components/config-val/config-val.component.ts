import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef,HostListener} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { DateAdapter } from '@angular/material';
import { MessagePropertiesService } from '../../services/message-properties.service';
import { ExcelService } from '../../services/excel.service';
import {EnvConfigurationService} from '../../services/env-configuration.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-config-val',
    templateUrl: './config-val.component.html',
    styleUrls: ['./config-val.component.css']
})
export class ConfigValComponent implements OnInit {
    configGrpList: any;
    checked: boolean = false;
    indeterminate: boolean = false;
    accessObjectId: any;
    bpId: any;
    orgId: any;
    checkboxErrorMsg: any;
    configValueForm: FormGroup;
    bPartners: any;
    configValSampleList: any;
    configValSampleObj: any;
    checkedObjects: any;
    configChildList: any;
    configValueList: any;
    cnfValueList: any;
    cnfGrpDrpDwnDisable: boolean;
    selectedFlag:boolean;
    configGroupId:string;
    headerListOnConfigGrp:any;
    headerArr=[1,2,3,4,5,6,7,8,9,10];
    selectedBPid:string;
    configMulChkList:any;
    managebleFlag:boolean;
    defaultPageNumber:any = 100;
    completeConfigList:any=[];
    lastIndexOfpage:any =0;
    pg_num:number=1;
    pg_size:number=50;
    ttl_cnt:number=0;
    resp_pg_size = 0;
    resp_pg_num = 0;
    keyId:any=0;
    grpText:string="";
    scrollCount:number=0;
     confGrp:string = "";
     groupText:string ="";

    constructor(private http: Http, private formBuilder: FormBuilder,private activatedRoute:ActivatedRoute,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private environment: EnvConfigurationService, private excelService: ExcelService) {
        this.app.isActive = true;
        this.checked = false;
        this.indeterminate = false;
        this.configGrpList = [];
        this.configChildList = [];
        this.checkboxErrorMsg = this.messagesService.check_box_error;
        this.orgId = localStorage.getItem("orgId");
        this.configValueForm = formBuilder.group({
            'group': [''],
            'bp_id': [''],
        });
        this.configValSampleList = [];
        this.configValSampleObj = {};
        this.checkedObjects = [];
        this.cnfValueList = [];
        this.cnfGrpDrpDwnDisable = false;
        this.selectedFlag=false;
         this.headerListOnConfigGrp={};
        this.selectedBPid="";
        this.configMulChkList=[];
        this.managebleFlag =false;
        this.defaultPageNumber=100;
        this.completeConfigList=[];
        this.pg_num = 1;
        this.pg_size = 50;
        this.ttl_cnt = 0;
        this.resp_pg_size = 0;
        this.resp_pg_num = 0;
        this.groupText="";
    }

    ngOnInit() {
        
        this.activatedRoute.queryParams.subscribe(params => {
            this.configGroupId = params['group'];
        });
            this.getConfigGroupList();    
            $(window).scroll(function() {
                if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                    $("#loadNxtRows").click();
                }
            })
        this.getBusinessPartnerDet();
        for (let index = 0; index < 2; index++) {
            this.configValSampleObj = {};
            this.configValSampleObj["parentValId"] = "";
            this.configValSampleObj["key"] = "";
            this.configValSampleObj["value"] = "";
            this.configValSampleObj["addField1"] = "";
            this.configValSampleObj["addField2"] = "";
            this.configValSampleObj["addField3"] = "";
            this.configValSampleObj["addField4"] = "";
            this.configValSampleObj["addField5"] = "";
            this.configValSampleObj["addField6"] = "";
            this.configValSampleObj["addField7"] = "";
            this.configValSampleObj["addField8"] = "";
            this.configValSampleObj["addField9"] = "";
            this.configValSampleObj["addField10"] = "";
           // this.configValSampleObj["orgId"] = this.orgId;
            this.configValSampleObj["bpId"] = "";
            this.configValSampleObj["configGroupId"] = "";
            this.configValSampleObj["configValId"] = "";
            this.configValSampleObj["displayRow"] = true;
            this.configValSampleObj["mark_as_delete"] = false;
            this.configValSampleList.push(this.configValSampleObj);
        }
        
        this.configMulChkList = this.configValSampleList;
        this.headerListOnConfigGrp['add_field1']="Field 1"
        this.headerListOnConfigGrp['add_field2']="Field 2"
        this.headerListOnConfigGrp['add_field3']="Field 3"
        this.headerListOnConfigGrp['add_field4']="Field 4"
        this.headerListOnConfigGrp['add_field5']="Field 5"
        this.headerListOnConfigGrp['add_field6']="Field 6"
        this.headerListOnConfigGrp['add_field7']="Field 7"
        this.headerListOnConfigGrp['add_field8']="Field 8"
        this.headerListOnConfigGrp['add_field9']="Field 9"
        this.headerListOnConfigGrp['add_field10']="Field 10"
        setTimeout(() => {
                var width = $("#mainContent").css("width");
                $(".outbound-footer").css("width", width);
                $(".outbound-footer").show();
            }, 50);

    }

    getConfigValueList() {

        $('#loadingIcon').show();
        $("#black-overlay").show();
        let url: any = this.environment.getRequiredApi("config_value_list") + "?";
        this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe((response) => {

            if (response.status == 0) {
                this.configValueList = response.data.configValues;
                

            } else {
                this.commonService.responseMessages("", response.message, "warning")
            }

            $("#conf-grp-table").DataTable().destroy();
            this.applyDataTable();

            $('#loadingIcon').hide();
            $("#black-overlay").hide();


        });


    }









    getConfigGroupList() {

        $('#loadingIcon').show();
        $("#black-overlay").show();
        let url: any = this.environment.getRequiredApi("config_grp_list") + "?";
        this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe((response) => {

            $("#conf-grp-table").DataTable().destroy();
            if (response.status == 0) {
                if (response.data.hasOwnProperty("configGroups")) {
                    this.configGrpList = response.data.configGroups;
                  
                    this.configGrpList.forEach((items,index)=>{
                        
                        if(!items.hasOwnProperty("parent_id")){
                            items["parent_id"]="";
                        }
                        items["keyId"]=index;
                        
                    })
                    
                }


            } else {
                this.commonService.responseMessages("", response.message, "warning")
            }
            

            $('#loadingIcon').hide();
            $("#black-overlay").hide();


        });


    }
    
   
    
    getCongifGrpHeaders(groupText){
        this.headerListOnConfigGrp ={};
        $("#add_flds").removeAttr("style", "display:none");
        for(let index of this.headerArr ){
             $("#th_add_field"+index).removeAttr("style", "display:none");  
        }
        
        
        
        this.configGrpList.forEach((items)=>{
            if(items.group_name == groupText){
                this.headerListOnConfigGrp =$.extend(true, {}, items);
                
               
                for(let index of this.headerArr ){
                    if(!items.hasOwnProperty("add_field"+index)){
                    this.headerListOnConfigGrp["add_field"+index]="";
                        
                        $("#th_add_field"+index).attr("style", "display:none");    
                        
                        
                        
                    //this.headerListOnConfigGrp["dispRow"+index]=false;     
                }    
                }
                //addField1
                
                
            }    
        })
         
       for(let index of this.headerArr ){
             if($("#th_add_field"+index).attr("style") == undefined){
                 break;
             }else{
                 $("#add_flds").attr("style", "display:none"); 
             } 
        }
        
        
        
            
    }
    
    getConfigWithBpid(bpId,confGrp){
        this.selectedBPid = bpId;
        if(confGrp.length != 0){
         this.setParentList(confGrp,"");    
        }else{
           this.commonService.responseMessages("", "Please select config group", "warning")  
        }
        
    }
    
    setParentList(keyId,grpText) {
        
        if(keyId != this.keyId && grpText != this.grpText){
            this.pg_num = 1;
            this.pg_size =50;
            this.scrollCount
        }
        
        
        
         if(this.scrollCount ==0 ){
             let newCnfgArr = this.configGrpList.filter(value => value.keyId === parseInt(keyId));
             this.managebleFlag = newCnfgArr[0].is_manageble
             this.confGrp = newCnfgArr[0].parent_id;
         }
       

        
        let bpIdConcat="";
        let appendBpId="pg_num="+this.pg_num+"&pg_size="+this.pg_size+"&";
        if(grpText == null || grpText.length == 0 ){
            this.groupText = $( "#confg_grps_id option:selected" ).text().trim();
        }else{
            this.groupText = grpText;
        }
        
        this.configChildList = [];
        if(this.selectedBPid.length !=0){
            //appendBpId =appendBpId+ "bp_id="+this.selectedBPid+"&";
            bpIdConcat = "bp_id="+this.selectedBPid+"&";
        }
        //this.scrollCount=1;
        
        
        $('#loadingIcon').show();
        $("#black-overlay").show();
        
        
        
        if (this.groupText != "" || this.groupText.length != 0) {
           

            let url: any = this.environment.getRequiredApi("config_value_list") + "?group=" + this.groupText + "&"+bpIdConcat;
             if (this.groupText == "MTRLS" ){
                 url = url+appendBpId;
             }
            this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe((response) => {
               
                if(this.scrollCount ==0 ){
                this.configValSampleList = [];    
                }
                
                   
                if (response.status == 0) {
                    
                    if (this.groupText == "MTRLS") {
                        response.data.configValues.forEach((items,index) => {

                        items["displayRow"] = true;
                        items["selval"] = items.value;
                    })
                       this.configValSampleList= this.configValSampleList.concat(response.data.configValues);
                    } else {
                        this.configValSampleList = response.data.configValues;
                        this.configValSampleList.forEach((items,index) => {

                        
                        items["displayRow"] = true;
                        items["selval"] = items.value;
                    })
                    }
                   
                    
                    this.ttl_cnt = response.data.ttl_cnt;
                    this.resp_pg_size = response.data.pg_size
                    this.resp_pg_num = response.data.pg_num;
                    this.keyId = keyId;
                    this.grpText=this.groupText;
                    
                   /* */
                    this.configMulChkList = this.configValSampleList;
                    
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                    
                    
                } else {
                     this.commonService.responseMessages("", response.message, "warning")
                    this.AddMoreLinesOfItems();
                    $('#loadingIcon').hide();
                    $("#black-overlay").hide();
                }
                
                   

            });
           }
        if (this.confGrp != "" || this.confGrp.length != 0) {
           
            let url: any = this.environment.getRequiredApi("config_value_list") + "?group=" + this.confGrp + "&" + bpIdConcat;
            this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe((response) => {
           
                if (response.status == 0) {
                    this.configChildList = response.data.configValues;
                    /*  if (this.configChildList.length != 0) {
    
                      let configChildArray = $.extend(true, [], this.configChildList);
    
                        
                       

                  }*/

                }

            });

        }
        if(this.scrollCount ==0 ){
                this.getCongifGrpHeaders(this.groupText);
        }
    

    }

    /* getConfigValuesList(){
         let group = this.configValueForm.value.group;
          let url = this.environment.getRequiredApi('config_value_list') + "?group="+group+"&org_id="+this.orgId+"&" ;
         
         let bpId = this.configValueForm.value.bp_id;
         if(bpId.length != 0 ){
             url = url +"bp_id="+bpId+"&";
         }
         
          
         
          $('#loadingIcon').show();
          $("#black-overlay").show();
          this.commonService.getData(url, 'GET', '', '')
              .subscribe((response) => {
                  console.log(response)
                  if (response.status == 0) {
                     //this.commonService.responseMessages("", response.message, "success");
                  }
                  if (response.status == 1) {
                      this.commonService.responseMessages("", response.message, "warning");
                    
                  }
                  console.log(this.configValSampleList)
                  $('#loadingIcon').hide();
                  $("#black-overlay").hide();
 
              }, err => {
 
                  console.log(err)
                  $('#loadingIcon').hide();
                  $("#black-overlay").hide();
 
          });
         
         }*/

    getBusinessPartnerDet() {


        let url = this.environment.getRequiredApi('get_org_bp').replace("{org_id}", localStorage.getItem("orgId")) + "?";
        this.commonService.getData(url, "GET", '', localStorage.getItem('Manage Users'))
            .subscribe((response) => {
                this.bPartners = response.data.bps;

            });
    }



    applyDataTable() {
        setTimeout(() => {
            var table = $('#conf-grp-table').DataTable({
                "order": [[1, 'desc']],

                retrieve: true,
                "language": {
                    "emptyTable": "No data available",
                    "info": "Showing page _PAGE_ of _PAGES_",
                    "infoFiltered": "(filtered from _MAX_ total records)",

                },
                columnDefs: [{
                    "targets": 'no-sort',
                    "orderable": false
                }],
                "fnDrawCallback": function(oSettings) {
                    if (10 >= oSettings.fnRecordsDisplay()) {
                        $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();

                        $(oSettings.nTableWrapper).find('.dataTables_info').hide();

                    } else {
                        $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                        //    $(oSettings.nTableWrapper).find('.dataTables_filter').show();
                        $(oSettings.nTableWrapper).find('.dataTables_info').show();
                        //  $(oSettings.nTableWrapper).find('.dataTables_length').show();
                    }
                },
            });

            setTimeout(() => {
                var width = $("#mainContent").css("width");
                $(".outbound-footer").css("width", width);
                $(".outbound-footer").show();
            }, 50);
        }, 500);
        setTimeout(() => {
            $(".dataTables_scrollHeadInner").css({ "width": "100%" });
            $(".table ").css({ "width": "100%" });
        }, 600);
    }




    AddMoreLinesOfItems() {
        let length: any = $("#conf-grp-table").find('tbody').find('tr').length;
        if (length >= 200) {
            this.commonService.responseMessages("", "Added Data Limit is Exceeded", "warning");
            return false;
        }
        for (let index = 0; index < 1; index++) {
            this.configValSampleObj = {};
            this.configValSampleObj["parentValId"] = "";
            this.configValSampleObj["key"] = "";
            this.configValSampleObj["value"] = "";
            this.configValSampleObj["addField1"] = "";
            this.configValSampleObj["addField2"] = "";
            this.configValSampleObj["addField3"] = "";
            this.configValSampleObj["addField4"] = "";
            this.configValSampleObj["addField5"] = "";
            this.configValSampleObj["addField6"] = "";
            this.configValSampleObj["addField7"] = "";
            this.configValSampleObj["addField8"] = "";
            this.configValSampleObj["addField9"] = "";
            this.configValSampleObj["addField10"] = "";
           // this.configValSampleObj["orgId"] = this.orgId;
            this.configValSampleObj["bpId"] = "";
            this.configValSampleObj["configGroupId"] = "";
            this.configValSampleObj["configValId"] = "";

            this.configValSampleObj["displayRow"] = true;
            this.configValSampleObj["mark_as_delete"] = false;
            

            this.configValSampleList.push(this.configValSampleObj);
        }
        this.configMulChkList = this.configValSampleList;
        
    }


    getWarningErrorMessage(messageKey) {

        return this.checkboxErrorMsg[messageKey] + "config group";

    }
    removeLineSelectedItems() {
        
        let configArrayList = $.extend(true, [], this.configValSampleList);
        let checkedList = $.extend(true, [],  this.checkedObjects);
        let savFlag = true;
        
        
        
        
        if (this.checkedObjects.length > 0) {
            for (let index of this.checkedObjects) {
                if (index != undefined && index != null) {
                    
                    if(!configArrayList[index].hasOwnProperty("key")){
                        
                        delete configArrayList[index];
                    }else{
                        if(configArrayList[index].key.length ==0){
                            //this will replace the index before the index is 0 after splice index become 0 again
                            //Where as delete remove the index completely
                           // this.configValSampleList.splice(index,1);  
                            delete configArrayList[index];
                        }else{
                            configArrayList[index].displayRow = false;
                            configArrayList[index].mark_as_delete = true;
                        }
                    }
                   
                }
            }
            this.configValSampleList = [];
            // To remove empty object in array use filter
            this.configValSampleList =configArrayList.filter(data=>data);
           
            for(let valList in this.configValSampleList){
                if(this.configValSampleList[valList].key.length == 0){
                     this.configValSampleList.splice(valList,1);  
                }
            }
            this.configMulChkList = this.configValSampleList;

            this.checkedObjects = [];
            let groupValuePnt = $("#confg_grps_id option:selected").val().trim();
            let groupTextDrp = $("#confg_grps_id option:selected").text().trim();
            
            
            
            if (groupTextDrp.toLowerCase().indexOf("select") == -1) {
                
              this.saveConfigValues("R");
            }
            
        } else {
            this.commonService.responseMessages("", "Please select atleast one config value", "warning");
            
        }
        setTimeout(() => {
            let flag: boolean = this.commonService.continueAction("purchase-order-table");
            if (flag) {
                this.indeterminate = false;
                this.checked = false;
            }
            else {
                this.indeterminate = true;
            }
            if ($("#purchase-order-table").find('tbody').find('tr').length == 0) {
                this.indeterminate = false;
                this.checked = false;
            }

        }, 200);
    }

    getReportList(tableId, i, list) {
        setTimeout(() => {
            let flag: boolean = this.commonService.checkAction(tableId);
            if (flag) {
                this.indeterminate = false;
                this.checked = true;
            }
            else {
                this.indeterminate = true;
            }
        }, 400);
        setTimeout(() => {
            if ($("#checkbox-" + i + "-input").is(":checked")) {
                this.checkedObjects.push(i);

            }
            else {

                if (this.checkedObjects.length > 0) {
                    let count: any = 0;
                    for (let index of this.checkedObjects) {
                        if (index == i) {
                            delete this.checkedObjects[count];
                        }
                        count++;
                    }
                }
                setTimeout(() => {
                    let flag: boolean = this.commonService.continueAction(tableId);
                    if (flag) {
                        this.indeterminate = false;
                        this.checked = false;
                    }
                    else {
                        this.indeterminate = true;
                    }
                }, 200);
            }

        }, 300);
    }

    selectAll(event, checkAll, tableId) {
        setTimeout(() => {
            if ($("#" + checkAll).is(":checked")) {
                this.commonService.selectAllCheckBoxes(checkAll, tableId);
                let count: any = 0;
                this.configValSampleList.forEach(response => {
                    if (response.displayRow) {
                        this.checkedObjects.push(count);
                    }
                    count++;
                });
            } else {
                this.commonService.selectAllCheckBoxes(checkAll, tableId);
                this.checkedObjects = [];
            }


        }, 300);

    }

    assignToObject(value, index) {
       
        this.configValSampleList[index]['parentValId'] = value;
    }

   
    
    saveConfigValues(action) {

        let saveArray: any = [];
        let message: string = "Please select parent id";
        let bflag: boolean = true;
        let index = 0;
         let groupValuePnt = $( "#confg_grps_id option:selected" ).val().trim();
        let groupTextDrp = $( "#confg_grps_id option:selected" ).text().trim();
        if (groupTextDrp.toLowerCase().indexOf("select") != -1) {
            this.commonService.responseMessages("", "Please select  config group", "warning");
            return false;
        }

        
        for (let items of this.configValSampleList) {
            
            let drpdwnText =  $("#conf-grp-list-"+index+" option:selected" ).text().toLowerCase();
            let parentValId =  $("#conf-grp-list-"+index+" option:selected" ).val(); 
            let count=0;
            if (items.displayRow || items.mark_as_delete ) {
                 index++
                if (items.hasOwnProperty("configGroupId")) {
                    items["parentValId"] = parentValId;
                     let groupText = $( "#confg_grps_id option:selected" ).text().trim();
                     items["configGroupId"] = groupText;
                   
                }
                if(this.selectedBPid.length !=0){
                items["bpId"] = this.selectedBPid;
                }

                if (items.configGroupId.length == 0) {
                    this.commonService.responseMessages("", "Please select  config group", "warning");
                    bflag = false;
                    break;
                }
                if(items.key.length == 0 && !items.mark_as_delete){
                    $("#key-"+(index-1)).css("border-color","red");
                    setTimeout(()=>{
                    $("#key-"+(index-1)).removeAttr("style");   
                    },600)
                    this.commonService.responseMessages("", "Please enter key", "warning");
                    bflag = false;
                    break;
                }
                
                
                for(let chkdList of this.configMulChkList ){
                    let parentId = items.parentValId;
                    let key = items.key;
                    
                    if(chkdList.key.toLowerCase() == key.toLowerCase() ){
                        if(count == 0){
                         count++;
                         continue;   
                        }
                        bflag = false;
                        break;
                    }
                   
                   // if(chkdList)
                }
                if(!bflag){
                    if(action != 'R')
                    this.commonService.responseMessages("", " key must not be same ", "warning");
                break;    
                }

                saveArray.push(items);
            }
        }
        if (bflag) {
            this.configValSampleList = saveArray;
        } else {
            return false;
        }

        let payload = {};
        let payLoadArray = $.extend(true, [], saveArray);
        

        payload["configValues"] = payLoadArray;

        payload["configValues"].forEach((elements) => {
            if (elements.hasOwnProperty("displayRow")) {
                delete elements.displayRow;
              //  delete elements.configValId;
                
            }
             if(elements.hasOwnProperty("selval")){
                    delete elements.selval
                }
        })
        
        this.configValSampleList.forEach((items) => {
            items["displayRow"] = true;

        })

        let url = this.environment.getRequiredApi('config_value_list') + "?";
        //url = "";
        $('#loadingIcon').show();
        $("#black-overlay").show();
        this.commonService.getData(url, 'POST', payload, '')
            .subscribe((response) => {
                
                if (response.status == 0) {
                    this.setParentList(groupValuePnt,groupTextDrp);
                    if(action=="c"){
                    this.commonService.responseMessages("", response.message, "success");
                    }
                    if(action == "R"){
                        this.commonService.responseMessages("", "Config value removed successfully", "success");
                    }
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

    navigateBack() {
        const path: string = "configval";
        this.router.navigate([path]);

    }
    
  /*  @HostListener("window:scroll", [])
  onWindowScroll() {
        
        let topPosition = $(window).scrollTop(); 
       topPosition= topPosition != 0?topPosition-1:0;
        let scrollHt = $(window).scrollTop();
         if(scrollHt > topPosition) {
             
             if (this.grpText == "MTRLS" && this.configValSampleList.length <= this.ttl_cnt) {
                 this.scrollCount++;
                 if (this.resp_pg_num == this.pg_num && scrollHt > 400) {
                     this.pg_num = this.pg_num + 1;
                     this.pg_size = this.resp_pg_size;
                     this.setParentList(this.keyId, this.grpText)
                 }
             }
             
         }
       
        
       
     
  }*/
    
    loadMoreRecords(){
        if (this.grpText == "MTRLS" && this.configValSampleList.length <= this.ttl_cnt) {
                 this.scrollCount++;
                 if (this.resp_pg_num == this.pg_num ) {
                     this.pg_num = this.pg_num + 1;
                     this.pg_size = this.resp_pg_size;
                     this.setParentList(this.keyId, this.grpText)
                 }
             }
        
    }
    
    trackConfgVals(index, confvalIds) {
        
        return confvalIds.configValId;

    }
   
 
}
