import { Component ,OnInit} from '@angular/core';
import { AllmyservicesService } from '../../services/allmyservices.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addvoyage',
  imports: [],
  templateUrl: './addvoyage.component.html',
  styleUrl: './addvoyage.component.css'
})
export class AddvoyageComponent implements OnInit {
  form:FormGroup
    constructor(
private service:AllmyservicesService,
private formbuilder:FormBuilder,
private router:Router
 )
 {
     this.form=this.formbuilder.group({
      date:["",Validators.required],
      name:["",Validators.required],
      file:["",Validators.required]
    })
  }
  ngOnInit(): void {
  }
    CreateFunction(){
    let data = new FormData();
    data.append("name",this.form.value.name)
    data.append("date",this.form.value.description)
    data.append("file",this.form.value.description)
//appel au service de cration
this.service.createvoyage(data).subscribe(
  (res)=>{console.log("sucess to create voyage",res);
this.router.navigateByUrl("/listvoyage")
  },
  (error)=>{console.log(error)}
)
  }
}



