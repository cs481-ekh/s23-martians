from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.firefox.options import Options


from selenium.webdriver.common.by import By

# Testing for Chrome Browser
def test_title():
   try:
      service = ChromeService(executable_path=ChromeDriverManager().install())
      driver = webdriver.Chrome(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by(by=By.Name, value = "titleBar")):
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
         if(driver.find_element(by=By.NAME, value="generatePlotBtn")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("error")

def test_sensorDropDown():
   try:
      service = ChromeService(executable_path=ChromeDriverManager().install())
      driver = webdriver.Chrome(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.NAME, value="sensor")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("error")

# Testing for Firefox Browser
def test_title():
   try:
      options = Options()
      driver = webdriver.Firefox(options=options)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.Name, value = "titleBar")):
            assert True
      except: 
            assert False
      driver.quit()

   except:
      print("error")

def test_textBox():
   try:
      options = Options()
      driver = webdriver.Firefox(options=options)

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
      options = Options()
      driver = webdriver.Firefox(options=options)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.NAME, value="generatePlotBtn")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("error")

def test_sensorDropDown():
   try:
      options = Options()
      driver = webdriver.Firefox(options=options)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.NAME, value="sensor")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("error")