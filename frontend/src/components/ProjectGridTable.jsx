import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Table 컴포넌트 사용시 헤더는 직접 지정, 컬럼 갯수 만큼만들면 됨.
// width는 백분율을 사용
export const columns = [
    { key: 'projectId', label: 'ID', width: '15%' },
    { key: 'projectName', label: '프로젝트', width: '35%' },
    { key: 'status', label: '상태', width: '15%' },
    { key: 'startDate', label: '시작일', width: '17.5%' },
    { key: 'endDate', label: '종료일', width: '17.5%' },
];

function ProjectGridTable({
    selectedSearchKeyword,
    keyword = '',
    onRowSelect,
}) {
    const [rowData, setRowData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function LoadProjectGridTable() {
            try {
                setIsLoading(true);
                const response = await axios.get("/api/projects/datas");
                setRowData(response.data);
            } catch (error) {
                console.error("프로젝트 데이터 조회 실패:", error);
            } finally {
                setIsLoading(false);
            }
        }
        LoadProjectGridTable();
    }, []);

    // SQL Like '%keyword%' 구현
    // keyword가 ''이면 전체 데이터 조회, keyword가 있으면 해당 키워드를 포함하는 데이터만 조회
    // 여기에 useMemo()가 사용
    const filteredData = useMemo(() => {
        if (!keyword) return rowData;

        const lowerKeyword = keyword.toLowerCase();

        return rowData.filter(row => {
            // 전체 선택 시 : 테이블의 모든 컬럼 중 하나라도 포함되면 통과
            if (!selectedSearchKeyword || selectedSearchKeyword === 'all') {
                return columns.some(col => {
                    const cellValue = row[col.key] != null
                        ? String(row[col.key])
                        : '';
                    return cellValue.toLowerCase().includes(lowerKeyword);
                });
            }

            // 특정 컬럼 선택 시 : 선택된 그 컬럼의 값만 검사
            const cellValue = row[selectedSearchKeyword] != null
                ? String(row[selectedSearchKeyword])
                : '';
            return cellValue.toLowerCase().includes(lowerKeyword);

        });
    }, [rowData, keyword, selectedSearchKeyword]);


    return (
        <Table
            size="small"
            stickyHeader
            aria-label="프로젝트 목록"
            sx={{
                width: "100%",
                tableLayout: "fixed",
                "& .MuiTableCell-root": {
                    fontSize: "11px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                },
            }}
        >
            <TableHead>
                <TableRow>
                    {columns.map(col => (
                        <TableCell
                            key={col.key}
                            scope="col"
                            sx={{
                                width: col.width,
                                padding: "6px 2px",
                                backgroundColor: "#f1f3f5",
                                borderBottom: "1px solid #dee2e6",
                            }}
                        >
                            {col.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            sx={{ padding: "16px 0", color: "#868e96" }}
                        >
                            데이터를 불러오는 중입니다.
                        </TableCell>
                    </TableRow>
                ) : filteredData.length === 0 ? (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            sx={{ padding: "16px 0", color: "#868e96" }}
                        >
                            {keyword
                                ? `"${keyword}"에 대한 검색 결과가 없습니다.`
                                : "데이터가 없습니다."}
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredData.map((row, idx) => (
                        <TableRow
                            key={row.projectId ?? idx}
                            onClick={() => onRowSelect(row)}
                            sx={{
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor: "#e7f5ff",
                                },
                            }}
                        >
                            {columns.map(col => {
                                const value = row[col.key] ?? '-';
                                return (
                                    <TableCell
                                        key={col.key}
                                        title={String(value)}
                                        sx={{
                                            padding: "6px 2px",
                                            borderBottom: "1px solid #f1f3f5",
                                        }}
                                    >
                                        {value}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );

}

export default ProjectGridTable;
