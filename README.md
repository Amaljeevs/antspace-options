# FinQuant Platform

FinQuant is a monorepo for an algorithmic options trading platform with:

- Spring Boot control-plane services
- FastAPI quant services
- Angular dashboard UI inspired by Minimal UI
- Docker-based one-click deployment
- PostgreSQL and Infinispan infrastructure
- paper trading with virtual capital, margin checks, and option-chain-based P&L

## Quick Start

1. Copy `.env.example` to `.env` if you want to override defaults.
2. Run `./scripts/deploy.ps1` on Windows PowerShell or `./scripts/deploy.sh` on Linux/macOS.
3. Open:
   - UI: `http://localhost:4200`
   - Gateway: `http://localhost:8080`
   - Auth JWKS: `http://localhost:9000/.well-known/jwks.json`
   - Market data API docs: `http://localhost:8101/docs`
   - Portfolio APIs: `http://localhost:8080/api/portfolio`
   - Order APIs: `http://localhost:8080/api/orders`

## Repository Layout

```text
backend/
  auth-server/
  api-gateway/
  order-engine/
  portfolio-service/
  broker-service/
  common/
quant/
  shared/
  market-data-service/
  strategy-engine/
  analytics-engine/
ui/
infrastructure/
native/
docs/
scripts/
```

## Notes

- The backend targets Java 17 locally because that is what is available in the current environment.
- The UI is authored in Angular 20 format and built inside Docker with a Node image that satisfies Angular's engine requirement.
- Broker adapters are stubbed behind interfaces, so no service calls broker APIs directly.
- The current MVP focus is paper trading only. Real-money execution is intentionally out of scope for now.
