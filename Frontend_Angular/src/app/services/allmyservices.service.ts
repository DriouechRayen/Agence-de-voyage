import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class AllmyservicesService {

  constructor(private http:HttpClient) { }


  httpOptions:any
logout(){
//alert(localStorage.getItem("token"))
  this.httpOptions  = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
       'Authorization':`Bearer` +` `+ localStorage.getItem("token")
      })
    }
   //console.log("****************httpheadrs**",this.httpOptions);
   return this.http.get(`${environment.baseUrl}/user/signout`,this.httpOptions)
  }

  //fonctions user
  Alusers()
   {return this.http.get(`${environment.baseUrl}/user/list`)}
  Detailuser(id:String)
   {
     return this.http.get(`${environment.baseUrl}/user/getOne/${id}`)
   }
  deleteOneuser(id:String)
   {return this.http.delete(`${environment.baseUrl}/user/delete/${id}`)}
  createUser(data:any)
   {
     return this.http.post(`${environment.baseUrl}/user/create`,data)
   }
    updateUtilisateurt(id:String, data:any){
     return this.http.put(`${environment.baseUrl}/user/update/${id}`,data)
   }
  signin(data:any){
     return this.http.post(`${environment.baseUrl}/user/signin`,data)
  }
  signout(){
     return this.http.get(`${environment.baseUrl}/user/signout`)
  }

  //fonctions category
  Alcategory()
   {return this.http.get(`${environment.baseUrl}/category/list`)}
  Detailcategory(id:String)
   {
     return this.http.get(`${environment.baseUrl}/category/getOne/${id}`)
   }
  deleteOnecategory(id:String)
   {return this.http.delete(`${environment.baseUrl}/category/delete/${id}`)} 
   createcategory(data:any)
   {
     return this.http.post(`${environment.baseUrl}/category/create`,data)

   }
   
  //fonctions voyage
    Alvoyage()
   {return this.http.get(`${environment.baseUrl}/voyage/list`)}
    Detailvoyage(id:String)
   {
     return this.http.get(`${environment.baseUrl}/voyage/getOne/${id}`)
   }
   deleteOnevoyage(id:String)
   {return this.http.delete(`${environment.baseUrl}/voyage/delete/${id}`)}

   createvoyage(data:any, idcat:String)
   {
     return this.http.post(`${environment.baseUrl}/voyage/create/${idcat}`,data)
   }
     updatevoyage(id:String, data:any){
     return this.http.put(`${environment.baseUrl}/voyage/update/${id}`,data)
   }


 //fonctions reservation
 
    Alreservation()
   {return this.http.get(`${environment.baseUrl}/reservation/list`)}
   Detailreservation(id:String)
   {
     return this.http.get(`${environment.baseUrl}/reservation/getOne/${id}`)

   }
    updatecategory(id:String, data:any){
     return this.http.put(`${environment.baseUrl}/category/update/${id}`,data)
    }
   deleteOnereservation(id:String)
   {return this.http.delete(`${environment.baseUrl}/reservation/delete/${id}`)}
   createreservation(data:any,id:String)
   {
     return this.http.post(`${environment.baseUrl}/reservation/create/${id}`,data)
   }
  updatereservation(id:String, data:any){
     return this.http.put(`${environment.baseUrl}/reservation/update/${id}`,data)
   }
   
}
