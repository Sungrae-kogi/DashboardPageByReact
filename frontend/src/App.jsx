import { useEffect, useState, useMemo } from 'react'
import { Chart, Subtitle, Tooltip } from '@highcharts/react'
import ProjectGridTable, { columns } from './components/ProjectGridTable'
import ProjectDetailDialog from './components/ProjectDetailDialog'
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import axios from 'axios'
import './App.css'
import WorkShopStatus from './components/WorkShopStatus'

function App() {
  const [points, setPoints] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // 모달 창에 띄월 선택된 프로젝트 정보 (초기값은 null) -> 모달 창을 닫으면 null로 초기화
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSearchKeyword, setSelectedSearchKeyword] = useState('all');
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState('all');
  // const [searchTarget, setSearchTarget] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');

  /**
   * useEffect()는 기본적으로 렌더링 직후 실행
   * 두번째 파라미터 배열에 무엇을 넣는지에 따라 실행 조건이 변경.
   * 
   * [] : 컴포넌트가 처음 마운트될 때만 실행
   * [value1,value2] : value1,value2 중 하나라도 변경될 때만 실행
   * 아무것도 넣지 않음 : 매 렌더링 마다 실행
   * 
   * 
   */

  useEffect(() => {
    async function loadCharData() {
      try {
        const response = await axios.get('/api/chart/sales')

        setPoints(response.data)
      } catch (error) {
        const message = axios.isAxiosError(error) ? error.message : '알 수 없는 오류가 발생했습니다.'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }
    loadCharData()
  }, [])    // 설정한 함수를 컴포넌트가 화면에 처음 렌더링 될 때만 실행하고, 업데이트 때는 실행하지 않으려면 함수의 두 번째 파라미터로 빈 배열[]을 전달합니다.

  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: 'column',
      },
      title: {
        text: '주간 판매량',
      },
      subtitle: {
        text: '2026년 10월 1일 ~ 10월 5일'
      },
      xAxis: {
        categories: points.map(({ label }) => label),
      },
      yAxis: {
        min: 0,
        title: {
          text: '판매량',
        },
      },
      series: [
        {
          name: '판매량',
          data: points.map(({ value }) => value),
          tooltip: {
            pointFormat: '<b>{series.name}: {point.y}</b>'
          }
        },

        // 추가한 주문량 데이터
        {
          name: '주문량',
          data: points.map(({ cnt }) => cnt),
          tooltip: {
            pointFormat: '<b>{series.name}: {point.y}</b>'
          }
        }
      ],
    }
  }, [points])

  const handleSearch = () => {
    setAppliedKeyword(searchKeyword.trim());
    setAppliedSearchKeyword(selectedSearchKeyword);
  };


  return (
    <>
      <Grid container spacing={1}>
        <Grid size={3} style={{ border: "1px solid black" }}></Grid>
        <Grid size={6} style={{ border: "1px solid black" }}>
          {isLoading && <p>차트 데이터를 불러오는 중입니다.</p>}
          {!isLoading && error && <p>{error}</p>}
          {!isLoading && !error && (
            <Chart options={chartOptions} />
          )}
        </Grid>

        <Grid
          size={3}
          sx={{
            height: "50vh",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gridTemplateRows: "auto minmax(0, 32fr) minmax(0, 68fr)",
            border: "1px solid black",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
            }}
          >
            <Select size="small"
              MenuProps={{
                disableScrollLock: true // 메뉴 스크롤 잠금 해제
              }}
              value={selectedSearchKeyword}
              onChange={(e) => setSelectedSearchKeyword(e.target.value)}>
              <MenuItem value="all">전체</MenuItem>

              {columns.map((col) => {
                return <MenuItem key={col.key} value={col.key}>
                  {col.label}
                </MenuItem>
              })}
            </Select>
            <TextField
              size="small"
              placeholder="프로젝트 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e => {
                if (e.key === 'Enter')
                  handleSearch();
              })}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" size="small" onClick={handleSearch}>
              검색
            </Button>
          </Box>
          <Box
            sx={{
              minHeight: 0,
              overflow: "auto",
              marginBottom: "1px",
              p: 0.5,
            }}
          >
            <ProjectGridTable selectedSearchKeyword={appliedSearchKeyword} keyword={appliedKeyword} onRowSelect={setSelectedProject} />
          </Box>
          <Box
            sx={{
              minHeight: 0,
              overflow: "auto",
              mt: 1,
              p: 0.5,
            }}
          >
            <ProjectGridTable selectedSearchKeyword={appliedSearchKeyword} keyword={appliedKeyword} onRowSelect={setSelectedProject} />
          </Box>
        </Grid>
        <Grid size={3} style={{ border: "1px solid black" }}></Grid>
        <Grid size={6} style={{ border: "1px solid black", height: "50vh" }}>

        </Grid>
        <Grid size={3} style={{ border: "1px solid black" }}>
          <WorkShopStatus />
        </Grid>
      </Grid>
      <ProjectDetailDialog
        project={selectedProject}                 // 값 전달 -> 부모의 상태를 자식이 사용
        onClose={() => setSelectedProject(null)}  // 자식요소인 ProjectDetailDialog가 부모의 상태 변경을 요청할 수 있는 함수 전달.
      />
    </>
  )
}

export default App
