import Axios from '../utils/Service';
import axios from 'axios';
import { userID as defaultUserID } from '../config/config'

// const API_ROOT='https://api.50d.top/DEMO_APP'
const API_ROOT='https://bim.90m.top'
// const API_ROOT='http://localhost:1780'

// export async function getListByPage(currentPageIndex) {
//   return await axios.get(`${API_ROOT}/le5le/getListByPage?pageIndex=${currentPageIndex}&pageCount=8`);
// }



export async function getListByPage(page=1,limit=10, userID=defaultUserID) {
  let _limit = limit;
  let _start = (page - 1) * 10;
  return await axios.post(`${API_ROOT}/lele-lists/pagination?users_permissions_user=${userID}&_start=${_start}&_limit=${_limit}&_sort=createdAt:desc`);
}

export async function getNodeById(id) {
  return await axios.get(`${API_ROOT}/lele-lists/${id}`);
}

export async function saveChart(obj) {
  return await axios.post(`${API_ROOT}/lele-lists/`, obj);
}


export async function updateChart(obj) {
  let id = obj.id;
  delete obj.id
  return await axios.put(`${API_ROOT}/lele-lists/${id}`, obj);
}

export async function deleteChartByID(id) {
  return await axios.delete(`${API_ROOT}/lele-lists/${id}`);
}


export async function addMyChartPicture(obj){
  return await axios.post(`${API_ROOT}/my-pictures/`, obj);
}


export async function getMyChartPicture(userID){
  return await axios.get(`${API_ROOT}/my-pictures/?users_permissions_user=${userID}`);
}

export async function deleteMyChartPicture(id){
  return await axios.delete(`${API_ROOT}/my-pictures/${id}`);
}


export async function uploadOnlinePicture(url){

  let obj = {
    url,
    users_permissions_user: defaultUserID
  }
  return await axios.post(`${API_ROOT}/my-pictures/uploadOnlieURL`, obj);
  
}
