import psutil
import threading
import time
import tkinter as tk
from tkinter import messagebox

BLACKLISTED_APPS = ["cluely.exe", "discord.exe", "skype.exe"]

class SecurityMonitor:
    def __init__(self, root):
        self.root = root
        self.running = True
        self.status_label = None
        self.alerts_text = None
        
    def setup_ui(self, frame):
        tk.Label(
            frame,
            text="Security Monitor",
            font=("Segoe UI", 16, "bold"),
            fg="white",
            bg="#181A20"
        ).pack(pady=15)

        self.status_label = tk.Label(
            frame,
            text="● Monitoring Active",
            font=("Segoe UI", 12),
            fg="#4CAF50",
            bg="#181A20"
        )
        self.status_label.pack(pady=(0, 10))

        self.alerts_text = tk.Text(
            frame,
            height=10,
            font=("Segoe UI", 11),
            bg="#1E1E1E",
            fg="white",
            wrap=tk.WORD
        )
        self.alerts_text.pack(fill="x", padx=15)

    def start(self):
        threading.Thread(target=self._monitor_loop, daemon=True).start()
    
    def _monitor_loop(self):
        while self.running:
            processes = [p.name().lower() for p in psutil.process_iter()]
            for app in BLACKLISTED_APPS:
                if app in processes:
                    self.terminate_session(app)
                    return
            time.sleep(1)  # Check every second
    
    def terminate_session(self, detected_app):
        self.running = False
        self.root.after(0, self._show_termination_screen, detected_app)
    
    def _show_termination_screen(self, detected_app):
        for widget in self.root.winfo_children():
            widget.destroy()
            
        frame = tk.Frame(self.root, bg="#181A20")
        frame.pack(expand=True)
        
        tk.Label(
            frame,
            text="Session Terminated",
            font=("Segoe UI", 24, "bold"),
            fg="#FF4444",
            bg="#181A20"
        ).pack(pady=20)
        
        tk.Label(
            frame,
            text=f"Unauthorized application detected: {detected_app}",
            font=("Segoe UI", 14),
            fg="white",
            bg="#181A20"
        ).pack(pady=10)
        
        tk.Label(
            frame,
            text="This incident will be reported.",
            font=("Segoe UI", 12),
            fg="#FF4444",
            bg="#181A20"
        ).pack(pady=20)

def start_monitoring():
    print("Process monitoring started...")
    running = [p.name().lower() for p in psutil.process_iter()]
    for app in BLACKLISTED_APPS:
        if app in running:
            print(f"Security Alert: {app} detected!")
            report_cheating(app)  # Log the cheating app
        else:
            print(f"{app} not running.")

def detect_cluely():
    pass  # Placeholder for future logic

def report_cheating(app_name):
    with open("logs.txt", "a") as log:
        log.write(f"{time.ctime()}: Detected cheating app - {app_name}\n")