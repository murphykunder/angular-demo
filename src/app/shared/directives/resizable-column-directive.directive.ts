import { Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResizableColumnDirective]',
  standalone: true
})
export class ResizableColumnDirectiveDirective implements OnInit {

  @Input() colIndex!: number;
  @Output() resize = new EventEmitter<{ colIndex: number, newWidthPercent: number }>();
  @Output() resizingChange = new EventEmitter<boolean>();

  private startX = 0;
  private startWidth = 0;
  private handle!: HTMLElement;
  private isResizing = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.handle = this.renderer.createElement('span');
    this.handle.className = 'resize-handle';
    this.renderer.appendChild(this.el.nativeElement, this.handle);

    this.renderer.listen(this.handle, 'mousedown', this.onMouseDown);
  }

  private onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;
    this.resizingChange.emit(true); // notify parent
    this.startX = event.pageX;
    this.startWidth = this.el.nativeElement.getBoundingClientRect().width;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  private onMouseMove = (event: MouseEvent) => {
    if (!this.isResizing) return;

    const dx = event.pageX - this.startX;
    const table = this.el.nativeElement.closest('table') as HTMLTableElement;
    const tableWidth = table.getBoundingClientRect().width;

    let newWidthPx = this.startWidth + dx;
    if (newWidthPx < 50) newWidthPx = 50;

    const newWidthPercent = (newWidthPx / tableWidth) * 100;
    this.resize.emit({ colIndex: this.colIndex, newWidthPercent });
  };

  private onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    setTimeout(() => {
      this.isResizing = false;
      this.resizingChange.emit(false); // notify parent
    }, 0);

  };

}
