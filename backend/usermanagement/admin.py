from django.contrib import admin
from .models import MyUser, Friend, Notification

# Register your models here.
admin.site.register(MyUser)
admin.site.register(Friend)
admin.site.register(Notification)