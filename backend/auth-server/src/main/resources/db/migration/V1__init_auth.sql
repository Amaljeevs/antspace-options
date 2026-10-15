create schema if not exists auth;

create table if not exists auth.refresh_token (
    id uuid primary key,
    subject varchar(128) not null,
    token_hash varchar(128) not null unique,
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone not null,
    revoked_at timestamp with time zone
);
