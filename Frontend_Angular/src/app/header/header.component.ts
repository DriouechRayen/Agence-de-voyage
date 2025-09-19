import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AllmyservicesService } from '../services/allmyservices.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
   
  
  constructor(private service:AllmyservicesService , private router:Router){
  
  }
  ngOnInit(): void {

  }
 logOut(){
  this.service.logout().subscribe(
      (res:any) =>{
         console.log("**succes to logout**",res);
         this.router.navigateByUrl("/")
     
      },(error:any)=>{console.log("error",error)}
      )

 }
    
  }