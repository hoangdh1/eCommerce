CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE DATABASE acheckin_hrm
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;


CREATE TYPE status_shipper AS ENUM ('active', 'disabled');
CREATE TYPE status_order AS ENUM ('inStock', 'exported', 'shipped', 'completed','canceled', 'recalled');

create table admins (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP
);

create table customers (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP
);

create table shippers (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL,
    status status_shipper NOT NULL,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP
);

create table products (
	id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	name VARCHAR(50) NOT NULL,
	image VARCHAR(500) NOT NULL,
	price INTEGER NOT NULL,
	description TEXT NOT NULL,
	quantity INTEGER NOT NULL,
    discount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP
);

create table categories (
	id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP
);

create table category_product (
	id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories (id),
    product_id UUID NOT NULL REFERENCES products (id),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP
);

create table carts (
	id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers (id),
    total INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP,
    UNIQUE (customer_id)
);

create table cart_items (
	id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts (id),
    product_id UUID NOT NULL REFERENCES products (id),
    count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP,
    UNIQUE (product_id)
);


create table orders (
	id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers (id),
    shipper_id UUID NOT NULL REFERENCES shippers (id),
    total INTEGER NOT NULL,
    status status_order NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP
);

create table order_items (
	id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders (id),
    product_id UUID NOT NULL REFERENCES products (id),
    count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP,
);

