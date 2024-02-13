import { createRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
  uploadBytes,
} from "firebase/storage";
import preview from "../../assets/preview.png";
import { userLoginInfo } from "../../State/Slice";
import {
  getDatabase,
  update,
  ref as mref,
  set,
  push,
  onValue,
} from "firebase/database";
import GroupList from "../GroupList/GroupList";
import Friend from "../Friend/Friend";
import Sidebar from "../Sidebar/Sidebar";
import ChatUser from "../../assets/ChatUser.svg";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";
import { BsEmojiLaughing } from "react-icons/bs";
import { MdOutlinePhotoCamera } from "react-icons/md";
import moment from "moment";
import ModalImage from "react-modal-image";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const auth = getAuth();
  const db = getDatabase();
  const dispatch = useDispatch();
  const ndata = useSelector((state) => state.userLoginInfo.userInfo);
  console.log(ndata, "data");
  const navigate = useNavigate();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const storage = getStorage();

  const activechat = useSelector((state) => state.activechatInfo.active);
  console.log(activechat);
  const [image, setImage] = useState();
  // eslint-disable-next-line no-unused-vars
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();

  const [verify, setVerify] = useState(false);

  const [mahmud, setmahmud] = useState(false);
  const [msg, setmsg] = useState("");
  const [singleMsg, setsingleMsg] = useState([]);

  const [showEmoji, setshowEmoji] = useState(false);

  const handleCancelPopup = () => {
    setmahmud(false);
  };

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

  const handlecroopImage = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    console.log("sdfhsdfoi");
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const storageRef = ref(storage, auth.currentUser.uid);

      const message4 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, message4, "data_url").then(() => {
        console.log("Uploaded a data_url string!");
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            update(mref(db, "users/" + data.uid), {
              img: downloadURL,
            });
            setmahmud(false);
            setImage("");
            setCropData("");
          });
        });
      });
    }
  };

  const handlemsg = (e) => {
    setmsg(e.target.value);
  };

  const handlesendMsg = () => {
    setmsg("");
    set(push(mref(db, "singleMsg/")), {
      sendmsgid: data.uid,
      sendmsgname: data.displayName,
      receivermsgid: activechat.id,
      receivermasname: activechat.name,
      msg: msg,
      date: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()},${new Date().getHours()}:${new Date().getMinutes()}`,
    });
  };

  useEffect(() => {
    const singlemsgRef = mref(db, "singleMsg/");
    onValue(singlemsgRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().sendmsgid == data.uid &&
            item.val().receivermsgid == activechat.id) ||
          (item.val().receivermsgid == data.uid &&
            item.val().sendmsgid == activechat.id)
        ) {
          arr.push(item.val());
        }
      });
      setsingleMsg(arr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleimgChange = (e) => {
    console.log(e.target.files);
    const storageRef = ref(storage, "some-child");
    // eslint-disable-next-line no-unused-vars
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        console.log("File available at", downloadURL);
        set(push(mref(db, "singleMsg/")), {
          sendmsgid: data.uid,
          sendmsgname: data.displayName,
          receivermsgid: activechat.id,
          receivermasname: activechat.name,
          img: downloadURL,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()},${new Date().getHours()}:${new Date().getMinutes()}`,
        });
      });
    });
  };

  const handleEmoji = (item) =>{
    console.log('emoji', item.emoji);
    setmsg(msg + item.emoji)
  }

  return (
    <>
      <div>
        {verify ? (
          <div className=" flex justify-center h-screen">
            <Sidebar active="Chat" />
            <div className="flex justify-center gap-x-[22px]">
              <div className="w-[380px]">
                <GroupList />
                <Friend />
              </div>
            </div>
            <div className="relative">
              <div className="w-[780px] h-[885px] overflow-y-scroll mt-[43px] ml-[12px] rounded-xl shadow-lg bg-white ">
                <div className="w-[757px] flex justify-between items-center bg-white fixed z-30  py-[10px] border-b-[2px] border-b-gray-500">
                  <div className="flex items-center">
                    <img src={ChatUser} alt="" />
                    <div className="ml-[15px]">
                      <h3 className="font-Poppins text-[24px] font-semibold  text-black">
                        {activechat.name}
                      </h3>
                      <p className="font-Poppins font-normal text-black/75">
                        Online
                      </p>
                    </div>
                  </div>
                  <BsThreeDotsVertical className="mr-[30px] text-[25px] text-[#5F35F5]" />
                </div>

                {singleMsg.map((item) =>
                  item.sendmsgid == data.uid ? (
                    item.img ? (
                      <div className="ml-[20px]  my-[130px]">
                        <div className="inline-block bg-[#5F35F5] py-[8px] px-[8px] rounded-lg ">
                          <div className="w-[150px] h-[200px] object-cover">
                            <ModalImage small={item.img} large={item.img} />
                          </div>
                        </div>
                        <p className="font-Poppins text-[15px] font-medium mt-[5px] text-[#525151]">
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    ) : (
                      // eslint-disable-next-line react/jsx-key
                      <div className="ml-[20px]  my-[130px]">
                        <div className="inline-block bg-[#5F35F5] h-[70px] pl-[30px] w-[235px] rounded-lg relative">
                          <p className="mt-[10px] font-Poppins text-[20px] text-white font-medium">
                            {item.msg}
                          </p>
                          <FaPlay className="rotate-[150deg] absolute top-[54px] left-[-12px] text-[#5F35F5] text-[21px] overflow-hidden" />
                        </div>
                        <p className="font-Poppins text-[15px] font-medium mt-[5px] text-[#525151]">
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    )
                  ) : item.img ? (
                    <div className="mr-[20px] text-right  my-[130px]">
                      <div className="inline-block bg-[#F1F1F1] py-[8px] px-[8px] rounded-lg ">
                        <div className="w-[150px] h-[200px] object-cover">
                          <ModalImage small={item.img} large={item.img} />
                        </div>
                      </div>
                      <p className="font-Poppins text-[15px] font-medium mt-[5px] text-[#525151]">
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}{" "}
                      </p>
                    </div>
                  ) : (
                    // eslint-disable-next-line react/jsx-key
                    <div className="mr-[20px] text-right my-[130px] ">
                      <div className="inline-block bg-[#F1F1F1] h-[70px] pr-[30px] w-[235px] rounded-lg relative">
                        <p className="mt-[20px] font-Poppins text-[20px] text-black font-medium">
                          {item.msg}
                        </p>
                        <FaPlay className="rotate-[150deg] absolute top-[54px] right-[-8px] text-[#F1F1F1] text-[21px] overflow-hidden" />
                      </div>
                      <p className="font-Poppins text-[15px] font-medium mt-[5px] text-[#525151]">
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </p>
                    </div>
                  )
                )}

                <div className="absolute top-[805px] z-30">
                  <div className=" relative w-[755px] flex items-center pb-[18px] bg-white pl-[26px] pr-[40px] justify-center border-t-[2px] pt-[40px]">
                    <input
                      onChange={handlemsg}
                      value={msg}
                      className="h-[65px] w-[596px] pl-[20px] bg-[#F1F1F1] font-Poppins text-[18px] text-black inline-block rounded-lg outline-none placeholder:font-Poppins placeholder:text-[15px] placeholder:text-[#5f35f58c]"
                      type="text"
                      placeholder="Message"
                    />
                    <div className="flex gap-[13px] absolute top-[58px] right-[130px] items-center">
                      <BsEmojiLaughing onClick={() =>setshowEmoji(!showEmoji)} className="text-[20px] text-gray-500" />
                      {showEmoji && (
                        <div className="absolute top-[-475px] right-0">
                          <EmojiPicker onEmojiClick ={(item) =>handleEmoji(item)} />
                        </div>
                      )}
                      <label>
                        <input
                          onChange={handleimgChange}
                          type="file"
                          className="hidden"
                        />
                        <MdOutlinePhotoCamera className="text-[22px] text-gray-500" />
                      </label>
                    </div>
                    <button
                      onClick={handlesendMsg}
                      className="py-[13px] px-[13px] bg-[#5F35F5] inline-block rounded-xl ml-[18px]"
                    >
                      <FaPaperPlane className="text-[25px] text-white" />
                    </button>
                  </div>
                </div>
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

      {mahmud && (
        <div className="h-[60vh] w-[400px] bg-white absolute top-[160px] left-[334px] rounded-xl drop-shadow-2xl ">
          <div className=" p-[20px]">
            <h1 className="text-[25px] font-Poppins font-bold ">
              Profile Image Upload
            </h1>
            <input
              className="font-Poppins text-[14px] font-medium mb-1 "
              type="file"
              onChange={handlecroopImage}
            />
            {image && (
              <Cropper
                ref={cropperRef}
                style={{ height: 250, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                guides={true}
              />
            )}
            {image ? (
              <div className="h-[120px] w-[120px] rounded-lg mt-1 overflow-hidden">
                <div className="img-preview w-full h-full"></div>
              </div>
            ) : (
              <img
                className="h-[120px] w-[120px] rounded-lg"
                src={preview}
                alt=""
              />
            )}
            <div className=" mt-[30px] text-white ">
              <button
                onClick={getCropData}
                className=" py-[5px] px-[15px] bg-[#5F35F5] hover:bg-[#5f35f5da] duration-300 rounded font-Poppins text-[20px] font-semibold mr-[20px]"
              >
                Upload
              </button>
              <button
                onClick={handleCancelPopup}
                className=" py-[5px] px-[15px] bg-red-700 hover:bg-red-500 duration-300 rounded font-Poppins text-[20px] font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;

//neya sira mit
