import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CountriesService } from 'src/app/services/countries.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { MyValidations } from 'src/app/utils/age-validation';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  formEmployee: FormGroup;
  dataCountryAll: [];

  constructor(
    private formBuilder: FormBuilder,
    private employeesService: EmployeesService,
    private countriesService: CountriesService,
    private router: Router,
  ) {
    this.formEmployee = this.formBuilder.group({
      name: [''],
      age: ['', MyValidations.age],
      hiring: [''],
      job: [''],
      username: [''],
      country: ['']
    });
  }

  ngOnInit() {
    this.getAllCountries();
  }

  getAllCountries() {
    this.countriesService.getAll().then((response: any) => {    
      this.dataCountryAll = response.map(item => {
        return item.name;
      })
    }).catch(error => {
      console.log(error);
    })
  }

  save(event: Event) {
    event.preventDefault();
    if (this.formEmployee.valid) {
      const employee: any = {
        name: this.formEmployee.value.name,
        age: this.formEmployee.value.age,
        hiring: this.formEmployee.value.hiring,
        job: this.formEmployee.value.job,
        username: this.formEmployee.value.username,
        country: this.formEmployee.value.country,
        dateCreate: new Date(),
        dateUpdate: new Date()
      }
      console.log(employee, 'employee???');
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
