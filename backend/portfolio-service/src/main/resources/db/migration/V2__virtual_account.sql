create table if not exists portfolio.virtual_account (
    id uuid primary key,
    owner_name varchar(128) not null,
    initial_capital numeric(18, 4) not null,
    available_cash numeric(18, 4) not null,
    used_margin numeric(18, 4) not null,
    realized_pnl numeric(18, 4) not null,
    unrealized_pnl numeric(18, 4) not null,
    created_at timestamp with time zone not null
);

