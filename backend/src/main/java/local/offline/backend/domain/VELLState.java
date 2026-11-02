package local.offline.backend.domain;

public record VELLState(
        String groupType, // 집계 기준
        String itemName, // 항목 이름
        int metricValue // 정수 실적값
) {

}
