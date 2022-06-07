import dotenv from "dotenv";
import path from "path";
const targetPath = path.dirname('.');
const envPath = `${targetPath}/config/.env`;
dotenv.config({ path: envPath });
