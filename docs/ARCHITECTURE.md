# Architecture Notes

## Control Plane

- `auth-server`: JWT minting, refresh tokens, JWKS publication, and key rotation.
- `api-gateway`: single ingress layer for UI and downstream clients.
- `broker-service`: broker abstractions and adapter registry.
- `order-engine`: virtual order intake, margin estimation, and paper trade lifecycle.
- `portfolio-service`: virtual accounts, capital state, and position/summary endpoints.

## Quant Plane

- `market-data-service`: instruments, candles, option chain snapshots, and normalized broker-fed market data.
- `strategy-engine`: strategy catalog and strategy composition boundary.
- `analytics-engine`: account analytics, margin usage, and paper trading summaries.

## Principles

- Strategies remain broker-agnostic.
- Broker contracts stay behind `BrokerAdapter`.
- Phase 1 is paper trading only, with no live money execution.
- Profit and loss are marked from option-chain and quote data, not manual entry.
- Every paper trade must be validated against available capital and estimated margin.
- Docker Compose is the default local deployment surface.

