import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  baseUrl = 'https://restcountries.eu/rest/v2/all';

  constructor(
    private httpClient: HttpClient,
  ) { }

  getAll(): Promise<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl).toPromise()
  }
}
