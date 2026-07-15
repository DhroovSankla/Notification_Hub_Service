package com.notificationhub.notification_service.util;

import java.util.Map;

public class TemplateEngine {

    public static class CompiledTemplate {
        public final String subject;
        public final String body;

        public CompiledTemplate(String subject, String body) {
            this.subject = subject;
            this.body = body;
        }
    }

    public static CompiledTemplate compile(String templateType, String name, String email, String rollNumber, String department) {
        String activeTemplate = (templateType == null) ? "WELCOME" : templateType.toUpperCase();
        String safeName = (name == null) ? "User" : name;
        String safeEmail = (email == null) ? "N/A" : email;
        String safeRoll = (rollNumber == null) ? "N/A" : rollNumber;
        String safeDept = (department == null) ? "N/A" : department;

        String subject;
        String body;

        switch (activeTemplate) {
            case "ENROLLMENT":
                subject = "Course Enrollment Confirmed!";
                body = String.format("Hi %s, your course enrollment details have been officially verified. You are registered under the department of %s with Roll Number: %s.", safeName, safeDept, safeRoll);
                break;
            case "SECURITY_ALERT":
                subject = "Security Clearance Activated!";
                body = String.format("Hi %s, your enterprise single sign-on security credentials for login identity %s have been successfully established. Authorization level: ROLE_OPERATOR.", safeName, safeEmail);
                break;
            case "WELCOME":
            default:
                subject = "Welcome to the University Cluster!";
                body = String.format("Hi %s, your student profile registry details have been verified successfully! Welcome to the secure operations cluster.", safeName);
                break;
        }

        return new CompiledTemplate(subject, body);
    }
}
