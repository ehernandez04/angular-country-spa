import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
export class SearchBoxComponent implements OnInit, OnDestroy{

  private debouncer: Subject<string> = new Subject();
  private debouncerSubscription?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();

  ngOnInit(): void {

    this.debouncerSubscription = this.debouncer
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe( value => {
      this.onDebounce.emit(value);
    })

  }

  ngOnDestroy(): void {
    this.debouncerSubscription?.unsubscribe();
  }

  @ViewChild('txtInput')
  public txtInput!: ElementRef<HTMLInputElement>;

  emitValue(value:string): void {

    this.onValue.emit(value);
  }

  onKeyPress(searchTerm: string): void {
    this.debouncer.next(searchTerm);

  }
}
