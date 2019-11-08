import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { GameStatsCardsComponent } from './../game-stats/game-stats-cards.component';
import { GameStatsCardComponent } from './../game-stats/game-stats-card.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { SocketIoModule } from 'ngx-socket-io';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GameStatsChartComponent } from 'src/game-stats/game-stats-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    GameStatsCardsComponent,
    GameStatsCardComponent,
    GameStatsChartComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    SocketIoModule.forRoot({ url: '' }),
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
