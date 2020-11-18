import axios from "axios";

// test
const API_URL = "http://localhost:9000/";
//const API_URL = "https://midterm596server.herokuapp.com/";

const user = JSON.parse(localStorage.getItem('user'));
if (user) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;
}

// user
const getUserInfo = () => {
  return axios.get(API_URL + "user/");
};

const changeUserInfo = (newUsername, newFullname, newEmail) => {
  return axios.post(API_URL + "user/changeinfo/", { newUsername, newFullname, newEmail });
};

const changePassword = (oldPass, newPass) => {
  return axios.post(API_URL + "user/changepass/", { oldPass, newPass });
}

// board of user
const getUserBoard = () => {
  return axios.get(API_URL + "user/board/");
};

const createBoard = (name) => {
  return axios.post(API_URL + "user/board/create/", { name });
};

const deleteBoard = (ID) => {
  return axios.post(API_URL + "user/board/delete/", { ID });
};

// detail board
const DataService = {
  getUserInfo,
  changeUserInfo,
  changePassword,
  createBoard,
  deleteBoard,
  getUserBoard,
}

export default DataService;
