create schema if not exists orders;

create table if not exists orders.trade_order (
    id uuid primary key,
    strategy_key varchar(80) not null,
    symbol varchar(64) not null,
    side varchar(8) not null,
    quantity integer not null,
    status varchar(24) not null,
    mode varchar(16) not null,
    created_at timestamp with time zone not null
);

