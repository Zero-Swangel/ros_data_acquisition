#!/usr/bin/env python3.8

import rospy
from geometry_msgs.msg import PoseStamped
from sensor_msgs.msg import PointCloud2
from std_msgs.msg import Float64MultiArray
from visualization_msgs.msg import Marker
from .msg._LidarOutput import LidarOutput
from jsk_recognition_msgs.msg import BoundingBoxArray


class TopicMonitor:

    def __init__(self):
        rospy.init_node('topic_monitor', anonymous=True, disable_signals=True)
        rospy.Subscriber('/current_pose', PoseStamped, self.pose_callback)
        rospy.Subscriber('/pandar_points', PointCloud2, self.point_callback)
        rospy.Subscriber('/lidar_output', LidarOutput, self.lidar_callback)
        rospy.Subscriber('/command', Float64MultiArray, self.command_callback)
        rospy.Subscriber('/record_way', Marker, self.record_way_callback)
        rospy.Subscriber('/spline_way', Marker, self.spline_way_callback)

        self.res = {}
        self.position = {'timestamp': -99999, 'data': []}
        self.cloud = {'timestamp': -99999, 'data': 0}
        self.command = {'timestamp': -99999, 'data': []}
        self.lidar = {'timestamp': -99999, 'data': {}}
        self.record_way = {'timestamp': -99999, 'data': []}
        self.spline_way = {'timestamp': -99999, 'data': []}

    def get(self):
        now_time = rospy.Time.now().to_sec()
        print('now time:', now_time)

        self.res['position'] = self.position
        self.res['cloud'] = self.cloud
        self.res['lidar'] = self.lidar
        self.res['command'] = self.command
        self.res['record_way'] = self.record_way
        self.res['spline_way'] = self.spline_way

        # if now_time - self.position['timestamp'] > 1:
        #     print('current_pose late.', self.position['timestamp'])
        #     self.res['position'] = False
        # else:
        #     self.res['position'] = self.position
        #
        # if now_time - self.cloud['timestamp'] > 1:
        #     print('pandar_points late.', self.cloud['timestamp'])
        #     self.res['cloud'] = False
        # else:
        #     self.res['cloud'] = self.cloud
        #
        # if now_time - self.lidar['timestamp'] > 1:
        #     print('lidar_output late.', self.lidar['timestamp'])
        #     self.res['lidar'] = False
        # else:
        #     self.res['lidar'] = self.lidar
        #
        # if now_time - self.command['timestamp'] > 1:
        #     print('command late.', self.command['timestamp'])
        #     self.res['command'] = False
        # else:
        #     self.res['command'] = self.command
        # if now_time - self.record_way['timestamp'] > 1:
        #     print('record_way late.', self.record_way['timestamp'])
        #     self.res['record_way'] = False
        # else:
        #     self.res['record_way'] = self.record_way
        # if now_time - self.spline_way['timestamp'] > 1:
        #     print('spline_way late.', self.spline_way['timestamp'])
        #     self.res['spline_way'] = False
        # else:
        #     self.res['spline_way'] = self.spline_way

        return self.res

    def pose_callback(self, data):
        self.position = {'timestamp': data.header.stamp.to_sec(),
                         'data': [round(data.pose.position.x, 2), round(data.pose.position.y, 2),
                                  round(data.pose.orientation.w, 2)]}

    def point_callback(self, data):
        self.cloud = {'timestamp': data.header.stamp.to_sec(), 'data': data.height * data.width}

    def command_callback(self, data):
        self.command = {'timestamp': rospy.Time.now().to_sec(),
                        'data': [round(data.data[0], 2), round(data.data[1], 2), round(data.data[2], 2),
                                 round(data.data[3], 2), round(data.data[4], 2), round(data.data[5], 2)]}

    def lidar_callback(self, data):
        boxes = []
        for box in data.global_bounding_box_array.boxes:
            boxes.append([box.pose.position.x, box.pose.position.y])
        self.lidar = {'timestamp': data.header.stamp.to_sec(),
                      'data': {'size': len(data.global_bounding_box_array.boxes), 'boxes': boxes}}

    def record_way_callback(self, data):
        points = []
        if data.id == 0:
            for point in data.points:
                points.append([point.x, point.y])
        self.record_way = {'timestamp': data.header.stamp.to_sec(), 'data': points}

    def spline_way_callback(self, data):
        points = []
        if data.id == 2:
            for point in data.points:
                points.append([point.x, point.y])
        self.spline_way = {'timestamp': data.header.stamp.to_sec(), 'data': points}

# if __name__ == '__main__':
#     obj = TopicMonitor()
#     while True:
#         time.sleep(0.1)
#         obj.get()
