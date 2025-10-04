import { JsonPipe } from '@angular/common';
import { JsonpInterceptor } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-basic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './basic-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicPageComponent {

  //formbuilder es un servicio de reactiveformsmodule
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    //usar validaciones de campos usando []
    name: ['', [Validators.required, Validators.minLength(3)]], //largo >=3
    price: [0, [Validators.required, Validators.min(10)]], //precio minimo de 10
    inStorage: [0, [Validators.required, Validators.min(0)]],
  })

  // myForm2 = new FormGroup({
  //   name: new FormControl(''),
  //   price: new FormControl(0),
  //   inStorage: new FormControl(0),
  // })


  //validar campos requeridos
  //se valida tambien que cuando el usuario toque los form aparezcan los campos requeridos y no antes
  // isValidField(fieldName: string):boolean | null {
  //   return (
  //   this.myForm.controls[fieldName].errors &&
  //   this.myForm.controls[fieldName].touched
  //   );
  // }


   //validar largo minimo establecido para mostrar error en html
  // getFieldError(fieldName: string): string | null {
  //   if(!this.myForm.controls[fieldName]) return null;

  //   const errors = this.myForm.controls[fieldName].errors ?? {};

  //   for(const key of Object.keys(errors)){
  //     switch(key){
  //       case 'required':
  //       return 'Este campo es requerido';

  //       case 'minlength':
  //       return `Minimo de ${errors['minlength'].requiredlength} caracteres.`;

  //       case 'min':
  //       return `Valor minimo de ${errors['min'].min}`;
  //     }
  //   }
  //   return null;
  // }

  //validacion para que si la persona manipula el formulario, muestre error de campos requeridos
  onSave(){
    if(this.myForm.invalid){
          this.myForm.markAllAsTouched();
          return;
    }
    console.log(this.myForm.value);
    this.myForm.reset({
      price:0,
      inStorage:0,

    })
  }

}
