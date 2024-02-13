import { useState } from "react";
import { Link } from "react-router-dom";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const ForgetPassword = () => {
    const auth = getAuth();
  const [email, setEmail] = useState("");


  const [emailErr , setemailErr] = useState("");



  const emailChange = (e) =>{
       setEmail(e.target.value);
       setemailErr("");
  }

  const submitPassword = () =>{
    if(!email){
        setemailErr("Email is required")
    }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        setemailErr("Email is not valid");
    }
    if(email){
        sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log('send');
            setEmail("")
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
        });  
    }
  }


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-slate-200 h-[300px] w-[25vw] rounded-lg relative">
        <h1 className="py-[10px] border-b-2 border-b-[#8b8b8b] text-[35px] font-OpenSans font-bold text-[#11175D] flex justify-center">
          Forget Password
        </h1>
        <div className="my-[20px] flex justify-center ">
          <div>
            <p className=" bg-slate-200 text-center max-w-[136.744px] px-[10px] ml-[30.46px] translate-y-3 font-Nunito text-[13.76px] font-semibold text-[#242b79da] ">
            Email address
            </p>
            <input
            onChange={emailChange}
            value={email}
              className="py-[20.66px] pl-[20.46px] bg-slate-200 pr-[66.22px] w-[18vw] outline-none border-2 border-[#8b8b8b] rounded-md placeholder:text-[#323770b0] placeholder:font-OpenSans"
              type="email"
              placeholder="Give your Email"
            />
           {
            emailErr &&
            <p className=" py-1 text-[#ED4337] font-Nunito text-[12px] font-semibold absolute">{emailErr}</p>
           }
          </div>
        </div>
        <div className="gap-x-[10px] flex justify-center mt-[30px]">
          <button onClick={submitPassword} className="py-[12px] px-[30px] bg-[#5F35F5] hover:bg-transparent duration-300 hover:border-2 border-[#8b8b8b] hover:text-[#242b79da] text-white rounded-md font-OpenSans font-semibold text-base">
            <Link>Reset</Link>
          </button>
          <button className="py-[12px] px-[30px] bg-[#5F35F5] text-white rounded-md font-OpenSans font-semibold text-base hover:bg-transparent duration-300 hover:border-2 border-[#8b8b8b] hover:text-[#242b79da]">
            <Link to="/Login">Back to Login</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
