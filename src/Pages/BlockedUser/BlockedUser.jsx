// import Raghav from "../../assets/Raghav.svg";
// import Swathi from "../../assets/Swathi.svg";
// import Kiran from "../../assets/Kiran.svg";
// import TejeshwiniC from "../../assets/TejeshwiniC.svg";
// import MarvinMcKinney from "../../assets/MarvinMcKinney.svg";
import { HiDotsVertical } from "react-icons/hi";
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

const BlockedUser = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [blockData, setBlockData] = useState([]);

  //   useEffect(() =>{
  //     const blockref = ref(db, 'block/');
  // onValue(blockref, (snapshot) => {
  //   let arr = [];
  //   snapshot.forEach((item) =>{
  //     if(item.val().blockbyid == data.uid){
  //       arr.push({
  //         key : item.key,
  //         block : item.val().block,
  //         blockid : item.val().blockid,
  //       });
  //     } else{
  //       arr.push({
  //         key: item.key,
  //         blockby : item.val().blockby,
  //         blockbyid : item.val().blockbyid
  //       })
  //     }
  //     })
  //     setBlockData(arr)
  //   })
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[]);

  useEffect(() => {
    const blockref = ref(db, "block/");
    onValue(blockref, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          item.val().blockbyid == data.uid ||
          item.val().blockid == data.uid
        ) {
          arr.push({
            ...item.val(),
            key: item.key,
          });
        }
      });
      setBlockData(arr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnblock = (item) => {
    set(push(ref(db, "friend/")), {
      sendername: item.block,
      senderid: item.blockid,
      receiverName: item.blockby,
      receiverid: item.blockbyid,
      senderimg: item.blockimg,
      receiverimg: item.blockbyimg,
    }).then(() => {
      remove(ref(db, "block/" + item.key));
    });
  };

  return (
    <div>
      <div className="shadow-md rounded-xl pb-[20px] px-[15px] mt-[43px] overflow-hidden overflow-y-scroll h-[420px]">
        <div className="flex justify-between items-center">
          <h1 className="text-[20px] font-semibold text-black font-Poppins">
            Blocked Users{" "}
          </h1>
          <HiDotsVertical className="text-[20px] text-[#5F35F5]" />
        </div>

        {blockData.length == 0 ? (
          <div className="flex justify-center mt-[150px]">
            <h1 className="font-Poppins text-[25px] font-bold text-[#5F35F5]">
              Blockuser is BLANK
            </h1>
          </div>
        ) : (
          blockData.map((item) => (
            // eslint-disable-next-line react/jsx-key
            <div className="flex items-center mt-[25px] border-b-2 border-b-[#b1afaf] pb-[10px]">
              <img
                className="w-[52.182px] h-[54.092px] rounded-full"
                src={`${
                  data.uid == item.blockid ? item.blockbyimg : item.blockimg
                }`}
                alt=""
              />
              <div className="ml-[14px]">
                <h4 className="text-[14px] font-Poppins font-semibold leading-[1]">
                  {`${data.uid == item.blockid ? item.blockby : item.block}`}
                </h4>
              </div>
              {item.blockbyid == data.uid ? (
                <button
                  onClick={() => handleUnblock(item)}
                  className="px-[7px] bg-[#5F35f5] text-white font-Poppins font-semibold text-[20px] rounded-md ml-[25px]"
                >
                  unblock
                </button>
              ) : (
                <button className="px-[7px] bg-[#5F35f5] text-white font-Poppins font-semibold text-[20px] rounded-md ml-[25px]">
                  block
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlockedUser;
