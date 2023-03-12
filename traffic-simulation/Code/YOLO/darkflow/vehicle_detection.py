import cv2
from darkflow.net.build import  TFNet
import matplotlib.pyplot as plt 
import os
import time
import requests
import numpy as np

options={
   'model':'./cfg/yolo.cfg',        #specifying the path of model
   'load':'./bin/yolov2.weights',   #weights
   'threshold':0.3                  #minimum confidence factor to create a box, greater than 0.3 good
}

tfnet=TFNet(options)
inputPath = os.getcwd() + "/test_images/"
outputPath = os.getcwd() + "/output_images/"

index = 1
def detectVehicles(img):
   filename = str(index) + ".jpg"
   # global tfnet, inputPath, outputPath
   # img=cv2.imread(inputPath+filename,cv2.IMREAD_COLOR)
   # img=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
   result=tfnet.return_predict(img)
   # print(result)
   ans = 0
   for vehicle in result:
      label=vehicle['label']   #extracting label
      if(label=="car" or label=="bus" or label=="bike" or label=="truck" or label=="motorcycle" or label=="person"): 
         ans += 1   # drawing box and writing label
         # top_left=(vehicle['topleft']['x'],vehicle['topleft']['y'])
         # bottom_right=(vehicle['bottomright']['x'],vehicle['bottomright']['y'])
         # img=cv2.rectangle(img,top_left,bottom_right,(0,255,0),3)    #green box of width 5
         # img=cv2.putText(img,label,top_left,cv2.FONT_HERSHEY_COMPLEX,0.5,(0,0,0),1)   #image, label, position, font, font scale, colour: black, line width      
  
   print(f"Frame {index} has {ans} objects!")
   # outputFilename = outputPath + "output_" +filename
   # cv2.imwrite(outputFilename,img)
   # print('Output image stored at:', outputFilename)
   # plt.imshow(img)
   # plt.show()
   # return result

fileDict = ["caca"]

CAMERA_IP = "http://192.168.8.142:4747/cam/1/frame.jpg"



while (1):
   #time.sleep(0.1)
   counter = time.time()
   r = requests.get(CAMERA_IP)

   img_arr = np.asarray(bytearray(r.content), dtype=np.uint8)
   img = cv2.imdecode(img_arr, -1)

   detectVehicles(img)
   print(f"Query took {time.time() - counter}")
   index += 1
   # for filename in os.listdir(inputPath):
   #    if(filename not in fileDict and (filename.endswith(".png") or filename.endswith(".jpg") or filename.endswith(".jpeg"))):
   #       fileDict.append(filename)
   #       detectVehicles(filename)
print("Done!")

