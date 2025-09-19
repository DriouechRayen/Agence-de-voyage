import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from '../services/allmyservices.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // ✅ c'était `styleUrl`, corrigé en `styleUrls`
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  resultlogin: any;

  constructor(
    private service: AllmyservicesService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  loginbutton() {
    const formdata = new FormData();
    formdata.append('username', this.form.value.username);
    formdata.append('password', this.form.value.password);

    this.service.signin(formdata).subscribe(
      (res:any) => {
        console.log('Succès de connexion', res);
        //stockage token 
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('id', res.id);
          localStorage.setItem('isLoggedIn', 'true');

          // Navigation après stockage
          this.router.navigateByUrl('/home');
        } else {
          console.log('aucun token reçu.');
          
        }
      },
      (error) => {
        console.error('Erreur de connexion', error);
      }
    );
  }
}
