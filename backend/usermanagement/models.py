from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, user_name, password=None, **extra_fields):
        if not user_name:
            raise ValueError('The Username field must be set')
        user = self.model(user_name=user_name, **extra_fields)
        user.set_password(password)  
        user.save(using=self._db)
        return user

    def create_superuser(self, user_name, password=None, **extra_fields):
        return self.create_user(user_name, password, **extra_fields)

class MyUser(AbstractBaseUser):
    user_name = models.CharField(max_length=30, unique=True)  
    name = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True, null=True)
    avatar = models.TextField(blank=True, default='Avatars/default-avatar.jpg')
    objects = CustomUserManager()

    USERNAME_FIELD = 'user_name'   
    REQUIRED_FIELDS = ['name']   

    def __str__(self):
        return self.user_name

class Friend(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='friends')
    friend = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='friend_of')
    is_blocked = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'friend')

    def __str__(self):
        return f"{self.user.user_name} -> {self.friend.user_name} (Blocked: {self.is_blocked})"

