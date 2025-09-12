# Sorin

A sensor data platform for farmers, built with **React**, **TypeScript**, and **Vite**.  
Sorin helps farmers monitor their fields with live sensor data, interactive charts, and smart insights.

---

## 🚀 Features

- **Live Sensor Data**: Real-time temperature, humidity, and soil readings.
- **Interactive Dashboard**: Visualize multiple sensors on customizable charts.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.
- **Data Filtering**: Select sensors, dates, and intervals for detailed analysis.
- **Smart Insights**: Identify trends to optimize irrigation and crop health.
- **Fast & Modern**: Built with Vite for quick load times and smooth performance.

---

## 🗂️ Project Structure

```
src/
  assets/         # Images, icons, and styling assets used in the dashboard
  components/     # Reusable React components (Charts, Cards, Dropdowns, Map, Alerts, etc.)
  data/           # Static or mock data for sensors, overlays, and test data
  hooks/          # Custom React hooks (e.g., useSensors, useMap)
  pages/          # Main pages and views (Dashboard, Analytics, Map & Alerts)
  utils/          # Helper functions for data formatting, API calls, and chart calculations
  index.css       # Global styles and theming
  App.tsx         # Main App component wrapping the pages and layout
  main.tsx        # Entry point initializing the app
```

---

## 🛠️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗺️ How It Works

- Fake data is retrieved from the Sorin Supabase.
- The dashboard fetches the data and displays it in line charts, cards, and maps.
- Users can select specific sensors and time ranges to analyze trends.
- Alerts and notifications highlight abnormal readings or critical values.
- Data visualizations help farmers make informed decisions about irrigation, fertilization, and crop care.

---

## 📁 Customization

- **Add new sensors**: Extend `src/data/` and useSensors hook to include new sensor types.
- **Modify charts**: Edit components in `src/components/` to add new visualization types or change chart behavior.
- **Styling**: Update `index.css` for global styles, colors, and layout changes.
- **Date**: Configure the date that is hardcoded in `src/pages/dashboard.tsx`
- **Data endpoint**: Configure the backend data call in `src/hooks/useSensors.ts` to point to your data source.

---

## 📦 Build for Production

```bash
npm run build
```

---

## 📝 License

This project is **not licensed for public use**.  
All rights reserved. You may not use, copy, modify, or distribute this code without explicit permission.

---