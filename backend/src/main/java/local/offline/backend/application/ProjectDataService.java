package local.offline.backend.application;

import java.util.List;

import org.springframework.stereotype.Service;

import local.offline.backend.domain.ProjectGridRow;
import local.offline.backend.domain.ProjectProgressRow;
import local.offline.backend.mapper.ProjectMapper;

@Service
public class ProjectDataService {

    private final ProjectMapper projectMapper;

    public ProjectDataService(ProjectMapper projectMapper) {
        this.projectMapper = projectMapper;
    }

    public List<ProjectGridRow> getProjectData() {
        return projectMapper.selectProjects();
    }

    public List<ProjectProgressRow> getProjectProgressRowData() {
        return projectMapper.selectProjectProgressRows();
    }

}
