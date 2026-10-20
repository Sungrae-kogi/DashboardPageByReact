import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";

const columnDefs = [
    {
        field: "projectId",
        headerName: "ID",
        width: 90,
    },
    {
        field: "projectName",
        headerName: "프로젝트명",
        flex: 1,
        minWidth: 180,
    },
    {
        field: "status",
        headerName: "상태",
        width: 150,
    },
    {
        field: "startDate",
        headerName: "시작일",
        width: 140,
    },
    {
        field: "endDate",
        headerName: "종료일",
        width: 140,
    },
];

const defaultColDef = {
    resizable: true,
};

function ProjectDetailDialog({ project, onClose }) {
    const rowData = project ? [project] : [];

    return (
        <Dialog
            open={project !== null}
            onClose={onClose}
            fullWidth
            disableScrollLock={true}
            maxWidth="lg"
        >
            <DialogTitle>
                {project?.projectName ?? "프로젝트 상세"}
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ height: 220, width: "100%" }}>
                    <AgGridReact
                        theme={themeQuartz}
                        rowData={rowData}
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

export default ProjectDetailDialog;