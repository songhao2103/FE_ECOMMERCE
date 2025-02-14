//hàm format sang VND
export const formatCurrencyVND = (amount) => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

//hàm viết hoa chữ cái đầu tiên
export const capitalizeFirstLetter = (string) => {
  if (!string) return "NaN";
  return string
    .toLowerCase() // Chuyển toàn bộ chuỗi về chữ thường
    .split(" ") // Tách chuỗi thành mảng các từ
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Viết hoa chữ cái đầu
    .join(" "); // Nối các từ lại thành chuỗi
};

//hàm chuyển định dạng thời gian
export const formatDate = (isoString) => {
  const date = new Date(isoString); // Chuyển chuỗi ISO thành đối tượng Date

  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày (2 chữ số)
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (2 chữ số, tháng bắt đầu từ 0)
  const year = date.getFullYear(); // Lấy năm

  return `${day}/${month}/${year}`; // Trả về định dạng ngày/tháng/năm
};
