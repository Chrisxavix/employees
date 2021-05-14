import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeModel } from 'src/app/models/employe';
import { EmployeesService } from 'src/app/services/employees.service';

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
  dataSource = new MatTableDataSource<EmployeModel>();
  datosFirebase: any[] = [];
  constructor(
    private employeesService: EmployeesService,
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.employeesService.translateMatPaginator(this.paginator);
    this.getEmployees();
  }

  getEmployees() {
    this.employeesService.getDataOrderForDateCreate().subscribe((response: any) => {
      /* Limpiar el array de datos, ya que se pueden duplicar si se eliminan desde firebase */
      this.datosFirebase = [];
      /* Para agarrar el id */
      response.forEach(element => {
        this.datosFirebase.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      this.dataSource.data = this.datosFirebase;
      console.log(this.dataSource.data, 'DATA');
    }, (error) => {
      console.log('Error:', error);
    })
  }

  /* Filtro pot todos los campos */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
