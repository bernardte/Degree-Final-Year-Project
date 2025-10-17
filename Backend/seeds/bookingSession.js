import mongoose from "mongoose";
import BookingSession from "../models/BookingSession.model.js";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// -------------------- Helper Functions --------------------
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomCheckInOut() {
  const checkIn = randomDate(new Date("2025-09-01"), new Date("2025-12-31"));
  const nights = Math.floor(Math.random() * 5) + 1; // 1–5 nights
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + nights);
  return { checkIn, checkOut, nights };
}

// ✅ 随机生成房间ID列表（1–3间房）
function randomRoomIds() {
  const roomPool = [
    "652d2e3a5a7d1b001234abcf",
    "652d2e3a5a7d1b001234abd0",
    "652d2e3a5a7d1b001234abd1",
    "652d2e3a5a7d1b001234abd2",
    "652d2e3a5a7d1b001234abd3",
  ];
  const numRooms = Math.floor(Math.random() * 3) + 1; // 1–3 间房
  return Array.from(
    { length: numRooms },
    () => roomPool[Math.floor(Math.random() * roomPool.length)]
  );
}

// -------------------- Seed Data --------------------
const seedData = [];

// ✅ 40 正常样本
for (let i = 1; i <= 40; i++) {
  const { checkIn, checkOut, nights } = randomCheckInOut();
  const adults = Math.floor(Math.random() * 3) + 1; // 1–3 adults
  const children = Math.floor(Math.random() * 2); // 0–1 child
  const pricePerNight = Math.floor(Math.random() * 200) + 300; // RM300–RM500
  const totalPrice =
    pricePerNight * nights * (Math.floor(Math.random() * 3) + 1); // 考虑多房间价格

  seedData.push({
    sessionId: `normal-${i.toString().padStart(3, "0")}`,
    userId: null,
    guestId: `guest-${i}`,
    guestDetails: {
      contactName: `Guest ${i}`,
      contactEmail: `guest${i}@example.com`,
      contactNumber: `011${Math.floor(1000000 + Math.random() * 9000000)}`,
    },
    roomId: randomRoomIds(), // ✅ 随机1–3个房间
    checkInDate: checkIn,
    checkOutDate: checkOut,
    totalGuest: { adults, children },
    totalPrice,
    breakfastIncluded: Math.random() > 0.5 ? 1 : 0,
    paymentStatus: "paid",
    paymentMethod: ["card", "fpx", "grabpay"][Math.floor(Math.random() * 3)],
    rewardDiscount: Math.random() > 0.7 ? 50 : 0,
  });
}

// ⚠️ 10 异常样本
const anomalies = [
  {
    reason: "价格异常高（数据错误）",
    totalPrice: 15000,
    nights: 2,
    adults: 2,
    children: 0,
  },
  {
    reason: "总价异常低（数据缺失）",
    totalPrice: 50,
    nights: 3,
    adults: 2,
    children: 1,
  },
  {
    reason: "入住天数太多（极端值）",
    totalPrice: 8000,
    nights: 30,
    adults: 1,
    children: 0,
  },
  {
    reason: "儿童人数大于成人",
    totalPrice: 900,
    nights: 2,
    adults: 1,
    children: 5,
  },
  {
    reason: "价格与人数比例不符",
    totalPrice: 500,
    nights: 5,
    adults: 4,
    children: 2,
  },
  {
    reason: "未付款但价格极高",
    totalPrice: 12000,
    nights: 3,
    adults: 2,
    children: 0,
    paymentStatus: "pending",
  },
  {
    reason: "rewardDiscount 异常（比总价高）",
    totalPrice: 400,
    nights: 2,
    adults: 2,
    children: 0,
    rewardDiscount: 600,
  },
  {
    reason: "checkOut 在 checkIn 之前",
    totalPrice: 500,
    nights: -1,
    adults: 2,
    children: 0,
  },
  {
    reason: "早餐标记为数字错误",
    totalPrice: 800,
    nights: 2,
    adults: 2,
    children: 1,
    breakfastIncluded: 10,
  },
  {
    reason: "空白 userId 与 guest 信息",
    totalPrice: 700,
    nights: 2,
    adults: 2,
    children: 0,
    guestId: null,
    guestDetails: {},
  },
];

for (let i = 0; i < anomalies.length; i++) {
  const anomaly = anomalies[i];
  const { checkIn, checkOut, nights } = randomCheckInOut();

  seedData.push({
    sessionId: `anomaly-${i + 1}`,
    userId: null,
    guestId: anomaly.guestId ?? `guest-a-${i}`,
    guestDetails: anomaly.guestDetails ?? {
      contactName: `Anomaly Guest ${i + 1}`,
      contactEmail: `anom${i + 1}@example.com`,
      contactNumber: `010${Math.floor(1000000 + Math.random() * 9000000)}`,
    },
    roomId: randomRoomIds(), // ✅ 异常样本也随机多个房间
    checkInDate: anomaly.nights === -1 ? new Date("2025-10-25") : checkIn,
    checkOutDate: anomaly.nights === -1 ? new Date("2025-10-20") : checkOut,
    totalGuest: {
      adults: anomaly.adults ?? 2,
      children: anomaly.children ?? 0,
    },
    totalPrice: anomaly.totalPrice,
    breakfastIncluded: anomaly.breakfastIncluded ?? 1,
    paymentStatus: anomaly.paymentStatus ?? "paid",
    paymentMethod: ["card", "fpx", "grabpay"][Math.floor(Math.random() * 3)],
    rewardDiscount: anomaly.rewardDiscount ?? 0,
  });
}

// -------------------- Seeder Function --------------------
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    await BookingSession.deleteMany({});
    console.log("🧹 Cleared old BookingSession collection");

    await BookingSession.insertMany(seedData);
    console.log(
      `🌱 Inserted ${seedData.length} booking session samples successfully!`
    );
    console.log(`   → 正常样本: 40 | 异常样本: 10`);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding error:", error);
  }
}

seed();
