import React, { useState } from "react";
import "../styles/pages/MyPage.css"; // 스타일 import
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UrlCopyIcon, RollDelete, RollTittleEdit } from "./MuiIcon";
import UpdateRollModal from "../components/UpdateRollModal";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { API, BASE_URL } from "../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useRollStore from "../stores/useRollStore";

const RollItem = ({ roll, role }) => {
  const { rollId, rollName, classCode, url } = roll;
  const { isUpdateRollModalOpen, toggleUpdateRollModal } = useRollStore();
  const [isHiddenGroupVisible, setIsHiddenGroupVisible] = useState(false);
  const token = localStorage.getItem("Authorization");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const enterRoll = () => {
      const rollElement = document.getElementById(`roll-${rollId}`);
      if (rollElement) {
        rollElement.classList.add("clicked");
      }  

      setTimeout(() => {
        rollElement.classList.remove("clicked"); // 클래스 제거
        navigate(`/roll/${url}/join`, { state: { rollId, rollName, role } })
      }, 500);

      // navigate(`/roll/${url}/join`, { state: { rollId, rollName, role } })
      // // navigate(`/roll/${url}/join?rollId=${rollId}&rollName=${rollName}&role=${role}`);
      // console.log(`롤링페이퍼 ${rollId}로 이동`);
  }

  const copyUrl = () => {
    navigator.clipboard
      .writeText(BASE_URL + `/${url}`)
      .then(() => {
        alert("URL이 클립보드에 복사되었습니다.");
      })
      .catch((err) => {
        alert("복사 실패: " + err);
      });
  };

  const openModal = () => {
    toggleUpdateRollModal();
  };

  const deleteMutation = useMutation(
    () => 
      axios.delete(API.DELETE_ROLL(rollId), {
        headers: { Authorization: token }
      }),
    {
      onSuccess: () => {
        alert("학급이 삭제되었습니다.");
        queryClient.invalidateQueries("rolls"); // 학급 목록 새로고침
      },
      onError: () => { alert("학급 삭제 중 오류가 발생했습니다."); }
    } 
  );

  const handleDelete = async () => {
    if (window.confirm("학급을 삭제하시겠습니까? 삭제된 학급은 복구할 수 없습니다.")) {
      deleteMutation.mutate();
    }
  };

  // 너비 767 이하 일때 '^', 'v' 버튼 토글
  const toggleHiddenGroup = () => {
    setIsHiddenGroupVisible((prev) => !prev);
  };

  return (
    <div id={`roll-${rollId}`} className="roll-item" onClick={enterRoll}>
      <div onClick={(e) => e.stopPropagation()}>
        <h2 className="roll-name" onClick={enterRoll}>
          {rollName}
        </h2>
        <div className="roll-code-container">
          <p className="class-code">학급코드 : {classCode}</p>
        </div>

        <div className="button-group">
          <p className="url-copy-button" onClick={copyUrl}>
            <UrlCopyIcon />
            <p>URL 복사</p>
          </p>
          <p className="update-button" onClick={() => setIsUpdateRollModalOpen(true)}>
            <RollTittleEdit />
            <p>수정</p>
          </p>
          <p className="delete-button" onClick={handleDelete}>
            <RollDelete />
            <p>삭제</p>
          </p>
        </div>

        <div className="hidden-group">
          {isHiddenGroupVisible ? (
            <ExpandLessIcon
              style={{ fontSize: "40px", cursor: "pointer" }}
              onClick={toggleHiddenGroup}
            />
          ) : (
            <ExpandMoreIcon
              style={{ fontSize: "40px", cursor: "pointer" }}
              onClick={toggleHiddenGroup}
            />
          )}
        </div>
          <div className={`hidden-button-group ${isHiddenGroupVisible ? 'visible' : 'hidden'}`}>
            <p className="url-copy-button" onClick={copyUrl}>
              URL 복사
            </p>
            <p className="update-button" onClick={openModal}>
              수정
            </p>
            <p className="delete-button" onClick={handleDelete}>
              삭제
            </p>
          </div>
      </div>
      {isUpdateRollModalOpen && <UpdateRollModal closeModal={toggleUpdateRollModal} roll={roll} />}
    </div>
  );
};

export default RollItem;
