import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ObjectI {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  static url = 'https://raw.githubusercontent.com/waliot/test-tasks/master/assets/data/frontend-1-dataset.json';

  constructor(private http: HttpClient) { }

  getObjectList(): Observable<ObjectI[]> {
    return this.http
      .get<ObjectI[]>(DataService.url)
      .pipe(map((list = []) => list));
  }
}
