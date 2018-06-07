import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-config-group-details',
  templateUrl: './config-group-details.component.html',
  styleUrls: ['./config-group-details.component.css']
})
export class ConfigGroupDetailsComponent implements OnInit {
        
    
    configGrpList: any;
    checked: boolean = false;
    indeterminate: boolean = false;
    accessObjectId: any;
    bpId: any;
    orgId: any;
    conGrpArrayEdit:any;
    checkboxErrorMsg:any;

  constructor(private http: Http, private formBuilder: FormBuilder,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private environment: EnvConfigurationService, private excelService: ExcelService)  { 
      this.app.isActive = true;
      this.checked = false;
      this.indeterminate = false;
      this.configGrpList =[];
      this.conGrpArrayEdit=[];
      this.checkboxErrorMsg=this.messagesService.check_box_error;
  
  }

  ngOnInit() {
      this.getConfigGroupList();
       
  }
    
    getConfigGroupList(){
        //
        
         $('#loadingIcon').show();
        $("#black-overlay").show();
        let url: any = this.environment.getRequiredApi("config_grp_list") + "?";
        this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe((response) => {
            
           $("#conf-grp-table").DataTable().destroy();
            if (response.status == 0) {
                if (response.data.hasOwnProperty("configGroups")) {
                    this.configGrpList = response.data.configGroups;
                    
                }
                

            } else {
                this.commonService.responseMessages("", response.message, "warning")
            }


            $('#loadingIcon').hide();
            $("#black-overlay").hide();
           this.applyDataTable();

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
    
    
    navigateConfGrps(action){
        if(action == 'E'){
            
            if(this.conGrpArrayEdit.length ==0){
                 this.commonService.responseMessages("", this.getWarningErrorMessage('select_atleast_msg'), "warning");
                 return false;
            }
            if(this.conGrpArrayEdit.length !=1){
             this.commonService.responseMessages("", this.getWarningErrorMessage('select_msg'), "warning"); 
                return false;   
            }
        }else{
            this.conGrpArrayEdit =[];
        }
        this.commonService.configGrpArray = this.conGrpArrayEdit;
        const path: any = "config/grp";
        this.router.navigate([path]);
    }
    
    getReportList(tableId, i,list) {
        
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
                this.conGrpArrayEdit.push(list);
                
            } else {
                this.conGrpArrayEdit.forEach((element,index)=>{
                    if(element.group_name == list.group_name){
                        this.conGrpArrayEdit.splice(index, 1);
                    }
                })
                
                setTimeout(() => {
                    let flag: boolean = this.commonService.continueAction(tableId);
                    if (flag) {
                        this.indeterminate = false;
                        this.checked = false;
                    } else {
                        this.indeterminate = true;
                    }
                }, 200);
            }
           
        }, 300);
    }
    
     getWarningErrorMessage(messageKey) {

        return this.checkboxErrorMsg[messageKey] + "config group";

    }

}
