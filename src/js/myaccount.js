import "../css/style.css";
import {renderError, renderText} from "./helpers/render";
import {compare, validateLogin, validatePassword} from "./helpers/validation";
import {URL} from "./helpers/request";
import axios from "axios";
import {redirect} from "./helpers/general";
import {getCookie} from "./helpers/cookieHelper";

const nickname = getCookie("nickName");
const token = getCookie("token");


getData();

function getData() {
    const authURL = URL + "/chat/myaccount";
    const options = {
        headers: {"authorization": token}
    };
    axios.get(authURL, options
    ).then((response) => {
        console.log(response.data);
        if (response.status === 200) {
            document.getElementById("1").value = response.data.nickName;
            document.getElementById("2").value = response.data.firstName;
            document.getElementById("3").value = response.data.lastName;
            document.getElementById("4").value = response.data.email;
            document.getElementById("5").value = response.data.login;
            document.getElementById("6").value = response.data.password;
            document.getElementById("7").value = response.data.phone;
            document.getElementById("8").value = response.data.companyName;
        } else return renderError(errorText, "Oppps...something wrong!");
    })
        .catch((e) => {
            console.log(e);
            renderText(errorText, "");
            return renderError(errorText, "Server is not responding!");
        });
}

export const updateInit = () => {
    const form_reg = document.querySelector("form");
    const nickname = form_reg.nickName;
    const firstname = form_reg.firstName;
    const lastname = form_reg.lastName;
    const email = form_reg.email;
    const login = form_reg.login;
    const password = form_reg.password;
    const confirm = form_reg.confirmPassword;
    const phone = form_reg.phone;
    const companyname = form_reg.companyName;

    const updateButton = document.querySelector("#submit-reg");
    const errorText = document.querySelector(".error-text");

    updateButton.addEventListener("click", (event) => {
        event.preventDefault();
        renderText(errorText, "");
        const valid = validateLogin(login.value) && validatePassword(password.value);
        console.log('valid', valid);
        if (valid) {
            const bodyObject = JSON.stringify({
                nickName: nickname.value,
                firstName: firstname.value,
                lastName: lastname.value,
                email: email.value,
                login: login.value,
                password: password.value,
                phone: phone.value,
                companyName: companyname.value
            });
            const options = {
                headers: {"content-type": "application/json", "authorization": token}
            };

            const authURL = URL + "/chat/myaccount";
            renderText(errorText, "");
            axios.put(authURL, bodyObject, options
            ).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    return renderError(errorText, "New data saved on server");
                } else return renderError(errorText, "Oppps...something wrong!");
            })
                .catch((e) => {
                    console.log(e);
                    renderText(errorText, "");
                    return renderError(errorText, "Server is not responding!");
                });
        } else {
            const loginValid = validateLogin(login.value);
            const passValid = validatePassword(password.value);
            if (!loginValid) {
                renderText(errorText, "");
                return renderError(
                    errorText,
                    "Login must contain between 5 and 10 latin characters or numeric!"
                );
            }
            if (!passValid) {
                renderText(errorText, "");
                return renderError(
                    errorText,
                    "The Password must contain between 6 and 25 latin characters or numeric!"
                );
            }
        }
    });
};

updateInit();

var input = document.getElementById('picture');

input.addEventListener('change', handleFiles, false);

function handleFiles(e) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var img = new Image();

    img.onload = function() {
        ctx.drawImage(img, 0, 0);

        var base64 = canvas.toDataURL();
        console.log(base64);
    }

    img.src = URL.createObjectURL(e.target.files[0]);
}