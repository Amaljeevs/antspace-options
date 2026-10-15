create schema if not exists portfolio;

create table if not exists portfolio.position_snapshot (
    id uuid primary key,
    symbol varchar(64) not null,
    net_quantity integer not null,
    mtm numeric(18, 4) not null,
    recorded_at timestamp with time zone not null
);

