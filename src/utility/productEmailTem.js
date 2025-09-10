// utils/templates/productTemplate.js
module.exports = function productTemplate(product_name, product_img, description, price, discount_price) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #ff5722;
        }
        .content {
          font-size: 16px;
          line-height: 1.6;
          color: #333333;
        }
        .product-img {
          width: 100%;
          max-width: 400px;
          border-radius: 8px;
          margin: 15px auto;
          display: block;
        }
        .price-box {
          text-align: center;
          margin: 15px 0;
          font-size: 18px;
        }
        .old-price {
          text-decoration: line-through;
          color: #999;
          margin-right: 10px;
        }
        .discount {
          background: #ff5722;
          color: #ffffff;
          font-size: 20px;
          font-weight: bold;
          padding: 10px;
          text-align: center;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          font-size: 14px;
          color: #777777;
          margin-top: 20px;
        }
        .btn {
          display: inline-block;
          background: #007bff;
          color: #fff;
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 16px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔥 Hot Deal on ${product_name}!</h1>
        </div>
        <div class="content">
          <img src="${product_img}" alt="${product_name}" class="product-img"/>
          <p>${description}</p>

          <div class="price-box">
            <span class="old-price">$${price}</span>
            <span style="color:#28a745; font-weight:bold;">Now $${discount_price}</span>
          </div>

          <div class="discount">
            Save $${(price - discount_price).toFixed(2)} Today!
          </div>

          <div style="text-align:center;">
            <a href="https://yourshop.com" class="btn">Shop Now</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} My Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
