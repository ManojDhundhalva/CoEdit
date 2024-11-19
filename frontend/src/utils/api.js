import axios from "axios";
import config from "../config";

axios.defaults.withCredentials = true;

// Create an instance of Axios for API requests
const API = axios.create({
  baseURL: config.BACKEND_API,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export async function executeCode(language = "javascript", version = "18.15.0", sourceCode = "", input = "") {

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: language,
      version: version,
      files: [
        {
          content: sourceCode,
        },
      ],
      stdin: input,
    });
    return response.data.run;
  } catch (error) {
    throw new Error("Cannot Run !");
  }
}

export default API;
