import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from 'src/app/interfaces/device';
import { PlayerService } from 'src/app/services/player/player.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit {
  /* *********************************************** */
  /* VAR */
  loader = false;
  rangeTracksUI!: string[];
  rangeTracks!: number[];
  startTrack!: 'beginning' | 'random';
  devices: Device[] = [];
  device!: Device;

  allTracksIsActive = true;

  allTracksActive = () => (this.allTracksIsActive ? 'active' : '');
  rangeTracksActive = (i: number) => (this.rangeTracksIsActive(i) ? 'active' : '');
  startTrackActive = (choice: 'beginning' | 'random') => (this.startTrack === choice ? 'active' : '');
  deviceActive = (id: string) => (this.device.id === id ? 'active' : '');

  /* *********************************************** */
  /* CONSTRUCTOR */
  constructor(private player: PlayerService, private router: Router) {}

  /* *********************************************** */
  /* INIT */
  ngOnInit(): void {
    this.loader = true;

    // Get range tracks UI
    let nbTracks = this.player.storage.getPlaylist().nbTracks;
    let limit = environment.limitTracks;
    this.rangeTracksUI = this.createRanges(nbTracks, limit);

    // Default range tracks
    this.allTracksClicked();

    // Default start track
    this.startTrack = 'beginning';

    // Get devices
    this.player.getDevices().subscribe({
      next: (devices) => {
        this.devices = devices;
        this.device = devices[0];
        this.loader = false;
      },
      error: () => this.router.navigateByUrl('/error/unknown-error'),
    });
  }

  /** Create ranges [ '1-20', '21-35' ] */
  private createRanges(max: number, step: number): string[] {
    const ranges: string[] = [];
    let start = 1;

    while (start <= max) {
      const end = Math.min(start + step - 1, max);
      ranges.push(`${start} - ${end}`);
      start += step;
    }

    return ranges;
  }

  /** Tell if a range track button should be active */
  rangeTracksIsActive(i: number) {
    return this.allTracksIsActive === false && this.rangeTracks.includes(i);
  }

  /* *********************************************** */
  /** The button all tracks was clicked */
  allTracksClicked() {
    this.allTracksIsActive = true;
    this.rangeTracks = Array.from({ length: this.rangeTracksUI.length }, (_, index) => index);
  }

  /** A button range track was clicked */
  rangeTracksClicked(i: number) {
    // Desactive all tracks >> active range track clicked
    if (this.allTracksIsActive === true) {
      this.allTracksIsActive = false;
      this.rangeTracks = [i];
    }

    // Range track already active
    else if (this.rangeTracksIsActive(i)) {
      // No more range track >> Active all track
      if (this.rangeTracks.length === 1) {
        this.allTracksClicked();
      }

      // Desactive range track
      else {
        this.rangeTracks = this.rangeTracks.filter((rangeTracks) => rangeTracks !== i);
      }
    }

    // Active range track clicked
    else {
      this.rangeTracks.push(i);
    }
  }

  /* *********************************************** */
  /** Play the tracks */
  play() {
    // Block if no device selected
    if (this.devices.length === 0) return;

    // Start loader
    this.loader = true;

    // Save start track
    this.player.storage.setStartTrack(this.startTrack);

    // Save device
    this.player.storage.setDevice(this.device);

    // Save tracks
    this.player.getTracks(this.rangeTracks).subscribe({
      next: (tracks) => {
        // End loader
        this.loader = false;

        // Set tracks
        this.player.storage.setTracks(tracks);

        // Reset the player
        this.player.reset();

        // Router - /play-track
        this.router.navigateByUrl('/play-track');
      },
      error: () => this.router.navigateByUrl('/error/unknown-error'),

    });
  }
}
