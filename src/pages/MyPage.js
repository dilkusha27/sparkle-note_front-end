import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/pages/MyPage.css';
import RollItem from "../components/RollItem";
import { CustomButton2 , LetterClick } from '../components/MuiButton';
import { UserLogout } from '../components/MuiIcon';
import axios from "axios";
import CreateRollModal from "../components/CreateRollModal";
import AddIcon from '@mui/icons-material/Add';
import { API } from "../config";
import { ArrowDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useRollStore from "../stores/useRollStore";


const MyPage = () => {
    const navigate = useNavigate();
    const {
        showGuide, isCreateRollModalOpen, userInfo, rolls,
        setShowGuide, toggleCreateRollModal, setUserInfo, setRolls
    } = useRollStore();

    // const [showGuide, setShowGuide] = useState(true);
    // const [isCreateRollModalOpen, setIsCreateRollModalOpen] = useState(false);

    const token = localStorage.getItem("Authorization");

    if (!token) {
        alert("로그인 상태가 아닙니다. 로그인 후 이용해주세요.");
        navigate("/");
        return null; // 컴포넌트 렌더링 중단
    }

    // const { data: userInfo } = useQuery("userInfo", () => 
    useQuery("userInfo", () => 
        axios.get(API.TEACHER_PROFILE, {
            headers: { Authorization: token }
        }).then((res) => res.data.data), // 응답 데이터 중 res.data.data만 반환 
        {
            onError: (error) => {
                console.error("사용자 정보 불러오기 실패", error);
                navigate("/");
                return null; // 컴포넌트 렌더링 중단
            }
        }
    )

    // const { data: rolls } = useQuery("rolls", () => 
    useQuery("rolls", () => 
            axios.get(API.GET_ROLL, {
            headers: { Authorization: token },
        }).then((res) => res.data.data) 
    );

    /** useQuery("rolls")가 API 호출하는 경우
        
        1. 컴포넌트가 처음 렌더링될 때
        2. queryClient.invalidateQueries("rolls")가 호출될 때
        3. 쿼리의 Stale 상태일 때: 데이터가 오래되었다고 판단되면 다시 호출.
        4. 리페치가 강제로 트리거될 때: 수동으로 호출하거나 특정 옵션으로 설정된 경우.
    
    */

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowGuide(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const teacherlogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // const closeModal = () => {
    //     setIsCreateRollModalOpen(false);
    // }

    return (
        <div className="my-page-container">
            <div className="greeting-container">
                <p className="greeting"><span>{userInfo.name}</span> 선생님, 안녕하세요! 🙇‍♂️</p>
                <LetterClick className="logout-button" onClick={teacherlogout}>
                    <UserLogout />
                    <p>LOGOUT</p>
                </LetterClick>
            </div>
            <div className="roll-list-container">
                <p className="highlighted-text">📌 학급 목록</p>

                {Array.isArray(rolls) && rolls.length > 0 ? (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {( showGuide && rolls.length === 1 ) && (
                            <div className="click-guide">
                                <div className="click-guide-message">
                                    클릭하여 입장해주세요!
                                </div>
                                <ArrowDown size={24} color="#4F46E5" />
                            </div>
                        )}
                        {rolls.map((roll) => (
                            <RollItem
                                key={roll.rollId}
                                roll={roll}
                                role={userInfo.role}
                                className={showGuide ? 'highlight' : ''}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="no-class">등록된 학급이 없습니다.</p>
                )}
                <CustomButton2
                    onClick={toggleCreateRollModal}
                    className="create-roll"
                >
                    <AddIcon style={{marginRight:"5px"}}></AddIcon> 학급 생성
                </CustomButton2>
            </div>

            {isCreateRollModalOpen && <CreateRollModal closeModal={toggleCreateRollModal} /> }

        </div>
    );
};

export default MyPage;