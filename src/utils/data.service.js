import axios from "axios";

//const API_URL = "http://localhost:9000/";
const API_URL = "https://midterm596server.herokuapp.com/auth/";

const user = JSON.parse(localStorage.getItem('user'));
if (user) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;
}

// user
const getUserInfo = () => {
  console.log(axios.defaults.headers.common["Authorization"]);
  return axios.get(API_URL + "user/");
};

const changeUserInfo = (newUsername, newFullname, newEmail) => {
  return axios.post(API_URL + "user/changeinfo/", { newUsername, newFullname, newEmail });
};

const changePassword = (oldPass, newPass) => {
  return axios.post(API_URL + "user/changepass", { oldPass, newPass });
}

// board
const getUserBoard = () => {
  console.log(axios.defaults.headers.common["Authorization"]);
  return axios.get(API_URL + "board/");
};

const createBoard = (name) => {
  return axios.post(API_URL + "board/create/", { name });
};

const deleteBoard = (ID) => {
  return axios.post(API_URL + "board/delete/", { ID });
};

const getBoardByID = (ID) => {
  return axios.get(API_URL + "board/" + ID + "/");
};

const changeNameBoard = (ID, name) => {
  return axios.post(API_URL + "board/" + ID + "/edit/", { name });
}

//
const getAllCardByColumn = (ID, idColumn) => {
  return axios.get(API_URL + "board/" + ID + "/" + idColumn + "/card/");
};

const createCard = (ID, idColumn, des) => {
  return axios.post(API_URL + "board/" + ID + "/" + idColumn + "/card/create/", { des });
};

const deleteCard = (idBoard, idColumn, idCard) => {
  return axios.post(API_URL + "board/" + idBoard + "/" + idColumn + "/card/delete/", { idCard });
};

const changeContentCard = (idBoard, idColumn, idCard, content) => {
  return axios.post(API_URL + "board/" + idBoard + "/" + idColumn + "/card/edit/", { idCard, content });
}

const DataService = {
  getUserInfo,
  changeUserInfo,
  changePassword,
  createBoard,
  deleteBoard,
  getUserBoard,
  getBoardByID,
  changeNameBoard,
  getAllCardByColumn,
  createCard,
  deleteCard,
  changeContentCard,
}

export default DataService;
