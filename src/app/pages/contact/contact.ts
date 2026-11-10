import { Component, signal, inject } from '@angular/core';
import {
  DxTextBoxModule,
  DxTextAreaModule,
  DxSelectBoxModule,
  DxButtonModule,
} from 'devextreme-angular';
import { JsonPipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

function customPhoneValidator(control: AbstractControl): ValidationErrors | null {
  // Allow empty values to be handled by required validator
  if (!control.value) {
    return null;
  }

  // Simple regex for phone number validation
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  // Remove non-digit characters for length check
  const cleaned = control.value.replace(/[\s\-\(\)]/g, '');

  // Check if it's a valid phone format (10-15 digits)
  if (cleaned.length >= 10 && cleaned.length <= 15 && phoneRegex.test(control.value)) {
    return null;
  }

  return { invalidPhone: { value: control.value } };
}

function customMessageValidator(control: AbstractControl): ValidationErrors | null {
  // Let required validator handle empty values
  if (!control.value) {
    return null;
  }

  // Count words in the message
  const words = control.value
    .trim()
    .split(/\s+/)
    .filter((word: string) => word.length > 0);
  const minWords = 5;

  // Check if there are at least 5 words
  if (words.length >= minWords) {
    return null;
  }

  return { minWords: { required: minWords, actual: words.length } };
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    DxTextBoxModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxButtonModule,
    JsonPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class Contact {
  private fb = inject(FormBuilder);

  contactOptions = ['Email', 'Phone', 'Both'];
  submittedData = signal<any>(null);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, customPhoneValidator]],
    subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000),
        customMessageValidator,
      ],
    ],
    preferredContact: ['Email', Validators.required],
  });

  // Helper methods for template access
  getField(fieldName: string): FormControl {
    return this.contactForm.get(fieldName) as FormControl;
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.getField(fieldName);
    return field.hasError(errorType) && (field.touched || field.dirty);
  }

  isFieldTouched(fieldName: string): boolean {
    return this.getField(fieldName).touched;
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.contactForm.controls).forEach((key) => {
      this.contactForm.get(key)?.markAsTouched();
    });

    if (!this.contactForm.valid) {
      console.log('Form is invalid:', this.contactForm.errors);
      return;
    }

    // Process the valid form data
    const formData = {
      ...this.contactForm.value,
      submittedAt: new Date(),
    };

    this.submittedData.set(formData);
    console.log('Form submitted:', formData);
  }

  onReset(): void {
    this.contactForm.reset({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      preferredContact: 'Email',
    });
    this.submittedData.set(null);
  }
}
