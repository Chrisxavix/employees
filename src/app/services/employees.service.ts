import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(
    private firebase: AngularFirestore,
  ) { }

  saveEmployeeData(employeeObject: any): Promise<any> {
    return this.firebase.collection('employees').add(employeeObject);
  }

  /* Trae la Data de Firebase ordenada por fecha de creación */
  getDataOrderForDateCreate(): Observable<any> {
    return this.firebase.collection('employees', ref => ref.orderBy('dateCreate', 'asc')).snapshotChanges();
  }

  /* Palabras del paginador */
  translateMatPaginator(paginator: MatPaginator) {
    paginator._intl.firstPageLabel = 'Página inicial';
    paginator._intl.itemsPerPageLabel = 'Items por página:';
    paginator._intl.lastPageLabel = 'Última página';
    paginator._intl.nextPageLabel = 'Página siguiente';
    paginator._intl.previousPageLabel = 'Página anterior';
  }
}
