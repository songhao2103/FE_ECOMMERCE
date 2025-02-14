import baseUrl from "../../config/baseUrl";

//gọi API để cập nhậ lại access token
// hàm này cần 1 tham số là dispatch để cập nhật lại userLogged ở state của redux
const refreshToken = async () => {
  try {
    console.log("refresh token");

    const response = await fetch(baseUrl + "/refresh-token", {
      credentials: "include", // Bật gửi cookie
    });

    if (!response.ok) {
      throw new Error(
        "Lỗi không cập nhật lại được access token!!" + response.statusText
      );
    }

    const data = await response.json();

    //lấy accessToken từ response cập nhật lại trên localStorage
    localStorage.setItem("accessToken", JSON.stringify(data.accessToken));

    //cập nhật lại userLogged ở state của redux
    // dispatch(updateUserLogged(data.user));
    return response;
  } catch (error) {
    console.log("Lỗi khi cập nhật lại access token!!" + error.message);
  }
};

export default refreshToken;
