package com.example.demo.configuration;

import com.raonsecure.transkey.servlet.TranskeyServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServletRegistConfig {
    @Bean
    public ServletRegistrationBean<TranskeyServlet> transkeyServletRegist(){
        ServletRegistrationBean<TranskeyServlet> tr = new ServletRegistrationBean<>(new TranskeyServlet(), "/transkeyServlet");
        tr.addInitParameter("isRealPath","false");
        tr.addInitParameter("isClassPath","true");
        tr.addInitParameter("iniFilePath","/raon_config/config.ini");
        tr.addInitParameter("licenseIniPath","/raon_config/transkey_license.ini");
        tr.setLoadOnStartup(1);
        return tr;
    }
}
