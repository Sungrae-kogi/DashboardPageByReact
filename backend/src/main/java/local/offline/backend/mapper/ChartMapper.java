package local.offline.backend.mapper;

import java.util.List;

import local.offline.backend.domain.ChartPoint;

public interface ChartMapper {
    List<ChartPoint> selectSalesData();
}
