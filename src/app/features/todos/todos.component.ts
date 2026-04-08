import { AfterViewInit, Component, inject } from '@angular/core';
import { TodosService } from '../../core/services/todos.service';
import { BehaviorSubject } from 'rxjs';
import { Todo } from '../../core/models/todo.interface';
import { TableColumn, TableComponent } from "../../shared/components/table/table.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todos',
  imports: [TableComponent, CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements AfterViewInit {
  private todoService = inject(TodosService);
  private todoSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todoSubject.asObservable();

  columns: TableColumn<Todo>[] = [
    { key: 'userId', label: 'User ID', sortable: true, width: '10%', resizable: true },
    { key: 'id', label: 'Todo ID', sortable: true, width: '10%', resizable: true },
    { key: 'title', label: 'Title', sortable: true, draggable: false, resizable: true, width: '60%' },
    { key: 'completed', label: 'Completed', sortable: false, draggable: false, width: '20%' }
  ];

  ngAfterViewInit(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todoSubject.next(todos);
        console.log(this.todoSubject.getValue());
      },
      error: (error) => console.error('Error fetching todos:', error)
    });
  }
  

}
