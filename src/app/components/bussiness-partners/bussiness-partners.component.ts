import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http , Headers, Response,RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { MessagePropertiesService } from '../../services/message-properties.service';
import {EnvConfigurationService} from '../../services/env-configuration.service';

declare var $: any; 
declare var jQuery: any;
declare var swal: any;


@Component({
  selector: 'app-bussiness-partners',
  templateUrl: './bussiness-partners.component.html',
  styleUrls: ['./bussiness-partners.component.css']
})
export class BussinessPartnersComponent implements OnInit {
    bpId:any;
    orgId:any;
    accessObjectId:any;
    displayTable:boolean=false;
    displayInformation:any;
    title:any;
    messages:any;
    myForm:FormGroup;
    bpStaus:any;
    countryList:any; 
    states:any;
    editBpList:any;
    bpFlag:boolean=false;
    countryId:any;
    cities:any;
    isPointerOn:any;
    businessPartnerTypes:any;
    
    bpTypeFlag:boolean;
    edtFlg:boolean;
    
    
  constructor(private http: Http, private formBuilder: FormBuilder,
          private router: Router,private ref: ChangeDetectorRef,private app:AppComponent, private messagesService:MessagePropertiesService,
          private commonService:CommonService,private environment:EnvConfigurationService) {
      this.app.isActive=true;
      this.bpId=localStorage.getItem("bpId");
      this.orgId=localStorage.getItem("orgId");
      this.accessObjectId=localStorage.getItem("Business Partners");
      this.displayInformation=[];
      this.messages=this.messagesService.bussinessPartnerMsgs;
      this.myForm = formBuilder.group( {
          'bpLegalName': ['', [Validators.required]],
          'bpGstinNumber': ['', [Validators.required, Validators.pattern( '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z][0-9A-Z]{1}$' )]],
          'gstinStatus': ['Active'],
          'bpPan': ['', [Validators.required,  Validators.pattern( '^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$' )]],
          'bpZipCode': ['', [Validators.required, Validators.pattern( '^[1-9][0-9]{5}$' )]],
          'bpContact': ['', [Validators.required, Validators.pattern( '^[789]{1}[0-9]{9}$' )]],
          'bpId': [''],
          'bpType': [''],
          'drugLicNum': ['',[]],
          'erpBankGl': [''],
          'erpBp': [''],
          'erpBusArea': [''],
          'erpProfitCenter': [''],
          'erpRefId': ['',[Validators.required]],
          'addrLine1': ['', [Validators.required]],
          'addrLine2': [''],
          'state': [''],
          'stateId': ['',[Validators.required]],
          'country': [''],
          'countryId': ['',[Validators.required]],
          'location': ['',[Validators.required]],
          'locationId': [''],
          });
      this.countryId=1;
      this.bpStaus =[
                     {
                         "status": "Active",
                     },
                     {
                         "status": "Inactive",
                     }];
      this.editBpList={};
      this.cities=[];
      this.bpTypeFlag=false;this.edtFlg=false;
 }

  ngOnInit() {
      let countriesUrl:any = this.environment.getRequiredApi("dropdown_list") + "?";
      countriesUrl=countriesUrl.replace("{obj_name}","countries");
      this.commonService.getData( countriesUrl, "GET", "", this.accessObjectId).subscribe(( response ) => {
          if(response.status==0){
              this.countryList = response["data"].objs;
          }
      });
      let stateUrl:any = this.environment.getRequiredApi( "dropdown_list_byid" )+ "?";
      stateUrl=stateUrl.replace("{obj_name}","states");
      stateUrl=stateUrl.replace("{obj_id}",1);
      this.commonService.getData( stateUrl, "GET", "", this.accessObjectId).subscribe(( response ) => {
          if(response.status==0){
              this.states  = response["data"].objs;
          }
      });
      this.getBusinessPartnerTypes();  
      this.getDisplayInformation();
      
      $(function(){
          $('#location').change(function(){
              var value=$('#citiesNameList option[value="' + $('#location').val() + '"]').text().trim();
              $("#locationId").val(value);
          });
      });
      
      var url = this.environment.getRequiredApi('upload_stock_balance_file');
      
      var accessObjId = this.accessObjectId;
      $(() => {
         
          $("input[type=file]").change(function() {
              var file = this.files[0];
              var fileExtension = ['csv'];
              var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
              var fileName = $("#stockFile").val()
              fileName = fileName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ' ');
              if(file.name.toLowerCase().lastIndexOf(".csv") == -1){
                   
                  $.notify({
                      title: '<strong></strong>',
                      message: "Please choose a csv file"
                  }, {
                          type: 'warning'
                      });
                  return false;
              } else {
                  $('#loadingIcon').show();
                  $("#black-overlay").show();
                  
                   var bpId = $("#uploadStockBpid").val();
                  var formdata = new FormData($("#csvUploadDataForm")[0]);
                  $.ajax({
                      url: url + "?access_token=" + localStorage.getItem('token') + "&org_id=" + localStorage.getItem("orgId") + "&bp_id=" + bpId + "&dl_type=IMPORT&access_obj_id=" + accessObjId,
                      type: "POST",
                      data: formdata,
                      cache: false,
                      contentType: false,
                      processData: false,
                      success: function(data) {
                          if (data.status == 0) {
                              $("#loadingIcon").hide();
                              $("#black-overlay").hide();
                              var message = data.message;
                              $.notify({
                                  title: '<strong></strong>',
                                  message: message
                              }, {
                                      type: 'success'
                                  });
                              console.log(data)
                          } else {
                              $("#loadingIcon").hide();
                              $("#black-overlay").hide();
                              var message = data.message;
                              $.notify({
                                  title: '<strong></strong>',
                                  message: message
                              }, {
                                      type: 'warning'
                                  });
                              console.log(data)
                          }
                      },
                      error: function(data) {

                          $('#loadingIcon').show();
                          $("#black-overlay").show();

                      }
                  });
              }
              
              
           /*   */
          });
          
        

      
      
      
      });
      
      
      
  }

  public getDisplayInformation() {
      $( '#loadingIcon' ).show(); $( "#black-overlay" ).show();
      this.displayInformation = [];
      let url:any = this.environment.getRequiredApi("get_bps_list")+"?";
      url=url.replace("{org_id}",this.orgId);
      this.commonService.getData(url, "GET", '', this.accessObjectId).subscribe((response) => {
              $( '#loadingIcon' ).hide(); $( "#black-overlay" ).hide();
              if(response.status==0){
                  this.displayTable = true;
                  this.displayInformation=response["data"].bps;
                    
                  this.applyDatatable();
              }else {
                  $( '#loadingIcon' ).hide(); $( "#black-overlay" ).hide();
                  this.displayTable = false;
                  this.applyDatatable();
              }

          } );

  }
  applyDatatable(){
      setTimeout(() => {
          $( '#business_place' ).DataTable( {
              // responsive: true,
              retrieve: true,
              "language": {
                  "emptyTable": "No data available",
                  "info": "Showing page _PAGE_ of _PAGES_",
                  "infoFiltered": "(filtered from _MAX_ total records)"
              },
              columnDefs: [{
                  targets: [0, 1, 2, 3],

                  //    render: $.fn.dataTable.render.ellipsis()
                  render: function( data, type, row ) {
                      return data.length > 25 ? data.substr( 0, 26 ) + '...' : data;
                  }
              }, {
                  "bSortable": false,
                  "aTargets": [7]
              }],
              "fnDrawCallback": function( oSettings ) {
                  if ( 10 >= oSettings.fnRecordsDisplay() ) {
                      $( oSettings.nTableWrapper ).find( '.dataTables_paginate' ).hide();
                      // $(oSettings.nTableWrapper).find('.dataTables_filter').hide();
                      $( oSettings.nTableWrapper ).find( '.dataTables_info' ).hide();
                      //$(oSettings.nTableWrapper).find('.dataTables_length').hide();
                  } else {
                      $( oSettings.nTableWrapper ).find( '.dataTables_paginate' ).show();
                      // $(oSettings.nTableWrapper).find('.dataTables_filter').show();
                      $( oSettings.nTableWrapper ).find( '.dataTables_info' ).show();
                      //  $(oSettings.nTableWrapper).find('.dataTables_length').show();
                  }
              }

          } );


          $( "div" ).removeClass( 'container-fluid' )

      }, 500 );

      setTimeout(() => {
          $( ".dataTables_scrollHeadInner" ).css( { "width": "100%" } );

          $( ".table " ).css( { "width": "100%" } );

      }, 600 );
  }
  addBusinessPartner(){
      this.title="Add Business Partner";
      this.bpFlag=false;
      this.bpTypeFlag=false;
       $("#drugLicNum").removeAttr("disabled");
      this.myForm.reset();
      $("#bussinessModal").modal("show");
  }
  closeModal(id){
      $("#"+id).modal("hide");
  }
  editBranchDetails(items,view){
      $( "#loadingIcon" ).show();
      $( "#black-overlay" ).show();
      this.bpTypeFlag = true;
     let url:any=this.environment.getRequiredApi("edit_bp_list")+"?" 
     url=url.replace("{bp_id}",items.bpId);
     this.commonService.getData(url, "GET", "", this.accessObjectId).subscribe(response=>{
        if(response.status==0){
            this.title=view;
            $( "#loadingIcon" ).hide();
            $( "#black-overlay" ).hide();
            this.editBpList=response["data"];
            
            if(this.editBpList.hasOwnProperty("drugLicNum") ){
                $("#drugLicNum").attr("disabled","disabled")
                console.log("entered")
            }else{
                 $("#drugLicNum").removeAttr("disabled")
            }
            
            console.log(this.editBpList);
            this.edtFlg =true;
            this.getCitiesList(this.editBpList.stateId);
            
            $("#bussinessModal").modal("show");
            if(view=='Business Partner Details'){
                this.bpFlag=true;
                $("#drugLicNum").attr("disabled","disabled")
            }else{
                this.bpFlag=false;
                 
            }
        }else{
            $( "#loadingIcon" ).hide();
            $( "#black-overlay" ).hide();
            this.commonService.responseMessages("", response.message, "warning");
        } 
     });
  }
  getCitiesList(stateId){
      if(this.title == "Add Business Partner" || !this.edtFlg){
          this.myForm.controls['location'].setValue('');
          $("#location").val("")    
      }else{
          this.edtFlg =false;
      }
      
      let citiesUrl:any = this.environment.getRequiredApi( "dropdown_list_byid" )+ "?";
  citiesUrl=citiesUrl.replace("{obj_name}","cities");
  citiesUrl=citiesUrl.replace("{obj_id}",stateId);
  this.commonService.getData( citiesUrl, "GET", "", this.accessObjectId).subscribe(( response ) => {
      if(response.status==0){
          this.cities  = response["data"].objs;
      }
  });
  }
 submitAddBusinessPartner(view){
     
     let response:any;
     let method:any="POST"
         if(view=='Add Business Partner'){
             method="POST";
             this.myForm.value['country']=$("#country_id option:selected").text().trim();
             this.myForm.value['state']=$("#state_id option:selected").text().trim();
             this.myForm.value['locationId']=$("#locationId").val();
            
             if( this.myForm.value['erpRefId'] != null ){
                 this.myForm.value['erpRefId'] = this.myForm.value['erpRefId'].toUpperCase();
             }
             
              if (this.myForm.value['erpBp'] != null ) {
                 this.myForm.value['erpBp'] = this.myForm.value['erpBp'].toUpperCase();
                 if(this.myForm.value['erpBp'].length ==0){
                      this.myForm.value['erpBp'] = this.myForm.value['erpRefId']
                 }
             }else{
                  this.myForm.value['erpBp'] = this.myForm.value['erpRefId']
              }
             
             
             
             if (this.myForm.value['erpBp'] != this.myForm.value['erpRefId']) {
                this.commonService.responseMessages("", "Provided  Plant Code and ERP Business Partner does not match", "warning");
                 return false;
             }
             
             //erpProfitCenter erpRefId
             response=this.myForm.value;
         }else{
             method="PUT";
             response=this.editBpList;
              if (response["erpBp"] != null) {
                response["erpBp"] = this.editBpList.erpBp.toUpperCase();
              }
             if(this.myForm.value['erpRefId'] != null){
                 response["erpRefId"] = this.editBpList.erpRefId.toUpperCase();   
             }
             
             this.editBpList['locationId']=$("#locationId").val();
             
             if (this.editBpList['erpBp'] === undefined || this.editBpList['erpBp'].length == 0) {
                 this.editBpList['erpBp'] = this.editBpList['erpRefId']
             }


             if (this.editBpList['erpBp'] != this.editBpList['erpRefId']) {
                 this.commonService.responseMessages("", "Provided  Plant Code and ERP Business Partner does not match", "warning");
                 return false;
             }
             
         }
     response["gstinStatus"]="Active";
     $( "#loadingIcon" ).show();
     $( "#black-overlay" ).show();
     
     let url:any=this.environment.getRequiredApi("add_bp_org")+"?";
     url=url.replace("{org_id}",this.orgId);
     this.commonService.getData(url, method, response, this.accessObjectId).subscribe((response)=>{
        if(response.status==0){
            $( "#loadingIcon" ).hide();
            $( "#black-overlay" ).hide();
            this.commonService.responseMessages("", response.message, "success");
            $("#bussinessModal").modal("hide");
            $( "#business_place" ).DataTable().destroy()
            this.getDisplayInformation();
        }else{
            $( "#loadingIcon" ).hide();
            $( "#black-overlay" ).hide();
            this.commonService.responseMessages("", response.message, "warning");
        } 
     });
  }
 removeBranchDetails( items ) {
     swal( {
         title: "Do you want to remove this business partner?",
         //text: "Do you want to delete branch?",
         showCancelButton: true,
         cancelButtonClass: "cancel-button-export btn-primary-custom",
         confirmButtonClass: "login-button-export btn-primary-custom",
         confirmButtonText: "Ok",
         closeOnConfirm: true
     },
         () => {
                 $( '#loadingIcon' ).show();
                 $( "#black-overlay" ).show();
                 let url:any=this.environment.getRequiredApi("add_bp_org")+"?";
                 url=url.replace("{org_id}",this.orgId);
                 let body = {
                             "bpList": [
                                            items.bpId
                                         ],
                             "orgId": this.orgId,
                             };
                 this.commonService.getData( url, "DELETE", body, this.accessObjectId)
                     .subscribe(( response ) => {
                         if(response.status==0){
                             $( "#business_place" ).DataTable().destroy()
                             this.getDisplayInformation();
                             $( '#loadingIcon' ).hide();
                             $( "#black-overlay" ).hide();
                             this.commonService.responseMessages( '', response.message, 'success' );
                         }else{
                             $( '#loadingIcon' ).hide();
                             $( "#black-overlay" ).hide();
                             this.commonService.responseMessages( '', response.message, 'warning' );
                         }

                     })
                 });
 }
    
    public getBusinessPartnerTypes(){
        let headerUrl:any = this.environment.getRequiredApi( "header_dropdown" )+ "?group=BPTYPS&";
          this.commonService.getData( headerUrl, "GET", "", this.accessObjectId).subscribe(( response ) => {
      if(response.status==0){
          this.businessPartnerTypes  = response.data["configValues"];
        this.businessPartnerTypes.sort(
        
                      function(x, y) {
                         console.log($(x).text()+".......")
                          return $(x).text() > $(y).text() ? 1 : -1;
                      }
        
                  );
      }
  });
    }
    
    public uploadCsvFile(bpId){
        $("#uploadStockBpid").val(bpId);
        $("#stockFile").val("");
        $("#stockFile").click();
    }
}
