import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { STATUS_COLORS } from "../constants/workShopStatusColors";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";

const columnDefs = [
    {
        field: "projectName",
        headerName: "프로젝트명",
        flex: 2,
    },
    {
        field: "stage1Status",
        headerName: "1차(초기)",
        flex: 1,
        minWidth: 180,
        cellStyle: params => {
            if (params.value === '대상전') {
                return { color: STATUS_COLORS['대상전'] };
            }
            if (params.value === '임박') {
                return { color: STATUS_COLORS['임박'] }
            }
            if (params.value === '지연') {
                return { color: STATUS_COLORS['지연'], cursor: 'pointer' }
            }
            if (params.value === '진행완') {
                return { color: STATUS_COLORS['진행완'], fontWeight: 'bold' }
            }
            return { color: 'inherit' };
        },
        onCellClicked: (params) => {
            if (params.value === '지연') {
                alert(`${params.node.data.projectName} 1차 지연`)
            }
        }
    },
    {
        field: "stage2Status",
        headerName: "2차(30%)",
        flex: 1,
        minWidth: 180,
        cellStyle: params => {
            if (params.value === '대상전') {
                return { color: STATUS_COLORS['대상전'] };
            }
            if (params.value === '임박') {
                return { color: STATUS_COLORS['임박'] }
            }
            if (params.value === '지연') {
                return { color: STATUS_COLORS['지연'], cursor: 'pointer' }
            }
            if (params.value === '진행완') {
                return { color: STATUS_COLORS['진행완'], fontWeight: 'bold' }
            }
            return { color: 'inherit' };
        },
        onCellClicked: (params) => {
            if (params.value === '지연') {
                alert(`${params.node.data.projectName} 2차 지연`)
            }
        }
    },
    {
        field: "stage3Status",
        headerName: "3차(70%)",
        flex: 1,
        minWidth: 180,
        cellStyle: params => {
            if (params.value === '대상전') {
                return {
                    color: STATUS_COLORS['대상전'],
                    textDecoration: 'line-through',
                };
            }
            if (params.value === '임박') {
                return { color: STATUS_COLORS['임박'] }
            }
            if (params.value === '지연') {
                return { color: STATUS_COLORS['지연'], cursor: 'pointer' }
            }
            if (params.value === '진행완') {
                return { color: STATUS_COLORS['진행완'], fontWeight: 'bold' }
            }
            return { color: 'inherit' };
        },
        onCellClicked: (params) => {
            if (params.value === '지연') {
                alert(`${params.node.data.projectName} 3차 지연`)
            }
        }
    }
];

const defaultColDef = {
    resizable: true,
};

const workshopGridTheme = themeQuartz.withParams({
    autoHeightMinBodyHeight: 120,
    autoHeightMaxBodyHeight: "60vh",
});

function WorkShopStatusDetailDialog({
    projectProgressRowData,
    isModalOpen,
    onClose,
}) {
    return (
        <Dialog
            open={isModalOpen}
            onClose={onClose}
            fullWidth
            disableScrollLock={true}
            maxWidth="lg"
        >
            <DialogTitle>
                WorkShop 결과 보고서 제출 현황
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ width: "100%" }}>
                    <AgGridReact
                        domLayout="autoHeight"
                        theme={workshopGridTheme}
                        rowData={projectProgressRowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default WorkShopStatusDetailDialog;

/*
 * 의사 코드 (pseudocode)
 * 1. 고정된 열 설정과 상태별 색상을 준비한다.
 * 2. 부모가 전달한 열림 상태에 따라 모달을 표시한다.
 * 3. 목록을 표로 표시하고 각 셀의 상태에 맞는 스타일을 적용한다.
 * 4. 닫기 요청을 부모에게 전달한다.
 */
