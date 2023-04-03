from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager


from selenium.webdriver.common.by import By

def test_title():
   try:
      service = ChromeService(executable_path=ChromeDriverManager().install())
    
      driver = webdriver.Chrome(service=service)
    
        
      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by_css_selector("titleBar")):
            assert True
      except: 
            assert False
      driver.quit()

   except:
      print("error")


def test_textBox():
   try:
      service = ChromeService(executable_path=ChromeDriverManager().install())
      driver = webdriver.Chrome(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.NAME, value="startTime")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("error")

def test_plotButton():
   try:
      service = ChromeService(executable_path=ChromeDriverManager().install())
      driver = webdriver.Chrome(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.NAME, value="plotGraphBtn")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("error")
