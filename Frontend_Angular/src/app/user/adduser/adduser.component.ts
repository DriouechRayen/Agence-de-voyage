import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';import { AllmyservicesService } from '../../services/allmyservices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adduser',
  imports: [],
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css'
})
export class AdduserComponent implements OnInit{
  form:FormGroup

  constructor(
    private service:AllmyservicesService,
    private formbuilder:FormBuilder,
    private router :Router
  ){
      this.form=this.formbuilder.group({
        firstName:["",Validators.required],
        lastName:["",Validators.required],
        email:["",Validators.required],
        password:["",Validators.required],
        phone:["",Validators.required],
        username:["",Validators.required],
        file:["",Validators.required],
      })
  }
  ngOnInit(): void {
    
  }
  CreateFunction(){
    let data = new FormData();
    data.append("firstName",this.form.value.name)
    data.append("lastName",this.form.value.name)
    data.append("email",this.form.value.name)
    data.append("phone",this.form.value.name)
    data.append("username",this.form.value.name)
    data.append("file",this.form.value.name)


   this.service.createUser(data).subscribe(
  (res)=>{console.log("sucess to create user",res);
  this.router.navigateByUrl("/listuser")
  },
  (error)=>{console.log(error)}
)
  }
    
  }


