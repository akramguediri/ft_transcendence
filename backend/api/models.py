from django.db import models

class Student(models.Model):
    name = models.CharField(blank=True, max_length=30)
    first_name = models.CharField(blank=True, max_length=30)
    last_name = models.CharField(blank=True, max_length=30)
    email = models.CharField(blank=True, max_length=64)
    password = models.CharField(blank=True, max_length=30)

