import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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
    DragDropModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T> implements OnInit, OnChanges {

  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() pageSize = 10;

  displayedData: T[] = [];
  currentPage = 1;
  totalPages = 1;

  sortKey: keyof T | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  private colStartX = 0;
  private colStartWidth = 0;
  private resizingColIndex: number | null = null;
  private colStartWidthPercent = 0;
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

  updateTable(): void {
    let processedData = [...this.data];

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
    console.log(this.displayedData)

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

  initiateColResize(event: MouseEvent, colIndex: number) {
    event.preventDefault();
    event.stopPropagation();
    this.isColResizing = true;
    this.resizingColIndex = colIndex;

    const th = (event.target as HTMLElement).parentElement!;
    const table = th.closest('table') as HTMLTableElement;

    this.colStartX = event.pageX;

    // Convert % width to px
    const thWidthPx = th.getBoundingClientRect().width;
    const tableWidthPx = table.getBoundingClientRect().width;

    this.colStartWidth = thWidthPx;
    this.tableStartWidthPx = tableWidthPx;

    document.addEventListener('mousemove', this.startColumnResize);
    document.addEventListener('mouseup', this.endColumnResize);
  }

  startColumnResize = (event: MouseEvent) => {
    if (this.resizingColIndex === null) return;

    const dx = event.pageX - this.colStartX;

    // New width in px
    const newWidthPx = this.colStartWidth + dx;

    if (newWidthPx > 50) { // minimum 50px
      const table = document.querySelector('table.custom-table') as HTMLTableElement;
      const tableWidthPx = table.getBoundingClientRect().width;

      // Convert px back to %
      const newWidthPercent = (newWidthPx / tableWidthPx) * 100;

      this.columns[this.resizingColIndex].width = `${newWidthPercent}%`;
    }
  };

  endColumnResize = () => {
    console.log('endColumnResize')
    document.removeEventListener('mousemove', this.startColumnResize);
    document.removeEventListener('mouseup', this.endColumnResize);
    this.resizingColIndex = null;
    setTimeout(() => {
      this.isColResizing = false;
    }, 0);
  };

  getTableWidthPercent(): number {
    return this.columns.reduce((sum, col) => {
      return sum + (parseFloat(col.width ?? '0'));
    }, 0);
  }
}
