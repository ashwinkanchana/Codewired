import * as path from 'path';
import dotenv from "dotenv";
const targetPath = path.dirname('.');
const envPath = `${targetPath}/config/.env`;
dotenv.config({ path: envPath });
