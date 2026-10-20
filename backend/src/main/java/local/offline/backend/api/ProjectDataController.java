package local.offline.backend.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import local.offline.backend.application.ProjectDataService;
import local.offline.backend.domain.ProjectGridRow;
import local.offline.backend.domain.ProjectProgressRow;

@RestController
@RequestMapping("/api/projects")
public class ProjectDataController {
    private final ProjectDataService projectDataService;

    public ProjectDataController(ProjectDataService projectDataService) {
        this.projectDataService = projectDataService;
    }

    @GetMapping("/datas")
    public List<ProjectGridRow> getProjectData() {
        return projectDataService.getProjectData();
    }

    @GetMapping("/progress")
    public List<ProjectProgressRow> getProjectProgressRowData() {
        return projectDataService.getProjectProgressRowData();
    }
}
