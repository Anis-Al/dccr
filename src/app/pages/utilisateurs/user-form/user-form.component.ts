import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Utilisateur } from '../../../core/dtos/Utilisateurs/utilisateur-dto';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() user: Utilisateur | null = null; 
  @Output() formSubmit = new EventEmitter<Utilisateur>();
  @Output() formCancel = new EventEmitter<void>();

  userForm!: FormGroup;
  isEditMode = false;
  isLdapMode = false;
  roles: Utilisateur['role'][] = ['Consultant', 'Importateur', 'Validateur']; 

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  onModeChange(): void {
    this.initForm();
  }
  ngOnInit(): void {
    this.isEditMode = !!this.user;
    this.initForm();

    if (this.isEditMode && this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  private initForm(): void {
    const baseControls = {
      matricule: [this.user?.matricule || null, Validators.required],
      role: [this.roles[1], Validators.required]
    };

    if (!this.isLdapMode) {
      Object.assign(baseControls, {
        fullName: [this.user?.fullName || '', Validators.required],
        email: [this.user?.email || '', [Validators.required, Validators.email]]
      });
    }

    this.userForm = this.fb.group(baseControls);
  }

  get matricule() { return this.userForm.get('matricule'); }
  get fullName() { return this.userForm.get('fullName'); }
  get email() { return this.userForm.get('email'); }
  get role() { return this.userForm.get('role'); }

  onSubmit(): void {
    if (this.userForm.valid) {
      if (this.isEditMode) {
        this.userService.updateUser(this.userForm.value).subscribe({
          next: (user) => {
            this.formSubmit.emit(user);
            this.router.navigate(['/utilisateurs']);
          },
          error: (error) => console.error('Erreur lors de la mise à jour:', error)
        });
      } else if (this.isLdapMode) {
        const ldapData = {
          matricule: this.userForm.value.matricule,
          role: this.userForm.value.role
        };
        this.userService.addLdapUser(ldapData).subscribe({
          next: (user) => {
            this.formSubmit.emit(user);
            this.router.navigate(['/utilisateurs']);
          },
          error: (error) => console.error('Erreur lors de l\'ajout LDAP:', error)
        });
      } else {
        this.userService.addUser(this.userForm.value).subscribe({
          next: (user) => {
            this.formSubmit.emit(user);
            this.router.navigate(['/utilisateurs']);
          },
          error: (error) => console.error('Erreur lors de l\'ajout:', error)
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/utilisateurs']);
  }
}
