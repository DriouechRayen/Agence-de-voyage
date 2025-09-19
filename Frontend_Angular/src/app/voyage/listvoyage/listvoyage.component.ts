import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from '../../services/allmyservices.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listvoyage',
  templateUrl: './listvoyage.component.html',
  styleUrls: ['./listvoyage.component.css'],
  imports: [HeaderComponent, CommonModule]
})
export class ListvoyageComponent implements OnInit {
  listvoyage: any;
  iduser: string = '';
listcategory:any;
  constructor(
    private service: AllmyservicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.iduser = localStorage.getItem('id') || '';
    this.getAllVoyages();
    //list des categories
    this.allmycategoriesfromback();

  }
 


   allmycategoriesfromback(){
     this.service.Alcategory().subscribe(
      (res:any) =>{
         console.log("**liste de category**")
         this.listcategory=res;
      },(error:any)=>{console.log("error")}
      )
     
  }

  getAllVoyages() {
    this.service.Alvoyage().subscribe(
      (res: any) => {
        console.log('**Liste des voyages**', res);
        this.listvoyage = res;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des voyages', error);
      }
    );
  }
viewVoyage(id: string) {
  Swal.fire({
    title: 'Do you want to view details?',
    text: "This will fetch the details for this item.",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085D6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, show me!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.Detailvoyage(id).subscribe(
        (res: any) => {
          console.log('Fetched data:', res);

          
          const imageUrl = `http://localhost:8083/voyage/files/${res.photo}`;

          Swal.fire({
            title: 'Voyage Details',
            html: `
              <p><strong>ID:</strong> ${res.id}</p>
              <p><strong>Name:</strong> ${res.name}</p>
              <p><strong>Date:</strong> ${res.date}</p>
              <p><strong>Image:</strong><br>
                <img src="${imageUrl}" alt="Voyage Image" style="max-width: 100%; height: auto; border-radius: 8px;" />
              </p>
            `,
            width: 600,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Close',
            icon: 'info'
          });
        },
        (error: any) => {
          console.error("Error fetching data", error);
          Swal.fire('Error', 'Could not fetch data.', 'error');
        }
      );
    }
  });
}


   deletevoyage(id:String){
    
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.deleteOnevoyage(id).subscribe(
            (res: any) => {
              console.log("ok");
              this.allmycategoriesfromback()
            },
            (error: any) => { console.log("error is", error) }
          )
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    }

  editvoyage(id: string) {
  this.service.Detailvoyage(id).subscribe(
    (existingVoyage: any) => {
      Swal.fire({
        title: 'Edit Voyage',
        html: `
          <input id="name" class="swal2-input" placeholder="Voyage Name" value="${existingVoyage.name}">
          <input id="date" type="date" class="swal2-input" value="${existingVoyage.date}">
          <p><strong>Current Image:</strong><br>
            <img src="http://localhost:8083/voyage/files/${existingVoyage.photo}" alt="Voyage Image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" />
          </p>
          <input id="file" type="file" class="swal2-input" />
        `,
        showCancelButton: true,
        confirmButtonText: 'Update',
        preConfirm: () => {
          const name = (document.getElementById('name') as HTMLInputElement).value.trim();
          const date = (document.getElementById('date') as HTMLInputElement).value;
          const fileInput = document.getElementById('file') as HTMLInputElement;
          const file = fileInput?.files?.[0] || null;

          if (!name || !date) {
            Swal.showValidationMessage('Please enter both name and date');
            return;
          }

          return { name, date, file };
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const formData = new FormData();
          formData.append('name', result.value.name);
          formData.append('date', result.value.date);
          if (result.value.file) {
            formData.append('file', result.value.file); 
          }

          this.service.updatevoyage(id, formData).subscribe(
            (res: any) => {
              Swal.fire('Updated!', 'Voyage has been updated.', 'success');
              this.getAllVoyages();
            },
            (error: any) => {
              console.error('Update error:', error);
              Swal.fire('Error', 'Failed to update voyage.', 'error');
            }
          );
        }
      });
    },
    (error: any) => {
      console.error('Fetch error:', error);
      Swal.fire('Error', 'Could not load voyage data.', 'error');
    }
  );
}



  makereservation(id: string) {
    Swal.fire({
      title: 'Create New Reservation',
      html:
        `<input id="date" type="date" class="swal2-input" placeholder="Date">` +
        `<input id="paid" class="swal2-input" placeholder="Paid">`,
      showCancelButton: true,
      confirmButtonText: 'Create',
      preConfirm: () => {
        const date = (document.getElementById('date') as HTMLInputElement).value;
        const paid = (document.getElementById('paid') as HTMLInputElement).value;
        if (!date || !paid) {
          Swal.showValidationMessage('Please fill out both fields');
          return;
        }
        return { date, paid };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const formData = new FormData();
        formData.append('date', result.value.date);
        formData.append('paid', result.value.paid);
        formData.append('voyageId', id); 

        this.service.createreservation(formData, this.iduser).subscribe(
          (res: any) => {
            Swal.fire('Success', 'Reservation created successfully!', 'success');
            this.router.navigateByUrl('/reservations');
          },
          (error: any) => {
            console.error('Creation error:', error);
            Swal.fire('Error', 'Failed to create reservation.', 'error');
          }
        );
      }
    });
  }
 createvoyage() {

 const categoryOptions = this.listcategory.map(
    (cat: any) => `<option value="${cat.id}">${cat.name}</option>`
  ).join('');


  Swal.fire({
    title: 'Create New Travel',
    html:
      `<input id="name" class="swal2-input" placeholder="Name">` +
      `<input id="date" type="date" class="swal2-input" placeholder="Date">` +
      `<input id="file" type="file" class="swal2-input">`+
     `<div class="form-group">
         <label for="idcat">Category</label>
         <select id="idcat" class="swal2-select">
           <option value="" disabled selected>Select category</option>
           ${categoryOptions}
         </select>
       </div>`,
    showCancelButton: true,
    confirmButtonText: 'Create',
    preConfirm: () => {
      const name = (document.getElementById('name') as HTMLInputElement).value;
      const date = (document.getElementById('date') as HTMLInputElement).value;
      const fileInput = document.getElementById('file') as HTMLInputElement;
      const idcat=(document.getElementById('idcat') as HTMLInputElement).value;
      const file = fileInput?.files?.[0];

      if (!name || !date || !file || !idcat) {
        Swal.showValidationMessage('Please fill out all fields');
        return;
      }

      return { name, date, file, idcat };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const formData = new FormData();
      formData.append('name', result.value.name);
      formData.append('date', result.value.date);
      formData.append('file', result.value.file);

      console.log('Sending form data:', formData);

      this.service.createvoyage(formData,result.value.idcat).subscribe(
        (res: any) => {
          Swal.fire('Success', 'Travel created successfully!', 'success');
          this.getAllVoyages(); 
        },
        (error: any) => {
          console.error('Creation error:', error);
          Swal.fire('Error', 'Failed to create travel.', 'error');
        }
      );
    }
  });
}


}
