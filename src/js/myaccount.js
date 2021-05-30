import "../css/style.css";
import {
    validateLogin,
    validatePassword,
    compare,
} from "./helpers/validation.js";
import { postRequest, URL } from "./helpers/request.js";
import { redirect } from "./helpers/general.js";
import { renderError, renderText } from "./helpers/render.js";
import axios from "axios";