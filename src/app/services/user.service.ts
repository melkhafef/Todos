import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Todo } from '../models/todo';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  login(user: User) {
    return this.http.post<any>('http://intense-dusk-99464.herokuapp.com:80/login', user).pipe(map(user => {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }));
  }
  addTodo(id: number, todo: Todo) {
    return this.http.post(`http://intense-dusk-99464.herokuapp.com:80/user/${id}/todos`, todo);
  }
  getTodos(id:number) {
    return this.http.get(`http://intense-dusk-99464.herokuapp.com:80/user/${id}/todos`);
  }
  deleteTodo(id:number) {
    return this.http.delete(`http://intense-dusk-99464.herokuapp.com:80/todos/${id}`);
  }
  updateTodo(todo:Todo,todoId:number){
    return this.http.put(`http://intense-dusk-99464.herokuapp.com:80/todos/${todoId}`, todo)
  }
  done(todoId:number){
    return this.http.put('http://intense-dusk-99464.herokuapp.com:80/todos',{todoId})
  }
}
