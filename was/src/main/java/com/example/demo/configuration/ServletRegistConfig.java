package com.example.demo.configuration;

import com.TouchEn.mVaccine.web.servlet.MVaccineWebServlet;
import com.raonsecure.transkey.servlet.TranskeyServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import websquare.http.DefaultRequestDispatcher;

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
    @Bean
    public ServletRegistrationBean<DefaultRequestDispatcher> defaultRequestDispatcherServletRegistrationBean(){
        ServletRegistrationBean<DefaultRequestDispatcher> dr = new ServletRegistrationBean<>(new DefaultRequestDispatcher());
        dr.addInitParameter("WEBSQUARE_HOME", "C:\\websquare_home");
        dr.addUrlMappings("*.wq");
        dr.setLoadOnStartup(2);
        return dr;
    }

    @Bean
    public ServletRegistrationBean<MVaccineWebServlet> mVaccineWebServletServletRegistrationBean(){
        ServletRegistrationBean<MVaccineWebServlet> sr = new ServletRegistrationBean<>(new MVaccineWebServlet(), "/fo/*");
        sr.addInitParameter("isRealPath", "false");
        sr.addInitParameter("isClassPath", "true");
        sr.addInitParameter("iniFilePath", "/raon_config/mVaccineWebConfig.ini");
        sr.addInitParameter("tokenKeyPath", "/raon_config/mvcVerifyToken.key");
        sr.setLoadOnStartup(1);
        return sr;
    }
}
