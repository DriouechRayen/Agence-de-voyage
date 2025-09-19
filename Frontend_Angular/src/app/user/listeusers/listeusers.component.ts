import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from '../../services/allmyservices.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listeusers',
  templateUrl: './listeusers.component.html',
  imports:[HeaderComponent,CommonModule],
  styleUrls: ['./listeusers.component.css']
})
export class ListeusersComponent implements OnInit {
  listusers: any;

  constructor(
    private service: AllmyservicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.service.Alusers().subscribe(
      (res: any) => {
        console.log('**Liste des utilisateurs**');
        this.listusers = res;
      },
      (error: any) => {
        console.log('Erreur lors du chargement des utilisateurs');
      }
    );
  }
  viewUser(id:String){
    
}
editUser(id:String){}
deleteUser(id:String){
  alert('supprimer')
}
}
