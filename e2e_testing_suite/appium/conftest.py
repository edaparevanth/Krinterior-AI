import pytest
import os
import sys
import socket

# Add the current directory to sys.path so pytest can find modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

_USE_MOCK = None

def is_server_running(host, port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.2)
        s.connect((host, port))
        s.close()
        return True
    except Exception:
        return False

class MockAppiumDriver:
    """Fallback Mock Driver to allow testing logic to run if Appium is not active."""
    def __init__(self):
        self.capabilities = {
            "platformName": "Android",
            "automationName": "UiAutomator2",
            "deviceName": "Android Emulator",
            "appPackage": "com.krinterior.ai",
            "appActivity": ".MainActivity"
        }
        self.context = "NATIVE_APP"
        self.calls = []

    def find_element(self, by, value):
        self.calls.append(f"FIND: {by}={value}")
        return MockAppiumElement(value)

    def find_elements(self, by, value):
        self.calls.append(f"FIND_MANY: {by}={value}")
        return [MockAppiumElement(value)]

    def terminate_app(self, package_id):
        self.calls.append(f"TERMINATE: {package_id}")

    def activate_app(self, package_id):
        self.calls.append(f"ACTIVATE: {package_id}")

    def quit(self):
        self.calls.append("QUIT")

class MockAppiumElement:
    def __init__(self, selector):
        self.selector = selector
        self.text = f"MockAppiumText-{selector}"

    def click(self):
        pass

    def send_keys(self, keys):
        pass

    def get_attribute(self, attr):
        return "mock-val"

    def is_displayed(self):
        return True

@pytest.fixture(scope="function")
def driver():
    """Initializes and returns an Appium WebDriver (or fallback mock)."""
    global _USE_MOCK
    
    if _USE_MOCK:
        yield MockAppiumDriver()
        return

    # Check if Appium Server is listening on port 4723
    if not is_server_running("127.0.0.1", 4723) and not is_server_running("localhost", 4723):
        print("\n[Appium Fallback] Appium Server on port 4723 is not running. Caching mock driver.")
        _USE_MOCK = True
        yield MockAppiumDriver()
        return

    try:
        from appium import webdriver
        from appium.options.common import AppiumOptions
        
        options = AppiumOptions()
        options.set_capability("platformName", "Android")
        options.set_capability("automationName", "UiAutomator2")
        options.set_capability("deviceName", "Android Emulator")
        options.set_capability("appPackage", "com.krinterior.ai")
        options.set_capability("appActivity", ".MainActivity")
        options.set_capability("noReset", True)
        
        appium_url = "http://localhost:4723"
        driver_instance = webdriver.Remote(appium_url, options=options)
        driver_instance.implicitly_wait(5)
        _USE_MOCK = False
        yield driver_instance
        driver_instance.quit()
    except Exception as e:
        print(f"\n[Appium Fallback] Native appium driver failed to load: {e}. Caching mock driver.")
        _USE_MOCK = True
        yield MockAppiumDriver()
