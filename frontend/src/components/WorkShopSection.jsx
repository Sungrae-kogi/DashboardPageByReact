import { useState, useEffect } from 'react'
import WorkShopStatus from './WorkShopStatus'

import axios from 'axios';

function WorkShopSection() {
    const [projectProgressRowData, setProjectProgressRowData] = useState([]);

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
            <WorkShopStatus projectProgressRowData={projectProgressRowData} isLoading={isLoading} />                {/* 현황판 */}
            {/* <WorkShopStatusDetailDialog />    자세히 보기 용 모달 창  */}
        </>
    )
}

export default WorkShopSection;