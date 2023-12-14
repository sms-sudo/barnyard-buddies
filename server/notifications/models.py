from django.db import models
from django.conf import settings
from comments.models import Comment
from petListing.models import Application
from accounts.models import PetPalUser

class Notification(models.Model):
    # Sender of the comment
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='sent_notifications'  # unique related name for user
    )

    # Recipient of the comment
    recipient = models.ForeignKey(PetPalUser, null=True, on_delete=models.CASCADE)

    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    related_comment = models.ForeignKey(Comment, null=True, on_delete=models.CASCADE)
    related_application = models.ForeignKey(Application, null=True, on_delete=models.CASCADE)
    def str(self):
        return f"Notification for {self.user.email} - Read: {self.is_read}"
