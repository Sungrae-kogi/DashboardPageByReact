package local.offline.backend.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import local.offline.backend.application.ChartDataService;
import local.offline.backend.domain.ChartPoint;

@RestController
@RequestMapping("/api/chart")
public class ChartDataController {
    private final ChartDataService chartDataService;

    public ChartDataController(ChartDataService chartDataService) {
        this.chartDataService = chartDataService;
    }

    @GetMapping("/sales")
    public List<ChartPoint> getSalesData() {
        return chartDataService.getSalesData();
    }
}
