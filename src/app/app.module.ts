import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PlaylistsPageComponent } from './pages/playlists-page/playlists-page.component';
import { ResultPageComponent } from './pages/result-page/result-page.component';
import { TitleComponent } from './components/title/title.component';
import { DividerModule } from 'primeng/divider';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputTextModule } from 'primeng/inputtext';
import { PlayTrackPageComponent } from './pages/play-track-page/play-track-page.component';
import { TimerComponent } from './components/timer/timer.component';
import { MustAcceptConditionPageComponent } from './pages/errors/must-accept-condition-page/must-accept-condition-page.component';
import { ErrorPageComponent } from './pages/errors/error-page/error-page.component';
import { NotFoundPageComponent } from './pages/errors/not-found-page/not-found-page.component';
import { RemoveParenthesesPipe } from './pipes/string/remove-parentheses/remove-parentheses.pipe';
import { RemoveEndDashPipe } from './pipes/string/remove-end-dash/remove-end-dash.pipe';
import { RemoveAccentsPipe } from './pipes/string/remove-accents/remove-accents.pipe';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { RemovePunctuationsPipe } from './pipes/string/remove-punctuations/remove-punctuations.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    PlaylistsPageComponent,
    ResultPageComponent,
    TitleComponent,
    LandingPageComponent,
    LoaderComponent,
    PlayTrackPageComponent,
    TimerComponent,
    MustAcceptConditionPageComponent,
    ErrorPageComponent,
    NotFoundPageComponent,
    RemoveParenthesesPipe,
    RemoveEndDashPipe,
    RemoveAccentsPipe,
    SearchBarComponent,
    SettingsPageComponent,
    RemovePunctuationsPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DividerModule,
    ButtonModule,
    RadioButtonModule,
    ConfirmPopupModule,
    InputTextModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
