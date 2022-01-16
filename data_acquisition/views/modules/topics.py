#!/usr/bin/env python3.8

import rospy
from geometry_msgs.msg import PoseStamped
from sensor_msgs.msg import PointCloud2
from std_msgs.msg import Float64MultiArray
from .msg._LidarOutput import LidarOutput
from jsk_recognition_msgs.msg import BoundingBoxArray


class TopicMonitor:

    def __init__(self):
        rospy.init_node('topic_monitor', anonymous=True, disable_signals=True)
        rospy.Subscriber('/current_pose', PoseStamped, self.pose_callback)
        rospy.Subscriber('/pandar_points', PointCloud2, self.point_callback)
        rospy.Subscriber('/lidar_output', LidarOutput, self.lidar_callback)
        rospy.Subscriber('/command', Float64MultiArray, self.command_callback)

        self.res = {}
        self.position = {'timestamp': -99999, 'data': []}
        self.cloud = {'timestamp': -99999, 'data': 0}
        self.command = {'timestamp': -99999, 'data': []}
        self.lidar = {'timestamp': -99999, 'data': 0}

    def get(self):
        now_time = rospy.Time.now().to_sec()

        if now_time - self.position['timestamp'] > 1:
            self.res['position'] = False
        else:
            self.res['position'] = self.position

        if now_time - self.cloud['timestamp'] > 1:
            self.res['cloud'] = False
        else:
            self.res['cloud'] = self.cloud

        if now_time - self.lidar['timestamp'] > 1:
            self.res['lidar'] = False
        else:
            self.res['lidar'] = self.lidar

        if now_time - self.command['timestamp'] > 1:
            self.res['command'] = False
        else:
            self.res['command'] = self.command

        return self.res

    def pose_callback(self, data):
        self.position = {'timestamp': data.header.stamp.to_sec(),
                         'data': [round(data.pose.position.x, 2),
                                  round(data.pose.position.y, 2),
                                  round(data.pose.orientation.w, 2)]}

    def point_callback(self, data):
        self.cloud = {'timestamp': data.header.stamp.to_sec(),
                      'data': data.height * data.width}

    def command_callback(self, data):
        self.command = {'timestamp': rospy.Time.now().to_sec(),
                        'data': data.data}

    def lidar_callback(self, data):
        self.lidar = {'timestamp': data.header.stamp.to_sec(),
                      'data': len(data.global_bounding_box_array.boxes)}

# if __name__ == '__main__':
#     obj = TopicMonitor()
#     while True:
#         time.sleep(0.1)
#         obj.get()
