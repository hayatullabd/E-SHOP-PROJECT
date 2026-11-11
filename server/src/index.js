const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database connection middleware for serverless invocations
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (error) {
    console.error("Database connection error in middleware:", error);
    res.status(500).json({ error: "Database connection failed", details: error.message });
  }
});

// Core E-Commerce Routes
const ProductRoute = require("./Routes/ProductRoute.js");
const CategoryRoute = require("./Routes/CategoryRoute.js");
const userRoutes = require("./Routes/userRoute");
const orderRoutes = require("./Routes/orderRoute");
const invoiceCountNo = require("./Routes/invoiceCountNoRoute");
const banner = require("./Routes/bannerRoute");
const LandingPage = require("./Routes/LandingPageRoute");
const brands = require("./Routes/brandsRoute");
const deliveryCost = require("./Routes/deliveryCostRoute");
const coupons = require("./Routes/couponsRoute");
const dashboard = require("./Routes/dashboardRoute");
const myShop = require("./Routes/myShopRoute");
const siteApiSetting = require("./Routes/siteApiSettingRoute");
const reviewRoute = require("./Routes/reviewRoute");
const variantRoute = require("./Routes/variantRoute");
const walletRoute = require("./Routes/walletRoute");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/category", CategoryRoute);
app.use("/api/v1/product", ProductRoute);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/invoice-count-no", invoiceCountNo);
app.use("/api/v1/banner", banner);
app.use("/api/v1/brands", brands);
app.use("/api/v1/delivery-cost", deliveryCost);
app.use("/api/v1/variant", variantRoute);
app.use("/api/v1/coupons", coupons);
app.use("/api/v1/dashboard", dashboard);
app.use("/api/v1/my-shop", myShop);
app.use("/api/v4/review", reviewRoute);
app.use("/api/v1/wallet", walletRoute);
app.use("/api/v1/site-api-setting", siteApiSetting);
app.use("/api/v2/landing-page", LandingPage);

app.get("/", (req, res) => res.send("eccomerce server is running..."));

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  dbConnect()
    .then(() => {
      app.listen(port, () => {
        console.log(`Database connected and listening on port ${port}`);
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
}

module.exports = app;
