import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from 'src/app/interfaces/playlist';
import { RemoveAccentsPipe } from 'src/app/pipes/string/remove-accents/remove-accents.pipe';
import { PlayerService } from 'src/app/services/player/player.service';

@Component({
  selector: 'app-playlists-page',
  templateUrl: './playlists-page.component.html',
  styleUrls: ['./playlists-page.component.scss'],
  providers: [RemoveAccentsPipe],
})
export class PlaylistsPageComponent implements OnInit {
  /* *********************************************** */
  /* VAR */
  loader = true;
  playlists: Playlist[] = [];
  savePlaylist!: Playlist[];

  /* *********************************************** */
  /* CONSTRUCTOR */
  constructor(private player: PlayerService, private router: Router, private removeAccentPipe: RemoveAccentsPipe) {}

  /* *********************************************** */
  /* INIT */
  ngOnInit(): void {
    // Get all playlists
    this.player.getAllPlaylists().subscribe({
      next: (playlists) => {
        // All playlists
        this.playlists = playlists;
        this.savePlaylist = playlists;

        // Default playlist
        this.setPlaylistSelected(playlists[0]);

        // End loader
        this.loader = false;
      },
      error: () => this.router.navigateByUrl('/error/unknown-error'),
    });
  }

  /* *********************************************** */
  /** Setter playlist selected */
  setPlaylistSelected(playlist: Playlist) {
    this.player.storage.setPlaylist(playlist);
  }

  /** Getter playlist selected */
  getPlaylistSelected(): Playlist {
    return this.player.storage.getPlaylist();
  }

  /* *********************************************** */
  /** Update the visible playlist */
  updatePlaylists(search: string) {
    this.playlists = this.savePlaylist.filter((playlist: Playlist) =>
      this.formatSearchPlaylist(playlist.name).includes(this.formatSearchPlaylist(search))
    );
  }

  /** Format the string for the search playlist */
  private formatSearchPlaylist(string: string): string {
    return this.removeAccentPipe.transform(string.toLowerCase());
  }
}
