import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function timerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (isNaN(value) || value < 0) {
      return { invalidMilliseconds: true };
    }

    return null;
  };
}

export function arraySizeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (isNaN(value) || value <= 0) {
      return { incorrectNumber: true };
    }

    return null;
  };
}

export function specifiedIdsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (!/^\d+(,\d+)*$/.test(value)) {
      return { invalidFormat: true };
    }

    return null;
  };
}
