import { EnvConfigurationService } from '../services/env-configuration.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/timeout';

declare var $: any;
declare var swal: any;


@Injectable()
export class CommonService {
  saleType;any;
  options: any;
  showOrderType:boolean;  
  formObject:any;
  responseMsg:any;
  rmsFlag:boolean=false;
  searchUrl:any;
  deliveryNum:any;
  orderType:any;
  configGrpArray:any;
  reportFlag:boolean=false;  
  purInvId:any="";
  grNum:any="";
  dlvNum:any="";
  postatus="";
  constructor(public http: Http,public environment:EnvConfigurationService,
          private router: Router) { 
      this.saleType="";
      this.showOrderType =false;
      this.formObject={};
      this.responseMsg = "";
      this.deliveryNum="";
      this.orderType="";
      this.configGrpArray=[];
      this.purInvId="";
      this.grNum="";
      this.dlvNum="";
      this.postatus="";
      
  }
  public getData(requrl, reqtype, reqObject, accessobjid) {
      if (accessobjid != '' && accessobjid != null) {
        requrl = requrl + "access_obj_id=" + accessobjid+"&";
      }
      else{
         requrl = requrl + "access_obj_id=" + 0 +"&";
      }
      if (localStorage.getItem('token') != null) {
        requrl = requrl + "access_token=" + localStorage.getItem('token');
      }
      this.options = new RequestOptions({
        method: reqtype,
        body: reqObject
      });
      return this.http.request(requrl, this.options).timeoutWith(300000, Observable.throw(new Error('Time Out Error Occurred. Please try again'))).map((response: Response) => { try {
          //
          $("#timeOut-Msg").hide();
          return response.json();
        } catch (e) {
         return response.status;
        }
      }).catch((error)=>{
          $("#loadingIcon").hide();
          $("#black-overlay").hide();
          if($(".modal").is("visible")){
              $(".modal").modal("hide");
          }
              if(error.status==401){
                  if ($(".modal").is("visible")) {
                      $(".modal").modal("hide");
                  }
                  const path: string = '/login';
              this.invalidateLoginSession().subscribe(( data ) => {
                  if ( data.status==0 || data==200) {
                      clearInterval( parseInt( localStorage.getItem( "IntervalSetup" ) ) );
                      clearInterval( parseInt( localStorage.getItem( "RefreshSetup" ) ) );
                      localStorage.removeItem( 'token' );
                      localStorage.removeItem( 'refreshToken' );
                      localStorage.clear();
                      localStorage.setItem( 'LMflag', 'false' );
                      $( '#loadingIcon' ).hide(); $( "#black-overlay" ).hide();
                      this.router.navigate( [path] );
                  }
                  $( '#loadingIcon' ).hide(); $( "#black-overlay" ).hide();
              } );
            }else{
                if(error.status==403){
                    let errorMessage=JSON.parse(error._body).message;
                    this.responseMessages('',errorMessage, 'warning');
                }else{
                    let errorMessage:any;
                    if(error._body!=undefined){
                        if(error.message==null){
                            errorMessage=JSON.parse(error._body).message;
                        }else{
                            errorMessage=error.message;
                        }
                     if(!( errorMessage === undefined)){
                         if(errorMessage.trim() != ''){
                             
                             if(error.status == 403){
                                 this.responseMessages('',errorMessage, 'warning');
                             if(error.status == 403 && (error.url.match("setting")["0"]=="setting")){
                             
                             }
                             
                             } 
                             else{
                                 this.responseMessages('',errorMessage, 'warning');
                             }
                              
                         }else{
                             this.responseMessages('','error', 'warning');}
                         
                     }
                    }
                    
                   else{
                        if(error.name=="TimeoutError"){
                            $("#timeOut-Msg").show();
                        }else{
                            this.responseMessages('','timerout error', 'warning');
                        }
                    }  
                }
                
              
                      
            }
          return Observable.throw(error.json() || 'Server error');
        });
    }
  public closePoupMsgs(btnId, modalId) {
      swal({
      title: "Do you want to cancel the operation?",
      customClass:'swal-text',
      type: "warning",
      showCancelButton: true,
      cancelButtonClass: "btn-danger btn-danger-custom",
      confirmButtonClass: "btn-primary btn-primary-custom",
      confirmButtonText: "Ok",
      closeOnConfirm: true
    },
      function() {
        $("#"+modalId).modal('hide');
      });
 $('.sweet-alert').find('.close-swal').remove(); 
}
public responseMessages(title, message, msgtype) {
    $('.alert-warning').remove();
    $('.alert-success').remove();
    setTimeout(() => {
        $.notify({
          title: '',
          message: message
        }, {
            type: msgtype,
            style: 'message'
          });
        $('.alert-warning').css('z-index','1000000');
        $('.alert-warning').css('display','block');
        $('.alert-success').css('z-index','100000');
      }, 500);
    }
public invalidateLoginSession(){
    const path: string = '/login';
    const logoutUrl = this.environment.getRequiredApi("logout_user").replace("/v1","")+"?accessObjId=null&access_token="+localStorage.getItem('token')+"&logon_id="+localStorage.getItem('logonId');
    this.options = new RequestOptions({
        method: "GET",
        body: ""
      });
    
    return this.http.request(logoutUrl, this.options).map((response: Response) => { try {
        return response.json();
      } catch (e) {
       return response.status;
      }
    }).catch((error)=>{  
        $( "#loadingIcon" ).hide();
        $( "#black-overlay" ).hide();
        $("#modal_locker").modal("hide");
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.clear();
          localStorage.setItem('LMflag','false');
          this.router.navigate([path]);  
        return Observable.throw(error.json() || 'Server error');
      });
}
public selectAllCheckBoxes(checkAll,tableId){
    if($("#"+checkAll).is(":checked")){
        $("#"+tableId).find("tbody").find(".mat-checkbox-input").each(function(i){
            let id:any=$(this).attr('id');
           if(!id.includes('scheme-checkbox')){
            if(!$("#"+id).is(":checked")){
                $("#"+id).click();
            }
           }
        });
    }else{
        $("#"+tableId).find("tbody").find(".mat-checkbox-input").each(function(i){
            let id:any=$(this).attr('id');
           if(!id.includes('scheme-checkbox')){
            if($("#"+id).is(":checked")){
                $("#"+id).click();
            }
           }
           
        });
    }
}
public continueAction(type){
    let flag: boolean;
    $("#"+type).find('tbody').find('.mat-checkbox-input').each(function(i) {
        let id:any=$(this).attr('id');
        if(!$("#"+id).is(":checked")){
          flag = true;
        } else {
          flag = false;
          return false;
        }
      });
    return flag;
}
public checkAction(type){
    let flag: boolean;
    $("#"+type).find('tbody').find('.mat-checkbox-input').each(function(i) {
        let id:any=$(this).attr('id');
        if($("#"+id).is(":checked")){
          flag = true;
        } else {
          flag = false;
          return false;
        }
      });
    return flag;
}
public getUserDetails(){
    let logonId = localStorage.getItem("logonId")
    if( logonId == null){
        logonId =sessionStorage.getItem("logonId");
    }
    let url:any=this.environment.getRequiredApi("get_user_details")+"?logon_id="+logonId+"&";
    return this.getData(url, "GET", "", "");
    
}
 public matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
}
