from django.db import models
from accounts import models as account_models

     
class PetListing(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('adopted', 'Adopted'),
        ('pending', 'Pending'),
        ('unavailable', 'Unavailable'),
    ]

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]

    SIZE_CHOICES = [
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
        ('extra_large', 'Extra Large'),
    ]

    name = models.CharField(max_length=100)
    breed = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    size = models.CharField(max_length=20, choices=SIZE_CHOICES)
    color = models.CharField(max_length=50)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='available')
    description = models.TextField()
    shelter = models.ForeignKey(account_models.PetShelter, on_delete=models.CASCADE, related_name='pet_listings')
    date_posted = models.DateTimeField(auto_now_add=True)
    characteristics = models.CharField(max_length=255) # may need to be parsed later(or omit because we already meet requirments)
    avatar = models.ImageField(upload_to="avatar/", default=None, null=True)
    

    def __str__(self):
        return f"{self.name}"



class Application(models.Model):
     STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
        ('withdrawn', 'Withdrawn'),
    ]
     
    # Foreign keys
    # pet_shelter = models.ForeignKey(User, on_delete=models.CASCADE) contained in pet listing
     pet_seeker = models.ForeignKey(account_models.PetPalUser, on_delete=models.CASCADE, null=True, blank=True)
     pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE, related_name='applications', null=True, blank=True)
    
    # Other info
     pet_name = models.CharField(max_length=100,null=True) 
     seeker_name = models.CharField(max_length=100,null=True)
     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
     creation_time = models.DateTimeField(auto_now_add=True)
     last_update_time = models.DateTimeField(auto_now=True)
     seeker_home_type = models.CharField(max_length=100)
     seeker_yard_size = models.CharField(max_length=100)
     seeker_pet_care_experience = models.CharField(max_length=100)
     seeker_previous_pets = models.CharField(max_length=100)

    