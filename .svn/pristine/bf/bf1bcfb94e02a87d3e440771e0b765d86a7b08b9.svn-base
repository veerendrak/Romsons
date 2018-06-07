import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[validateOnBlur]'
})
export class ValidateOnBlurDirective {

   @Input('validateFormControl') validateFormControl;

    constructor() { }
    @HostListener('focus', ['$event.target'])
    onFocus(target) {
        try{
            this.validateFormControl.markAsUntouched();
        }
      
        catch (e) {
    // todo: handle exception
}
    }
    @HostListener('focusout', ['$event.target'])
    onFocusout(target) {
        try{
            this.validateFormControl.markAsTouched(); 
        }catch(e){
            
        }
        
    }
}
