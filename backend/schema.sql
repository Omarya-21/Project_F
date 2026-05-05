-- Nexus PC Database Schema (Aligned with ERD)

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    name TEXT NOT NULL,
    address TEXT,
    role TEXT DEFAULT 'user' -- Added for application logic
);

-- Brands Table
CREATE TABLE IF NOT EXISTS Brands (
    brandID INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_name TEXT NOT NULL UNIQUE
);

-- Category Table
CREATE TABLE IF NOT EXISTS Category (
    categoryID INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL UNIQUE
);

-- Products Table
CREATE TABLE IF NOT EXISTS Products (
    productID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    categoryID INTEGER,
    brandID INTEGER,
    image_url TEXT, -- Maintained for UI
    FOREIGN KEY (categoryID) REFERENCES Category(categoryID),
    FOREIGN KEY (brandID) REFERENCES Brands(brandID)
);

-- ProductSpecs Table (Technical necessity for PC builds)
CREATE TABLE IF NOT EXISTS ProductSpecs (
    specID INTEGER PRIMARY KEY AUTOINCREMENT,
    productID INTEGER,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Compatibility Table (Technical necessity for AI advice)
CREATE TABLE IF NOT EXISTS Compatibility (
    compatibilityID INTEGER PRIMARY KEY AUTOINCREMENT,
    product1ID INTEGER,
    product2ID INTEGER,
    compatibility_type TEXT NOT NULL,
    FOREIGN KEY (product1ID) REFERENCES Products(productID),
    FOREIGN KEY (product2ID) REFERENCES Products(productID)
);

-- Cart Table
CREATE TABLE IF NOT EXISTS Cart (
    cartID INTEGER PRIMARY KEY AUTOINCREMENT,
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- CartItems Table
CREATE TABLE IF NOT EXISTS CartItems (
    cartItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    cartID INTEGER,
    productID INTEGER,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (cartID) REFERENCES Cart(cartID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Order Table
CREATE TABLE IF NOT EXISTS Orders (
    orderID INTEGER PRIMARY KEY AUTOINCREMENT,
    userID INTEGER,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    shipping_address TEXT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- Order_Item Table
CREATE TABLE IF NOT EXISTS Order_Item (
    orderItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    orderID INTEGER,
    productID INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Review Table
CREATE TABLE IF NOT EXISTS Review (
    reviewID INTEGER PRIMARY KEY AUTOINCREMENT,
    userID INTEGER,
    raiting INTEGER,
    productID INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Payment Table
CREATE TABLE IF NOT EXISTS Payment (
    paymentID INTEGER PRIMARY KEY AUTOINCREMENT,
    orderID INTEGER,
    payment_method TEXT,
    payment_status TEXT,
    payment_date DATETIME,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID)
);

-- Shipment Table
CREATE TABLE IF NOT EXISTS Shipment (
    shipmentID INTEGER PRIMARY KEY AUTOINCREMENT,
    orderID INTEGER,
    delivery_address TEXT,
    shipment_status TEXT,
    delivery_date DATETIME,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID)
);
