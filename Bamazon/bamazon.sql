create database bamazon;
use bamazon;

create table products(
itemid integer auto_increment not null,
name varchar(45) not null,
type varchar(45) not null,
price decimal(10,2) not null,
quantity integer(10) not null,
primary key (itemid)
);