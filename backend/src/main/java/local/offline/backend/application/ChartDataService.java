package local.offline.backend.application;

import java.util.List;

import org.springframework.stereotype.Service;

import local.offline.backend.domain.ChartPoint;
import local.offline.backend.mapper.ChartMapper;

@Service
public class ChartDataService {
    private final ChartMapper chartMapper;

    public ChartDataService(ChartMapper chartMapper) {
        this.chartMapper = chartMapper;
    }

    public List<ChartPoint> getSalesData() {
        return chartMapper.selectSalesData();
    }
}
