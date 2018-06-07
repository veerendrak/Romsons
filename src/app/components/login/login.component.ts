import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Http , Headers, Response,RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessagePropertiesService } from '../../services/message-properties.service'; 
import { EnvConfigurationService } from '../../services/env-configuration.service';
import { CommonService } from '../../services/common.service';

import { AppComponent } from '../../app.component';

declare var $: any;
declare var jQuery: any;
declare var escape:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
public loginForm: FormGroup;
    public fPasswordForm : FormGroup;
loginBlock:boolean=true;
forgotBlock:boolean=false;
logClass:any;
public loginMessages:any;
  
  public access_token:string="";
  public refresh_token:string="";
  public expires_in:any;
  public checkTokenData:boolean=false;
  public responsesMessage:string="";
  public resetPwdMessage:string="";
  public userLockedExpireMsg="";
      
  constructor(private http: Http, private formBuilder: FormBuilder,
             private router: Router,private ref: ChangeDetectorRef,private app:AppComponent,
             private messagesService:MessagePropertiesService,
             private environment:EnvConfigurationService,private commonService:CommonService) { 
  this.loginMessages=this.messagesService.login;
     this.resetPwdMessage = this.commonService.responseMsg;
      if(this.resetPwdMessage != ""){
          $("#resetPwdmsg").show();
      }
      
      this.loginForm = new FormBuilder().group(
  {
   'email': ['', [ Validators.required,Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
    // 'username': ['', [ Validators.required]],
     'password'   : ['', Validators.required],
      
      },   );
    
    this.fPasswordForm = new FormBuilder().group(
  {
   'email': ['', [ Validators.required,Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
   },);
    
    this.app.isActive=false;
    this.logClass="leftside-logo";
   
  }

  ngOnInit() {
    
      setTimeout(() => {
                        this.resetPwdMessage = "";
                         $("#resetPwdmsg").hide();
                    }, 3000);
      
      let flag=localStorage.getItem('LMflag')
      if (flag == 'true') {
          if (localStorage.getItem("token") != null) {
              var path = null;
              path = "quickstats";
              this.router.navigate([path]);
          } else {
              $('.modal-backdrop').hide();
          }
      }
      
      
      
  }
  showForgotBlock(){
      this.loginBlock=false;
      this.forgotBlock=true;
      this.logClass="left-side-forgot"
  }
  backtoLogin(){
      this.loginBlock=true;
      this.forgotBlock=false;
      this.logClass="leftside-logo";
      this.fPasswordForm.reset();
  }
  submitPassword(){
    
      var reqObject = {
             "action": "FORGOTPWD",
             "logonId": this.fPasswordForm.value.email,
             "userIds": []
         };
      if(this.fPasswordForm.value.email.length ==0 ){
       this.responsesMessage = this.loginMessages.EMAIL_ERR_MSG;
           setTimeout(() => {
               this.responsesMessage='';
              }, 2000);
          return false;
      }
       $('#loadingIcon').show();
     $("#black-overlay").show();
    let url=this.environment.getRequiredApi("fwd_password")+"?";
    this.commonService.getData(url,"POST",reqObject,"").subscribe((response) =>
        {  
    console.log(response)
        if(response.status==0){ 
         $("#forgotPasswordModal").modal("show");
          $('#forgotPwdMessage').show().text(this.messagesService.forgot_pwd.forgot_pwd_success).css('color','black');
       $('#loadingIcon').hide();
         $("#black-overlay").hide();
        }
        if(response.status==1){ 
           $('#loadingIcon').hide();
              $("#black-overlay").hide();
          // this.responsesMessage=this.messagesService.forgot_pwd.forgot_pwd_invalid;
             this.responsesMessage=this.messagesService.forgot_pwd.error_forgot_pwd_success;
            setTimeout(() => {
               this.responsesMessage='';
              }, 4000);
         
        }
        $("#black-overlay").hide();
        /* if(response.status==201){ 
             $('#loadingIcon').hide();
              $("#black-overlay").hide();
             $("#forgotPasswordModal").modal("show");
             $('#forgotPwdMessage').show().text(this.loginMessages.forgot_pwd.forgot_pwd_success).css('color','green');
            // $('.closePopUpOk').show();
         }
         if(response.status==204){ 
          $('#loadingIcon').hide();
              $("#black-overlay").hide();
           this.responsesMessage=this.loginMessages.forgot_pwd.forgot_pwd_invalid;
            setTimeout(() => {
               this.responsesMessage='';
              }, 3000);
        
         }
         if(response.status==1){ 
          $('#loadingIcon').hide();
              $("#black-overlay").hide();
           this.responsesMessage=response.message;
       setTimeout(() => {
               this.responsesMessage='';
              }, 3000);
        
         }*/
      
              
         },(error) =>{
         console.log("----------")
             console.log(error);    
         });
    
    
     
  }
  closeModal(id){
      $("#"+id).modal("hide");
      this.fPasswordForm.reset();
      $('#loadingIcon').hide(); 
      $("#black-overlay").hide();
       this.backtoLogin();
  }
  

 signIn(){
    
     $('#loadingIcon').show();
     $("#black-overlay").show();
    localStorage.setItem('LMflag', 'true');
    let username = this.loginForm.value.email;
    let password = this.loginForm.value.password;

    localStorage.setItem('logonId', username);
    sessionStorage.setItem("logonId", username);
    let pswd = password;
    var lockedMsg = this.loginMessages.user_locked_msg; 
    // btoa(unescape(encodeURIComponent( $("#Contact_description").val() )));
     
    var AUTHORIZATION_ENDPOINT = this.environment.getRequiredApi('oauth_Token').replace("/v1", "") + "?grant_type=password&username=" +btoa(username)  + "&password=" +btoa(pswd);
    $(function() {
        var extractToken = function(hash) {
            var match = hash.match(/access_token=([\w-]+)/);
            return !!match && match[1];
        };

        var CLIENT_ID = "incresol";
        var CLIENT_SECRET = "password";

        var token = extractToken(document.location.hash);

        $.ajax({
            url: AUTHORIZATION_ENDPOINT,
            type: 'POST',
            contentType: "application/json",
            beforeSend: function(xhrObj) {
                xhrObj.setRequestHeader("Authorization", "Basic " + btoa('incresol:passw0rd'));
                xhrObj.setRequestHeader("Content-Type", "application/json");
                //              xhrObj.setRequestHeader("Access-Control-Allow-Origin","*");
            },
            success: function(response) {
                this.access_token = response.access_token;
                this.refresh_token = response.refresh_token;
                this.expires_in = response.expires_in;
                localStorage.setItem('token', this.access_token);
                localStorage.setItem('refreshToken', this.refresh_token);
                localStorage.setItem('expiresIn', this.expires_in);
                sessionStorage.setItem('invalidatedSession', 'false')
                if (this.access_token && this.refresh_token) {
                    this.checkTokenData = true;
                    localStorage.removeItem("INV_CREDENTIALS");
                }
                if (this.checkTokenData) {
                    window.location.href = '#/delarshipdetails';

                }
                $('#loadingIcon').hide(); $("#black-overlay").hide();


            }, error: function(response) {
                if (response) {
                    if (response.status == 0 || response.status == 400) {
                        if(response.status == 0 && !(response.hasOwnProperty("locked"))
                        && !(response.hasOwnProperty("expired"))){
                            
                                $('.alert-warning').remove();
                                $('.alert-success').remove();
                                setTimeout(() => {
                                    $.notify({
                                        title: '',
                                        message: "Connection Error. Please try after sometime"
                                    }, {
                                            type: "warning",
                                            style: 'message'
                                        });
                                    $('.alert-warning').css('z-index', '1000000');
                                    $('.alert-warning').css('display', 'block');
                                    $('.alert-success').css('z-index', '100000');
                                }, 500);
                               $('#loadingIcon').hide(); 
                               $("#black-overlay").hide();
                            
                          
                        }
                        if(response.responseJSON.error_description.includes("locked")){
                         
                             $('#user_locked').show().css('color', 'red').text(lockedMsg);
                        }
                         if(response.responseJSON.error_description.includes("expired")){
                             
                             $('#user_locked').show().css('color', 'red').text(response.responseJSON.error_description);
                        }
                        if (response.status == 400 && !(response.responseJSON.error_description.includes("locked"))
                        && !(response.responseJSON.error_description.includes("expired"))) {
                         $('#errorMessage').show().css('color', 'red');
                       
                    }
                       
                    } 
                    setTimeout(() => {
                        $('#user_locked').hide();
                        $('#errorMessage').hide();
                        if(response.responseJSON.error_description.includes("expired")){
                            window.location.href="/#/resetPassword?expired=1";
                        }
                    }, 3000);
                    // window.location.href='/login';
                    $('#loadingIcon').hide(); $("#black-overlay").hide();
                }
            }
        });
    });
  }



}
