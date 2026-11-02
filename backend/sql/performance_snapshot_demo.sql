-- 등급 / Phase / 본부 전환 그래프용 학습 데이터
-- 한 행: 집계 기준 + 항목 이름 + 정수 실적값
-- 이전의 performance_snapshot 대신 performance_summary를 사용한다.
-- 같은 기준과 항목으로 다시 INSERT하면 실적값을 갱신한다.

CREATE TABLE IF NOT EXISTS performance_summary (
    group_type VARCHAR(20) NOT NULL COMMENT '집계 기준',
    item_name VARCHAR(50) NOT NULL COMMENT '항목 이름',
    metric_value INT UNSIGNED NOT NULL COMMENT '정수 실적값',

    PRIMARY KEY (group_type, item_name),

    CONSTRAINT chk_performance_summary_group
        CHECK (group_type IN ('등급', 'Phase', '본부'))
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

INSERT INTO performance_summary (
    group_type,
    item_name,
    metric_value
)
VALUES
    ('등급', 'S', 120),
    ('등급', 'A', 219),
    ('등급', 'B', 334),
    ('등급', 'C', 200),
    ('Phase', 'Phase 1', 345),
    ('Phase', 'Phase 2', 292),
    ('Phase', 'Phase 3', 236),
    ('본부', '플랜트', 333),
    ('본부', '건축', 231),
    ('본부', '인프라', 144),
    ('본부', '자산', 165)
ON DUPLICATE KEY UPDATE
    metric_value = VALUES(metric_value);

-- 1. 등급별 조회: S / A / B / C 순서
SELECT
    item_name AS label,
    metric_value AS value
FROM performance_summary
WHERE group_type = '등급'
ORDER BY FIELD(item_name, 'S', 'A', 'B', 'C');

-- 2. Phase별 조회: Phase 1=345, Phase 2=292, Phase 3=236
SELECT
    item_name AS label,
    metric_value AS value
FROM performance_summary
WHERE group_type = 'Phase'
ORDER BY FIELD(item_name, 'Phase 1', 'Phase 2', 'Phase 3');

-- 3. 본부별 조회: 플랜트=333, 건축/인프라=375, 자산=165
-- 건축과 인프라는 저장할 때 구분하고, 조회할 때 한 항목으로 합산한다.
SELECT
    CASE
        WHEN item_name IN ('건축', '인프라')
            THEN '건축/인프라'
        ELSE item_name
    END AS label,
    SUM(metric_value) AS value
FROM performance_summary
WHERE group_type = '본부'
GROUP BY
    CASE
        WHEN item_name IN ('건축', '인프라')
            THEN '건축/인프라'
        ELSE item_name
    END
ORDER BY
    FIELD(label, '플랜트', '건축/인프라', '자산');

-- 4. 데이터 확인: 등급 4행 / Phase 3행 / 본부 4행, 기준별 합계는 873
-- 같은 전체 실적의 세 집계 결과이므로 각 기준의 합계를 따로 확인한다.
SELECT
    group_type,
    COUNT(*) AS row_count,
    SUM(metric_value) AS total_value
FROM performance_summary
GROUP BY group_type;

-- 의사 코드 (pseudocode)
-- 1. 집계 기준, 항목 이름, 정수 실적값을 저장할 테이블을 만든다.
-- 2. 등급 4개, Phase 3개, 본부 4개의 값을 총 11행으로 저장한다.
-- 3. 선택한 기준에 해당하는 항목과 값을 조회한다.
-- 4. 본부 조회에서 건축과 인프라만 건축/인프라로 합산한다.
-- 5. 조회 결과를 그래프에 전달한다.

