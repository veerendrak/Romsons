import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http , Headers, Response,RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { MessagePropertiesService } from '../../services/message-properties.service';
import { EnvConfigurationService } from '../../services/env-configuration.service';

declare var $: any; 
declare var jQuery: any;
declare var swal: any;

@Component({
  selector: 'app-delarship-details',
  templateUrl: './delarship-details.component.html',
  styleUrls: ['./delarship-details.component.css']
})
export class DelarshipDetailsComponent implements OnInit {

  loginId:any;
  bpDetails:any;
  bpBlockFlag:boolean=false;
  userId:any;
  usersList:any;
  constructor(private http: Http, private formBuilder: FormBuilder,
          private router: Router,private ref: ChangeDetectorRef,private app:AppComponent,private messagesService:MessagePropertiesService,
          private commonService:CommonService, private environment:EnvConfigurationService) {
      this.app.isActive=false;
      this.loginId=localStorage.getItem("logonId");
      this.bpDetails={};
      this.bpBlockFlag=false;
      this.userId=null;
      this.usersList={};
      
  }

  ngOnInit() {
      $("#loadingIcon").show();
      $("#black-overlay").show();
    this.getUsersList();  
  }
  getUsersList(){
      this.commonService.getUserDetails().subscribe(response=>{
          if(response.status==0){
             this.usersList=response.data;
             this.userId=response.data.userId;
             if(this.userId!=null){
                 this.getBussinessPartners(this.userId);
             }
          }else{
              $("#loadingIcon").hide();
              $("#black-overlay").hide();
          }
      });
  }
  getBussinessPartners(userId){
      let url:any=this.environment.getRequiredApi("get_Bussiness_Partners")+"?";
      url=url.replace("{user_id}",userId);
      this.commonService.getData(url, "GET", "", "").subscribe(response=>{
         if(response.status==0){
             let roleName = "";
             
               let rUrl = this.environment.getRequiredApi('get_left_side_menu')+"?org_id=" +response["data"].orgs[0].orgId 
                        +"&bp_id="+response["data"].orgs[0].businessPartners[0].bpId+"&";
            this.commonService.getData( rUrl, 'GET', '', '')
                .subscribe(( result ) => {
                     if(result.status==0){
                         roleName = result["data"].roleName;
                          localStorage.setItem("roleName", result["data"].roleName);
                     
                          if (response["data"].redirect) {
                              localStorage.setItem("orgId", response["data"].orgs[0].orgId);
                              localStorage.setItem("bpId", response["data"].orgs[0].businessPartners[0].bpId);
                              localStorage.setItem("bpLegalName", response["data"].orgs[0].businessPartners[0].bpLegalName);
                              localStorage.setItem("plantId", response["data"].orgs[0].businessPartners[0].plantCode);
                              localStorage.setItem("rmsFlag", "false");
                              localStorage.setItem("bpType", response["data"].orgs[0].businessPartners[0].bpType);
                              if(roleName != 'Sales Person'){
                                  if (this.usersList.firstName == 'Admin' || roleName == 'Admin' || response["data"].orgs[0].businessPartners[0].opBalStatus == "L") {
                                  const path: string = "quickstats";
                                  this.router.navigate([path]);
                              } else {
                                  const path: string = "openstk";
                                  this.router.navigate([path]);
                              }
                              }else{
                                   const path: string = "salespersonreport";
                                  this.router.navigate([path]);
                              }
                              

                          } else {
                              this.bpDetails = response["data"];
                              this.bpBlockFlag = true;
                              this.commonService.rmsFlag = true;
                              localStorage.setItem("orgId", response["data"].orgs[0].orgId);
                              localStorage.setItem("bpId", response["data"].orgs[0].businessPartners[0].bpId);
                              localStorage.setItem("bpLegalName", response["data"].orgs[0].businessPartners[0].bpLegalName);
                              localStorage.setItem("rmsFlag", "false");
                              localStorage.setItem("bpType", response["data"].orgs[0].businessPartners[0].bpType);
                              localStorage.setItem("rmsFlag", "true");
                              $("#loadingIcon").hide();
                              $("#black-overlay").hide();
                          }
                     
                     
                     
                 }
            });
             
             $("#loadingIcon").hide();
             $("#black-overlay").hide();
            
         
          } 
      });
      
      
      
      
      
  }
  getListByBpId(list,orgId,opBalStatus){
      localStorage.setItem("orgId", orgId);
      localStorage.setItem("bpId", list.bpId);
      localStorage.setItem("plantId",list.plantCode);
      localStorage.setItem("bpLegalName",list.bpLegalName);
      localStorage.setItem("bpType", list.bpType);
      let path:string="openstk";
      if(opBalStatus =="L")
        path ="quickstats"
     // const path:string="openstk";
      this.router.navigate([path]);
  }

}
