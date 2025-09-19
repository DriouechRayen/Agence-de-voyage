import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListeusersComponent } from './user/listeusers/listeusers.component';
import { AdduserComponent } from './user/adduser/adduser.component';
import { LoginComponent } from './login/login.component';
import { UpdateuserComponent } from './user/updateuser/updateuser.component';
import { ListcategoryComponent } from './category/listcategory/listcategory.component';
import { AddcategoryComponent } from './category/addcategory/addcategory.component';
import { UpdatecategoryComponent } from './category/updatecategory/updatecategory.component';
import { ListreservationComponent } from './reservation/listreservation/listreservation.component';
import { AddreservationComponent } from './reservation/addreservation/addreservation.component';
import { UpdatereservationComponent } from './reservation/updatereservation/updatereservation.component';
import { ListvoyageComponent } from './voyage/listvoyage/listvoyage.component';
import { UpdatevoyageComponent } from './voyage/updatevoyage/updatevoyage.component';
import { SendmailComponent } from './sendmail/sendmail.component';

export const routes: Routes = [
   {path:"home",component:HomeComponent},
   {path:"",component:LoginComponent},

    {path:"mail",component:SendmailComponent},



  
    {path:"listuser",component:ListeusersComponent},
    {path:"createuser",component:AdduserComponent},
    {path:"updateuser",component:UpdateuserComponent},
    
    {path:"listcategory",component:ListcategoryComponent},
    {path:"createcategory",component:AddcategoryComponent},
    {path:"updatecategory",component:UpdatecategoryComponent},

    {path:"listreservation",component:ListreservationComponent},
    {path:"createreservation",component:AddreservationComponent},
    {path:"updatereservation",component:UpdatereservationComponent},



    {path:"listvoyage",component:ListvoyageComponent},
    {path:"createvoyage",component:AdduserComponent},
    {path:"updatevoyage",component:UpdatevoyageComponent},



];
