import { useState } from "react";
import registrationimage from "../../assets/registrationImage.svg";
import { BsFillEyeSlashFill, BsFillEyeFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {
  const db = getDatabase();

  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [emailErr, setemailErr] = useState("");
  const [nameErr, setnameErr] = useState("");
  const [passwordErr, setpasswordErr] = useState("");

  const [showPassword, setshowPassword] = useState(false);

  const handelEmail = (e) => {
    setEmail(e.target.value);
    setemailErr("");
  };
  const handleFullname = (e) => {
    setName(e.target.value);
    setnameErr("");
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
    if (!name) {
      setnameErr("give your full Name");
    }
    if (!password) {
      setpasswordErr("password is required");
    }
    //  else if (!/(?=.*[a-z])/.test(password)) {
    //   setpasswordErr(" At least 1 lowercase alphabetical character");
    // } else if (!/(?=.*[A-Z])/.test(password)) {
    //   setpasswordErr(" At least 1 uppercase alphabetical character");
    // } else if (!/(?=.*[0-9])/.test(password)) {
    //   setpasswordErr(" At least 1 numeric character");
    // } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
    //   setpasswordErr("At least one special character");
    // } else if (!/(?=.{8,})/.test(password)) {
    //   setpasswordErr("Must be eight characters or longer");
    // }

    if (
      email &&
      name &&
      password &&
      // eslint-disable-next-line no-useless-escape
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: "src/assets/Profile.svg",
          })
            .then(() => {
              console.log(user, "data");
              sendEmailVerification(auth.currentUser);
              toast.success("registration Done,Please verify your email");
              setEmail("");
              setName("");
              setPassword("");
              setTimeout(() => {
                navigate("/login");
              }, 5000);
            })
            .then(() => {
              set(ref(db, "users/" + user.user.uid), {
                username: user.user.displayName,
                email: user.user.email,
              });
            });
        })

        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);

          if (errorCode.includes("auth/email-already-in-use")) {
            setemailErr("Email is already used");
          }
        });
    }
  };

  return (
    <div className="lg:flex">
      <div className="lg:w-1/2 flex lg:justify-end justify-center items-center lg:ml-[30px]">
        <div className="lg:pr-[69px]">
          <h1 className="text-[34.401px] font-Nunito font-bold text-[#11175D]">
            Get started with easily register
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

          <p className="text-[20.641px] font-Nunito font-normal text-[#808080]">
            Free register and you can enjoy it
          </p>
          <div className="mt-[61.5px] w-[368.092px]">
            <p className="bg-white text-center max-w-[136.744px] pl-[18.2px] pr-[14.55px] ml-[52.46px] translate-y-3 font-Nunito text-[13.76px] font-semibold text-[#242b79da]">
              Email Address
            </p>
            <input
              onChange={handelEmail}
              value={email}
              className="w-full h-[81.703px] py-[26.66px] pl-[52.46px] pr-[66.22px] rounded-[8.6px] outline-none border-2 border-[#8b8b8b] placeholder:text-[#323770b0] placeholder:font-Nunito"
              type="email"
              placeholder="Give your Email Address"
            />
            {emailErr && (
              <p className=" py-1 text-[#ED4337] font-Nunito text-[12px] font-semibold ">
                {emailErr}
              </p>
            )}
          </div>
          <div className="mt-[56.5px] w-[368.092px]">
            <p className="bg-white text-center max-w-[136.744px] pl-[18.2px] pr-[14.55px] ml-[52.46px] translate-y-3 font-Nunito text-[13.76px] font-semibold text-[#242b79da]">
              Full Name
            </p>
            <input
              onChange={handleFullname}
              value={name}
              className=" w-full h-[81.703px] py-[26.66px] pl-[52.46px] pr-[66.22px] rounded-[8.6px] outline-none border-2 border-[#8b8b8b] placeholder:text-[#323770b0] placeholder:font-Nunito"
              type="text"
              placeholder="Give Your Name"
            />
            {nameErr && (
              <p className=" py-1 text-[#ED4337] font-Nunito text-[12px] font-semibold ">
                {nameErr}
              </p>
            )}
          </div>
          <div className="mt-[56.5px] w-[368.092px] relative">
            <p className="bg-white text-center max-w-[136.744px] pl-[18.2px] pr-[14.55px] ml-[52.46px] translate-y-3 font-Nunito text-[13.76px] font-semibold text-[#242b79da]">
              Password
            </p>
            <input
              onChange={handlePassword}
              value={password}
              className="w-full h-[81.703px] py-[26.66px] pl-[52.46px] pr-[66.22px] rounded-[8.6px] outline-none border-2 border-[#8b8b8b] placeholder:text-[#323770b0] placeholder:font-Nunito"
              type={showPassword ? "text" : "password"}
              placeholder="Give your Password"
            />
            {showPassword ? (
              <BsFillEyeFill
                onClick={() => setshowPassword(!showPassword)}
                className="absolute top-[50px] right-[18px] text-[22px] text-[#03014C]"
              />
            ) : (
              <BsFillEyeSlashFill
                onClick={() => setshowPassword(!showPassword)}
                className="absolute top-[50px] right-[18px] text-[22px] text-[#03014C]"
              />
            )}
            {passwordErr && (
              <p className=" py-1 text-[#ED4337] font-Nunito text-[12px] font-semibold ">
                {passwordErr}
              </p>
            )}
          </div>
          <div className="pt-[51px]">
            <button
              onClick={handleSubmit}
              className="pl-[158px] pr-[132px] bg-[#5F35F5] py-[20px] rounded-[100px] text-white font-Nunito text-[20px] font-semibold hover:bg-transparent hover:text-[#000000] duration-300 hover:border-2 hover:border-[#707070]"
              href=""
            >
              Sign up
            </button>
          </div>
          <div className="pt-[51px] font-Nunito text-[13px] font-normal">
            <p className="pl-[70px]">
              Already have an account ?{" "}
              <a href="" className="text-[#EA6C00]">
                <Link to="/login"> Sign In</Link>
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2">
        <img
          className="w-full h-screen object-cover"
          src={registrationimage}
          alt="registrationImage"
        />
      </div>
    </div>
  );
};

export default Registration;
