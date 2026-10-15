alter table orders.trade_order
    add column if not exists account_id uuid,
    add column if not exists entry_price numeric(18, 4),
    add column if not exists lot_size integer,
    add column if not exists estimated_margin numeric(18, 4),
    add column if not exists maximum_loss numeric(18, 4),
    add column if not exists risk_pct_of_capital numeric(8, 2);

