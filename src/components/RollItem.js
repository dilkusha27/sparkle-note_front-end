import React, { useState } from 'react';
import '../styles/pages/MyPage.css'; // 스타일 import
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UrlCopyIcon, RollDelete, RollTittleEdit } from './MuiIcon';
import UpdateRollModal from './UpdateRollModal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { API, BASE_URL } from '../config';

const RollItem = ({ roll, role }) => {
  const { rollId, rollName, classCode, url } = roll;
  const [isUpdateRollModalOpen, setIsUpdateRollModalOpen] = useState(false);
  const [isHiddenGroupVisible, setIsHiddenGroupVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const token = localStorage.getItem('Authorization');
  const navigate = useNavigate();

  const enterRoll = () => {
    // 상태 기반 클릭 애니메이션 처리 및 네비게이트
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      navigate(`/roll/${url}/join`, { state: { rollId, rollName, role } });
    }, 500);
  };

  const copyUrl = () => {
    navigator.clipboard
      .writeText(BASE_URL + `/${url}`)
      .then(() => {
        alert('URL이 클립보드에 복사되었습니다.');
      })
      .catch((err) => {
        alert('복사 실패: ' + err);
      });
  };

  const closeModal = () => {
    setIsUpdateRollModalOpen(false);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        '학급을 삭제하시겠습니까? 삭제된 학급은 복구할 수 없습니다.'
      )
    ) {
      try {
        await axios.delete(API.DELETE_ROLL(rollId), {
          headers: { Authorization: token },
        });
        alert('학급이 삭제되었습니다.');
        window.location.reload();
      } catch (error) {
        alert('학급 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 너비 767 이하 일때 '^', 'v' 버튼 토글
  const toggleHiddenGroup = () => {
    setIsHiddenGroupVisible((prev) => !prev);
  };

  return (
    <div
      id={`roll-${rollId}`}
      className={`roll-item ${isClicked ? 'clicked' : ''}`}
      onClick={enterRoll}
    >
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
          <p
            className="update-button"
            onClick={() => setIsUpdateRollModalOpen(true)}
          >
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
              style={{ fontSize: '40px', cursor: 'pointer' }}
              onClick={toggleHiddenGroup}
            />
          ) : (
            <ExpandMoreIcon
              style={{ fontSize: '40px', cursor: 'pointer' }}
              onClick={toggleHiddenGroup}
            />
          )}
        </div>
        <div
          className={`hidden-button-group ${
            isHiddenGroupVisible ? 'visible' : 'hidden'
          }`}
        >
          <p className="url-copy-button" onClick={copyUrl}>
            URL 복사
          </p>
          <p
            className="update-button"
            onClick={() => setIsUpdateRollModalOpen(true)}
          >
            수정
          </p>
          <p className="delete-button" onClick={handleDelete}>
            삭제
          </p>
        </div>
      </div>
      {isUpdateRollModalOpen && (
        <UpdateRollModal closeModal={closeModal} roll={roll} />
      )}
    </div>
  );
};

export default RollItem;
