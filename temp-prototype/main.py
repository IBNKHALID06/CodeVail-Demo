# Entry point for CodeVail

from ui.main_window import launch_ui
from core.process_monitor import start_monitoring

def main():
    print('Launching CodeVail...')
    start_monitoring()
    launch_ui()

if __name__ == '__main__':
    main()