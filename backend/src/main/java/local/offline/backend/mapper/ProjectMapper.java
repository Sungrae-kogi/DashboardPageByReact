package local.offline.backend.mapper;

import java.util.List;

import local.offline.backend.domain.ProjectGridRow;
import local.offline.backend.domain.ProjectProgressRow;

public interface ProjectMapper {
    List<ProjectGridRow> selectProjects();

    List<ProjectProgressRow> selectProjectProgressRows();
}
