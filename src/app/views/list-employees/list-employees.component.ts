import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeModel } from 'src/app/models/employe';
import { EmployeesService } from 'src/app/services/employees.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

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
    Swal.fire({
      title: '??Eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(194, 61, 61)',
      confirmButtonText: 'S??',
      cancelButtonColor: 'rgb(43, 95, 155)',
      cancelButtonText: 'NO',
    }).then(response => {
      if (response.isConfirmed === true) {
        this.loading = true;
        this.employeesService.deleteEmployee(id).then(() => {
          console.log(id, 'eliminado');
          this.loading = false;
          Swal.fire({ icon: 'success', title: 'Registro eliminado', showConfirmButton: false, timer: 2000 });
        }, (error) => {
          this.loading = false;
          Swal.fire({ title: 'Error', text: 'Ups, intente m??s tarde', icon: 'error',  showConfirmButton: false,  timer: 2500 });
          console.log(error, 'eliminaci??n erronea');
        })
      }
    }).catch(error => {
      console.log(error, 'Error Sweet');
      Swal.fire({ title: 'Error',  text: 'Ups, intente m??s tarde', icon: 'error', showConfirmButton: false, timer: 2500 });
    })
  }

  /* Filtro pot todos los campos */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
