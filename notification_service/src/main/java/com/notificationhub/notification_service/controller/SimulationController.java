package com.notificationhub.notification_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/simulation")
@CrossOrigin("*")
public class SimulationController {

    private boolean faultModeActive = false;

    @PostMapping("/toggle-fault")
    public ResponseEntity<?> toggleFaultMode(@RequestBody Map<String, Boolean> payload) {
        if (payload.containsKey("active")) {
            this.faultModeActive = payload.get("active");
        } else {
            this.faultModeActive = !this.faultModeActive;
        }
        
        System.out.println("⚠️ Simulation Fault Mode is now: " + (this.faultModeActive ? "ACTIVE" : "INACTIVE"));
        return ResponseEntity.ok(Map.of("faultModeActive", this.faultModeActive));
    }

    @GetMapping("/fault-status")
    public ResponseEntity<?> getFaultStatus() {
        return ResponseEntity.ok(Map.of("faultModeActive", this.faultModeActive));
    }
    
    public boolean isFaultModeActive() {
        return faultModeActive;
    }
}
