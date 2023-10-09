import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TimerComponent } from 'src/app/components/timer/timer.component';
import { Answer } from 'src/app/interfaces/answer';
import { Playlist } from 'src/app/interfaces/playlist';
import { Track } from 'src/app/interfaces/track';
import { RemoveAccentsPipe } from 'src/app/pipes/string/remove-accents/remove-accents.pipe';
import { RemoveEndDashPipe } from 'src/app/pipes/string/remove-end-dash/remove-end-dash.pipe';
import { RemoveParenthesesPipe } from 'src/app/pipes/string/remove-parentheses/remove-parentheses.pipe';
import { RemovePunctuationsPipe } from 'src/app/pipes/string/remove-punctuations/remove-punctuations.pipe';
import { PlayerService } from 'src/app/services/player/player.service';

@Component({
  selector: 'app-play-track-page',
  templateUrl: './play-track-page.component.html',
  styleUrls: ['./play-track-page.component.scss'],
  providers: [RemoveAccentsPipe, RemoveEndDashPipe, RemoveParenthesesPipe, RemovePunctuationsPipe],
})
export class PlayTrackPageComponent implements OnInit, AfterViewInit {
  /* *********************************************** */
  /* VAR */
  playlist!: Playlist;
  track?: Track;
  numTrack!: string;
  confirmDisable!: boolean;

  /* FORM */
  title: string = '';
  feedbackTitle?: boolean;
  artists: string[] = [];
  feedbackArtists: boolean[] = [];

  /* TIMER */
  @ViewChild('timer') timer!: TimerComponent;
  timerEnded!: boolean;

  /* *********************************************** */
  /* CONSTRUCTOR */
  constructor(
    private player: PlayerService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private removeEndDashesPipe: RemoveEndDashPipe,
    private removeParenthesesPipe: RemoveParenthesesPipe,
    private removeAccentsPipe: RemoveAccentsPipe,
    private removePunctuations: RemovePunctuationsPipe
  ) {}

  /* *********************************************** */
  /* INIT */
  ngOnInit(): void {
    // Get the playlist
    this.playlist = this.player.storage.getPlaylist();

    // Get num track
    this.numTrack = this.getNumTrack();
  }

  /* *********************************************** */
  /* AFTER VIEW INIT */
  ngAfterViewInit(): void {
    // Use setTimeout to delay the execution
    setTimeout(() => {
      this.playNextTrack();
      this.cdRef.detectChanges(); // Trigger change detection manually after setting the track
    });
  }

  /* *********************************************** */
  /** Play the next track */
  playNextTrack() {
    // Disable
    this.confirmDisable = false;

    // Get the track
    this.track = this.player.getNextTrack();

    // Check no more tracks
    if (!this.track) {
      this.router.navigateByUrl('/result');
      return;
    }

    // Update num track
    this.numTrack = this.getNumTrack();

    // Reset form
    this.resetForm();

    // Play the track
    this.player.playTrack(this.track).subscribe({
      next: () => {
        // Start the timer
        this.timer.start();
        this.timerEnded = false;
      },
      error: () => {},
    });
  }

  /* *********************************************** */
  /** Get num track */
  getNumTrack() {
    return `${this.player.storage.getITracks() + 1} / ${this.player.storage.getTracks().length}`;
  }

  /* *********************************************** */
  /** Show answer and then play next song */
  confirm() {
    // Disable ?
    if (this.confirmDisable === true) return;
    this.confirmDisable = true;

    // Stop timer
    if (!this.timerEnded) {
      // Stop the timer
      this.timer.stop();

      // Pause the song
      this.player.pauseTrack().subscribe();
    }

    // Title
    this.showAnswerTitle();

    // Artists
    this.showAnswerArtists();

    // Save the answer
    this.saveAnswer();

    // Play next track
    const timeout = 3000;
    setTimeout(() => this.playNextTrack(), timeout);
  }

  /* *********************************************** */
  /** Save answer */
  private saveAnswer() {
    const answer: Answer = {
      title: this.feedbackTitle!,
      artists: this.artists.map((artist, index) => ({ name: artist, correct: this.feedbackArtists[index] })),
    };

    this.player.storage.addAnswer(answer);
  }

  /* *********************************************** */
  /** Feedback artists and show answer */
  private showAnswerArtists() {
    // Remove duplicates from artists
    const noDuplicatesArtists = this.getNoDuplicatesArtists();

    // To keep track of the artists found
    let foundArtists: number[] = [];
    let iFoundArtists: number = 0;

    for (let i = 0; i < this.artists.length; i++) {
      // Get the pos of the artist in the track.artists
      const pos = this.track!.artists.map((artist) => this.formatInput(artist)).indexOf(
        this.formatInput(noDuplicatesArtists[i])
      );

      // Set the feedback
      this.feedbackArtists[i] = pos !== -1 && noDuplicatesArtists[i] !== '' ? true : false;

      // Save the pos the artists in track.artists
      if (this.feedbackArtists[i] === true) foundArtists.push(pos);
    }

    // Not found artists (indexes)
    let notFoundArtists: number[] = this.getNotFoundArtists(foundArtists);
    let iNotFoundArtists = 0;

    // For feedbackartists incorrect, show the correct answer
    for (let i = 0; i < this.feedbackArtists.length; i++) {
      const feedback = this.feedbackArtists[i];
      if (feedback === true) {
        let indexArtist = foundArtists[iFoundArtists++];
        this.artists[i] = this.track!.artists[indexArtist];
      } else {
        let indexArtist = notFoundArtists[iNotFoundArtists++];
        this.artists[i] = this.track!.artists[indexArtist];
      }
    }
  }

  /** Get the artists not found from track.artists */
  private getNotFoundArtists(foundArtists: number[]) {
    return this.artists
      .map((_, index) => index) // Create an array of all indexes [0, 1, 2, ...]
      .filter((index) => !foundArtists.includes(index)); // Filter out the found artists' indexes
  }

  /** Replace the duplicates by '' in artists */
  private getNoDuplicatesArtists() {
    const uniqueArtists = new Set<string>();
    const noDuplicatesArtists: string[] = [];

    for (const artist of this.artists) {
      const lowercaseArtist = artist.toLowerCase();
      if (!uniqueArtists.has(lowercaseArtist)) {
        uniqueArtists.add(lowercaseArtist);
        noDuplicatesArtists.push(artist);
      } else {
        noDuplicatesArtists.push('');
      }
    }

    return noDuplicatesArtists;
  }

  /* *********************************************** */
  /** Feedback title and show answer */
  private showAnswerTitle() {
    // Feedback title
    this.feedbackTitle = this.formatInput(this.title) === this.formatInput(this.track!.title);

    // Show answer
    this.title = this.track!.title;
  }

  /* *********************************************** */
  /** Format the title to check */
  private formatInput(string: string): string {
    const lowercase = string.toLowerCase();
    const noEndDashed = this.removeEndDashesPipe.transform(lowercase);
    const noParentheses = this.removeParenthesesPipe.transform(noEndDashed);
    const noAccents = this.removeAccentsPipe.transform(noParentheses);
    const noPunctuation = this.removePunctuations.transform(noAccents)
    return noPunctuation;
  }

  /* *********************************************** */
  /** Reset the form value */
  resetForm() {
    // Title
    this.title = '';
    this.feedbackTitle = undefined;

    // Artists
    this.artists = [];
    this.track!.artists.forEach((_) => this.artists.push(''));
    this.feedbackArtists = [];
  }

  /* *********************************************** */
  /** End of the timer */
  endTimer() {
    this.timerEnded = true;

    // Pause the music
    this.player.pauseTrack().subscribe();
  }
}
