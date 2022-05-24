import axios from "axios";
import { getBaseURL } from "../utils/utils.js";
const url = getBaseURL()
const instance = axios.create({
    baseURL: url,
  });
 
export default instance
  