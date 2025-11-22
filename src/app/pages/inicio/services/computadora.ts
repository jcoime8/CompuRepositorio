import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PC, pcs } from '../interface/computadora';

@Injectable({
  providedIn: 'root'
})
export class Computadora {
  
  apisUrl = 'https://api-proyectofinal-b9su.onrender.com/api/pc'

  constructor(
    private http:HttpClient
  ){}

  getcomputadoras():Observable<pcs>{
    return this.http.get<pcs>(this.apisUrl)
  }

  getcomputadora(id:string):Observable<PC>{
    return this.http.get<PC>(`${this.apisUrl}/${id}`)
  }

}
