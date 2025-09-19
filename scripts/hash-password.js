const bcrypt = require("bcrypt");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Vui lòng nhập mật khẩu bạn muốn mã hóa: ", (password) => {
  if (!password) {
    console.error("Mật khẩu không được để trống.");
    rl.close();
    return;
  }

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      console.error("Lỗi khi mã hóa mật khẩu:", err);
    } else {
      console.log("\nĐây là chuỗi mật khẩu đã được mã hóa của bạn:");
      console.log(hash);
      console.log(
        "\n=> Hãy sao chép chuỗi này và cập nhật vào cột PasswordHash trong CSDL."
      );
    }
    rl.close();
  });
});
