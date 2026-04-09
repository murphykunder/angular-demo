import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosComponent } from './todos.component';
import { HttpClient } from '@angular/common/http';
import { TodosService } from '../../core/services/todos.service';
import { of } from 'rxjs';
import { subscribe } from 'node:diagnostics_channel';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let httpClientSpy: { get: jest.Mock };
  let todoServiceSpy: { getTodos: jest.Mock };

  beforeEach(async () => {
    httpClientSpy = { get: jest.fn() };
    todoServiceSpy = {
      getTodos: jest.fn()
      // getTodos: jest.fn().mockReturnValue({
      //   subscribe: ({ next, error, complete }: any) => {
      //     next([
      //       { id: 1, title: 'Todo 1', completed: false },
      //       { id: 2, title: 'Todo 2', completed: true },
      //     ]);
      //   }
      // })
    };
    
    await TestBed.configureTestingModule({
      imports: [TodosComponent],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: TodosService, useValue: todoServiceSpy }
      ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch todos on ngAfterViewInit', (done) => {
    const expectedTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true },
    ];
    todoServiceSpy.getTodos.mockReturnValue(of(expectedTodos));
    component.ngAfterViewInit();

    component.todos$.subscribe(todos => {
      expect(todos).toEqual(expectedTodos);
      done()
    });
  });
});
