from threading import Thread
from queue import Queue
import serial
import time
import re
from core.models import Temperature


SERIAL_PORT = "/dev/ttyACM0"


class TemperatureMsg:
    regex = re.compile(r"S;\d+(;[01]){3};F")

    def __new__(cls, tram):
        if cls.regex.search(tram) is None:
            return None
        else:
            return super().__new__(cls)

    def __init__(self, msg):
        self.msg = msg
        self.temp = int(msg.split(";")[1])/100
        obj = self.save()
        self.date = obj.created_at

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
                    print(tram)
                    # t = TemperatureMsg(tram)
                    # if t is not None :
                    #     if self.q.full():
                    #         self.q.get()
                    #     self.q.put_nowait(t.get())
                    #     t.save()
                    time.sleep(2)
            except Exception as e:
                ser = None
                print(e)
                time.sleep(1)



if __name__=='__main__':
    SerialThread().start()

