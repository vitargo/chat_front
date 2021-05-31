import "../css/style.css";
import {postRequest, URL} from "./helpers/request.js";
import {setCookie} from "./helpers/cookieHelper.js";
import {redirect} from "./helpers/general";
import {renderError, renderText} from "./helpers/render.js";

import axios from "axios";

export const IndexInit = () => {

    const regForm = document.querySelector("form");
    const login = regForm.login;
    const password = regForm.password;
    const signButton = document.querySelector("#submit-auth");
    const errorText = document.querySelector(".error-text");

    signButton.addEventListener("click", (event) => {
        event.preventDefault();
        renderText(errorText, "");
        const bodyObject = JSON.stringify({
            login: login.value,
            password: password.value,
        });

        const authURL = URL + "/chat/auth";
        const options = {
            headers: {"content-type": "application/json"}
        }
        axios.post(authURL, bodyObject, options
        ).then((response) => {
            console.log(response);
            if (response.status === 200) {
                setCookie("nickName", response.data.nickName);
                setCookie("token", response.data.token);
                console.log(response.data)
                console.log(response.data.nickName)
                console.log(response.data.token)
                redirect("chat.html");
            } else return renderError(errorText, "Opps...Invalid password or login!");
        })
            .catch((e) => {
                console.log(e);
                renderText(errorText, "");
                return renderError(errorText, "Opps...Invalid password or login!");
            });

    });
};

IndexInit();
