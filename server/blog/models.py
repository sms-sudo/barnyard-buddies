from django.db import models
from accounts import models as account_models

class Blog(models.Model):
    author = models.ForeignKey(account_models.PetPalUser, on_delete=models.CASCADE, related_name='blog')
    title = models.CharField(max_length=100)
    content = models.TextField()
    likes = models.PositiveIntegerField()
    date_posted = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to="avatar/", default=None, null=True)
    shelter_name = models.CharField(max_length=100, default=None, null=True)
    liked_by_users = models.ManyToManyField(account_models.PetPalUser, related_name='liked_blogs', blank=True)

    def is_liked_by_user(self, user):
        return self.liked_by_users.filter(pk=user.pk).exists()
