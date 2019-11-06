import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameStatsService } from './game-stats.service';
import { Subscription } from 'rxjs';
import { GameStats, GameId, GameDatabase } from './game-stats';

export interface ChartData {
  name: string;
  series: ChartPoint[];
}

export interface ChartPoint {
  name: number;
  value: number;
}

@Component({
  selector: 'app-game-stats-chart',
  templateUrl: './game-stats-chart.component.html',
  styleUrls: ['./game-stats-chart.component.scss']
})
export class GameStatsChartComponent implements OnInit, OnDestroy {

  // ngx-charts options as defined here: https://swimlane.gitbook.io/ngx-charts/examples/line-area-charts/line-chart#inputs
  public results: ChartData[] = [];
  public view: [number, number] = [800, 500];
  public scheme: string = 'cool';
  public gradient: boolean = false;
  public animations: boolean = true;
  public xAxis: boolean = true;
  public yAxis: boolean = true;
  public xAxisTicks: number[] = this.createXAxisTicks();
  public legend: boolean = true;
  public legendTitle: string = '';
  public legendPosition: string = 'right';
  public showXAxisLabel: boolean = false;
  public showYAxisLabel: boolean = false;

  private resultsMap: Map<string, number[]> = new Map<string, number[]>([
    [GameId.RainbowSixSiege, []],
    [GameId.FarCry5, []],
    [GameId.AssassinsCreedOdyssey, []],
  ]);
  private subscription: Subscription;
  private readonly maxTicks: number = 30;

  constructor(private gameStatsService: GameStatsService) {
  }

  public ngOnInit(): void {
    this.subscription = this.gameStatsService.stats$.subscribe((stats: GameStats[]) => this.process(stats));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public get showChart(): boolean {
    return this.resultsMap.get(GameId.RainbowSixSiege).length > 0;
  }

  private process(statsList: GameStats[]): void {
    if (!statsList) {
      return;
    }

    this.results = [];
    const gameIds = [GameId.RainbowSixSiege, GameId.FarCry5, GameId.AssassinsCreedOdyssey];

    for (const gameId of gameIds) {
      const stats = statsList.find((s) => s.gameId === gameId);
      const values = this.resultsMap.get(gameId);

      const value = stats ? stats.viewerCount : 0;

      values.push(value);
      if (values.length > this.maxTicks) {
        values.shift();
      }

      const chartData = this.createChartData(GameDatabase[gameId].title, values);
      this.results.push(chartData);
    }
  }

  private createXAxisTicks(): number[] {
    const ticks = [];

    for (let i = 0; i < this.maxTicks; i++) {
      ticks.push(i);
    }

    return ticks;
  }

  private createChartData(name: string, values: number[]): ChartData {
    const data: ChartData = {
      name,
      series: []
    };


    for (let i = 0; i < this.maxTicks; i++) {
      data.series.push({
        name: i,
        value: values[0]
      });
    }

    for (let i = 0; i < values.length; i++) {
      data.series[this.maxTicks - values.length + i].value = values[i] || 0;
    }

    return data;
  }
}
