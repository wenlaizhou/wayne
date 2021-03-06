import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Group } from '../../model/v1/group';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';

@Injectable()
export class GroupService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  listGroup(pageState: PageState, type?: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    if (typeof (type) !== 'undefined') {
      params = params.set('type', type + '');
    }
    Object.getOwnPropertyNames(pageState.params).map(key => {
      let value = pageState.params[key];
      if (isNotEmpty(value)) {
        params = params.set(key, value);
      }
    });
    let filterList: Array<string> = [];
    Object.getOwnPropertyNames(pageState.filters).map(key => {
      let value = pageState.filters[key];
      if (isNotEmpty(value)) {
        if (key === 'deleted' || key === 'id') {
          filterList.push(`${key}=${value}`);
        } else {
          filterList.push(`${key}__contains=${value}`);
        }
      }
    });
    if (filterList.length) {
      params = params.set('filter', filterList.join(','));
    }
    // sort param
    if (Object.keys(pageState.sort).length !== 0) {
      let sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      params = params.set('sortby', sortType);
    }

    return this.http
      .get('/api/v1/groups', {params: params})

      .catch(error => Observable.throw(error));
  }

  createGroup(group: Group): Observable<any> {
    return this.http
      .post(`/api/v1/groups`, group, this.options)

      .catch(error => Observable.throw(error));
  }

  updateGroup(group: Group): Observable<any> {
    return this.http
      .put(`/api/v1/groups/${group.id}`, group, this.options)

      .catch(error => Observable.throw(error));
  }

  deleteGroup(groupId: number): Observable<any> {
    let options: any = {};
    return this.http
      .delete(`/api/v1/groups/${groupId}`, options)

      .catch(error => Observable.throw(error));
  }

  getGroup(groupId: number): Observable<any> {
    return this.http
      .get(`/api/v1/groups/${groupId}`)

      .catch(error => Observable.throw(error));
  }

  initGroup(): Observable<any> {
    return this.http.get(`/api/v1/groups/init`)

      .catch(error => Observable.throw(error));
  }
}
