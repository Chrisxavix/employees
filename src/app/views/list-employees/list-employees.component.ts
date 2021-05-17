import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeModel } from 'src/app/models/employe';
import { EmployeesService } from 'src/app/services/employees.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListEmployeesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['name', 'age', 'hiring', 'transactions'];
  dataSource = new MatTableDataSource<EmployeeModel>();
  datosFirebase: any[] = [];
  loading = false;

  constructor(
    private employeesService: EmployeesService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.employeesService.translateMatPaginator(this.paginator);
    this.getEmployees();
  }

  getEmployees() {
    this.loading = true;
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
      this.datosFirebase.forEach((elemnt: any) => {
        elemnt.age = this.employeesService.getAge(elemnt.age);
      })
      this.dataSource.data = this.datosFirebase;
      console.log(this.dataSource.data, 'DATA');
      this.loading = false;
    }, (error) => {
      this.loading = false;
      console.log('Error:', error);
    })
  }

  /* Eliminar Empleado */
  deleteEmployee(id: string) {
    this.loading = true;
    this.employeesService.deleteEmployee(id).then(() => {
      console.log(id, 'eliminado');
      this.loading = false;
      this.toastr.success('Registro eliminado', 'Éxito', { progressBar: true, timeOut: 2000 });
    }, (error) => {
      this.loading = false;
      this.toastr.error('Ups, intente más tarde', 'Error', { progressBar: true, timeOut: 2000 });
      console.log(error, 'eliminación erronea');
    })
  }

  /* Filtro pot todos los campos */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
