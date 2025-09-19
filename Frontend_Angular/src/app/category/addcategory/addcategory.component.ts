import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from '../../services/allmyservices.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-addcategory',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './addcategory.component.html',
  styleUrl: './addcategory.component.css'
})
export class AddcategoryComponent implements OnInit {
  form:FormGroup
  constructor(
private service:AllmyservicesService,
private formbuilder:FormBuilder,
private router:Router
 )
 {
     this.form=this.formbuilder.group({
      description:["",Validators.required],
      name:["",Validators.required]
    })
  }
  ngOnInit(): void {
  }
  CreateFunction(){
    let data = new FormData();
    data.append("name",this.form.value.name)
    data.append("description",this.form.value.description)
//appel au service de cration
this.service.createcategory(data).subscribe(
  (res)=>{console.log("sucess to create category",res);
this.router.navigateByUrl("/listcategory")
  },
  (error)=>{console.log(error)}
)
  }
}