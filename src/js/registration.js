import "../css/style.css";

import {
  validateLogin,
  validatePassword,
  compare,
} from "./helpers/validation.js";
import { postRequest, URL } from "./helpers/request.js";
import { redirect } from "./helpers/general.js";
import { renderError, renderText } from "./helpers/render.js";
import { setLocalStorage } from "./helpers/localStorageOperations.js";
import axios from "axios";
import {setCookie} from "./helpers/cookieHelper";

export const regInit = () => {
  //login nodes
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


  // const guestLink = document.querySelector("#guest");
  const signButton = document.querySelector("#submit-reg");
  const errorText = document.querySelector(".error-text");

  // guestLink.addEventListener("click", (e) => {
    // setLocalStorage("role", "guest");
  //   redirect("chat.html");
  // });

  signButton.addEventListener("click", (event) => {
    event.preventDefault();
    renderText(errorText, "");
    const valid = validateLogin(login.value) &&  validatePassword(password.value) && compare(password.value, confirm.value, errorText);
      console.log('valid' ,valid);
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
        headers: {"content-type": "application/json"}
      };

      const authURL = URL + "/chat/reg";
      renderText(errorText, "");
      axios.post(authURL, bodyObject, options
      ).then((response) => {
        console.log(response);
        if (response.status === 200) {
          redirect("index.html");
          return renderError(errorText, "Check email and login!");
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
          "login length must be more then 3 symbols and less 25 symbols. Only latin characters and numeric in it"
        );
      }
      if (!passValid) {
        renderText(errorText, "");
        return renderError(
          errorText,
          "password length must be more then 6 symbols and less 25 symbols. Only latin characters and numberic in it"
        );
      }
    }
  });
};

regInit();
