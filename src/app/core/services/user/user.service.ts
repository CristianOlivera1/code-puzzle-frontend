import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUser = environment.apiUser;
  constructor(private httpClient: HttpClient) { }

  updateUserPassword(formData: FormData): Observable<any> {
    const url = `${this.apiUser}/update`;
    return this.httpClient.put<any>(url, formData);
  }

}
