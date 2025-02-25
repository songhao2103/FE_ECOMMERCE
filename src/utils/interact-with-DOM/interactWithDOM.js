export const handleCopy = (textToCopy) => {
  // Nếu trình duyệt hỗ trợ Clipboard API và đang chạy trên kết nối bảo mật (HTTPS)
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy);
  } else {
    // Fallback: sử dụng textarea ẩn và document.execCommand('copy')
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // Đưa textarea ra khỏi vùng nhìn để không ảnh hưởng đến giao diện
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
    } catch (err) {
      alert("Lỗi khi sao chép: " + err);
    }

    // Loại bỏ textarea sau khi sao chép
    document.body.removeChild(textArea);
  }
};
