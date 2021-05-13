import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeModel } from 'src/app/models/employe';
import { EmployeesService } from 'src/app/services/employees.service';

const employees: EmployeModel[] = [
  { name: 'Chrisdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', age: 12, contratacion: '12/12/12', job: 'TI'},
  { name: 'Xavier', age: 20, contratacion: '11/04/12', job: 'Programador'},
  { name: 'Daniel', age: 32, contratacion: '03/02/12', job: 'Diseñador'},
  { name: 'Mary', age: 23, contratacion: '19/01/12', job: 'SEO'},
  { name: 'Lucas', age: 89, contratacion: '14/03/12', job: 'Marketing'},
  { name: 'Pedro', age: 40, contratacion: '12/06/12', job: 'TI'},
  { name: 'Juan', age: 30, contratacion: '16/10/12', job: 'Seguridad'},
  { name: 'Peter', age: 27, contratacion: '29/11/12', job: 'BD'},
  { name: 'Teresa', age: 17, contratacion: '23/04/12', job: 'Programador'},
  { name: 'Martha', age: 19, contratacion: '10/08/12', job: 'Marketing'},
  { name: 'Jaz', age: 44, contratacion: '05/11/12', job: 'Marketing'},
  { name: 'Naty', age: 33, contratacion: '01/04/12', job: 'Programador'},
  { name: 'Jess', age: 14, contratacion: '02/09/12', job: 'BD'}
];

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListEmployeesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['name', 'age', 'contratacion', 'transactions'];
  dataSource = new MatTableDataSource(employees);

  constructor(
    private employeesService: EmployeesService
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.employeesService.translateMatPaginator(this.paginator);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
