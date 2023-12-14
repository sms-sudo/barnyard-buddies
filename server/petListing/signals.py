from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Application
from accounts.models import PetSeeker, PetShelter
from notifications.models import Notification

@receiver(post_save, sender=Application)
def create_notification_on_application_status_change(sender, instance, created, **kwargs):
    print("signal called")
    #omit and instance.status != instance.previous_status
    if not created :
        # Assuming `Application` has a relation to `PetSeeker` (applicant) and `PetListing` (which has a relation to `PetShelter`)
        pet_seeker_user = instance.pet_seeker
        pet_shelter_user = instance.pet_listing.shelter.user
        print(pet_seeker_user)
        print(pet_shelter_user)

        # Creating notification for Pet Seeker
        Notification.objects.create(
            user=pet_shelter_user,
            recipient=pet_seeker_user,
            message=f"Your application status has been updated to {instance.status}.",
            related_application=instance
        )

        # Creating notification for Pet Shelter
        Notification.objects.create(
            user=pet_seeker_user,
            recipient=pet_shelter_user,
            message=f"Application for {instance.pet_listing.name} has been updated to {instance.status}.",
            related_application=instance
        )
