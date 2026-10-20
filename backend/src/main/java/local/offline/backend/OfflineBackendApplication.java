package local.offline.backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = "local.offline.backend.mapper")
public class OfflineBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(OfflineBackendApplication.class, args);
    }
}
