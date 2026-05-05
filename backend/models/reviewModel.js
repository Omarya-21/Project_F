import db from '../config/db.js';

export const createReview = async (userID, productID, rating, comment) => {
  const [result] = await db.query(
    'INSERT INTO Review (userID, productID, raiting, comment) VALUES (?, ?, ?, ?)',
    [userID, productID, rating, comment]
  );
  return result.insertId;
};

export const getReviewsByProductId = async (productID) => {
  const [rows] = await db.query(`
    SELECT r.*, u.name as user_name
    FROM Review r
    JOIN Users u ON r.userID = u.userID
    WHERE r.productID = ?
    ORDER BY r.reviewID DESC
  `, [productID]);
  return rows;
};

export const getAverageRating = async (productID) => {
  const [rows] = await db.query(
    'SELECT AVG(raiting) as average FROM Review WHERE productID = ?',
    [productID]
  );
  return rows[0].average || 0;
};
