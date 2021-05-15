import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  areaAdministration = true;
  areaTechnology = false;
  arrayAdministration = ['Fundador y CEO', 'Recursos Humanos'];
  arrayTechnology = ['Programador', 'Diseñador'];
  arrayCommission = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];
  founderAndCeo = false;
  id: string | null;
  titleEmployee = 'Crear Empleado';

  constructor(
    private formBuilder: FormBuilder,
    private employeesService: EmployeesService,
    private countriesService: CountriesService,
    private router: Router,
    private routeActivate: ActivatedRoute,
  ) {
    this.formEmployee = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      age: ['', [Validators.required, MyValidations.age]],
      hiring: ['', Validators.required],
      country: ['', Validators.required],
      username: ['', Validators.required],
      area: ['administration', Validators.required],
      job: ['', Validators.required],
      commission: [''],
      status: [true, Validators.required]
    });
    /* Agregar de manera dinámica el validador en comisión */
    this.formEmployee.get('job').valueChanges.subscribe(value => {
      if (value === 'Fundador y CEO') {
        this.formEmployee.get('commission').setValidators(Validators.required);
      } else {
        this.formEmployee.get('commission').clearValidators();
        this.formEmployee.get('commission').reset();
      }
    });
    /* Sección para determinar si estoy en la ruta de crear o editar */
    this.id = this.routeActivate.snapshot.paramMap.get('id');
    if (this.id !== null) {
      this.titleEmployee = 'Actualizar Empleado';
    }
  }

  ngOnInit() {
    this.getAllCountries();
    this.getEmployee();
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

  areaSelect(item) {
    if (item.value === 'administration') {
      this.areaAdministration = true;
      this.areaTechnology = false;
      /* Si estoy en tecnología, y me paso directo a admin reinicio el control */
      if (this.formEmployee.value.job === 'Diseñador' || this.formEmployee.value.job === 'Programador') {
        this.formEmployee.get('job').patchValue(null);
      }
    } else if (item.value === 'technology') {
      this.areaTechnology = true;
      this.areaAdministration = false;
      /* Si estoy en administración, en fundador CEO y me paso directo a tecnología, oculto comisión */
      this.founderAndCeo = false;
      this.formEmployee.value.commission = '';
      this.formEmployee.get('job').patchValue(null);
    }
  }

  jobSelect(item) {
    if (item === 'Fundador y CEO') {
      this.founderAndCeo = true;
    } else {
      this.founderAndCeo = false;
    }
  }

  save(event: Event) {
    event.preventDefault();
    if (this.id === null) {
      this.createEmployee();
    } else {
      this.updateEmployee(this.id);
    }
  }

  createEmployee() {
    if (this.formEmployee.valid) {
      const employee: any = {
        name: this.formEmployee.value.name,
        age: this.formEmployee.value.age,
        hiring: this.formEmployee.value.hiring,
        area: this.formEmployee.value.area,
        job: this.formEmployee.value.job,
        commission: this.formEmployee.value.commission,
        username: this.formEmployee.value.username,
        country: this.formEmployee.value.country,
        status: this.formEmployee.value.status,
        dateCreate: new Date(),
        dateUpdate: new Date()
      }
      this.employeesService.saveEmployeeData(employee).then(result => {
        console.log('Usuario registrado');
        this.formEmployee.reset();
        this.router.navigate(['/employees-list']);
      }).catch(error => {
        console.log(error);
      })
    }
  }

  updateEmployee(id: string) {
    if (this.formEmployee.valid) {
      const employee: any = {
        name: this.formEmployee.value.name,
        age: this.formEmployee.value.age,
        hiring: this.formEmployee.value.hiring,
        area: this.formEmployee.value.area,
        job: this.formEmployee.value.job,
        commission: this.formEmployee.value.commission,
        username: this.formEmployee.value.username,
        country: this.formEmployee.value.country,
        status: this.formEmployee.value.status,
        dateUpdate: new Date()
      }
      this.employeesService.updateEmployee(id, employee).then(response => {
        console.log('Actualizado');
        this.router.navigate(['/employees-list']);
      }).catch(error => {
        console.log(error, 'Error');
      })
    }
  }

  /* Trae la data para setear el formulario */
  getEmployee() {
    if (this.id !== null) {
      this.employeesService.getEmployee(this.id).subscribe(response => {
        this.formEmployee.setValue({
          name: response.payload.data()['name'],
          age: response.payload.data()['age'],
          hiring: response.payload.data()['hiring'],
          country: response.payload.data()['country'],
          username: response.payload.data()['username'],
          area: response.payload.data()['area'],
          job: response.payload.data()['job'],
          commission: response.payload.data()['commission'],
          status: response.payload.data()['status'],
        }
        )
        if (response.payload.data()['area'] === 'technology') {
          this.areaTechnology = true;
        } else if (response.payload.data()['area'] === 'administration') {
          this.areaAdministration = true;
          if (response.payload.data()['job'] === 'Fundador y CEO') {
            this.founderAndCeo = true;
          }
        }
      }, (error) => {
        console.log(error, 'Error');
      })
    }
  }
}
