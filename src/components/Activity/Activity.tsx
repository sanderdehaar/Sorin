import React from 'react';
import './Activity.css';

interface Alert {
  id: string;
  alert_type: string;
  title: string;
  alert_time: string;
}

interface ActivityProps {
  alerts: Alert[];
}

const Activity: React.FC<ActivityProps> = ({ alerts }) => {
  const sortedAlerts = [...alerts].sort((a, b) => new Date(b.alert_time).getTime() - new Date(a.alert_time).getTime());
  const alertsToShow = sortedAlerts.slice(0, 8);

  return (
    <div className="activity_card__container">
      {alertsToShow.map((alert) => (
        <div key={alert.id} className="activity_card">
          <div className={`activity_card__dot activity_card__dot--${alert.alert_type}`}>
            <span className="activity_card__dot--round"></span>
            <span className="activity_card__dot--line"></span>
          </div>
          <div className="activity_card__description">
            <h4 className="activity_card__title">{alert.title}</h4>
            <div className="activity_card__description-info">
              <span className="activity_card__date">{new Date(alert.alert_time).toLocaleDateString()}</span>
              <span className="activity_card__dot-separator"></span>
              <span className="activity_card__time">{new Date(alert.alert_time).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Activity;