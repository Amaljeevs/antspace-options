create table if not exists auth.app_user (
    id uuid primary key,
    email varchar(160) not null unique,
    display_name varchar(160) not null,
    password_hash varchar(255) not null,
    created_at timestamp with time zone not null
);
