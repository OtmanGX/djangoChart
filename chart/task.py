from threading import Thread
from queue import Queue
import serial
import time
import re
from core.models import Temperature
from datetime import datetime

from django.utils import timezone

SERIAL_PORT = "/dev/ttyUSB0"


class TemperatureMsg:
    regex = re.compile(r"S;\d+;\d+;[01];\d+;F")
    lastValue = 0

    def __new__(cls, tram):
        if cls.regex.search(tram) is None:
            return None
        else:
            return super().__new__(cls)

    def __init__(self, msg):
        self.msg = msg
        self.temp = float(msg.split(";")[1])/100
        self.date = datetime.now(tz=timezone.utc)
        # if abs(self.temp-TemperatureMsg.lastValue) > 0.5:
        if self.temp != TemperatureMsg.lastValue:
            self.save()
            TemperatureMsg.lastValue = self.temp
        # obj = self.save()
        # self.date = obj.created_at

    def save(self):
        return Temperature.objects.create(value=self.temp)

    def get(self):
        return {'date':self.date, 'value':self.temp}





class SerialThread(Thread):
    def __init__(self):
        super().__init__(name="serialThread")
        self.q = Queue(maxsize=3)
        self.count = 0
    def run(self):
        ser = None
        while (True):
            try:
                if ser is None:
                    ser = serial.Serial(SERIAL_PORT, 9600, timeout=2)
                    time.sleep(2)
                if ser is not None :
                    tram = ser.readline().decode().strip()
                    t = TemperatureMsg(tram)
                    if t is not None :
                        print(t.temp)
                        if self.q.full():
                            self.q.get()
                        self.q.put(t.get())
                        # t.save()
            except Exception as e:
                ser = None
                print(e)
                time.sleep(1)



if __name__=='__main__':
    datetime.now(tz=timezone.utc)
    # SerialThread().start()

