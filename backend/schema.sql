-- Nexus PC Database Schema (Aligned with ERD)

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    role VARCHAR(20) DEFAULT 'user'
);

-- Brands Table
CREATE TABLE IF NOT EXISTS Brands (
    brandID INT PRIMARY KEY AUTO_INCREMENT,
    brand_name VARCHAR(255) NOT NULL UNIQUE
);

-- Category Table
CREATE TABLE IF NOT EXISTS Category (
    categoryID INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL UNIQUE
);

-- Products Table
CREATE TABLE IF NOT EXISTS Products (
    productID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    categoryID INT,
    brandID INT,
    image_url TEXT,
    FOREIGN KEY (categoryID) REFERENCES Category(categoryID),
    FOREIGN KEY (brandID) REFERENCES Brands(brandID)
);

-- ProductSpecs Table
CREATE TABLE IF NOT EXISTS ProductSpecs (
    specID INT PRIMARY KEY AUTO_INCREMENT,
    productID INT,
    spec_key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Compatibility Table
CREATE TABLE IF NOT EXISTS Compatibility (
    compatibilityID INT PRIMARY KEY AUTO_INCREMENT,
    product1ID INT,
    product2ID INT,
    compatibility_type VARCHAR(255) NOT NULL,
    FOREIGN KEY (product1ID) REFERENCES Products(productID),
    FOREIGN KEY (product2ID) REFERENCES Products(productID)
);

-- Cart Table
CREATE TABLE IF NOT EXISTS Cart (
    cartID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- CartItems Table
CREATE TABLE IF NOT EXISTS CartItems (
    cartItemID INT PRIMARY KEY AUTO_INCREMENT,
    cartID INT,
    productID INT,
    quantity INT NOT NULL,
    FOREIGN KEY (cartID) REFERENCES Cart(cartID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Order Table
CREATE TABLE IF NOT EXISTS Orders (
    orderID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- Order_Item Table
CREATE TABLE IF NOT EXISTS Order_Item (
    orderItemID INT PRIMARY KEY AUTO_INCREMENT,
    orderID INT,
    productID INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Review Table
CREATE TABLE IF NOT EXISTS Review (
    reviewID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    rating INT,
    productID INT,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Payment Table
CREATE TABLE IF NOT EXISTS Payment (
    paymentID INT PRIMARY KEY AUTO_INCREMENT,
    orderID INT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    payment_date DATETIME,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID)
);

-- Shipment Table
CREATE TABLE IF NOT EXISTS Shipment (
    shipmentID INT PRIMARY KEY AUTO_INCREMENT,
    orderID INT,
    delivery_address TEXT,
    shipment_status VARCHAR(50),
    delivery_date DATETIME,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID)
);
