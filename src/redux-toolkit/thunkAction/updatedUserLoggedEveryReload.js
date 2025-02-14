import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithAuth from "../../utils/tokenApi/fetchWithAuth";
import baseUrl from "../../config/baseUrl";
import refreshToken from "../../utils/tokenApi/refreshToken";

////hàm này dùng để cập nhật lại userLogged trong state của redux mỗi khi người dùng reload lại trang

//thunk action là 1 hàm, không phải là 1 object như action bình thường
//thunk action nhận vào 2 tham số là dispatch và getState, nếu không có 2 tham số trên thì nó giống như 1 hàm thông thường
//updateUserLoggedEveryReload làm 1 thunk action creator, tức là 1 hàm trả về 1 thunk action,
export const updateUserLoggedEveryReload = createAsyncThunk(
  "userLogged/fetchUserLogged",
  async (_, { rejectWithValue }) => {
    //lấy accessToken ở local
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));

    //kiểm tra accessToken
    if (!accessToken) {
      console.log("accessToken không có, người dùng chưa đăng nhập!");
      return rejectWithValue("Không có accessToken");
    }

    //nếu có accessToken thì gọi lên server để lấy lại thông tin người dùng đang đăng nhập với thông tin có trong accessToken
    try {
      //gọi API với fecth có gắn accessToken từ đầu
      let response = await fetchWithAuth(baseUrl + "/user");

      //nếu access token hết hạn thì dùng refresh token để cập nhật lại access token
      if (response.status === 403) {
        console.log("Access token đang hết hạn, đang thử refresh token...");

        try {
          // gọi refresh token để cập nhật lại access token
          const refreshSuccess = await refreshToken();

          if (!refreshSuccess.ok) {
            console.log(
              "Refresh token không thành công, đăng xuất người dùng!!"
            );
            return rejectWithValue("Refresh token không thành công");
          }

          //gọi lại sau khi refresh token thành công
          response = await fetchWithAuth(baseUrl + "/user");
        } catch (error) {
          console.log("Xác thực không thành công " + error.message);
          //đăng xuất người dùng
          return rejectWithValue("Refresh token không thành công");
        }
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.log(
        "Lỗi cập nhật lại thông tin người dùng đang đăng nhập khi reload lại trang! Error: " +
          error.message
      );
    }
  }
);
