import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, expand, map, reduce } from 'rxjs';
import { Playlist } from 'src/app/interfaces/playlist';
import { AuthService } from '../auth/auth.service';
import { Track } from 'src/app/interfaces/track';
import { Device } from 'src/app/interfaces/device';
import { environment } from 'src/environments/environment.development';
import { PlayerStorage } from 'src/app/interfaces/storage/player-storage';
import { Answer } from 'src/app/interfaces/answer';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  /* *********************************************** */
  /* CONSTRUCTOR */
  constructor(private authService: AuthService, private http: HttpClient) {}

  /* *********************************************** */
  /** Get all playlist of the user */
  getAllPlaylists(): Observable<Playlist[]> {
    // Get them using recursive function
    return this.getRangePlaylists('https://api.spotify.com/v1/me/playlists', 50);
  }

  /* *********************************************** */
  /* Get a range of <limit> playlists */
  private getRangePlaylists(url: string, limit: number): Observable<Playlist[]> {
    let headers = { Authorization: 'Bearer ' + this.authService.storage.getToken() };

    return this.http.get<any>(`${url}?limit=${limit}`, { headers }).pipe(
      // Continue recusive function
      expand((data: any) => (data.next !== null ? this.http.get<any>(data.next, { headers }) : EMPTY)),

      // Transform data to playlist
      map((data: any) => {
        return data.items.map((item: any) => ({
          id: item.id,
          img: item.images[0].url,
          name: item.name,
          nbTracks: item.tracks.total,
        }));
      }),

      // Reassemble playlists arrays as one array of playlists
      reduce((acc: Playlist[], playlists: Playlist[]) => acc.concat(playlists), []),

      // Sort playlists in ascending order based on name
      map((playlists: Playlist[]) => playlists.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  /* *********************************************** */
  /** Get all tracks of the playlist selected */
  getTracks(offsets: number[]): Observable<Track[]> {
    return this.getRangeTracks(offsets, 0);
  }

  /** Get a range of tracks at <offset> */
  private getRangeTracks(offsets: number[], index: number): Observable<Track[]> {
    let headers = { Authorization: 'Bearer ' + this.authService.storage.getToken() };
    let urlNoOffset = `https://api.spotify.com/v1/playlists/${
      this.storage.getPlaylist().id
    }/tracks?fields=items(track(name,uri,duration_ms,album.images,artists.name))&limit=${environment.limitTracks}`;

    return this.http.get<any>(`${urlNoOffset}&offset=${offsets[index] * environment.limitTracks}`, { headers }).pipe(
      // Continue recusive function
      expand(() =>{
        return index + 1 < offsets.length
          ? this.http.get<any>(`${urlNoOffset}&offset=${offsets[++index] * environment.limitTracks}`, { headers })
          : EMPTY}
      ),

      // Transform data into a Track
      map((data: any) => {
        return data.items.map((item: any) => ({
          title: item.track.name,
          artists: item.track.artists.map((artist: any) => artist.name),
          img: item.track.album.images[0].url,
          uri: item.track.uri,
          duration: item.track.duration_ms,
        }));
      }),

      // Reassemble tracks arrays as one array of tracks
      reduce((acc: Track[], tracks: Track[]) => acc.concat(tracks), []),

      // Shuffle tracks
      map((tracks: Track[]) => this.shuffle(tracks))
    );
  }

  /* *********************************************** */
  /** Shuffle an array */
  shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /* *********************************************** */
  /** Get the next track */
  getNextTrack(): Track | undefined {
    // Get the track
    const iTracks = this.storage.getITracks();
    const tracks = this.storage.getTracks();

    const track = iTracks < tracks.length ? tracks[iTracks + 1] : undefined;

    // Incremement iTracks
    this.storage.setITracks(iTracks + 1);

    return track;
  }

  /* *********************************************** */
  /** Play the track */
  playTrack(track: Track): Observable<any> {
    let headers = { Authorization: 'Bearer ' + this.authService.storage.getToken() };

    const positionTrack = this.storage.getStartTrack() === 'beginning' ? 0 : this.getRandomPositionTrack(track);

    return this.http.put(
      'https://api.spotify.com/v1/me/player/play?device_id=' + this.storage.getDevice().id,
      { uris: [track.uri], position_ms: positionTrack },
      { headers }
    );
  }

  /* *********************************************** */
  /** Get a random position in the track */
  getRandomPositionTrack(track: Track) {
    let maxPosition = track.duration - 10000;

    if (maxPosition <= 0) maxPosition = 0;

    const randomPosition = Math.floor(Math.random() * maxPosition);

    return randomPosition;
  }

  /* *********************************************** */
  /** Pause the track */
  pauseTrack(): Observable<any> {
    let headers = { Authorization: 'Bearer ' + this.authService.storage.getToken() };

    return this.http.put('https://api.spotify.com/v1/me/player/pause', {}, { headers });
  }

  /* *********************************************** */
  /* RESET PLAYER */
  reset() {
    this.storage.setITracks(-1);
    this.storage.setAnswers([]);
  }

  /* *********************************************** */
  /* Tell if there a active device */
  getDevices(): Observable<Device[]> {
    let headers = { Authorization: 'Bearer ' + this.authService.storage.getToken() };

    return this.http
      .get('https://api.spotify.com/v1/me/player/devices', { headers })
      .pipe(
        map((data: any) => data.devices.map((device: any) => ({ id: device.id, type: device.type, name: device.name })))
      );
  }

  /* *********************************************** */
  /* LOCAL STORAGE */
  storage: PlayerStorage = {
    // Playlist
    setPlaylist(playlist: Playlist): void {
      localStorage.setItem('playlist', JSON.stringify(playlist));
    },
    getPlaylist(): Playlist {
      return JSON.parse(localStorage.getItem('playlist')!);
    },

    // Tracks
    setTracks(tracks: Track[]): void {
      localStorage.setItem('tracks', JSON.stringify(tracks));
    },
    getTracks(): Track[] {
      return JSON.parse(localStorage.getItem('tracks')!);
    },

    // I Tracks
    setITracks(iTracks: number): void {
      localStorage.setItem('iTracks', iTracks.toString());
    },
    getITracks(): number {
      return Number.parseInt(localStorage.getItem('iTracks')!);
    },

    // Start Track
    setStartTrack(startTrack: 'beginning' | 'random'): void {
      localStorage.setItem('startTrack', startTrack);
    },
    getStartTrack(): 'beginning' | 'random' {
      return localStorage.getItem('startTrack') as 'beginning' | 'random';
    },

    // Device
    setDevice(device: Device): void {
      localStorage.setItem('device', JSON.stringify(device));
    },
    getDevice(): Device {
      return JSON.parse(localStorage.getItem('device')!);
    },

    // Answer
    setAnswers(answers: Answer[]): void {
      localStorage.setItem('answers', JSON.stringify(answers));
    },
    addAnswer(answer: Answer): void {
      const answers = this.getAnswers();
      answers.push(answer);
      this.setAnswers(answers);
    },
    getAnswers(): Answer[] {
      return JSON.parse(localStorage.getItem('answers')!);
    },
  };
}
