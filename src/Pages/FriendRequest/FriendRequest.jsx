import { HiDotsVertical } from "react-icons/hi";
// import Raghav from "../../assets/Raghav.svg";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const FriendRequest = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [friendrequest, setfriendRequest] = useState([]);

  useEffect(() => {
    const friendrequest = ref(db, "friendrequest/");

    onValue(friendrequest, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().receiverid == data.uid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setfriendRequest(arr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = (item) => {
    set(push(ref(db, "friend/")), {
      ...item,
    }).then(() => {
      remove(ref(db, "friendrequest/" + item.key));
    });
  };

  return (
    <div>
      <div className="rounded-xl pb-[20px] px-[15px] mt-[43px] overflow-hidden overflow-y-scroll h-[420px]">
        <div className="flex justify-between items-center">
          <h1 className="text-[20px] font-semibold text-black font-Poppins">
            Friend Request{" "}
          </h1>
          <HiDotsVertical className="text-[20px] text-[#5F35F5]" />
        </div>

        {friendrequest.length == 0 ? (
          <div className="flex justify-center mt-[150px]">
            <h1 className="font-Poppins text-[25px] font-bold text-[#5F35F5]">
              Friendrequest is BLANK
            </h1>
          </div>
        ) : (
          friendrequest.map((item) => (
            // eslint-disable-next-line react/jsx-key
            <div className="flex items-center mt-[25px] border-b-2 border-b-[#b1afaf] pb-[10px]">
              <img
                className="w-[52.182px] h-[54.092px] rounded-full"
                src={item.senderimg}
                alt=""
              />
              <div className="ml-[14px]">
                <h4 className="text-[14px] font-Poppins font-semibold leading-[1]">
                  {item.sendername}
                </h4>
                <p className="text-[12px] font-Poppins font-medium text-[#4D4D4DBF]">
                  Dinner?
                </p>
              </div>
              <button
                onClick={() => handleAccept(item)}
                className="px-[7px] bg-[#5F35f5] text-white font-Poppins font-semibold text-[20px] rounded-md ml-[104px]"
              >
                Accept
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequest;
