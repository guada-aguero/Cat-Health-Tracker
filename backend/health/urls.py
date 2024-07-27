from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CatProfileViewSet, HealthRecordViewSet, EventViewSet, FeedingRecordViewSet, InteractionRecordViewSet, HairballRecordViewSet, RegisterView, RecommendationViewSet, update_recommendation_status, ResourceViewSet

router = DefaultRouter()
router.register(r'cat-profiles', CatProfileViewSet)
router.register(r'health-records', HealthRecordViewSet)
router.register(r'events', EventViewSet)
router.register(r'feeding-records', FeedingRecordViewSet)
router.register(r'interaction-records', InteractionRecordViewSet)
router.register(r'hairball-records', HairballRecordViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'recommendations', RecommendationViewSet, basename='recommendation')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/recommendations/<int:pk>/status/', update_recommendation_status, name='update_recommendation_status'),
]