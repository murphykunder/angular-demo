import { TestBed } from '@angular/core/testing';

import { TodosService } from './todos.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoint.constant';

describe('TodosService', () => {
  let service: TodosService;
  let httpClientSpy: { get: jest.Mock };

  beforeEach(() => {
    httpClientSpy = { get: jest.fn() };
    TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientSpy },
        ]
    });
    service = TestBed.inject(TodosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected todos (HttpClient called once)', (done) => {
    const expectedTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true },
    ]; 
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(expectedTodos));

    service.getTodos().subscribe(todos => {
        expect(todos).toEqual(expectedTodos);
        done();
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(API_ENDPOINTS.TODOS);
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);

  });
});
