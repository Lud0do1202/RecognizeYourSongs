import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Answer } from 'src/app/interfaces/answer';
import { Playlist } from 'src/app/interfaces/playlist';
import { Track } from 'src/app/interfaces/track';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PlayerService } from 'src/app/services/player/player.service';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.scss'],
})
export class ResultPageComponent implements OnInit {
  /* *********************************************** */
  /* VAR */
  loader = true;
  playlist!: Playlist;
  strokeDasharray!: string;
  rCircle!: number;
  answers!: Answer[];
  tracks!: Track[];

  playing!: any;

  correctAnswerClass = (bool: boolean) => (bool === true ? 'correct-answer' : 'incorrect-answer');

  /* *********************************************** */
  /* CONSTRUCTOR */
  constructor(private player: PlayerService, private router: Router, private authService: AuthService) {}

  /* *********************************************** */
  /* INIT */
  ngOnInit(): void {
    // Refresh token
    this.authService.refreshToken().subscribe({
      next: (data) => {
        // Save the token
        this.authService.storage.setToken(data.access_token);
        this.authService.storage.setRefreshToken(data.refresh_token);
      },
      error: () => this.router.navigateByUrl('/error/unknown-error'),
    });

    // Get the playlist
    this.playlist = this.player.storage.getPlaylist();

    // Width of the circle
    this.rCircle = document.body.clientWidth * 0.7 * 0.25;
    let circumference = this.rCircle * 2 * Math.PI;
    let correctAnswerRatio = this.getCorrectAnswerRatio();
    this.strokeDasharray = `${circumference * correctAnswerRatio} ${circumference * (1 - correctAnswerRatio)}`;

    // Answers
    this.answers = this.player.storage.getAnswers();

    // Tracks
    this.tracks = this.player.storage.getTracks();

    this.loader = false;
  }

  /* *********************************************** */
  /** Get the ratio of correct answers */
  getCorrectAnswerRatio(): number {
    return this.getCorrectAnswerCount() / this.player.storage.getTracks().length;
  }

  /* *********************************************** */
  /** Get the number of correct answers */
  getCorrectAnswerCount() {
    const answers = this.player.storage.getAnswers();
    const correctAnswerCount = answers.reduce((count, answer) => {
      if (answer.title === true && answer.artists.every((artist) => artist.correct === true)) {
        return count + 1;
      }
      return count;
    }, 0);

    return correctAnswerCount;
  }

  /* *********************************************** */
  /** Get the number of incorrect answers */
  getIncorrectAnswerCount() {
    return this.player.storage.getTracks().length - this.getCorrectAnswerCount();
  }

  /* *********************************************** */
  /** Play the track */
  playTrack(track: Track) {
    // Clear the timeout
    clearTimeout(this.playing);

    // Play the track
    this.player.playTrack(track).subscribe();

    // Set a timeout for pausing the track
    this.playing = setTimeout(() => this.player.pauseTrack().subscribe(), 10000);
  }

  /* *********************************************** */
  /** Replay the same playlist */
  replay() {
    // Reshuffle the tracks
    this.player.storage.setTracks(this.player.shuffle(this.player.storage.getTracks()));

    // Reset player
    this.player.reset();

    // Replay
    this.router.navigateByUrl('/play-track');
  }

  /* *********************************************** */
  /** Go back home */
  home() {
    this.router.navigateByUrl('/home');
  }
}
