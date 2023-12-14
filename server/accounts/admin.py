from django.contrib import admin
from .models import PetPalUser, PetSeeker, PetShelter

# Register your models here.
admin.site.register(PetPalUser)
admin.site.register(PetSeeker)
admin.site.register(PetShelter)