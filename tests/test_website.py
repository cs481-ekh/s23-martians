from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

from selenium.webdriver.common.by import By

def test_components():
    
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    driver.get("https://sdp.boisestate.edu/s23-martians/")

    driver.implicitly_wait(1)

    text_box = driver.find_element(by=By.NAME, value="startTime")

    text_box.send_keys("01:00:00")
    submit_button = driver.find_element(by=By.ID, value ="plotGraphBtn")
    
    submit_button.click()

    driver.quit()
