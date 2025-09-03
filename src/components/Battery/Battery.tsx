import React from 'react'
import './Battery.css'

interface BatteryProps {
  percentage: number
  bars?: number
}

const Battery: React.FC<BatteryProps> = ({ percentage, bars = 5 }) => {
  const filledBars = Math.round((percentage / 100) * bars)

  return (
    <div className="battery-container">
      <span>Battery: {percentage}%</span>
      <div className="battery">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`battery-bar ${i < filledBars ? 'filled' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Battery