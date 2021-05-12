import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ListEmployeesComponent } from './views/list-employees/list-employees.component';
import { EmployeesComponent } from './views/employees/employees.component';
import { NavbarComponent } from './views/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    ListEmployeesComponent,
    EmployeesComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
