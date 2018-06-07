import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router , ActivatedRoute } from '@angular/router';
import { Http , Headers, Response,RequestOptions } from '@angular/http';
import { MessagePropertiesService } from '../../services/message-properties.service'; 
import { EnvConfigurationService } from '../../services/env-configuration.service';
import { CommonService } from '../../services/common.service';

import { AppComponent } from '../../app.component';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  geturl: any;
  userDetails: any;
  userId : any;  
  url: any;
  reqmethod: any;
  result: any;
  logonuserId: any;
  mockresult: any;
  public editProfileForm: FormGroup;
  emailMessage: any;
  emailInvalidMessage: any;
  firstNameMessage: any;
  lastNameMessage: any;
  mobileMessage: any;
  mobileInvalidMessage: any;
  roleMessage: any;
  pwdMatchMsg: string;
  pwdReqMsg: string;
  pwdMatch: string;
  payload: any;
    pwdCnf:any;
     public responseFwdMsg:string;
    public errorMsgOn:boolean;
     public successMsgOn:boolean;
settingsMockData:any;
showInitialValidations:any= false;
    public drugLicence:string;
    
public loginMessages:any;
     public resetPwdMsg:any;
     public editUserDetMsg:any;
    public bsnName:string;
  public resetForm: FormGroup;
  public fb = new FormBuilder();
 constructor(private http: Http, private formBuilder: FormBuilder,
             private router: Router,private app:AppComponent,
             private messagesService:MessagePropertiesService,
             private environment:EnvConfigurationService,private commonService:CommonService) {
    //this.app.routeUrl = this.router.url;
    this.app.isActive=true;
      this.resetPwdMsg = this.messagesService.resetPwd;
     this.editUserDetMsg = this.messagesService.userManagement;
    this.editProfileForm = new FormBuilder().group(
      {

        'email': ['', [Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')]],
        'firstName': ['', Validators.required],
        'lastName': ['', Validators.required],
        'mobile': ['', [Validators.required, Validators.pattern('^[789]{1}[0-9]{9}$')]],
        'logonId': ['', [Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')]]
      });
   /* this.pwdMatchMsg = this.mesgservice.messages.error_no_newpassword;
    this.pwdReqMsg = this.mesgservice.messages.error_change_password;
    this.pwdCnf = this.mesgservice.messages.error_confirm_password;
    this.pwdMatch = this.mesgservice.messages.error_passwords_match;*/
    this.resetForm = this.fb.group(
      {
        'password': ['', [Validators.required]],
        'confirmPassword': ['', [Validators.required]],
        'oldPassword': ['', Validators.required]
      }, {validator: this.commonService.matchingPasswords('password', 'confirmPassword')});
  }

  ngOnInit() {
      this.bsnName = localStorage.getItem("bpLegalName");
      this.drugLicence =""
 this.getuserDetails();
  }
    
    public saveUserdetails(){
        
        this.url = this.environment.getRequiredApi('get_user_details')+"?";
        this.reqmethod ="PUT";
        this.payload=this.editProfileForm.value;
        this.payload.userId=this.userId;
        
        console.log(this.payload);
       // this.payload.push({"userId":this.userId});
        this.commonService.getData(this.url,this.reqmethod,this.payload,localStorage.getItem("Manage Users")).subscribe((response) => {
        console.log( response);
         if (response.hasOwnProperty("status")) {
                this.responseFwdMsg = response.message;
                
                if (response.status == 0) {
                    this.commonService.responseMessages("",response.message, "success");
                    this.getuserDetails();
                    
                } else {
                   this.commonService.responseMessages("",response.message, "error");
                }
               $("#editProfile").modal("hide");

            }
      }, err => {
       

      });
        //
    }
    
    
    
    
 public getuserDetails() {
   
    this.commonService.getUserDetails().subscribe((response) => {
        console.log( response);
     this.userDetails=response.data;
     this.userId = response.data.userId;
     console.log(this.userId);
     this.editProfileForm.setValue({email:response.data.email,firstName:response.data.firstName,lastName:response.data.lastName,
     mobile:response.data.mobile,logonId:response.data.logonId})     
      }, err => {
       

      });
  }

  public resetPwd() {
    //this.reqdata.closePoupMsgs('changePwdCancel','changePassword');
    this.resetForm.reset();

  }
  public resetPassword() {
      //this.resetForm.reset();
      console.log(this.resetForm.value);
        this.url = this.environment.getRequiredApi('um_put_user_restpwd')+"?";
        this.reqmethod ="PUT";
        this.payload= this.payload =        
                 {
                     "action": "RESETPWD",
                     "oldPwd": this.resetForm.value.oldPassword,   
                     "newPwd": this.resetForm.value.password,
                     "logonId":localStorage.getItem("logonId")
                 }
        this.commonService.getData(this.url,this.reqmethod,this.payload,null).subscribe((response) => {
        console.log( response);
        if (response.hasOwnProperty("status")) {
                //this.responseFwdMsg = response.message;
               
                if (response.status == 0) {
                     this.commonService.responseMessages("", response.message, "success");
                   
                    this.resetForm.reset();
                    this.closeModal();
                } else {
                    this.errorMsgOn = true;
                    this.commonService.responseMessages("", response.message, "warning");
                }
            }
  }, err => {
       

      });
            }
  public submituserDetails() {
  
  }
  public closePopup(btnId, mdlId) {
       $("#editProfile").modal("hide");
   // this.reqdata.closePoupMsgs(btnId, mdlId);
  }

  public closeprofileDetailsPopupTop() {
      $("#editProfile").modal("hide");
   // this.reqdata.closePoupMsgs("closeuser", "editProfile");
  }
  passwordPolicy(){
      $('#pwd_policy').show();
  }
  closePP(){
      $('#pwd_policy').hide();
  }
  checkPassword(){
     
      
  }
    closeModal(){
      $("#changePassword").modal("hide");
      this.resetForm.reset();
  }

}
