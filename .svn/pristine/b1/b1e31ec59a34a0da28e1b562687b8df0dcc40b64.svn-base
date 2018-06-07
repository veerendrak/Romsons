import { Pipe, PipeTransform } from '@angular/core';
declare var $: any; 

@Pipe({
  name: 'customround'
})
export class CustomroundPipe implements PipeTransform {

  transform(val: any, args?: any): any {
      let value:any;
  if(val!=null && val!=""){
      if($.isNumeric(val)){
          value=parseFloat(val);
          value=Math.abs(value);
          value=Math.round(value); 
      }else{
          value=val.replace("+","");
          value=parseFloat(val);
          value=Math.abs(value);
          value=Math.round(value); 
          value=value+" + ";
      }
    
  }else{
      value=0;
  }
  return value;
  }

}
