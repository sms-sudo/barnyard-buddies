from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, filters, permissions, serializers, generics
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, UpdateAPIView
from .models import PetListing, Application
from accounts.models import PetShelter, PetSeeker
from .serializer import PetListingSerializer, ApplicationSerializer, ApplicationUpdateSerializer, PetListingSummarySerializer, PetListingUpdateSerializer
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from comments.pagination import NoPagination



class IsSheltersManager(permissions.BasePermission):
    """
    Custom permission to only allow SheltersManagers to create a listing.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_pet_shelter
    
class IsOwnerOrSheltersManager(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or SheltersManagers to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the object
        return obj.shelter.user == request.user

class PetListingUpdateDeleteDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    pagination_class = NoPagination

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.request.method == 'GET':
            return []
        return [IsAuthenticated(), IsSheltersManager(), IsOwnerOrSheltersManager()]

    def get(self, request, pk):
        petlisting = get_object_or_404(PetListing, pk=pk)
        serializer = PetListingSerializer(petlisting)
        return Response(serializer.data)

    def put(self, request, pk):
        petlisting = get_object_or_404(PetListing, pk=pk)
        if petlisting.shelter.user != request.user:
            return Response({"error": "You are not authorized to update this listing."}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = PetListingUpdateSerializer(petlisting, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        petlisting = get_object_or_404(PetListing, pk=pk)
        if petlisting.shelter.user != request.user:
            return Response({"error": "You are not authorized to delete this listing."}, status=status.HTTP_401_UNAUTHORIZED)
        
        petlisting.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PetListingCreateList(generics.GenericAPIView):
    pagination_class = NoPagination
    authentication_classes = [JWTAuthentication]
    queryset = PetListing.objects.all()
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status', 'age', 'size', 'shelter', 'gender']
    ordering_fields = ['age', 'size']

    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        return [IsAuthenticated(), IsSheltersManager()]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PetListingSummarySerializer
        return PetListingSerializer

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



##################### Application Views #####################

class CreateApplication(CreateAPIView):
    pagination_class = NoPagination
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        pet_listing = get_object_or_404(PetListing, pk=self.kwargs['pk'], status='available')
        # Check if the user has already applied for this listing
        existing_application = Application.objects.filter(
            pet_seeker=self.request.user,
            pet_listing=pet_listing
        ).exists()

        if self.request.user.is_pet_shelter:
            raise PermissionDenied(detail="Shelters cannot create applications.")

        if existing_application:
            raise serializers.ValidationError("You have already applied for this listing.")
        seeker_profile = PetSeeker.objects.filter(user=self.request.user).first()
        seeker_name = seeker_profile.name if seeker_profile else "Unknown"

        serializer.save(pet_listing=pet_listing, pet_seeker=self.request.user, pet_name=pet_listing.name, seeker_name=seeker_name)


class UpdateApplication(UpdateAPIView):
    pagination_class = NoPagination
    print("view called")
    serializer_class = ApplicationUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        application = get_object_or_404(Application, id=self.kwargs['pk'])
        
        # Shelter can only update the status of an application from pending to accepted or denied.
        # Pet seeker can only update the status of an application from pending or accepted to withdrawn.
        # Details of an application cannot be updated once submitted/created, except for its status
        return application

    def perform_update(self, serializer):
        super().perform_update(serializer)

class GetApplication(RetrieveAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        application = get_object_or_404(Application, id=self.kwargs['pk'])

        # Ensure that the user is authorized to view the application

        return application
    
class GetShelterApplicationsList(APIView):
    pagination_class = NoPagination
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status']
    ordering_fields = ['creation_time', 'last_update_time']
    def get(self, request, user_id):
        print(user_id)
        # Filter applications where the pet_listing's shelter's user matches the user_id
        applications = Application.objects.filter(pet_listing__shelter__user=user_id)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetSeekerApplicationList(APIView):
    pagination_class = NoPagination
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status']
    ordering_fields = ['creation_time', 'last_update_time']
    def get(self, request, user_id):
        print(user_id)
        # Assuming the Application model has a ForeignKey to User model as `pet_seeker`
        applications = Application.objects.filter(pet_seeker=user_id)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

