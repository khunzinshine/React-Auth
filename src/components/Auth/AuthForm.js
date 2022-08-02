import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/authContext";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBrwIb5B11iL-nVclB-0ctdCEXfgfZTBbM";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBrwIb5B11iL-nVclB-0ctdCEXfgfZTBbM";
    }
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          console.log(res);
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMsg = "Authentication Failed!";
            if (data?.error?.message) {
              errorMsg = data.error.message;
            }
            alert(errorMsg);
          });
        }
      })
      .then((data) => {
        const remainTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        authContext.login(data.idToken, remainTime.toISOString());
        history.replace("/");
        // console.log(authContext.login(data.idToken));
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
      <section className={classes.auth}>
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={handleSubmit}>
          <div className={classes.control}>
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              required
              ref={emailRef}
              placeholder="reactauth@gmail.com"
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Your Password</label>
            <input
              type="password"
              id="password"
              required
              ref={passwordRef}
              placeholder="reactauth"
            />
          </div>
          <div className={classes.actions}>
            {!isLoading ? (
              <button>{isLogin ? "Login" : "Create Account"}</button>
            ) : (
              <p>Loading...</p>
            )}
            <button
              type="button"
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? "Create new account" : "Login with existing account"}
            </button>
          </div>
        </form>
      </section>
  );
};

export default AuthForm;
