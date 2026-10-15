# FinQuant Platform - Project Kickoff Guide

## Vision

Build a production-grade **options paper trading platform** using **broker market data only**, with:

- Zerodha and Dhan market data ingestion
- Virtual account based paper trading
- Option-chain-driven P&L and MTM
- Margin estimation before every virtual trade
- Risk and reward allocation based on available capital
- Professional Angular dashboard with a Minimal-inspired UI

Important scope rules:

- No real-money trading in Phase 1
- No broker order placement in Phase 1
- Options backtesting is not a primary milestone for this MVP

The system must simulate trades internally and compute loss/profit from live or near-live option-chain data.

## Product Goal

From **August 3, 2026 to September 1, 2026**, the platform should help users:

- monitor live option chains
- create a virtual account with user-funded capital
- place simulated options trades
- see required margin before entry
- understand capital consumption, risk percentage, and reward potential
- track open positions, realized P&L, unrealized P&L, and account equity

## Technology Stack

### Frontend
- Angular 20
- Tailwind CSS
- Minimal-inspired dashboard design
- TradingView Lightweight Charts
- AG Grid

### Core Services
- Java 17+ / Spring Boot 3 for platform APIs already scaffolded in this repo
- FastAPI for market data and analytics services
- PostgreSQL for persistent storage
- Docker Compose for one-click deployment

### Optional High-Performance Layer
- Rust for future hot-path components only if tick processing or pricing latency requires it

## Primary Responsibilities

### Angular Dashboard
- login shell
- broker selector
- option chain view
- live watchlist
- virtual order entry
- paper positions
- P&L dashboard
- capital and margin widgets
- risk allocation insights

### Broker Layer
- Zerodha adapter
- Dhan adapter
- instrument sync
- quote and option-chain normalization
- no direct broker calls outside adapters

### Paper Trading Core
- virtual account creation with user-provided capital
- virtual order lifecycle
- simulated fills using market data
- margin estimation
- realized and unrealized P&L
- capital utilization
- risk budget validation

### Market Data Services
- instrument sync
- option chain snapshots
- candles and quote snapshots
- WebSocket consumer for live updates
- storage for chain history and analysis

### Analytics
- account equity curve for the 30-day paper window
- daily P&L
- margin usage
- strategy-wise performance
- capital-at-risk and reward-to-risk summaries

## Repository Structure

```text
finquant-platform/
  backend/
    auth-server/
    api-gateway/
    order-engine/
    portfolio-service/
    broker-service/
    common/
  quant/
    market-data-service/
    strategy-engine/
    analytics-engine/
    shared/
  ui/
  infrastructure/
    docker/
    postgres/
    infinispan/
  docs/
  scripts/
```

Notes:

- `backtesting-engine/` may remain in the repo as a future placeholder, but it is not part of the immediate MVP path.
- Phase 1 should optimize for working paper trading, not platform completeness.

## MVP Roadmap

### Phase 1 - Working Infrastructure
- Create monorepo
- Configure Docker Compose
- Configure PostgreSQL
- Configure shared env setup
- Configure Angular, Java, and Python service bootstraps

Deliverable:
- all core services boot locally with one command

### Phase 2 - Broker Data Ingestion
- Create `BrokerAdapter` contract
- Add Zerodha adapter skeleton
- Add Dhan adapter skeleton
- Normalize instruments, option chains, and quotes

Deliverable:
- broker-agnostic market data APIs

### Phase 3 - Virtual Account and Paper Trading
- Create virtual account with user-provided capital
- Store available capital, used margin, and free cash
- Create virtual orders only
- Simulate fills using market data
- Record positions and tradebook

Deliverable:
- paper trading flow works end to end without real money

### Phase 4 - Margin and Risk Allocation
- Estimate margin before trade placement
- Calculate capital utilization
- Enforce configurable risk limits from available capital
- Show reward-to-risk expectations where applicable

Deliverable:
- margin-aware order approval and risk budget visibility

### Phase 5 - Angular Trading Desk
- Minimal-inspired dashboard shell
- account summary cards
- option chain screen
- paper order entry
- position and P&L screens
- analysis widgets

Deliverable:
- usable paper trading dashboard

### Phase 6 - 30-Day Analysis Layer
- track daily account snapshots
- MTM and drawdown reporting
- margin usage history
- strategy-wise summaries
- broker-wise comparison

Deliverable:
- live analysis workspace for the 30-day simulation window

## PostgreSQL Schemas

auth
broker
market
strategy
orders
portfolio
analytics

Key new business entities:

- `portfolio.virtual_account`
- `orders.paper_trade_order`
- `portfolio.position_snapshot`
- `analytics.daily_account_snapshot`
- `market.option_chain_snapshot`

## Trading Rules

- No real broker order placement in the MVP
- No strategy should contain broker API logic
- Broker models stay inside the adapter layer
- P&L must be derived from broker-fed quotes or option-chain values
- Margin must be calculated before virtual order acceptance
- Risk allocation must consider available capital, not just notional trade size
- Every trade belongs to a virtual account

## Coding Standards

### Spring Boot
- Hexagonal Architecture
- Constructor Injection
- DTOs
- Flyway
- OpenAPI
- Integration Tests

### FastAPI
- Async endpoints where appropriate
- SQLAlchemy 2
- Alembic
- Pydantic v2
- Repository pattern

### Frontend
- standalone Angular components
- mobile-friendly dashboard layout
- reusable market-data and account widgets

## Success Criteria

The MVP is successful when a user can:

1. connect/select a broker data source
2. create a virtual account with starting capital
3. inspect live option-chain data
4. place a simulated trade
5. view required margin before order acceptance
6. see capital impact, risk percentage, and running P&L
7. operate entirely without risking real money

