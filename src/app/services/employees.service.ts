import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../models/employe';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(
    private firebase: AngularFirestore,
  ) { }

  saveEmployeeData(employeeObject: EmployeeModel): Promise<any> {
    return this.firebase.collection('employees').add(employeeObject);
  }

  /* Trae la Data de Firebase ordenada por fecha de creación */
  getDataOrderForDateCreate(): Observable<any> {
    return this.firebase.collection('employees', ref => ref.orderBy('dateCreate', 'asc')).snapshotChanges();
  }

  /* Eliminar una empleado */
  deleteEmployee(id: string): Promise<any> {
    return this.firebase.collection('employees').doc(id).delete();
  }

  /* Trae la data para editar */
  getEmployee(id: string): Observable<any> {
    return this.firebase.collection('employees').doc(id).snapshotChanges();
  }

  /* Editar Empleado */
  updateEmployee(id: string, employee: EmployeeModel): Promise<any> {
    return this.firebase.collection('employees').doc(id).update(employee);
  }

  /* Palabras del paginador */
  translateMatPaginator(paginator: MatPaginator) {
    paginator._intl.firstPageLabel = 'Página inicial';
    paginator._intl.itemsPerPageLabel = 'Items por página:';
    paginator._intl.lastPageLabel = 'Última página';
    paginator._intl.nextPageLabel = 'Página siguiente';
    paginator._intl.previousPageLabel = 'Página anterior';
  }

  getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
