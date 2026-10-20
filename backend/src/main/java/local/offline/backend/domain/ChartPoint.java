package local.offline.backend.domain;

public record ChartPoint(
                String label,
                int value, // 판매량
                int cnt // 주문량
) {
}
