import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { fromEvent, interval, merge, of } from 'rxjs';
import { mapTo, scan, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, AfterViewInit {
  faPlay = faPlay;
  faPause = faPause;
  faSquare = faSquare;

  @ViewChild('start', { static: true })
  startBtn: ElementRef;
  @ViewChild('pause', { static: true })
  pauseBtn: ElementRef;
  @ViewChild('reset', { static: true })
  resetBtn: ElementRef;
  @ViewChild('wait', { static: true })
  waitBtn: ElementRef;

  public intervalObs$;
  public toggle = true;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    const start$ = fromEvent(this.startBtn.nativeElement, 'click').pipe(mapTo(true));
    const pause$ = fromEvent(this.pauseBtn.nativeElement, 'click').pipe(mapTo(false));

    const wait$ = fromEvent(this.waitBtn.nativeElement, 'click').pipe(mapTo(false));
    // TODO: develop logic for waitBtn

    const reset$ = fromEvent(this.resetBtn.nativeElement, 'click').pipe(mapTo(null));
    this.intervalObs$ = merge(start$, pause$, reset$).pipe(
      switchMap(isCounting => {
        if (isCounting === null) {
          return of(null);
        }
        return isCounting ? interval(1000) : of();
      }),
      scan((accumulatedValue, currentValue) => {
        if (currentValue === null) {
          return 0;
        }
        return ++accumulatedValue;
      })
    );
  }

  public toggleOn() {
    this.toggle = true;
  }
  public toggleOff() {
    this.toggle = false;
  }
}
