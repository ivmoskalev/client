import { Link, useNavigate } from "react-router-dom";

import ErrorPasswordLength from "../forms/ErrorPasswordLength";
import ErrorRequiredMessage from "../forms/ErrorRequiredMessage";
import Input from "../forms/Input";
import axios from "axios";
import { useState } from "react";

function SignInForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState({
    value: "",
    isTouched: false,
  });
  const [password, setPassword] = useState({
    value: "",
    isTouched: false,
  });
  const [error, setError] = useState(false);

  function ErrorLogin() {
    return <p className="fieldError">The login or password is incorrect</p>;
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email.value);
  }

  const getIsFormValid = () => {
    return isValidEmail(email) && password.value.length >= 8;
  };

  const clearForm = () => {
    setEmail({ value: "", isTouched: false });
    setPassword({ value: "", isTouched: false });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: email.value,
      password: password.value,
    };
    await axios
      .post("https://deliveryapp-sever.herokuapp.com/auth/login", userData)
      .then((response) => {
        console.log(response.status, response.data);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem('userId', response.data.user._id);
        localStorage.setItem("userName", response.data.user.name);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("userEmail", response.data.user.email);
        clearForm();
        if (localStorage.getItem("role") === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/user", { replace: true });
        }
      })
      .catch((err) => {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("userName");
        if (err.response) {
          setError(true);
          console.log(err.response);
          console.log("Server responded");
        } else if (err.request) {
          console.log("network error");
        } else {
          console.log(err);
        }
      });
  };

  return (
    <section>
      <form className="row g-2" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="Email"
          value={email}
          onChange={(e) => {
            setEmail({ ...email, value: e.target.value });
          }}
          onBlur={() => {
            setEmail({ ...email, isTouched: true });
          }}
        />
        <ErrorRequiredMessage label="Email" value={email} />

        <Input
          label="Password"
          type="password"
          name="Password"
          value={password.value}
          aria-describedby="passwordHelpInline"
          onChange={(e) => {
            setPassword({ ...password, value: e.target.value });
          }}
          onBlur={() => {
            setPassword({ ...password, isTouched: true });
          }}
        />
        <div className="col-md-12">
          <span id="passwordHelpInline" className="form-text">
            Must be at least 8 characters long.
          </span>
        </div>
        <ErrorPasswordLength password={password} />
        {error ? <ErrorLogin /> : null}
        <button
          type="submit"
          disabled={!getIsFormValid()}
          className=" col-md-12 mt-4 btn btn-success"
        >
          Log In
        </button>

        <div className="col-md-12">
          <p className="text-muted">
            Don't have an account?{" "}
            <Link className="text-dark" to="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
export default SignInForm;
