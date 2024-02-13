import { getAuth, signOut, updateProfile } from "firebase/auth";
import { BsFillChatDotsFill } from "react-icons/bs";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { LiaHomeSolid } from "react-icons/lia";
import { LuSettings } from "react-icons/lu";
import { Link, Navigate } from "react-router-dom";
import { userLoginInfo } from "../../State/Slice";
import { createRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import back from "../../assets/back.svg";
import { update, ref as draf, getDatabase } from "firebase/database";
import Cropper from "react-cropper";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import preview from "../../assets/preview.png";
import "cropperjs/dist/cropper.css";

// eslint-disable-next-line react/prop-types
const Sidebar = ({active}) => { 
  const auth = getAuth();
  const dispatch = useDispatch();
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const ndata = useSelector((state) => state.userLoginInfo.userInfo);
  // eslint-disable-next-line no-unused-vars
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();
  const storage = getStorage();

  const [image, setImage] = useState();

  const [mahmud, setmahmud] = useState(false);
  const ProfileUpdate = () => {
    setmahmud(true);
  };
  const handleCancelPopup = () => {
    setmahmud(false);
  };
  const handlesingout = () => {
    signOut(auth)
      .then(() => {
        Navigate("/Login");
        dispatch(userLoginInfo(null));
        localStorage.removeItem("userLoginInfo");
      })
      .catch(() => {
        // An error happened.
      });
  };
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
            update(draf(db, "users/" + data.uid), {
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
  return (
    <div>
      <div className="  bg-[#5F35F5] w-[186px] h-screen ml-[32px] mx-[35px] rounded-xl items-center">
        <div
          onClick={ProfileUpdate}
          className="group pt-[38px] mb-[100px] h-[120px] w-[120px] cursor-pointer"
        >
          <img
            className="h-[120px] w-[120px] ml-[43px] rounded-full bg-white"
            src={ndata.photoURL}
            alt=""
          />
          <div className="group-hover:bg-overlay duration-300 h-[120px] w-[120px] rounded-full translate-y-[-120px] translate-x-[43px]"></div>
          <FaCloudUploadAlt className="translate-y-[-195px] translate-x-[88px] text-white text-[35px] opacity-0 group-hover:opacity-100 duration-300" />
        </div>
        <div className="text-[20px] font-bold font-Poppins text-white text-center mt-[-35px] mb-[30px]">
          {ndata.displayName}
        </div>
        
            <Link to="/">
          <div className={`${active == 'Home' ? 'bg-white' : 'bg-[#5F35F5]'} ml-[30px] pl-[44px] pr-[70px] pt-[15px] pb-[20px] rounded-l-2xl relative`}>
            <div className={`absolute ${active == 'Home' ? 'bg-[#5f35f585]' : ''} w-3 h-full hover:w-full duration-300 rounded-l-md  top-0 right-0`}></div>
            <LiaHomeSolid className={`text-[40px] ${active == 'Home' ? 'text-[#5F35F5]' : 'text-[#BAD1FF]'} text-[#5F35F5]`} />
          </div>
           </Link>         
          <Link to="/chat">
        <div className={`${active == 'Chat' ? 'bg-white' : 'bg-[#5F35F5]'} ml-[30px] pl-[44px] pr-[70px] pt-[15px] pb-[20px] rounded-l-2xl relative`}>
        <div className={`absolute ${active == 'Chat' ? 'bg-[#5f35f585]' : ''} w-3 h-full hover:w-full duration-300 rounded-l-md  top-0 right-0`}></div>
            <BsFillChatDotsFill className={`text-[40px] ${active == 'Chat' ? 'text-[#5F35F5]' : 'text-[#BAD1FF]'} text-[#5F35F5]`} />
        </div>
          </Link>
        <div className="mt-[58px] ml-[30px] pl-[44px] pr-[70px] pt-[20px] pb-[25px] rounded-l-md">
          <IoMdNotificationsOutline className="text-[40px] text-[#BAD1FF]" />
        </div>
        <div className="mt-[58px] ml-[30px] pl-[44px] pr-[70px] pt-[20px] pb-[25px] rounded-l-md">
          <LuSettings className="text-[40px] text-[#BAD1FF]" />
        </div>
        <div
          onClick={handlesingout}
          className="mt-[72px] ml-[30px] pl-[44px] pr-[70px] pt-[20px] pb-[25px] rounded-l-md cursor-pointer"
        >
          <img className="w-[40px]" src={back} alt="" />
        </div>
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
    </div>
  );
};

export default Sidebar;
