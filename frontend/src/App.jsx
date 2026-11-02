import { useEffect, useState, useMemo } from 'react'
import { Chart, Subtitle, Tooltip, XAxis } from '@highcharts/react'
import ProjectGridTable, { columns } from './components/ProjectGridTable'
import ProjectDetailDialog from './components/ProjectDetailDialog'
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import axios from 'axios'
import WorkShopSection from './components/WorkShopSection'
import './App.css'


function App() {
  const [points, setPoints] = useState([])
  const [vellPoints, setVellPoints] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // 모달 창에 띄월 선택된 프로젝트 정보 (초기값은 null) -> 모달 창을 닫으면 null로 초기화
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSearchKeyword, setSelectedSearchKeyword] = useState('all');
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState('all');
  // const [searchTarget, setSearchTarget] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');

  // 보여줄 차트 기본 : Phase
  const [selectedGroup, setSelectedGroup] = useState('Phase');
  // 탭 버튼 목록
  const groupType = ['Phase', '등급', '본부'];

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

  // 판매량 차트
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


  // VELL 현황 차트
  useEffect(() => {
    async function loadVELLState() {
      try {
        const response = await axios.get('/api/chart/vell')

        setVellPoints(response.data)
      } catch (error) {
        const message = axios.isAxiosError(error) ? error.message : '알 수 없는 오류가 발생했습니다.'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }
    loadVELLState()
  }, [])

  const chartOptionsForWeeklySales = useMemo(() => {
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

  // 하단 차트
  // api 응답은 (Phase, 등급, 본부) 3가지 타입 데이터를 한번에 전달 -> 이후 전환버튼을 통해 Type을 전환하여 차트를 전환
  // 구현 방법 -> 선택된 상태에 따라 useMemo로 필터링 하여 단 하나의 차트를 전달하는것이 (딜레이가 x)
  // 차트 컴포넌트를 3개를 미리 만들었다가 숨기고 띄우고 하는게 아니라 차트는 1개만 두고 options 만 바꾸는식.
  const chartOptionsForVELL = useMemo(() => {

    const filteredData = vellPoints.filter(point => point.groupType === selectedGroup);

    return {
      chart: {
        type: 'column'
      },
      title: {
        text: `VELL 등록 현황 - ${selectedGroup}`
      },
      xAxis: {
        categories: filteredData.map((vellPoint) => vellPoint.itemName),
      },
      yAxis: {
        min: 0,
        title: {
          text: '건수 / 값'
        }
      },
      series: [
        {
          name: selectedGroup,
          data: filteredData.map(item => item.metricValue),
          tooltip: {
            pointFormat: '<b>{series.name} ({point.key}): {point.y}</b>'
          }
        }
      ]
    }
  }, [vellPoints, selectedGroup]);  // 

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
            <Chart options={chartOptionsForWeeklySales} />
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
        <Grid size={6} style={{ border: "1px solid black" }}>
          <Box sx={{ my: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, ml: 1 }}>
              {groupType.map(group => (
                <Button key={group} variant={selectedGroup === group ? 'contained' : 'outlined'}
                  onClick={() => setSelectedGroup(group)}>
                  {group}
                </Button>
              ))}
            </Box>
            {isLoading && <p>차트 데이터를 불러오는 중입니다.</p>}
            {!isLoading && error && <p>{error}</p>}
            {!isLoading && !error && (
              <Chart options={chartOptionsForVELL} >

              </Chart>
            )}
          </Box>
        </Grid>
        <Grid size={3} style={{ border: "1px solid black" }}>
          <WorkShopSection />
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
