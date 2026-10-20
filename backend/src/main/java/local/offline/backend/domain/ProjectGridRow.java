package local.offline.backend.domain;

import java.time.LocalDate;

public record ProjectGridRow(
        Long projectId,
        String projectName,
        String status,
        LocalDate startDate,
        LocalDate endDate) {
}
