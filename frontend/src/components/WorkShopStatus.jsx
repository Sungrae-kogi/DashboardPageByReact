import { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

/*
*   초기 상태
*   우측 하단 WorkShop 차수 별 보고서 진행 현황
*
*/

function WorkShopStatus() {

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
        <Table
            size="small"
            aria-label="프로젝트 차수별 진행 현황"
            sx={{
                width: "100%",
                height: "50%",
                tableLayout: "fixed",
                "& .MuiTableCell-root": {
                    padding: "6px 2px",
                    fontSize: "11px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                },
                "& .MuiTableCell-head": {
                    backgroundColor: "#f1f3f5",
                    borderBottom: "1px solid #dee2e6",
                },
            }}
        >
            <TableHead>
                <TableRow>
                    <TableCell scope="col">프로젝트명</TableCell>
                    <TableCell scope="col">1차(초기)</TableCell>
                    <TableCell scope="col">2차(30%)</TableCell>
                    <TableCell scope="col">3차(70%)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={4}>로딩 중...</TableCell>
                    </TableRow>
                ) : projectProgressRowData.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4}>데이터 없음</TableCell>
                    </TableRow>
                ) : (
                    projectProgressRowData.map((row, idx) => (
                        <TableRow key={row.projectId ?? idx}>
                            <TableCell title={row.projectName}>
                                {row.projectName}
                            </TableCell>
                            <TableCell title={row.stage1Status}>
                                {row.stage1Status}
                            </TableCell>
                            <TableCell title={row.stage2Status}>
                                {row.stage2Status}
                            </TableCell>
                            <TableCell title={row.stage3Status}>
                                {row.stage3Status}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )

}

export default WorkShopStatus;
