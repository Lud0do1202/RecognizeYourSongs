import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PlaylistsPageComponent } from './pages/playlists-page/playlists-page.component';
import { ResultPageComponent } from './pages/result-page/result-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { PlayTrackPageComponent } from './pages/play-track-page/play-track-page.component';
import { MustAcceptConditionPageComponent } from './pages/errors/must-accept-condition-page/must-accept-condition-page.component';
import { ErrorPageComponent } from './pages/errors/error-page/error-page.component';
import { NotFoundPageComponent } from './pages/errors/not-found-page/not-found-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'landing' },
  { path: 'landing', component: LandingPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'playlists', component: PlaylistsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'play-track', component: PlayTrackPageComponent },
  { path: 'result', component: ResultPageComponent },

  { path: 'error/not-found', component: NotFoundPageComponent },
  { path: 'error/must-accept-conditions', component: MustAcceptConditionPageComponent },
  { path: 'error/unknown-error', component: ErrorPageComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'error/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
