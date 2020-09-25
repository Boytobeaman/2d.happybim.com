import Axios from '../utils/Service';
import axios from 'axios';

const API_ROOT='http://api.50d.top/DEMO_APP'

export async function getListByPage(currentPageIndex) {
  return await axios.get(`${API_ROOT}/le5le/getListByPage?pageIndex=${currentPageIndex}&pageCount=8`);
}


export async function getNodeById(id) {
  return await axios.get(`${API_ROOT}/le5le/getNodeById/${id}`);
}