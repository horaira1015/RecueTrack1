const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const connectDB = require("./config/db");
// const cors = require("cors");
require("dotenv").config(); // ✅ Fixed dotenv path
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

// ✅ Import Routes
const CampregRoutes = require("./Routes/CampRegRoutes");
const CofficerRegRoutes = require("./Routes/CofficerRegRoutes");
const MofficerRegRoutes = require("./Routes/MofficerRegRoutes");
const AddCategoryRoutes = require("./Routes/AddCategoryRoutes");
const ItemRegRoutes = require("./Routes/ItemRegRoutes");
const ManageCampRoutes = require("./Routes/ManageCampRoutes");
const InventoryRoutes = require("./Routes/InventoryRoutes");
const LoginRoutes = require("./Routes/LoginRoutes");
const assignCofficerRoutes = require("./Routes/AssignCofficerRoutes");
const VictimRoutes=require("./Routes/VictimRoutes");
const VolunteerRoutes=require("./Routes/VolunteerRoutes");
const CampStatusRoutes=require("./Routes/CampStatusRoutes");
const RequestSupplyRoutes=require("./Routes/RequestSupplyRoutes")
const assignMofficerRoutes = require("./Routes/AssignMofficerRoutes");
const medicalReportRoutes = require("./Routes/MedicalReportRoutes");
const medicalRequestRoutes = require("./Routes/MedicalRequestRoutes");
const DonationRoutes = require("./Routes/DonationRoutes");
const incidentRoutes = require("./Routes/IncidentReportRoutes");
const emailRoutes=require("./Routes/AlertRoutes")
const ForgotPassRoutes = require("./Routes/ForgotPassRoutes"); // ✅
// Routes
const disasterRoutes = require("./Routes/DisasterRoutes");
const leaderRoutes = require("./Routes/LeaderRoutes");

const app = express();
const port = process.env.PORT || 5553; // ✅ Use port from .env if available

// ✅ Middleware
app.use(bodyParser.json({ limit: "50mb" })); // Increase JSON payload size
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // Increase URL-encoded payload size
app.use(express.json());
const cors = require("cors");
// const { default: RequestSupplies } = require("../frontend/campaid/src/components/RequestSupply");

app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend URL
    credentials: true, // Allow cookies/sessions
  })
);


// ✅ Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}



app.use(
  session({
    secret: "s1o2n3a4", // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Use secure: true in production with HTTPS
  })
);



// ✅ Connect to Database
connectDB();

console.log("Registered Models:", mongoose.modelNames());

// ✅ Routes
app.use("/api/camps", CampregRoutes);
app.use("/api/auth", LoginRoutes);
app.use("/api/cofficerReg", CofficerRegRoutes);
app.use("/api/medicaloffReg", MofficerRegRoutes);
app.use("/api/category", AddCategoryRoutes);
app.use("/api/items", ItemRegRoutes);
app.use("/api/managecamps", ManageCampRoutes);
app.use("/api/inventory", InventoryRoutes);
app.use("/api/assigncofficer", assignCofficerRoutes); 
app.use("/api/victims",VictimRoutes);
app.use("/api/volunteer",VolunteerRoutes);
app.use("/api/campstatus", CampStatusRoutes);
app.use("/api/requestSupply",RequestSupplyRoutes);
app.use("/api/assignmofficer",assignMofficerRoutes);
app.use("/api/medicalreports", medicalReportRoutes);
app.use("/api/requests", medicalRequestRoutes);
app.use("/api/donate", DonationRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/email",emailRoutes);
app.use("/api/authe", ForgotPassRoutes); // ✅ Use Forgot Password Routes


app.use("/api/disasters", disasterRoutes);
app.use("/api/leaders", leaderRoutes);

// ✅ Serve Uploaded Files
app.use("/uploads", express.static(uploadDir));

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🚨 Global Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at port ${port}`);
}

);

