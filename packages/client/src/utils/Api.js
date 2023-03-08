import axios from "axios";
import { BACKEND_URL } from "./Endpoints";

const Api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 5000,
});

export default Api;
