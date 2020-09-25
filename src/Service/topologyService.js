import Axios from '../utils/Service';

const API_ROOT='http://api.50d.top/DEMO_APP'

export async function getListByPage(currentPageIndex) {
  return await Axios.get(`${API_ROOT}/le5le/getListByPage?pageIndex=${currentPageIndex}&pageCount=8`);
}


export async function getNodeById(id) {
  return await Axios.get(`${API_ROOT}/le5le/getNodeById/${id}`);
}