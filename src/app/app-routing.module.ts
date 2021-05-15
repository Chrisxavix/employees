import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './views/employees/employees.component';
import { ListEmployeesComponent } from './views/list-employees/list-employees.component';

const routes: Routes = [
  { path: 'employees-list', component: ListEmployeesComponent },
  { path: 'employees-create', component: EmployeesComponent },
  { path: 'employees-edit/:id', component: EmployeesComponent },
  { path: '', redirectTo: 'employees-list', pathMatch: 'full' },
  { path: '**', redirectTo: 'employees-list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
