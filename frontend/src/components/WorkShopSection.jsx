import { useState, useEffect } from 'react'
import WorkShopStatus from './WorkShopStatus'
import WorkShopStatusDetailDialog from './WorkShopStatusDetailDialog';

import axios from 'axios';

function WorkShopSection() {
    const [projectProgressRowData, setProjectProgressRowData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function LoadProjectProgressRowData() {
            try {
                setIsLoading(true);
                const response = await axios.get("/api/projects/progress");
                setProjectProgressRowData(response.data);
            } catch (error) {
                console.error("프로젝트 데이터 조회 실패:", error);
            } finally {
                // 성공 실패 여부와 상관없이 로딩 상태를 false로 변경
                setIsLoading(false);
            }
        }
        LoadProjectProgressRowData();
    }, []);

    return (
        <>
            <WorkShopStatus
                projectProgressRowData={projectProgressRowData}
                isLoading={isLoading}
                onRowSelect={() => setIsModalOpen(true)}
            />
            <WorkShopStatusDetailDialog
                projectProgressRowData={projectProgressRowData}
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}

export default WorkShopSection;

/*
 * 의사 코드 (pseudocode)
 * 1. 빈 목록과 닫힌 모달 상태로 시작한다.
 * 2. API에서 받은 목록을 저장하고 로딩을 종료한다.
 * 3. 같은 목록을 현황판과 모달에 전달한다.
 * 4. 현황판 클릭과 닫기 요청에 따라 모달 상태를 변경한다.
 */
