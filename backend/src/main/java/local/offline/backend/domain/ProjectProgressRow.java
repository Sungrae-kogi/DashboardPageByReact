package local.offline.backend.domain;

public record ProjectProgressRow(
        Long projectId,
        String projectName,
        String stage1Status,
        String stage2Status,
        String stage3Status) {
}
