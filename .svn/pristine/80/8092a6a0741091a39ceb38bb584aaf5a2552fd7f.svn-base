import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { EnvConfigurationService } from '../../services/env-configuration.service';
import { CommonService } from '../../services/common.service';
import { MessagePropertiesService } from '../../services/message-properties.service';
import { AppComponent } from '../../app.component';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-config-group',
    templateUrl: './config-group.component.html',
    styleUrls: ['./config-group.component.css']
})
export class ConfigGroupComponent implements OnInit {


    configDetailsForm: FormGroup;
    customerDetailMsg: any;
    url: string;
    states: any;
    bpId: any;
    orgId: any;
    accessObjectId: any;
    public payload: any;
    title: any;
    displayFlag: any;
    fromDisplayFlag: boolean;
    configGrp: any;
    configGrpArray: any;
    cnfGrpList: any;
    formArrayGrp: any;
    displaygrpFlag: boolean;
    dropDowmList: any;
    parentId: string;
    disbaleFlag: boolean;
    actInactArray: any = [];
    objKeys = []; statusFlag: boolean = false;

    constructor(private http: Http, private formBuilder: FormBuilder, private environment: EnvConfigurationService,
        private commonService: CommonService, private messagesService: MessagePropertiesService,
        private router: Router, private activatedRoute: ActivatedRoute, private ref: ChangeDetectorRef, private app: AppComponent) {
        this.app.isActive = true;
        this.bpId = localStorage.getItem("bpId");
        this.orgId = localStorage.getItem("orgId");
        this.accessObjectId = localStorage.getItem("Customer Details");
        this.fromDisplayFlag = false;
        this.disbaleFlag = false;
        this.configDetailsForm = new FormBuilder().group(
            {

                'group_name': ['', Validators.required],
                'parent_id': [''],
                // 'shrtDesc': ['', Validators.required],
                'description': ['', Validators.required],
                'add_field1': [''],
                'add_field2': [''],
                'add_field3': [''],
                'add_field4': [''],
                'add_field5': [''],
                'add_field6': [''],
                'add_field7': [''],
                'add_field8': [''],
                'add_field9': [''],
                'add_field10': [''],
                'mark_as_delete': [false]
            }

        );
        this.configGrp = {};
        this.configGrpArray = [];
        this.cnfGrpList = [];
        this.formArrayGrp = ['group_name', 'parent_id', 'description', 'add_field1', 'add_field2'
            , 'add_field3', 'add_field4', 'add_field5', 'add_field6', 'add_field7', 'add_field8', 'add_field9', 'add_field10'];
        this.displaygrpFlag = false;
        this.dropDowmList = [];
        this.parentId = "";
        this.customerDetailMsg = messagesService.configError;
        this.actInactArray = [{ "key": "ACTIVE", "value": false }, { "key": "INACTIVE", "value": true }];

        this.objKeys = Object.keys(this.actInactArray);
        console.log(this.objKeys)
        this.statusFlag = false;

    }
    ngOnInit() {

        setTimeout(() => {
            var width = $("#mainContent").css("width");
            $(".outbound-footer").css("width", width);
            $(".outbound-footer").show();
        }, 500);
        let arrayLen = this.commonService.configGrpArray;
        if (arrayLen.length != 0 && arrayLen[0].hasOwnProperty("parent_id")) {
            this.disbaleFlag = true;
        }

        this.cnfGrpList = this.commonService.configGrpArray
        if (this.commonService.configGrpArray.length != 0) {
            this.title = "Config Group/Edit";
            this.displaygrpFlag = true;
            this.formArrayGrp.forEach((items, index) => {
                if (!this.cnfGrpList[0].hasOwnProperty(items)) {
                    this.cnfGrpList[0][items] = '';
                }
            })

            this.parentId = this.cnfGrpList[0].parent_id;
            this.statusFlag = this.cnfGrpList[0].mark_as_delete;
            this.configDetailsForm.setValue(this.commonService.configGrpArray[0])
        } else {
            this.title = "Config Group/Create";
          
        }

        this.getConfigGroupList();

    }


    getConfigGroupList() {

        $('#loadingIcon').show();
        $("#black-overlay").show();
        let url: any = this.environment.getRequiredApi("config_grp_list") + "?";
        this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe((response) => {

            if (response.status == 0) {
                if (response.data.hasOwnProperty("configGroups")) {
                    this.dropDowmList = response.data.configGroups;

                }


            } else {
                this.commonService.responseMessages("", response.message, "warning")
            }


            $('#loadingIcon').hide();
            $("#black-overlay").hide();

        });


    }



    navigateBack() {
        const path: any = "configgrp";
        this.router.navigate([path]);
    }
    saveConfigGroupsVal() {
        $('#loadingIcon').show();
        $("#black-overlay").show();

        let url = this.environment.getRequiredApi('config_grp_list') + "?";

        this.configDetailsForm.value.group_name = this.configDetailsForm.value.group_name.toUpperCase().replace(/\s/g, "");
        this.configGrpArray.push(this.configDetailsForm.value)

        this.configGrp["configGroups"] = this.configGrpArray;

        this.commonService.getData(url, 'POST', this.configGrp, '')
            .subscribe((response) => {
                if (response.status == 0) {
                    this.commonService.responseMessages("", response.message, "success");
                    this.configDetailsForm.reset();
                    if (this.cnfGrpList.length != 0) {
                        this.statusFlag = false;
                        const path: any = "configgrp";
                        this.router.navigate([path]);
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

}
