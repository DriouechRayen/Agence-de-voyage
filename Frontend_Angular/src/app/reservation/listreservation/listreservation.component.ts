import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from '../../services/allmyservices.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listreservation',
  templateUrl: './listreservation.component.html',
  imports: [HeaderComponent, CommonModule],
  styleUrls: ['./listreservation.component.css']
})
export class ListreservationComponent implements OnInit {
  listreservation: any;

  constructor(
    private service: AllmyservicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllReservationsFromBack();
  }

  getAllReservationsFromBack() {
    this.service.Alreservation().subscribe(
      (res: any) => {
        console.log('**Liste des réservations**',res);
        this.listreservation = res;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des réservations', error);
      }
    );
  }

  viewReservation(id: string) {
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
        this.service.Detailreservation(id).subscribe(
          (res: any) => {
            console.log('Fetched data:', res);
            Swal.fire({
              title: 'Details',
              html: `
                <strong>ID:</strong> ${res.id}<br>
                <strong>Date:</strong> ${res.date}<br>
              `,
              icon: 'info'
            });
          },
          (error: any) => {
            console.error("Erreur lors de la récupération des détails", error);
            Swal.fire('Erreur', 'Impossible de récupérer les données.', 'error');
          }
        );
      }
    });
  }

  editReservation(id: string) {
    this.service.Detailreservation(id).subscribe(
      (existingReservation: any) => {
        Swal.fire({
          title: 'Edit Reservation',
          html: `
            <input id="date" class="swal2-input" placeholder="Date" value="${existingReservation.date}">
          `,
          showCancelButton: true,
          confirmButtonText: 'Update',
          preConfirm: () => {
            const date = (document.getElementById('date') as HTMLInputElement).value.trim();
            if (!date) {
              Swal.showValidationMessage('Please enter the date.');
              return;
            }
            return { date };
          }
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const updatedReservation = new FormData();
            updatedReservation.append("date", result.value.date);

            this.service.updatereservation(id, updatedReservation).subscribe(
              (res: any) => {
                Swal.fire('Updated!', 'Reservation has been updated.', 'success');
                this.getAllReservationsFromBack();
              },
              (error: any) => {
                console.error('Erreur lors de la mise à jour :', error);
                Swal.fire('Erreur', 'La mise à jour a échoué.', 'error');
              }
            );
          }
        });
      },
      (error: any) => {
        console.error('Erreur lors du chargement de la réservation :', error);
        Swal.fire('Erreur', 'Impossible de charger les données.', 'error');
      }
    );
  }

  deleteReservation(id: string) {
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
        this.service.deleteOnereservation(id).subscribe(
          (res: any) => {
            Swal.fire('Deleted!', 'Reservation has been deleted.', 'success');
            this.getAllReservationsFromBack();
          },
          (error: any) => {
            console.error("Erreur lors de la suppression", error);
            Swal.fire('Erreur', 'Impossible de supprimer.', 'error');
          }
        );
      }
    });
  }
}
