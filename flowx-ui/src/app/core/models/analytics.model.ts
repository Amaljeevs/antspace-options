export interface AnalyticsSummary {
  total_pnl: number;
  sharpe: number;
  win_rate: number;
  max_drawdown: number;
  used_margin: number;
  free_cash: number;
  capital_utilization: number;
  updated_at: string;
}
