from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.

# Referenced the following sites:
# https://medium.com/@poorva59/implementing-simple-jwt-authentication-in-django-rest-framework-3e54212f14da
# https://testdriven.io/blog/django-custom-user-model/
# https://simpleisbetterthancomplex.com/tutorial/2018/01/18/how-to-implement-multiple-user-types-with-django.html

class PetPalUserManager(BaseUserManager):
    def create_user(self, email, password=None, is_pet_shelter=False, is_pet_seeker=False, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        if is_pet_shelter:
            user.is_pet_shelter = True
        elif is_pet_seeker:
            user.is_pet_seeker = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        user = self.create_user(email, password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class PetPalUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_pet_seeker = models.BooleanField(default=False)
    is_pet_shelter = models.BooleanField(default=False)

    objects = PetPalUserManager()
    USERNAME_FIELD = 'email'


class PetSeeker(models.Model):
    user = models.OneToOneField(PetPalUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    avatar = models.ImageField(upload_to="avatar/")


class PetShelter(models.Model):
    user = models.OneToOneField(PetPalUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    mission_statement = models.TextField()
    address = models.CharField(max_length=250)
    phone_number = models.CharField(max_length=20)



