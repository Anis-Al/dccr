import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilisateur, ROLES } from '../../../core/dtos/Utilisateurs/utilisateur-dto';
import { UtilisateurService } from '../../../core/services/auth&utilisateurs/utilisateur.service';

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
  ldapForm!: FormGroup;
  isEditMode = false;
  isLdapMode = false;
  roles = ROLES;
  addUserMessage: string | null = null;
  addUserSuccess: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UtilisateurService
  ) {}

  onModeChange(): void {
    this.initForm();
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const matricule = params.get('matricule');
      if (matricule) {
        this.isEditMode = true;
        this.userService.getUserByMatricule(matricule).subscribe({
          next: user => {
            this.user = user;
            this.initForm();
            this.userForm.patchValue(user);
          },
          error: () => {
            this.router.navigate(['/utilisateurs']);
          }
        });
      } else {
        this.isEditMode = false;
        this.initForm();
      }
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      matricule: [this.user?.matricule || null, Validators.required],
      nom_complet: [this.user?.nom_complet || '', Validators.required],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      role: [this.user?.role || 'Consultant', Validators.required]
    });
    this.ldapForm = this.fb.group({
      matricule: [this.user?.matricule || null, Validators.required],
      role: [this.user?.role || 'Consultant', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.isLdapMode) {
      if (this.ldapForm.valid) {
        const ldapData = this.ldapForm.value;
        this.userService.ajouterUtilisateurLdap(ldapData).subscribe({
          next: (res) => {
            this.addUserMessage = res.message;
          },
          error: (error) => {
            this.addUserMessage = 'Erreur lors de l\'ajout LDAP.';
            console.error('Erreur lors de l\'ajout LDAP:', error);
          }
        });
      }
    } else {
      if (this.userForm.valid) {
        const utilisateur: Utilisateur = this.userForm.value;
        if (this.isEditMode) {
          this.userService.majUtilisateur(utilisateur).subscribe({
            next: (user) => {
              this.formSubmit.emit(user);
              alert('Utilisateur modifié avec succès!');
              this.router.navigate(['/utilisateurs']);
            },
            error: (error) => {
              console.error('Erreur :', error);
              alert('Erreur');
            }
          });
        } else {
          this.userService.ajouterUtilisateur(utilisateur).subscribe({
            next: (res) => {
              this.addUserMessage = res;
            },
            error: (error) => {
              this.addUserSuccess = false;
              console.error('Erreur lors de l\'ajout:', error);
            }
          });
        }
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/utilisateurs']);
  }

  get matricule() {
    return (this.isLdapMode ? this.ldapForm : this.userForm).get('matricule');
  }
  get email() {
    return this.userForm.get('email');
  }
  get nom_complet() {
    return this.userForm.get('nom_complet');
  }
  get role() {
    return (this.isLdapMode ? this.ldapForm : this.userForm).get('role');
  }
}
