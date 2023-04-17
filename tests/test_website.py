from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By

#This page contains the testing suite for the muldoon-webapp
#At this time the testing is for the four major browsers (Chrome, Firefox, Edge, and Safari)
#The testing that is done in this file is for the elements of the website and the links to 
#other websites that must be present.  This is done with Selenium and basic calls to the 
#different drivers looking for elements and asserting true or false.
#The calls to the drivers are in Try/catch blocks incase there is an issue starting a driver 


#
# Testing for Chrome Browser
#

#Checking to see if the title bar is reachable
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
      print("Error: Failed to Start Chrome Driver. test_titleChrome()")

#Checking if the box for start time is reachable
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
      print("Error: Failed to Start Chrome Driver.  test_textBoxChrome()")

#Checking if the generate plot button is reachable
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
      print("Error: Failed to Start Chrome Driver.  test_plotButtonChrome()")

#Checking if sensor selection element is reachable
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
      print("Error: Failed to Start Chrome Driver.  test_sensorDropDownChrome()")

#Checking if the link to the Mars 2020 PDS reachable
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
      print("Error: Failed to Start Chrome Driver.  test_linkToMEDAChrome()")

#Checking if the link to Astrojack website reachable
def test_linkToAstrojackChrome():
   try:
      service = ChromeService(executable_path=ChromeDriverManager().install())
      driver = webdriver.Chrome(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by_link_text("Astrojack")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Chrome Driver.  test_linkToAstrojackChrome()")     

#
# Testing for Firefox Browser
#

#Checking to see if the title bar is reachable
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
      print("Error: Failed to Start Firefox Driver.  test_titleFirefox()")

#Checking if the box for start time is reachable
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
      print("Error: Failed to Start Firefox Driver.  test_textBoxFirefox()")

#Checking if the generate plot button is reachable
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
      print("Error: Failed to Start Firefox Driver.  test_plotButtonFirefox()")

#Checking if sensor selection element is reachable
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
      print("Error: Failed to Start Firefox Driver.  test_sensorDropDownFirefox()")

#Checking if the link to the Mars 2020 PDS reachable
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
      print("Error: Failed to Start Firefox Driver.  test_linkToMEDAFirefox()")

#Checking if the link to Astrojack website reachable
def test_linkToAstrojackFirefox():
   try:
      options = Options()
      driver = webdriver.Firefox(options=options)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by_link_text("Astrojack")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Firefox Driver.  test_linkToAstrojackFirefox()")

#
# Testing for Edge Browser
#

#Checking to see if the title bar is reachable
def test_titleEdge():
   try:
      service = Service(verbose = True)
      driver = webdriver.Edge(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by(by=By.Name, value = "titleBar")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Edge Driver.  test_titleEdge()")

#Checking if the box for start time is reachable
def test_textBoxEdge():
   try:
      service = Service(verbose = True)
      driver = webdriver.Edge(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.NAME, value="startTime")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Edge Driver.  test_textBoxEdge()")

#Checking if the generate plot button is reachable
def test_plotButtonEdge():
   try:
      service = Service(verbose = True)
      driver = webdriver.Edge(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.NAME, value="generatePlotBtn")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Edge Driver.  test_plotButtonEdge()")

#Checking if sensor selection element is reachable
def test_sensorDropDownEdge():
   try:
      service = Service(verbose = True)
      driver = webdriver.Edge(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.NAME, value="sensor")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Edge Driver.  test_sensorDropDownEdge()")

#Checking if the link to the Mars 2020 PDS reachable
def test_linkToMEDAEdge():
   try:
      service = Service(verbose = True)
      driver = webdriver.Edge(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by_link_text("Mars 2020 PDS")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Edge Driver.  test_linkToMEDAEdge()")

#Checking if the link to Astrojack website reachable
def test_linkToAstrojackEdge():
   try:
      service = Service(verbose = True)
      driver = webdriver.Edge(service=service)

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by_link_text("Astrojack")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Edge Driver.  test_linkToAstrojackEdge()")

#
# Testing for Safari Browser
#

#Checking to see if the title bar is reachable
def test_titleSafari():
   try:
   
      driver = webdriver.Safari()

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by(by=By.Name, value = "titleBar")):
            assert True
      except: 
            assert False
      driver.quit()

   except:
      print("Error: Failed to Start Safari Driver.  test_titleSafari()")

#Checking if the box for start time is reachable
def test_textBoxSafari():
   try:
   
      driver = webdriver.Safari

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.NAME, value="startTime")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Safari Driver.  test_textBoxSafari()")

#Checking if the generate plot button is reachable
def test_plotButtonSafari():
   try:
   
      driver = webdriver.Safari

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.NAME, value="generatePlotBtn")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Safari Driver.  test_plotButtonSafari()")

#Checking if sensor selection element is reachable
def test_sensorDropDownSafari():
   try:
   
      driver = webdriver.Safari

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element(by=By.NAME, value="sensor")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Safari Driver.  test_sensorDropDownSafari()")

#Checking if the link to the Mars 2020 PDS reachable
def test_linkToMEDASafari():
   try:
   
      driver = webdriver.Safari

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by_link_text("Mars 2020 PDS")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Safari Driver.  test_linkToMEDASafari()")

#Checking if the link to Astrojack website reachable
def test_linkToAstrojackSafari():
   try:
   
      driver = webdriver.Safari

      driver.get("https://sdp.boisestate.edu/s23-martians/")
    
      driver.implicitly_wait(1)
      try:
         if(driver.find_element_by_link_text("Astrojack")):
            assert True
      except: 
            assert False

      driver.quit()
   except:
      print("Error: Failed to Start Safari Driver.  test_linkToAstrojackSafari()")
