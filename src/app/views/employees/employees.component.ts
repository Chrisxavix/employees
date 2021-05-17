import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CountriesService } from 'src/app/services/countries.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { MyValidations } from 'src/app/utils/age-validation';
import Swal from 'sweetalert2';

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
  idView: string | null;
  titleEmployee = 'Crear Empleado';
  getInformationFirebase: any;
  objectEmployee: any;
  viewInformation = true;
  textViewDisabled = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private employeesService: EmployeesService,
    private countriesService: CountriesService,
    private router: Router,
    private routeActivate: ActivatedRoute,
    private toastr: ToastrService,
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
    /* Sección para determinar si estoy en la ruta de crear, editar o ver */
    this.id = this.routeActivate.snapshot.paramMap.get('id');
    this.idView = this.routeActivate.snapshot.paramMap.get('idView');
    if (this.id !== null) {
      this.titleEmployee = 'Actualizar Empleado';
    }
    if (this.idView !== null) {
      this.titleEmployee = 'Ver Empleado';
      this.textViewDisabled = true;
    }
  }

  ngOnInit() {
    this.getAllCountries();
    this.getEmployee();
    this.viewEmployee();
  }

  /* Traer data de paises del endpoint */
  getAllCountries() {
    this.countriesService.getAll().then((response: any) => {
      this.dataCountryAll = response.map(item => {
        return item.name;
      })
    }).catch(error => {
      console.log(error);
    })
  }

  /* Seleccionar del radio button el area */
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

  /* Visualizar la opción de comisión */
  jobSelect(item) {
    if (item === 'Fundador y CEO') {
      this.founderAndCeo = true;
    } else {
      this.founderAndCeo = false;
    }
  }

  /**
   * Ejecución del método del submit del formulario
   * Reutilizar formulario para editar o crear
   * this.id: recojo de la ruta, si es nulo estoy creado, si tiene un valor (id:string) es para editar
   * even.preventDefault(): Evento por default de html es recargar la página, con el preventDefault
    se asegura que no lo haga
   */
  save(event: Event) {
    event.preventDefault();
    if (this.id === null) {
      this.createEmployee();
    } else {
      this.updateEmployee(this.id);
    }
  }

  /* Crear el empleado */
  createEmployee() {
    if (this.formEmployee.valid) {
      this.loading = true;
      const object = {
        ...this.createObject(),
        dateCreate: new Date()
      }
      this.employeesService.saveEmployeeData(object).then(result => {
        this.formEmployee.reset();
        this.router.navigate(['/employees-list']);
        this.loading = false;
        Swal.fire({ icon: 'success', title: 'Registro creado', showConfirmButton: false, timer: 2000 });
      }).catch(error => {
        Swal.fire({ title: 'Error', text: 'Ups, intente más tarde', icon: 'error', showConfirmButton: false, timer: 2500 });
        this.loading = false;
        console.log(error);
      })
    }
  }

  /* Actualizar registro */
  updateEmployee(id: string) {
    if (this.formEmployee.valid) {
      this.loading = true;
      this.createObject();
      this.employeesService.updateEmployee(id, this.objectEmployee).then(response => {
        this.router.navigate(['/employees-list']);
        this.loading = false;
        Swal.fire({ icon: 'success', title: 'Registro actualizado', showConfirmButton: false, timer: 2000 });
      }).catch(error => {
        this.loading = false;
        console.log(error, 'Error');
        Swal.fire({ title: 'Error', text: 'Ups, intente más tarde', icon: 'error', showConfirmButton: false, timer: 2500 });
      })
    }
  }

  /* Setea los datos para la ruta de actualizar */
  getEmployee() {
    if (this.id !== null) {
      this.loading = true;
      this.employeesService.getEmployee(this.id).subscribe(response => {
        this.getInformationFirebase = response;
        this.getDataFirebase();
        this.loading = false;
      }, (error) => {
        this.loading = false;
        console.log(error, 'Error');
      })
    }
  }

  /* Setea los datos para la ruta de ver */
  viewEmployee() {
    if (this.idView !== null) {
      this.loading = true;
      this.employeesService.getEmployee(this.idView).subscribe(response => {
        this.getInformationFirebase = response;
        this.getDataFirebase();
        this.formEmployee.controls['name'].disable();
        this.formEmployee.controls['age'].disable();
        this.formEmployee.controls['hiring'].disable();
        this.formEmployee.controls['area'].disable();
        this.formEmployee.controls['job'].disable();
        this.formEmployee.controls['commission'].disable();
        this.formEmployee.controls['username'].disable();
        this.formEmployee.controls['country'].disable();
        this.formEmployee.controls['status'].disable();
        this.viewInformation = false;
        this.loading = false;
      }, (error) => {
        this.toastr.error('Ups, intente más tarde', 'Error', { progressBar: true, timeOut: 2000 });
        this.loading = false;
        console.log(error, 'Error');
      })
    }
  }

  /* Formar el objeto a partir de los controles del formulario para enviar a Firebase */
  createObject() {
    this.objectEmployee = {
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
    return this.objectEmployee;
  }

  /* Trae los datos de Firebase de acuerdo al id para setear el formulario */
  getDataFirebase() {
    if (this.getInformationFirebase.payload.data()) {
      this.formEmployee.setValue({
        name: this.getInformationFirebase.payload.data()['name'],
        age: this.getInformationFirebase.payload.data()['age'],
        hiring: this.getInformationFirebase.payload.data()['hiring'],
        country: this.getInformationFirebase.payload.data()['country'],
        username: this.getInformationFirebase.payload.data()['username'],
        area: this.getInformationFirebase.payload.data()['area'],
        job: this.getInformationFirebase.payload.data()['job'],
        commission: this.getInformationFirebase.payload.data()['commission'],
        status: this.getInformationFirebase.payload.data()['status'],
      });
      if (this.getInformationFirebase.payload.data()['area'] === 'technology') {
        this.areaTechnology = true;
        this.areaAdministration = false;
      } else if (this.getInformationFirebase.payload.data()['area'] === 'administration') {
        this.areaAdministration = true;
        this.areaTechnology = false;
        if (this.getInformationFirebase.payload.data()['job'] === 'Fundador y CEO') {
          this.founderAndCeo = true;
        }
      }
    }
  }
}
