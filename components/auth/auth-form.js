import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "../UI/Loading";
import Button from "../UI/Button";
import classes from "./auth-form.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fragment } from "react";
import Footer from "../Global/Footer";
import Link from "next/link";

function AuthForm() {
  const [toggleForms, setToggleForms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  async function createUser(email, password, enteredName) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, enteredName }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message, { theme: "colored" });
      setIsLoading(false);
    } else {
      toast.success(data.message, { theme: "colored" });
    }

    return data;
  }

  const toggleForm = () => {
    setToggleForms((prev) => !prev);
  };
  const loginEmailInputRef = useRef();
  const loginPasswordInputRef = useRef();

  const registerEmailInputRef = useRef();
  const registerPasswordInputRef = useRef();
  const registerNameInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();
    setIsLoading(true);

    const enteredEmail = loginEmailInputRef.current.value;
    const enteredPassword = loginPasswordInputRef.current.value;

    // optional: Add validation

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });

      if (!result.error) {
        router.replace("/dashboard");
        toast.success("Success!", { theme: "colored" });
        setIsLoading(false);
      }
      if (result.error) {
        toast.error(result.error, { theme: "colored" });
        setIsLoading(false);
      }
    }
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    if (newPassword.length < 7) {
      setPasswordError("Password should be at least 7 characters long");
    } else {
      setPasswordError("");
    }
  };
  async function submitHandlerRegister(event) {
    setIsLoading(true);
    event.preventDefault();

    const enteredEmail = registerEmailInputRef.current.value;
    const enteredPassword = registerPasswordInputRef.current.value;
    const enteredName = registerNameInputRef.current.value;
    // optional: Add validation

    const result = await createUser(enteredEmail, enteredPassword, enteredName);
    setIsLoading(false);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Fragment>
      <ToastContainer autoClose={1500} draggable closeOnClick />
      <div className={classes.col1}>
        <div className={classes.formbox}>
          <div className={classes.form}>
            {!toggleForms && (
              <form className={classes.loginform} onSubmit={submitHandler}>
                <center>
                  <h1 className={classes.mainheading}>Login Form</h1>
                </center>
                <input
                  type="email"
                  placeholder="email-id"
                  ref={loginEmailInputRef}
                  required
                />
                <input
                  type="password"
                  placeholder="password"
                  ref={loginPasswordInputRef}
                  required
                />
                <div class="text-right pb-4">
                  <Link href="/forget-password" class="text-white text-lg hover:text-gray-300">
                    Forgot password ?
                  </Link>
                </div>
                <Button
                  content="LOGIN"
                  onClick={switchAuthModeHandler}
                ></Button>

                <p className={classes.message}>
                  Not Registered&nbsp;?&nbsp;
                  <a onClick={toggleForm} className={classes.link}>
                    Register
                  </a>
                </p>
              </form>
            )}
            {toggleForms && (
              <form
                className={classes.registerform}
                onSubmit={submitHandlerRegister}
              >
                <center>
                  <h1 className={classes.mainheading}>Register Form</h1>
                </center>
                <input
                  type="text"
                  placeholder="user name"
                  ref={registerNameInputRef}
                  required
                />
                <input
                  type="email"
                  placeholder="email-id"
                  ref={registerEmailInputRef}
                  required
                />
                <input
                  type="password"
                  placeholder="password"
                  ref={registerPasswordInputRef}
                  onChange={handlePasswordChange}
                  required
                />
                {passwordError && (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#f4f4f4",
                      marginBottom: "5px",
                      textDecoration: "underline",
                    }}
                  >
                    {passwordError}
                  </div>
                )}
                <Button
                  content="REGISTER"
                  onClick={switchAuthModeHandler}
                ></Button>

                <p className={classes.message}>
                  Already Registered&nbsp;?&nbsp;
                  <a onClick={toggleForm} className={classes.link}>
                    Login
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}

export default AuthForm;
