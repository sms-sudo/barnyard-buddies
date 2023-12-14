from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.views import APIView
from .models import PetPalUser, PetSeeker, PetShelter
from .serializers import PetSeekerSerializer, PetShelterSerializer, PetShelterUpdateSerializer, PetSeekerUpdateSerializer, UserTypeSerializer, ShelterUserSerializer, SeekerUserSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from petListing.models import Application 


class PetPalUserTypeView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserTypeSerializer(user)
        return Response({'user_id': serializer.data['id'], 'email': serializer.data['email'], 'is_pet_shelter': serializer.data['is_pet_shelter']}, status=status.HTTP_200_OK)

class RetrieveUserInformation(generics.RetrieveAPIView):
    def get_serializer_class(self):
        is_pet_shelter = self.request.user.is_pet_shelter 
        if is_pet_shelter:
            return ShelterUserSerializer
        elif not is_pet_shelter:
            return SeekerUserSerializer
        else:
            pass
    def get_object(self):
        is_pet_shelter = self.request.user.is_pet_shelter
        user = self.request.user

        if is_pet_shelter:
            return PetShelter.objects.get(user=user)
        elif not is_pet_shelter:
            return PetSeeker.objects.get(user=user)
        else:
            pass
    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        user_info_serializer = self.get_serializer(instance)
        return Response(user_info_serializer.data, status=status.HTTP_200_OK)

### PET SEEKER VIEWS ###
class PetSeekerRegisterView(APIView):
    # Create PetSeeker and its associated account
    def post(self, request):
        pet_seeker_serializer = PetSeekerSerializer(data = request.data)
        if pet_seeker_serializer.is_valid():
            if PetPalUser.objects.filter(email=request.data.get('email')).exists():
                return Response({"error": "An account is associated with this email already."}, status=status.HTTP_400_BAD_REQUEST) 
            avatar_file = request.FILES.get('avatar')
            pet_pal_user = PetPalUser.objects.create_user(email=request.data['email'], password=request.data['password'], is_pet_seeker=True)
            pet_seeker_data = pet_seeker_serializer.validated_data
            password = pet_seeker_data.pop('password')
            password2 = pet_seeker_data.pop('password2')
            email = pet_seeker_data.pop('email')
            if avatar_file:
                pet_seeker_data['avatar'] = avatar_file
            pet_seeker = PetSeeker.objects.create(user=pet_pal_user, **pet_seeker_data)
            return Response(PetSeekerSerializer(pet_seeker).data, status=status.HTTP_201_CREATED)
        return Response(pet_seeker_serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

class PetSeekerDetailUpdateDeleteView(APIView):
    permission_classes=[IsAuthenticated]
    # Get detail of a PetSeeker with a pending application if the user is a pet_shelter
    def get(self, request, pk):
        pet_seeker = get_object_or_404(PetSeeker, pk=pk)
        # active_application = Application.objects.filter(pet_listing__shelter__user = request.user, pet_seeker=pet_seeker.user, status="pending").first()
        active_application = Application.objects.filter(pet_seeker=pet_seeker.user, status="pending").first()

        if active_application:
            pet_seeker_serializer = PetSeekerSerializer(pet_seeker)
            return Response(pet_seeker_serializer.data)
        else:
            return Response("You are attempting to perform an unauthorized action", status=status.HTTP_403_FORBIDDEN)
    
    # Update a PetSeeker's info 
    def put(self, request, pk):
        pet_seeker = get_object_or_404(PetSeeker, pk=pk)
        if request.user == pet_seeker.user:
            pet_seeker_update_serializer = PetSeekerUpdateSerializer(pet_seeker, data=request.data)
            if pet_seeker_update_serializer.is_valid():
                if 'new_password' not in request.data:
                    new_password = pet_seeker_update_serializer.fields.pop('new_password', None)
                    new_password2 = pet_seeker_update_serializer.fields.pop('new_password2', None)
                else:
                    new_password = pet_seeker_update_serializer.validated_data.pop('new_password')
                    new_password2 = pet_seeker_update_serializer.validated_data.pop('new_password2')
                    pet_seeker.user.set_password(new_password)
                    pet_seeker.user.save()
                pet_seeker_update_serializer.save()
                return Response(pet_seeker_update_serializer.data)
            return Response(pet_seeker_update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("You are attempting to perform an unauthorized action", status=status.HTTP_403_FORBIDDEN)
    # Delete a PetSeeker's account
    def delete(self, request, pk):
        pet_seeker = get_object_or_404(PetSeeker, pk=pk)
        if pet_seeker.user == request.user:
            pet_seeker_name = pet_seeker.name
            pet_seeker_email = pet_seeker.user.email
            pet_seeker.user.delete()    
            return Response(f"The Pet Seeker named {pet_seeker_name} and their associated account {pet_seeker_email} have been deleted successfully.", status=status.HTTP_204_NO_CONTENT)
        else:
            return Response("You are attempting to perform an unauthorized action", status=status.HTTP_403_FORBIDDEN)


### PET SHELTER VIEWS ###
class PetShelterRegisterListView(APIView):
    # Create a PetShelter and its associated account
    def post(self, request):
        pet_shelter_serializer = PetShelterSerializer(data=request.data)
        if pet_shelter_serializer.is_valid():
            if PetPalUser.objects.filter(email=request.data.get('email')).exists():
                return Response({"error": "An account is associated with this email already."}, status=status.HTTP_400_BAD_REQUEST) 
            pet_pal_user = PetPalUser.objects.create_user(email=request.data['email'], password=request.data['password'], is_pet_shelter=True)
            email = pet_shelter_serializer.validated_data.pop('email')
            password = pet_shelter_serializer.validated_data.pop('password')
            password2 = pet_shelter_serializer.validated_data.pop('password2')
            pet_shelter = PetShelter.objects.create(user=pet_pal_user, **pet_shelter_serializer.validated_data)
            return Response(PetShelterSerializer(pet_shelter).data, status=status.HTTP_201_CREATED)
        return Response(pet_shelter_serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    # List all Pet Shelters
    def get(self, request):
        pet_shelters = PetShelter.objects.all()
        pet_shelter_serializer = PetShelterSerializer(pet_shelters, many=True)
        return Response(pet_shelter_serializer.data)
    
class PetShelterDetailUpdateDeleteView(APIView):
    # Get a PetShelter Detail
    def get(self, request, pk):
        pet_shelter = get_object_or_404(PetShelter, pk=pk)
        pet_shelter_serializer = PetShelterSerializer(pet_shelter)
        return Response(pet_shelter_serializer.data)
    # Update a Pet Shelter
    def put(self, request, pk):
        pet_shelter = get_object_or_404(PetShelter, pk=pk)
        if request.user == pet_shelter.user: 
            pet_shelter_update_serializer = PetShelterUpdateSerializer(pet_shelter, data=request.data, partial = True)
            if pet_shelter_update_serializer.is_valid():
                if 'new_password' not in request.data:
                    new_password = pet_shelter_update_serializer.fields.pop('new_password', None)
                    new_password2 = pet_shelter_update_serializer.fields.pop('new_password2', None)
                else:
                    new_password = pet_shelter_update_serializer.validated_data.pop('new_password')
                    new_password2 = pet_shelter_update_serializer.validated_data.pop('new_password2')
                    pet_shelter.user.set_password(new_password)
                    pet_shelter.user.save()
                pet_shelter_update_serializer.save()
                return Response(pet_shelter_update_serializer.data)
            return Response(pet_shelter_update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("You are attempting to perform an unauthorized action", status=status.HTTP_403_FORBIDDEN)
    # Delete a Pet Shelter
    def delete(self, request, pk):
        pet_shelter = get_object_or_404(PetShelter, pk=pk)
        if pet_shelter.user == request.user:
            pet_shelter_name = pet_shelter.name
            pet_shelter_email = pet_shelter.user.email
            pet_shelter.user.delete()
            return Response(f"The Pet Shelter titled {pet_shelter_name} and its associated account {pet_shelter_email} have been deleted successfully.", status=status.HTTP_204_NO_CONTENT)
        else:
            return Response("You are attempting to perform an unauthorized action", status=status.HTTP_403_FORBIDDEN)

################### Added for Comment Display Functionality ###################
class PetSeekerProfileView(APIView):
    def get(self, request, pk):
        pet_seeker = get_object_or_404(PetSeeker, pk=pk)
        pet_seeker_serializer = PetSeekerSerializer(pet_seeker)

        # Extract relevant information from the serializer
        profile_data = {
            'name': pet_seeker_serializer.data.get('name'),
            'avatar_url': pet_seeker_serializer.data.get('avatar') if pet_seeker_serializer.data.get('avatar') else None,
        }

        return Response(profile_data, status=status.HTTP_200_OK)

