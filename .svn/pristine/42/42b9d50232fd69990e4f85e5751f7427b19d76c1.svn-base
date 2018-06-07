import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router , ActivatedRoute } from '@angular/router';
import { Http , Headers, Response,RequestOptions } from '@angular/http';
import { MessagePropertiesService } from '../../services/message-properties.service'; 
import { EnvConfigurationService } from '../../services/env-configuration.service';
import { CommonService } from '../../services/common.service';

import { AppComponent } from '../../app.component';
declare var $: any; 
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
        
    public tokenReceivedThroughEmail:string;
    logClass:any;
    public resetPwdMsg:any;
    public resetForm: FormGroup;
    public fb = new FormBuilder();
    public userId:string;
    public payload:any;
    public responseFwdMsg:string;
    public errorMsgOn:boolean;
     public successMsgOn:boolean;
     public oldPwdFlag:boolean;
    public queryParamKeyVal:string;

   constructor(private http: Http, private formBuilder: FormBuilder,
             private router: Router,private app:AppComponent,
             private messagesService:MessagePropertiesService,private route:ActivatedRoute, 
             private environment:EnvConfigurationService,private commonService:CommonService) { 
    this.app.isActive=false;
     this.logClass="leftside-logo";
       this.resetPwdMsg = this.messagesService.resetPwd;
        this.resetForm = this.fb.group(
      {
        
        'password': ['', Validators.required],
        'confirmPassword': ['', Validators.required]
      }, { validator: this.commonService.matchingPasswords('password', 'confirmPassword') });
   }

  ngOnInit() {
       let key='';
      this.route.queryParams.subscribe(params => {
       
        for(key in params){
        }
          this.queryParamKeyVal = key;
        if(key == 'ky'){
        this.tokenReceivedThroughEmail = params[key];
        this.oldPwdFlag=false;  
        }
        if(key == 'expired'){
                 this.tokenReceivedThroughEmail = "";
          this.oldPwdFlag=true;

        this.resetForm = this.fb.group(
            {
                'oldPassword': ['', Validators.required],
                'password': ['', Validators.required],
                'confirmPassword': ['', Validators.required]
            }, { validator: this.commonService.matchingPasswords('password', 'confirmPassword') });

              
        }
           if(key == 'orgky'){
        this.tokenReceivedThroughEmail = params[key];
          $('.login-header').text('Create Password');
          
        }
         
      });
       if(this.tokenReceivedThroughEmail === undefined){
        this.tokenReceivedThroughEmail="";    
      }
      
       if(this.tokenReceivedThroughEmail != ""  ){
          let url=this.environment.getRequiredApi('reset_pwd_resetKey').replace("{resetKey}",this.tokenReceivedThroughEmail)+"?";
      this.commonService.getData(url,"GET","",null).subscribe((response) => { 
       if(response.hasOwnProperty('data')){
              let data =response.data;
            if(!(data.keyStatus =='Active')){
              if(key == 'ky'){
             
                const path: string = 'login';
                this.router.navigate([path]);  
              }
            
               
          }else{
              
               this.userId=data.userId;
              
              }
       }else{
          this.commonService.responseMsg=response.message;
             const path: string = 'login';
                this.router.navigate([path]); 
       }
       
      });
          
      }else{
              if(key == 'ky'){
                this.commonService.responseMsg=this.messagesService.resetPwd.invalid_token;
        
                const path: string = 'login';
                this.router.navigate([path]);
               }
           
         
      }
      
  }
    
    resetPassword(){
        console.log("call to reset url"+this.userId +""+this.resetForm)
        if(this.queryParamKeyVal =="ky"){
             this.payload =        
                 {
                     "action": "FORGOTPWD",
                     "newPwd": this.resetForm.value.password,
                     "resetKey": this.tokenReceivedThroughEmail,
                     "userId": this.userId
                 }
        }

        if(this.queryParamKeyVal =="expired"){
             this.payload =        
                 {
                     "action": "RESETPWD",
                     "oldPwd": this.resetForm.value.oldPassword,   
                     "newPwd": this.resetForm.value.password,
                     "logonId":localStorage.getItem("logonId")
                 }
        }
        if( this.queryParamKeyVal =="orgky"){
            
         this.payload =        
                 {
                     "action": "CREATEPWD",
                     "newPwd": this.resetForm.value.password,
                     "resetKey": this.tokenReceivedThroughEmail,
                     "userId": this.userId
                 }
            
             let url = this.environment.getRequiredApi('um_put_user_restpwd');
            
        
        }
       
       let url = this.environment.getRequiredApi('um_put_user_restpwd')+"?";//"http://104.237.3.222:9090/igasp-core/user/restpwd";
    let reqmethod = "PUT";
        
    this.commonService.getData(url, reqmethod, this.payload, null)
        .subscribe((response) => {
            console.log(response);

            if (response.hasOwnProperty("status")) {
                this.responseFwdMsg = response.message;
                setTimeout(() => {
                       this.responseFwdMsg = "";
                    this.commonService.responseMsg="";
                    }, 3000);
                if (response.status == 0) {
                    
                    this.successMsgOn = true;
                    this.resetForm.reset();
                    setTimeout(() => {
                        const path: string = 'login';
                        this.router.navigate([path]);
                    }, 5000);
                } else {
                    this.errorMsgOn = true;
                }



            }

        });

    }
  }
