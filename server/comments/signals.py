from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Comment
from notifications.models import Notification
from django.contrib.contenttypes.models import ContentType
from accounts.models import PetSeeker, PetShelter, PetPalUser

@receiver(post_save, sender=Comment)
def create_notification_on_new_comment(sender, instance, created, **kwargs):
    if created:

        username = None
        # Check which user type made the comment and get their username
        if instance.comment_made_by_the_id_pet_seeker:
            username = instance.comment_made_by_the_id_pet_seeker.name
        elif instance.comment_made_by_the_id_pet_shelter:
            username = instance.comment_made_by_the_id_pet_shelter.name


        # Determine the recipient based on the content type of the comment
        # object id is NOT user_id
        if instance.is_application == 1:
            recipient = PetSeeker.objects.get(pk=instance.object_id).user
        elif instance.is_application == 0:
            recipient = PetShelter.objects.get(pk=instance.object_id).user
        else:
            recipient = None

        # Create notification if a username and recipient were found
        if username and recipient:
            notification = Notification.objects.create(
                user=instance.comment_made_by_the_user,
                recipient=recipient,
                message=f"New comment made by {username}",
                related_comment=instance
            )
