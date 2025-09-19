// Trong một ứng dụng thực tế, bạn sẽ dùng Context hoặc thư viện quản lý state
// để lấy trạng thái đăng nhập thực sự. Đây là file giả lập để minh họa.

// Giả lập trạng thái đăng nhập.
// Thay đổi giá trị này thành `true` để kiểm tra luồng khi người dùng đã đăng nhập.
const IS_LOGGED_IN = false;

export const useAuth = () => {
  const isAuthenticated = IS_LOGGED_IN;
  const user = isAuthenticated ? { firstName: "Minh" } : null;

  return { isAuthenticated, user };
};
