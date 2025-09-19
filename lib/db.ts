import sql from "mssql";

// Cấu hình kết nối lấy từ file .env.local
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Bắt buộc nếu bạn dùng Azure SQL
    trustServerCertificate: true, // Đặt là true cho môi trường dev
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// --- Bắt đầu phần code được cải tiến ---

// Khai báo một biến toàn cục để lưu trữ promise của pool kết nối
let poolPromise: Promise<sql.ConnectionPool> | null = null;

/**
 * Lấy ra pool kết nối CSDL.
 * Sử dụng mẫu singleton để đảm bảo chỉ có một pool được tạo và tái sử dụng.
 * @returns {Promise<sql.ConnectionPool>}
 */
function getDbPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    // Nếu pool chưa được khởi tạo, tạo mới và kết nối
    const pool = new sql.ConnectionPool(sqlConfig);
    poolPromise = pool
      .connect()
      .then((p) => {
        console.log("Đã kết nối thành công đến SQL Server.");
        p.on("error", (err) => console.error("Lỗi SQL Pool:", err));
        return p;
      })
      .catch((err) => {
        console.error("Không thể tạo kết nối CSDL:", err);
        // Đặt lại promise về null để lần gọi tiếp theo có thể thử lại
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

export { getDbPool, sql };
