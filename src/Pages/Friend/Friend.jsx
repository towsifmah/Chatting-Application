// import Raghav from "../../assets/Raghav.svg";
import { HiDotsVertical } from "react-icons/hi";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ImBlocked } from "react-icons/im";
import { activeChat } from "../../State/Activechatslice";

const Friend = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [friend, setfriend] = useState([]);

  const dispach = useDispatch();
  useEffect(() => {
    const friendrequest = ref(db, "friend/");

    onValue(friendrequest, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        // console.log(item.val().receiverid, item.val().senderid);
        if (
          item.val().receiverid == data.uid ||
          item.val().senderid == data.uid
        ) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setfriend(arr);
    });
  }, []);

  const handleblock = (item) => {
    console.log(item);
    if (data.uid == item.senderid) {
      set(push(ref(db, "block/")), {
        block: item.receiverName,
        blockid: item.receiverid,
        blockby: item.sendername,
        blockbyid: item.senderid,
        blockimg: item.receiverimg,
        blockbyimg: item.senderimg,
      }).then(() => {
        remove(ref(db, "friend/" + item.key));
      });
    } else {
      set(push(ref(db, "block/")), {
        block: item.sendername,
        blockid: item.senderid,
        blockby: item.receiverName,
        blockbyid: item.receiverid,
        blockimg: item.senderimg,
        blockbyimg: item.receiverimg,
      }).then(() => {
        remove(ref(db, "friend/" + item.key));
      });
    }
  };

  const handleChat = (item) => {
    if (item.senderid == data.uid) {
      dispach(activeChat({ id: item.receiverid, name: item.receiverName }));
    } else {
      dispach(activeChat({ id: item.senderid, name: item.sendername }));
    }
  };

  return (
    <div>
      <div className="shadow-md rounded-xl pb-[85px] px-[15px] mt-[43px] overflow-hidden overflow-y-scroll h-[420px]">
        <div className="flex justify-between items-center fixed">
          <h1 className="text-[20px] font-semibold text-black font-Poppins mr-[200px]">
            Friends{" "}
          </h1>
          <HiDotsVertical className="text-[20px] text-[#5F35F5]" />
        </div>
        {
        friend.length == 0
        ?
        <div className="flex justify-center mt-[150px]">
            <h1 className="font-Poppins text-[25px] font-bold text-[#5F35F5]">
              Friend is BLANK
            </h1>
          </div>
        :
        friend.map((item) => (
          // eslint-disable-next-line react/jsx-key
          <div
            onClick={() => handleChat(item)}
            className="flex items-center mt-[25px] border-b-2 border-b-[#b1afaf] pb-[10px]"
          >
            <img
              className="w-[52.182px] h-[54.092px] rounded-full"
              src={`${
                data.uid == item.senderid ? item.receiverimg : item.senderimg
              }`}
              alt=""
            />
            <div className="ml-[14px]">
              <h4 className="text-[14px] font-Poppins font-semibold leading-[1]">
                {item.receiverid == data.uid
                  ? item.sendername
                  : item.receiverName}
              </h4>
            </div>
            <ImBlocked
              onClick={() => handleblock(item)}
              className="py-[5px] rounded bg-[#5F35F5] text-[30px] ml-[60px] text-white"
            />
          </div>
        ))
        
        }
      </div>
    </div>
  );
};

export default Friend;
