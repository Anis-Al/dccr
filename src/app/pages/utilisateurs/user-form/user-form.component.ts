import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null; 
  @Output() formSubmit = new EventEmitter<User>();
  @Output() formCancel = new EventEmitter<void>();

  userForm!: FormGroup;
  isEditMode = false;
  roles: User['role'][] = ['Consultant', 'Importateur', 'Validateur']; 

  constructor(private router:Router,private fb:FormBuilder){}
  ngOnInit(): void {
    this.isEditMode = !!this.user;
    this.initForm();

    if (this.isEditMode && this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      matricule: [this.user?.matricule || null],  
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [this.roles[1], Validators.required] 
    });
  }

  get matricule() { return this.userForm.get('matricule'); }
  get fullName() { return this.userForm.get('fullName'); }
  get email() { return this.userForm.get('email'); }
  get role() { return this.userForm.get('role'); }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.formSubmit.emit(this.userForm.value as User);
    }
  }

  onCancel(): void {
    this.router.navigate(['/utilisateurs']);
  }
}
