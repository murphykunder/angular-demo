import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResizableColumnDirectiveDirective } from '../../directives/resizable-column-directive.directive';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  draggable?: boolean;
  width?: string;
  resizable?: boolean;
}

@Component({
  selector: 'app-table',
  imports: [
    DragDropModule,
    ResizableColumnDirectiveDirective
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T> implements OnInit, OnChanges {

  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() pageSize = 10;
  @Input() expandable = false;
  @Input() nestedKey?: keyof T; // e.g. 'products'
  @Input() nestedColumns: TableColumn<any>[] = [];
  // expandedRows = new Set<number>();
  expandedRow: number = -1;

  displayedData: T[] = [];
  currentPage = 1;
  totalPages = 1;

  sortKey: keyof T | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  isColResizing = false;
  tableStartWidthPx = 0;
  

  ngOnInit(): void {
    this.updateTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['data'] && !changes['data'].isFirstChange()) || (changes['columns'] && !changes['columns'].isFirstChange())) {
      this.updateTable();
    }
  }

  toggleRow(index: number): void {
    this.expandedRow = this.expandedRow === index ? -1 : index;
  // if (this.expandedRows.has(index)) {
  //   console.log('Collapsing row at index:', index);
  //   this.expandedRows.delete(index);
  // } else {
  //   console.log('Expanding row at index:', index);
  //   this.expandedRows.add(index);
  // }
}

  updateTable(): void {
    let processedData = Array.isArray(this.data) ? [...this.data] : [];
    if (this.sortKey) {
      processedData.sort((a, b) => {
        const valA = a[this.sortKey!];
        const valB = b[this.sortKey!];

        if (valA == null) return -1;
        if (valB == null) return 1;

        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;

        return 0;
      })
    }

    this.totalPages = Math.ceil(processedData.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedData = processedData.slice(startIndex, endIndex);

  }

  sort(column: TableColumn<T>): void {
    if (!column.sortable || this.isColResizing) return;

    if (this.sortKey === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column.key;
      this.sortDirection = 'asc';
    }

    this.updateTable();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateTable();
    this.expandedRow = -1;
  }

  showAscIcon(column: TableColumn<T>): boolean {
    return (column.sortable && this.sortKey === column.key && this.sortDirection === 'asc') ?? false;
  }

  showDescIcon(column: TableColumn<T>): boolean {
    return (column.sortable && this.sortKey === column.key && this.sortDirection === 'desc') ?? false;
  }

  dropColumn(event: CdkDragDrop<TableColumn<T>[]>): void {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  getTableWidthPercent(): number {
    return this.columns.reduce((sum, col) => {
      return sum + (parseFloat(col.width ?? '0'));
    }, 0);
  }

  onColumnResize(event: { colIndex: number, newWidthPercent: number }) {
    this.columns[event.colIndex].width = `${event.newWidthPercent}%`;
  }
}
