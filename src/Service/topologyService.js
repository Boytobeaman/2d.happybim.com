import Axios from '../utils/Service';
import axios from 'axios';

// const API_ROOT='https://api.50d.top/DEMO_APP'
const API_ROOT='https://bim.90m.top'

// export async function getListByPage(currentPageIndex) {
//   return await axios.get(`${API_ROOT}/le5le/getListByPage?pageIndex=${currentPageIndex}&pageCount=8`);
// }

export async function getListByPage(page=1,limit=10) {
  let _limit = limit;
  let _start = (page - 1) * 10;
  return await axios.post(`${API_ROOT}/lele-lists/pagination?_start=${_start}&_limit=${_limit}&_sort=createdAt:desc`);
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
