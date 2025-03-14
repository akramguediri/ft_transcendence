from django.contrib.auth.models import User
from django.db import models

class Student(models.Model):
    name = models.CharField(blank=True, max_length=30)
    first_name = models.CharField(blank=True, max_length=30)
    last_name = models.CharField(blank=True, max_length=30)
    email = models.CharField(blank=True, max_length=64)
    password = models.CharField(blank=True, max_length=30)


class User(models.Model):
    user_name = models.CharField(max_length=30, unique=True)
    name = models.CharField(blank=True, max_length=100)
    password = models.CharField(max_length=128) 


class GameRecord(models.Model):
    game_id = models.CharField(max_length=100, unique=True)
    player1 = models.CharField(max_length=100)
    player2 = models.CharField(max_length=100)
    result = models.CharField(max_length=10)
    winner = models.CharField(max_length=100)
    loser = models.CharField(max_length=100)
    game_mode = models.CharField(max_length=50)
    ball_size = models.IntegerField()
    paddle_speed = models.IntegerField()
    max_score = models.IntegerField()
    game_duration = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game {self.game_id} - {self.result}"