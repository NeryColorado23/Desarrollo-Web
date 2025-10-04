import { FormGroup } from '@angular/forms';

//clase para poder reutilizar las validaciones de los formulario
export class FormUtils {
//Expresiones regulares


  //validar campos requeridos
  //se valida tambien que cuando el usuario toque los form aparezcan los campos requeridos y no antes
  static isValidField(form: FormGroup, fieldName: string):boolean | null {
    return(
      !! form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }


   //validar largo minimo establecido para mostrar error en html
  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if(!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    for(const key of Object.keys(errors)){
      switch(key){
        case 'required':
        return 'Este campo es requerido';

        case 'minlength':
        return `Minimo de ${errors['minlength'].requiredlength} caracteres.`;

        case 'min':
        return `Valor minimo de ${errors['min'].min}`;
      }
    }
    return null;
  }

}

//FormUtils.isValiedField
