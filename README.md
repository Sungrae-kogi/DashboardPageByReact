# 📊 React & Spring Boot 기반 대시보드 프로젝트

## 📌 1. 프로젝트 소개
* **목표**: 프론트엔드(React, MUI, Highcharts)와 백엔드(Spring Boot, MyBatis, MariaDB)를 연결하여 주간 판매 현황 차트 및 프로젝트 진행 관리 대시보드 구축.

* **학습 방향**: 
  - 단순 동작에 만족하지 않고 **"왜 이 방식을 사용하는가?"**에 대한 기술적 근거 학습
  - 프론트엔드 렌더링 최적화, 컴포넌트 생명주기, CSS 레이아웃 원리 체득
  - 백엔드 DTO 설계, RDB 정규화 및 피벗(Pivot) 쿼리를 통한 유연한 API 설계
  - 데이터는 임의의 형식에 맞는 더미 데이터 사용

---

## 🛠️ 2. 기술 스택 (Tech Stack)

### Frontend
* **Core**: React 19, JavaScript (ES6+)
* **Build Tool**: Vite
* **UI & Styling**: Material UI (MUI v7), Vanilla CSS (CSS Grid, Flexbox)
* **Chart**: Highcharts, Highcharts React
* **HTTP Client**: Axios

### Backend
* **Language & Framework**: Java 21, Spring Boot 3.x
* **Database & ORM**: MariaDB, MyBatis
* **Build Tool**: Gradle

---

## 🖥️ 3. 시스템 아키텍처 & 레이아웃 구조

```
Grid Container (전체 대시보드)
├── [좌측 상단: 6칸] 주간 판매/주문량 비교 차트 (Highcharts Column Chart)
├── [우측 상단: 3칸] CSS Grid 기반 프로젝트 관리 패널
│    ├── Row 1 (auto): 다중 조건 검색바 (MUI Select + TextField + Button)
│    ├── Row 2 (32%): 프로젝트 목록 그리드 테이블 A (MUI Table)
│    └── Row 3 (68%): 프로젝트 목록 그리드 테이블 B (MUI Table)
└── [우측 하단: 3칸] 워크샵 차수별 진행 현황 테이블 (WorkShopStatus)
```

---

## 🧠 4. 기술적 의사결정 및 학습 기록 (Tech Decisions & Troubleshooting)

### ① React 성능 최적화: `useMemo`를 통한 불필요한 연산 방지
* **문제 상황**: 사용자가 검색창에 키워드를 타이핑할 때마다 부모 컴포넌트가 리렌더링되면서, 검색 버튼을 누르지도 않았는데 수십~수백 건의 테이블 필터링 연산(`.filter()`)이 매 타자마다 반복 실행되는 비효율 발생.
* **해결 및 원리**: 
  - `useMemo`를 도입하여 `[rowData, keyword, selectedSearchKeyword]` 의존성 배열의 값이 바뀔 때만 필터링 함수를 실행하도록 캐싱(메모이제이션).
  - 타이핑 중이거나 모달을 열고 닫는 무관한 렌더링에서는 연산을 0초로 건너뛰고 이전 캐시 결과를 재사용하여 렌더링 성능을 극대화함.

### ② 검색 UX 개선: '입력 중인 상태'와 '확정된 상태'의 분리
* **구조 설계**:
  - `searchKeyword`, `selectedSearchKeyword`: 사용자가 현재 타이핑/선택 중인 임시 상태
  - `appliedKeyword`, `appliedSearchKeyword`: [검색] 버튼을 누르거나 Enter 키를 쳤을 때 확정되는 상태
* **효과**: 사용자가 단어를 다 입력하고 의도적으로 검색 액션을 취했을 때만 하위 그리드 테이블에 `props`가 전달되어 재필터링되도록 설계하여 실무 수준의 검색 UX 완성.

### ③ CSS Grid의 `minmax(0, 1fr)`와 Flexbox 레이아웃의 원리
* **Flexbox 속성 정상화**: `alignItems`, `gap` 등 Flexbox 속성이 동작하려면 부모에 반드시 `display: "flex"`가 선언되어야 함을 확인하고 수정.
* **CSS Grid 오버플로우 방지 트릭**:
  - `gridTemplateColumns: "minmax(0, 1fr)"`: CSS Grid 내부의 긴 텍스트가 부모 너비를 뚫고 삐져나가는 기본 동작을 방지하고, 최소 너비를 `0`으로 지정하여 `text-overflow: ellipsis`(말줄임표)가 정상 작동하도록 구현.
  - `gridTemplateRows: "auto minmax(0, 32fr) minmax(0, 68fr)"`: 검색바는 내용물 높이만큼(`auto`), 남은 높이는 두 테이블에 32:68 비율로 분할.

### ④ 시각 효과의 정석: JS `onMouseOver` 대신 CSS `:hover` 사용
* **문제점**: `onMouseOver` / `onMouseOut`으로 DOM의 스타일 객체(`e.currentTarget.style`)를 직접 조작하는 방식은 마우스 이동 시마다 JS 엔진을 거치며, 마우스가 빠르게 벗어날 때 잔상이 남는 버그 발생.
* **해결**: 
  - 브라우저 네이티브 그래픽 엔진(GPU 가속)이 처리하는 CSS `:hover`로 전환.
  - MUI `<TableRow hover>` 속성 및 `sx={{ '&:hover': { backgroundColor: '#e7f5ff' } }}`를 활용하여 코드 가독성 향상과 잔상 버그 원천 차단.

### ⑤ RDB 정규화 테이블을 프론트엔드 맞춤형으로 가공 (SQL PIVOT 쿼리)
* **상황**: DB에는 프로젝트별 차수(1~3차) 진행 상태가 세로 행(1:N 정규화)으로 쌓여 있으나, 화면에는 `프로젝트명 | 1차 | 2차 | 3차` 형태로 한 행에 표현해야 함.
* **의사결정**: DB 테이블 컬럼을 비정규화하지 않고, 백엔드 MyBatis SQL에서 `LEFT JOIN`과 `MAX(CASE WHEN...)` 조건부 집계를 활용하여 피벗(PIVOT) 처리.
* **효과**: DB의 확장성(4차, 5차가 추가되어도 테이블 변경 없음)을 유지하면서도 프론트엔드가 렌더링하기 가장 편한 형태로 DTO 전달.

### ⑥ Java 17+ `record`를 활용한 불변 DTO 설계
* 조회 전용 데이터 객체로 Java `record`를 사용하여 보일러플레이트 코드(`getter`, `setter`, `equals`, `hashCode`) 제거.
* DB 테이블명(`project`)과 화면용 DTO명(`ProjectGridRow`, `ProjectProgressRow`)의 관심사를 명확히 분리하여 계층 간 독립성 확보.

---

## 📂 5. 프로젝트 디렉토리 구조

```
highChart/
├── backend/                        # Spring Boot 백엔드
│   ├── src/main/java/local/offline/backend/
│   │   ├── api/                    # REST Controller (Chart, Project)
│   │   ├── application/            # Service Layer
│   │   ├── domain/                 # Record DTOs (ProjectGridRow, ProjectProgressRow)
│   │   └── mapper/                 # MyBatis Mapper Interfaces
│   └── src/main/resources/
│       ├── mapper/                 # MyBatis SQL XML (PIVOT 쿼리 포함)
│       └── application.properties  # MariaDB 설정
│
├── frontend/                       # React + Vite 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProjectGridTable.jsx   # 검색/정렬/선택 가능한 프로젝트 목록 테이블
│   │   │   ├── ProjectDetailDialog.jsx# 행 클릭 시 노출되는 프로젝트 상세 모달
│   │   │   └── WorkShopStatus.jsx     # 프로젝트 차수별 피벗 진행 현황 테이블
│   │   ├── App.jsx                 # 전체 대시보드 레이아웃 및 공유 상태 관리
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore                      # 대용량 빌드 파일 및 캐시 제외 설정
```

---

## 🚀 6. 실행 방법 (Getting Started)

### Backend 실행
```bash
cd backend
./gradlew bootRun
# 포트: 8080
```

### Frontend 실행
```bash
cd frontend
npm install
npm run dev
# 접속: http://localhost:5173
```
