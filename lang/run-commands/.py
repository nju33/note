# coding: utf-8
import subprocess

wc_process = subprocess.Popen(['wc'], stdin=subprocess.PIPE)
wc_process.communicate(subprocess.check_output(['date', '+%M:%H:%S']))

# 以下みたいなのは古い
# import commands
# import os

# """ stdoutはされない、その内容は`result`へ入る  """
# print commands.getoutput('echo a')
# """ `os.system`は終了ステータスを返す,stdoutもされる """
# print os.system('echo a')
