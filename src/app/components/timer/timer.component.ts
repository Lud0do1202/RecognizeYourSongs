import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  /* *********************************************** */
  /* VAR */
  @Input() time!: number;
  timeSpent!: number;
  timer!: any;
  @Output() end = new EventEmitter();

  /* STYLE */
  private svgWidth!: number;
  private svgHeight!: number;

  /* *********************************************** */
  /* INIT */
  ngOnInit(): void {
    // Width of the svg = width of the body
    this.svgWidth = document.body.clientWidth;
    this.svgHeight = document.body.clientHeight;
  }

  /* *********************************************** */
  /** Get the points of the polyline 1 */
  getPoints1() {
    return `${this.svgWidth / 2},0 0,0 0,${this.svgHeight} ${this.svgWidth / 2},${this.svgHeight}`;
  }

  /** Get the points of the polyline 2 */
  getPoints2() {
    return `${this.svgWidth / 2},0 ${this.svgWidth},0 ${this.svgWidth},${this.svgHeight} ${this.svgWidth / 2},${
      this.svgHeight
    }`;
  }

  /* *********************************************** */
  /** Get the stoke-dashrray witch is the width visible border */
  getVisibleWidth() {
    const fullWidth = this.svgWidth + this.svgHeight;
    let timeLeftRatio = this.getTimeSpentRatio();

    return `stroke-dasharray: ${fullWidth * timeLeftRatio} ${fullWidth * (1 - timeLeftRatio)}`;
  }

  /* *********************************************** */
  /** Get the time already spent ratio */
  getTimeSpentRatio() {
    return this.timeSpent / this.time;
  }

  /* *********************************************** */
  /** Start the timer */
  start() {
    // Reset the timer
    this.resetTimer();

    // Start the timer
    const timeout = 10;
    this.timer = setInterval(() => {
      // Increase time spent
      this.timeSpent += timeout;

      // End timer
      if (this.timeSpent >= this.time) this.endTimer();
    }, timeout);
  }

  /* *********************************************** */
  /** Stop the timer */
  stop() {
    clearInterval(this.timer);
  }

  /* *********************************************** */
  /** Emit the fact that the timer ended and stop it */
  endTimer() {
    this.stop();
    this.end.emit();
  }

  /* *********************************************** */
  /** Reset the timer */
  resetTimer() {
    this.timeSpent = 0;
  }
}

