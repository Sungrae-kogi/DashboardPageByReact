import { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // grid 테마 css
import "ag-grid-community/styles/ag-theme-quartz.css"; // grid 테마 css

// AgGridReact로 작성해본 테이블 데이터. (이거는 공간이 좁을 경우 컬럼이 잘려서 확인이 어려움.)

// 열 정의가 고정되어있다면, 컴포넌트 외부로 정의.
const defaultColDef = {
    flex: 1,
    minWidth: 30,
    resizable: true,
    suppressSizeToFit: false,
};

const columnDefs = [
    { field: 'projectId', headerName: '프로젝트 ID', flex: 0.8, minWidth: 35 },
    { field: 'projectName', headerName: '프로젝트명', flex: 1.5, minWidth: 60 },
    { field: 'status', headerName: '상태', flex: 0.8, minWidth: 40 },
    { field: 'startDate', headerName: '시작일', flex: 1.1, minWidth: 50 },
    { field: 'endDate', headerName: '종료일', flex: 1.1, minWidth: 50 },
]

function ProjectGrid() {
    const [rowData, setRowData] = useState([]);


    useEffect(() => {
        async function loadProjectGridData() {
            try {
                const response = await axios.get('/api/projects/datas')
                setRowData(response.data);
            } catch (error) {
                console.error(error)
            }
        }
        loadProjectGridData()
    }, []);

    return (
        <div className="ag-theme-quartz" style={{ width: "100%", height: "100%" }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}

                autoSizeStrategy={{
                    type: 'fitGridWidth',
                    defaultMinWidth: 30,
                }}
            ></AgGridReact>
        </div>
    );
}

export default ProjectGrid;
