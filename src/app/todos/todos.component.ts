import { Component, OnInit } from '@angular/core';
import { Todo } from '../models/todo';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todo: Todo;
  todos;
  userId;
  todoId;
  todoIsDone;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('uid');
    this.todo = new Todo();
    this.userService.getTodos(this.userId).subscribe(res => {
      this.todos = res;
    });
  }
  addTodo() {
    this.userService.addTodo(this.userId, this.todo).subscribe(res => {
      console.log(res);
      this.ngOnInit();
    })
  }
  removeTodo(e:any){
    this.todoId=parseInt(e.path[2].cells[0].innerText);
    this.userService.deleteTodo(this.todoId).subscribe(res=>{
      this.ngOnInit();
    })
  }
  selectTodo(e:any){
    this.todo.title = e.path[2].cells[1].innerText;
    this.todo.description = e.path[2].cells[3].innerText;
    this.todoId = parseInt(e.path[2].cells[0].innerText);
    this.todo.isDone = e.path[2].cells[4].children[0].children[0].checked   ;
  }
  updateTodo(){
    this.userService.updateTodo(this.todo,this.todoId).subscribe(res=>{
      this.ngOnInit();
    })
  }
  todoState(e:any){
    this.todoId = parseInt(e.path[3].cells[0].innerText);
    this.todoIsDone = e.target.checked;
    this.userService.updateState(this.todoId,this.todoIsDone).subscribe(res=>{
      this.ngOnInit();
    })
  }

}
