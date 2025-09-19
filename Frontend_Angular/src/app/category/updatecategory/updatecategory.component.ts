import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AllmyservicesService } from '../../services/allmyservices.service';

@Component({
  selector: 'app-updatecategory',
  templateUrl: './updatecategory.component.html',
  styleUrls: ['./updatecategory.component.css']
})
export class UpdatecategoryComponent implements OnInit {
  categoryId: any;
  categoryData: any = {};

  constructor(
    private route: ActivatedRoute,
    private service: AllmyservicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id'); 
    this.getCategoryById(this.categoryId);
  }

  getCategoryById(id: any) {
    this.service.Detailcategory(id).subscribe(
      (res) => {
        this.categoryData = res;
        console.log('Catégorie récupérée:', this.categoryData);
      },
      (err) => {
        console.error('Erreur lors du chargement de la catégorie');
      }
    );
  }

  updateCategory() {
    this.service.updatecategory(this.categoryId, this.categoryData).subscribe(
      (res) => {
        console.log('Catégorie mise à jour avec succès');
        this.router.navigate(['/listcategory']);
      },
      (err) => {
        console.error('Erreur lors de la mise à jour');
      }
    );
  }
}
