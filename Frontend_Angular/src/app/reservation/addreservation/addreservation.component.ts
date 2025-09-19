import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AllmyservicesService } from '../../services/allmyservices.service';

@Component({
  selector: 'app-addreservation',
  imports: [],
  templateUrl: './addreservation.component.html',
  styleUrl: './addreservation.component.css'
})
export class AddreservationComponent implements OnInit{
  form:FormGroup
  constructor(
    private service:AllmyservicesService,
    private formbuilder:FormBuilder,
    private router:Router
  ){
     this.form=this.formbuilder.group({
      date:["",Validators.required]
     })
  }
  ngOnInit(): void {
    
  }
  CreateFunction(){
    let data = new FormData();
    let id=""
    data.append("date",this.form.value.date)
    this.service.createreservation(data,id).subscribe(
      (res)=>{console.log("sucess to create reservation",res);
        this.router.navigateByUrl("/listreservation")
      }
    )
  
  }

  

}
