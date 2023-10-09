import { Answer } from '../answer';
import { Device } from '../device';
import { Playlist } from '../playlist';
import { Track } from '../track';

export interface PlayerStorage {
  // Playlist
  setPlaylist(playlist: Playlist): void;
  getPlaylist(): Playlist;

  // Tracks
  setTracks(tracks: Track[]): void;
  getTracks(): Track[];

  // I Tracks
  setITracks(iTracks: number): void;
  getITracks(): number;

  // Start Track
  setStartTrack(startTrack: 'beginning' | 'random'): void;
  getStartTrack(): 'beginning' | 'random';

  // Device
  setDevice(device: Device): void;
  getDevice(): Device;

  // Answer
  setAnswers(answers: Answer[]): void;
  addAnswer(answer: Answer): void;
  getAnswers(): Answer[];
}
