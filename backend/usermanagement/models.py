from django.db import models

class User(models.Model):
    user_name = models.CharField(max_length=30, unique=True)
    name = models.CharField(blank=True, max_length=100)
    password = models.CharField(max_length=128) 
