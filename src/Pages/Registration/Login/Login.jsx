import { useState } from "react";
import login from "../../../assets/Login.svg";
import google from "../../../assets/googleIcon.svg";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { GoogleAuthProvider } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../../State/Slice";
import app from "../../../Authentication/firebaseconfig";

const Login = () => {
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();

  const [emailErr, setemailErr] = useState("");
  const [passwordErr, setpasswordErr] = useState("");

  const [showPassword, setshowPassword] = useState(false);

  const [error, setError] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setemailErr("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setpasswordErr("");
  };

  const handleSubmit = () => {
    if (!email) {
      setemailErr("Email is required");
    } else {
      // eslint-disable-next-line no-useless-escape
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setemailErr("Email is not valid");
      }
    }
    if (!password) {
      setpasswordErr("Password is required");
    } else if (!/(?=.*[a-z])/.test(password)) {
      setpasswordErr("At least 1 lowercase alphabetical character");
    } else if (!/(?=.*[A-Z])/.test(password)) {
      setpasswordErr(" At least 1 uppercase alphabetical character");
    } else if (!/(?=.*[0-9])/.test(password)) {
      setpasswordErr(" At least 1 numeric character");
    } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setpasswordErr("At least one special character");
    } else if (!/(?=.{8,})/.test(password)) {
      setpasswordErr("Must be eight characters or longer");
    }
    if (
      email &&
      password &&
      // eslint-disable-next-line no-useless-escape
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ) {
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          toast.success("Login successfully Done");
          console.log(user);
          dispatch(userLoginInfo(user.user));
          localStorage.setItem(
            "userLoginInfo",
            JSON.stringify(userLoginInfo(user.user))
          );
          setEmail("");
          setPassword("");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          if (errorCode.includes("auth/invalid-login-credentials")) {
            setError("Please Give your right Email & Password");
          }
        });
    }
  };
  const handleGoogle = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        toast.success("Login successfully Done");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
  };

  return (
    <div className="lg:flex">
      <div className="lg:w-1/2 flex justify-center items-center">
        <div>
          <h1 className="text-[33.344px] font-OpenSans font-bold text-[#03014C]">
            Login to your account!
          </h1>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <div
            onClick={handleGoogle}
            className="flex w-fit items-center gap-x-[9.77px] py-[22px] pl-[29.9px] pr-[42.12px] mt-[29.78px] border-2 rounded-lg"
          >
            <img
              className="w-[19px] h-[19px] rounded-[100px]"
              src={google}
              alt="google"
            />
            <h5 className="font-OpenSans text-[14px] font-semibold text-[#03014C]">
              Login with Google
            </h5>
          </div>
          <div className="w-[372.203px] mt-[32px]">
            <p className="text-[13.332px] font-OpenSans font-normal text-[#03014c9d]">
              Email Addres
            </p>
            <input
              onChange={handleEmail}
              className=" w-full py-[26.66px] pr-[66.22px] border-b-2 border-[#8b8b8bd5] outline-none text-[20px] font-OpenSans text-[#03014C] font-semibold placeholder:text-[20px] placeholder:font-semibold placeholder:text-[#03014cb7]"
              type="email"
              value={email}
              placeholder="Give your Email"
            />
            {emailErr && (
              <p className=" py-1 text-[#ED4337] font-Nunito text-[12px] font-semibold">
                {emailErr}
              </p>
            )}
          </div>
          <div className="w-[372.203px] mt-[60.85px] relative">
            <p className="text-[13.332px] font-OpenSans font-normal text-[#03014c9d]">
              Password
            </p>
            <input
              onChange={handlePassword}
              className=" w-full py-[26.66px] pr-[66.22px] border-b-2 border-[#8b8b8bd5] outline-none text-[20px] font-OpenSans text-[#03014C] font-semibold placeholder:text-[20px] placeholder:font-semibold placeholder:text-[#03014cb9]"
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter your Password"
            />
            {showPassword ? (
              <BsFillEyeFill
                onClick={() => setshowPassword(!showPassword)}
                className="absolute top-[50px] right-[18px] text-[22px] font font-semibold text-[#03014C]"
              />
            ) : (
              <BsFillEyeSlashFill
                onClick={() => {
                  setshowPassword(!showPassword);
                }}
                className="absolute top-[50px] right-[18px] text-[22px] font font-semibold text-[#03014C]"
              />
            )}
            {passwordErr && (
              <p className=" py-1 text-[#ED4337] font-Nunito text-[12px] font-semibold">
                {passwordErr}
              </p>
            )}
          </div>
          <p className=" py-1 text-[#ED4337] font-Nunito text-[12px] font-semibold">
            {error}
          </p>
          <button
            onClick={handleSubmit}
            className="py-[26px] px-[122px] bg-[#5F34F5] rounded-lg mt-[55px] text-white font-OpenSans text-[20px] font-semibold hover:bg-transparent hover:text-[#03014C] duration-300 hover:border-2 border-[#8b8b8b]"
            href=""
          >
            Login to Continue
          </button>

          <p className="pt-[26px] px-[134px] font-OpenSans text-base font-semibold cursor-pointer hover:text-[#EA6C00] duration-300">
            <Link to="/ForgetPassword">Forget Password</Link>
          </p>

          <p className="pl-[40px] pt-[34px] text-[13px] font-OpenSans font-normal text-[#03014C]">
            Don’t have an account ?{" "}
            <button className="text-[#EA6C00]" href="">
              <Link to="/registration"> Sign up</Link>
            </button>
          </p>
        </div>
      </div>
      <div className="lg:w-1/2 mt-5 lg:mt-0">
        <picture>
          <img
            className="w-full h-screen object-cover"
            src={login}
            alt="Login"
          />
        </picture>
      </div>
    </div>
  );
};

export default Login;
