from selenium import webdriver
from selenium.webdriver.common.by import By


def test_eight_components():
    driver = webdriver.Chrome()

    driver.get("https://sdp.boisestate.edu/s23-martians/")

    title = driver.title
    assert title == "Muldoon"

    driver.implicitly_wait(0.5)

    text_box = driver.find_element(by=By.NAME, value="startTime")

    text_box.send_keys("01:00:00")
    submit_button = driver.find_element(by=By.ID, value ="plotGraphBtn")
    
    submit_button.click()

    message = driver.find_element(by=By.ID, value="message")
    value = message.text
    assert value == "Received!"

    driver.quit()