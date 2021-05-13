import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor() { }

  translateMatPaginator(paginator: MatPaginator) {
    paginator._intl.firstPageLabel = 'Página inicial';
    paginator._intl.itemsPerPageLabel = 'Items por página:';
    paginator._intl.lastPageLabel = 'Última página';
    paginator._intl.nextPageLabel = 'Página siguiente';
    paginator._intl.previousPageLabel = 'Página anterior';
  }
}
