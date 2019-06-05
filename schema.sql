-- Created the DB "wizard_schools_db" (only works on local connections)
CREATE DATABASE bamazon_db;
USE bamazon_db;

-- Created the table "schools" 
CREATE TABLE products
(
  item_id int
  AUTO_INCREMENT,
  product_name varchar
  (45) NOT NULL,
  department_name varchar
  (45) NOT NULL,
  price int not null,
  stock_quantity int not null,
  PRIMARY KEY
  (item_id)
);

  -- Inserted a set of records into the table
  INSERT INTO products
    (product_name,department_name,price,stock_quantity)
  VALUES
    ("Plasma TV","electronics",3000,10),
    ("LCD TV","electronics",1000,10),
    ("Bluetood Headphones","electronics",100,10),
    ("Aspirin","pharmacy",100,10),
    ("Afrin","pharmacy",200,10),
    ("Advil","pharmacy",300,10),
    ("Drill","hardware",400,10),
    ("Hamer","hardware",500,10),
    ("Cable","hardware",100,10),
    ("Nail","hardware",20,10);
    
-- Created the table "departments" 
CREATE TABLE departments
(
  department_id int
  AUTO_INCREMENT,
  department_name varchar
  (45) NOT NULL,
  over_head_costs int not null,
  PRIMARY KEY
  (department_id)
);

  -- Inserted a set of records into the table
  INSERT INTO departments
    (department_name,over_head_costs)
  VALUES
    ("electronics",1000),
    ("pharmacy",1000),
    ("hardware",100),
    ("test",10);
 
 ALTER TABLE products
  ADD product_sales int NOT NULL
    AFTER price