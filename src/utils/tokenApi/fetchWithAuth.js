//hàm trả về 1 fetch API có gắn thêm accessToken

const fetchWithAuth = (url, options = {}) => {
  //lấy accessToken từ localStogare
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));

  if (!accessToken) {
    console.log("Chưa có access token!!");
    return;
  }

  //thêm accessToke vào headers của request
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  //trả về 1 fetch API có url và options
  return fetch(url, options);
};

export default fetchWithAuth;
