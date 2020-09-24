import Axios from '../utils/Service';

const API_ROOT='http://topology.le5le.com'

export async function getListByPage(currentPageIndex) {
  return await Axios.get(`${API_ROOT}/api/topologies?pageIndex=${currentPageIndex}&pageCount=8`);
}


export async function getNodeById(id) {
  return await Axios.get(`${API_ROOT}/api/topology/${id}`);
}