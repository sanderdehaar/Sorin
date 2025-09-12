import { ArrowUp, ArrowDown } from "@mynaui/icons-react";

interface DashboardStatsProps {
  latest: number;
  change: number;
  unit?: string;
  label: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ latest, change, unit }) => {
  const isUp = change > 0;

  return (
    <div className="dashboard__weekly-stats">
      <span className="dashboard__weekly-stats--value">
        {latest} {unit || ''}
      </span>
      <span
        className={`dashboard__weekly-stats--change ${
          isUp ? 'dashboard__weekly-stats--change-up' : 'dashboard__weekly-stats--change-down'
        }`}
      >
        {isUp ? <ArrowUp className="dashboard__weekly-stats--arrow" /> : <ArrowDown className="dashboard__weekly-stats--arrow" />}
        <span className="dashboard__weekly-stats--change-value">
          {Math.abs(change).toFixed(1)}%
        </span>
        <span className="dashboard__weekly-stats--change-text">vs last week</span>
      </span>
    </div>
  );
};

export default DashboardStats;