# SimTrader

**SimTrader** is a fast-paced simulation game that mimics day trading in a compressed, 5-minute trading day. Players trade fake companies in a realistic, paper-trading environment where prices fluctuate based on simulated market conditions, volatility, and random events. The goal is to maximize your portfolio value before the market closes.

---

## 🎯 Overview

SimTrader lets you experience the thrill of active day trading—without the risk.
You start each session with a fixed virtual balance and a watchlist of fictional companies.
Each in-game trading day lasts less than **5 minutes**, during which prices update in real-time according to volatility models and simulated market events.

**Features:**

- Realistic intraday price movements
- 5-minute accelerated trading sessions
- Interactive charts for price tracking
- Simple buy/sell interface for instant trades
- Portfolio and P&L tracking
- Configurable difficulty levels (low, medium, high volatility)

---

## 🧠 Game Concept

- Each company has a generated ticker (e.g., `FYNX`, `ZORD`, `MERA`).
- Prices are simulated using a stochastic model (e.g., geometric Brownian motion).
- Market events (earnings, news shocks) cause sudden volatility spikes.
- The simulation ends with a “market close,” showing your total gain or loss.

Example flow:

1. Start a new trading day.
2. Watch prices update in real time.
3. Buy/sell stocks as prices move.
4. End of day → leaderboard ranking and stats.

---

## 🖥️ UI Layout

```
+-------------------------------------------------------+
| SimTrader                                             |
|-------------------------------------------------------|
|  [ FYNX  $102.45 ▲ 1.2% ] [ ZORD $87.12 ▼ 0.9% ]     |
|-------------------------------------------------------|
|  Chart:  <Live updating line chart of selected stock> |
|-------------------------------------------------------|
|  [ Buy ] [ Sell ]  Quantity: [ 10 ]                   |
|  Cash: $50,000   Portfolio Value: $51,240             |
|-------------------------------------------------------|
|  Timer: 04:23 Remaining | Market Closes Soon          |
+-------------------------------------------------------+
```

---

## ⚙️ Tech Stack

| Component          | Technology                                         |
| ------------------ | -------------------------------------------------- |
| Frontend           | Next.js 15 with React 19                           |
| Charting           | Recharts or D3.js                                  |
| Backend (optional) | Node.js / Express (for event simulation)           |
| State Management   | Redux Toolkit / Zustand                            |
| Data Simulation    | Geometric Brownian Motion or Monte Carlo generator |
| Styling            | Tailwind CSS v4                                    |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn

### Installation

```bash
git clone https://github.com/ridermw/SimTrade.git
cd SimTrade
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## 🥩 Future Enhancements

- Global leaderboard and social sharing
- Market news feed simulation
- Multi-day tournaments
- AI-based trader opponents
- Mobile PWA support

---

## 🧮 Simulation Model (Simplified)

Price change per tick:

```
P(t+1) = P(t) * exp( (μ - 0.5σ²)Δt + σ√Δt * ε )
```

Where:

- `μ` = expected return (drift)
- `σ` = volatility
- `ε` = random variable ~ N(0,1)
- `Δt` = tick time interval

This creates realistic intraday price movement patterns.

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.

