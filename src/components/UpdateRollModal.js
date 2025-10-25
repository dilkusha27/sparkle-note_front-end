import { useState, useEffect } from "react";
import "../styles/components/Modal.css"; // CSS 파일 가져오기
import axios from "axios";
import { LetterClick } from "../components/MuiButton";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { API } from "../config";
import { useQueryClient } from "@tanstack/react-query";

const UpdateRollModal = ({ closeModal, roll }) => {
  const { rollId, rollName } = roll;
  const token = localStorage.getItem("Authorization");
  const [rollTitle, setRollTitle] = useState(rollName);
  const queryClient = useQueryClient();

  const updateRollMutation = useMutation(
    (rollData) => axios.put(API.UPDATE_ROLL(rollId), rollData, {
      headers: {
        Authorization: token
      }
    }),
    {
      onSuccess: (response) => {
        alert("학급명이 수정되었습니다.");
        setRollTitle(response.data.data.rollName)
        queryClient.invalidateQueries("rolls");
        closeModal();
      },
      onError: (error) => {
        console.error("학급명 수정 실패", error);
        alert("학급명 수정 실패", error);
      }
    }
  )

  const updateRoll = () => {
    if (!rollTitle.trim()){
      updateRollMutation.mutate({ rollName: rollTitle });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        e.stopPropagation();
        handleOverlayClick(e);
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="update-title" style={{ marginBottom: "5px" }}>
          <BorderColorIcon style={{ marginRight: "8px", float: "left" }} />
          <h3 style={{ width: "150px" }}>학급명 수정</h3>
        </div>
        <input
          type="text"
          value={rollTitle}
          onChange={(e) => setRollTitle(e.target.value)}
          placeholder={rollName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateRoll();
            }
          }}
        />
        <div className="modal-actions">
          <LetterClick onClick={closeModal}>취소</LetterClick>
          <LetterClick
            className="roll-create-button"
            onClick={updateRoll}
            disabled={!rollTitle.trim()}
          >
            등록
          </LetterClick>
        </div>
      </div>
    </div>
  );
};

export default UpdateRollModal;
