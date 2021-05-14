import { AbstractControl } from '@angular/forms';

export class MyValidations {

    static age(control: AbstractControl) {
        const value = control.value;
        if (value) {
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                return { isYoung: true };
            } else {
                return null;
            }
        }
    }
}
