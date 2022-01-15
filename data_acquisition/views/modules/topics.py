#!/usr/bin/env python3.8

import rospy, json, time
from geometry_msgs.msg import PoseStamped


class TopicMonitor:

    def __init__(self):
        rospy.init_node('topic_monitor', anonymous=True, disable_signals=True)
        rospy.Subscriber("/current_pose", PoseStamped, self.pose_callback)

        self.res = {}
        self.position = {'timestamp': -99999, 'data': []}

    def get(self):
        now_time = rospy.Time.now().to_sec()

        if now_time - self.position['timestamp'] > 1:
            self.res['position'] = False
        else:
            self.res['position'] = self.position

        return self.res

    def pose_callback(self, data):
        self.position = {'timestamp': data.header.stamp.to_sec(),
                         'data': [round(data.pose.position.x, 2),
                                  round(data.pose.position.y, 2),
                                  round(data.pose.orientation.w, 2)]}


# if __name__ == '__main__':
#     obj = TopicMonitor()
#     while True:
#         time.sleep(0.1)
#         obj.get()
