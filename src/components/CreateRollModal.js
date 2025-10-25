import { useState } from "react";
import '../styles/components/Modal.css' // CSS 파일 가져오기
import axios from "axios";
import { LetterClick } from '../components/MuiButton';
import AddIcon from '@mui/icons-material/Add';
import { API } from "../config";
import { useQueryClient } from "@tanstack/react-query";

const CreateRollModal = ({ closeModal }) => {

    const token = localStorage.getItem("Authorization");
    const [rollTitle, setRollTitle] = useState('');
    const queryClient = useQueryClient();

    // React Query로 학급 생성 관리
    const createRollMutation = useMutation(
        (rollData) => 
            axios.post(API.CREATE_ROLL, rollData, {
                headers: {
                    "Authorization": token
                }
            }),
        {
            onSuccess: (response) => {
                // addRoll(response.data.data);
                queryClient.invalidateQueries("rolls");
                alert("새 학급이 생성되었습니다.");
                setRollTitle('');
                closeModal();
            },
            onError: (error) => {
                console.error("롤 생성 실패", error);
                alert("학급 생성 중 오류가 발생했습니다.");
            }
        }
    )

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) { // 배경을 클릭했는지 확인
            closeModal();
        }    
    }

    const createRoll = () => {
        if (rollTitle.trim()) {
            createRollMutation.mutate({ rollName: rollTitle });
        }
    }
    
    return (
        <div className="modal-overlay" onClick={handleOverlayClick}> {/* 모달 배경 */}
            <div className="modal-content" onClick={(e) => {e.stopPropagation()}}> {/* 모달 내용 */}
            {/**
             * 이벤트 버블링은 하위 요소에서 발생한 이벤트가 상위 요소로 전파되는 현상이다.
             * 이벤트는 발생한 요소부터 최상위 부모 요소까지 순차적으로 전달된다.
             * 기본적으로 대부분의 브라우저에서 이벤트는 버블링 방식을 따른다.
             * */}
            
            {/**
             * stopPropagation() 함수는 JavaScript 이벤트 전파를 중지시킨다.
             * 이벤트가 상위 요소로 전달되는 버블링 또는 캡처링 단계를 차단한다.
             * 특정 요소의 이벤트 처리에만 동작을 제한하고 싶을 때 사용된다.
             * */}  
                <div className="modal-creat-tittle">
                    <AddIcon style={{fontSize:"32px"}}></AddIcon>
                    <p>학급 생성</p>
                </div>

                <input 
                    type="text"
                    value = {rollTitle}
                    onChange = {(e) => setRollTitle(e.target.value)}
                    placeholder="새 학급명을 입력해주세요"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            createRoll();
                        }
                    }}
                /> {/* 롤링페이퍼 작성 */}
                <LetterClick 
                    className="roll-create-button" 
                    onClick={createRoll}
                    disabled={!rollTitle.trim()} // 내용이 없을 때 버튼 비활성화
                    style={{ marginBottom:"5px" }}
                >등록</LetterClick>
            </div>
        </div>
    );

};

export default CreateRollModal;