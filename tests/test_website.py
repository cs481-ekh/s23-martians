from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.firefox.options import Options


from selenium.webdriver.common.by import By

# Testing for Chrome Browser

def test_titleChrome():
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
      print("Error")


def test_textBoxChrome():
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
      print("Error")

def test_plotButtonChrome():
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
      print("Error")

def test_sensorDropDownChrome():
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
      print("Error")

def test_linkToMEDAChrome():
   try:
      service = ChromeService(executable_path=ChromeDriverManager().install())
      driver = webdriver.Chrome(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by_link_text("Mars 2020 PDS")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error")

# Testing for Firefox Browser

def test_titleFirefox():
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
      print("Error")

def test_textBoxFirefox():
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
      print("Error")

def test_plotButtonFirefox():
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
      print("Error")

def test_sensorDropDownFirefox():
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
      print("Error")

def test_linkToMEDAFirefox():
   try:
      options = Options()
      driver = webdriver.Firefox(options=options)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by_link_text("Mars 2020 PDS")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error")