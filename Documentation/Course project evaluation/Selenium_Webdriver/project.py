from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


driver = webdriver.Chrome()
driver.get("https://co-edit-live.netlify.app/auth")

WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "username")))

driver.find_element(By.ID, "username").send_keys("Demo")  # Your username
driver.find_element(By.ID, "password").send_keys("123456789")  # Your password

driver.find_element(By.XPATH, "//button[@type='submit']").click()

print("Successfully logged into the CoEdit website.")

WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//div[text()='Projects']")))

driver.find_element(By.XPATH, "//div[text()='Projects']").click()

print("Successfully navigated to the Projects page.")

driver.find_element(By.CSS_SELECTOR, "button svg[data-testid='AddRoundedIcon']").click()

print("Clicked the button containing the SVG.")

WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "project-name")))

input_field = driver.find_element(By.ID, "project-name")
input_field.send_keys("New Project")

driver.find_element(By.XPATH, "//button[@type='submit']").click()

print("Entered text into the 'Project Name' input field.")

# Running the browser indefinitely
try:
    print("Browser is open. Close it manually when done.")
    while True:  # Infinite loop
        time.sleep(1)  # Prevent high CPU usage
except KeyboardInterrupt:
    print("\nExiting script.")
