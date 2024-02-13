import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import GroupList from "../../GroupList/GroupList";
import FriendRequest from "../../FriendRequest/FriendRequest";
import Friend from "../../Friend/Friend";
import MyGroup from "../../MyGroup/MyGroup";
import UserList from "../../UserList/UserList";
import BlockedUser from "../../BlockedUser/BlockedUser";
import "cropperjs/dist/cropper.css";
import { userLoginInfo } from "../../../State/Slice";
import { getDatabase } from "firebase/database";
import Sidebar from "../../Sidebar/Sidebar";

const Home = () => {
  const auth = getAuth();
  // eslint-disable-next-line no-unused-vars
  const db = getDatabase();
  const dispatch = useDispatch();
  const ndata = useSelector((state) => state.userLoginInfo.userInfo);
  console.log(ndata, "data");
  const navigate = useNavigate();
  const data = useSelector((state) => state.userLoginInfo.userInfo);

  // eslint-disable-next-line no-unused-vars

  const [verify, setVerify] = useState(false);

  useEffect(() => {
    if (!data) {
      navigate("/Login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user.emailVerified) {
        setVerify(true);
      }
      dispatch(userLoginInfo(user));
      localStorage.setItem(
        "userLoginInfo",
        JSON.stringify(userLoginInfo(user))
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        {verify ? (
          <div className=" flex justify-center h-screen">
            <Sidebar active="Home" />
            <div className="flex justify-center gap-x-[22px]">
              <div className="w-[380px]">
                <GroupList />
                <FriendRequest />
              </div>
              <div className="w-[320px]">
                <Friend />
                <MyGroup />
              </div>
              <div className="w-[320px]">
                <UserList />
                <BlockedUser />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-screen bg-[#5F35F5] flex justify-center items-center">
            <div className="text-center">
              <h1 className="text-white font-Poppins font-bold text-[45px]">
                Please verify your Email
              </h1>
              <button className="py-[15px] px-[90px] font-Poppins text-[35px] font-semibold bg-white hover:bg-[#e0dede] duration-300 text-[#5F35F5] rounded-lg mt-[25px]">
                <Link to="/Login">Back to Login </Link>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
