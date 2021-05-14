import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  formEmployee: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private employeesService: EmployeesService,
    private router: Router,
  ) {
    this.formEmployee = this.formBuilder.group({
      name: [''],
      age: [''],
      hiring: [''],
      job: ['']
    });
  }

  ngOnInit() {
  }

  save(event: Event) {
    event.preventDefault();
    if (this.formEmployee.valid) {
      const employee: any = {
        name: this.formEmployee.value.name,
        age: this.formEmployee.value.age,
        hiring: this.formEmployee.value.hiring,
        job: this.formEmployee.value.job,
        dateCreate: new Date(),
        dateUpdate: new Date()
      }
      this.employeesService.saveEmployeeData(employee).then(result => {
        console.log('Usuario registrado');
        this.formEmployee.reset();
        this.router.navigate(['/employees-list'])
      }).catch(error => {
        console.log(error);
      })
    } else {
      console.log('Error');
      this.formEmployee.markAllAsTouched();
    }
  }
}
