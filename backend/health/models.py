from django.db import models
from django.contrib.postgres.fields import ArrayField

class CatProfile(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=50, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    breed = models.CharField(max_length=100, blank=True, null=True)
    microchip_number = models.CharField(max_length=100, blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)

    def __str__(self):
        return self.name

class HealthRecord(models.Model):
    cat = models.ForeignKey(CatProfile, on_delete=models.CASCADE)
    weight = models.FloatField(blank=True, null=True)
    last_vaccination = models.DateField(blank=True, null=True)
    last_antiparasitic = models.DateField(blank=True, null=True)
    last_vet_appointment = models.DateField(blank=True, null=True)
    flea_tick_prevention = models.DateField(blank=True, null=True)
    deworming_treatment = models.DateField(blank=True, null=True)
    medication_records = models.TextField(blank=True, null=True)
    vet_visit_details = models.TextField(blank=True, null=True)
    warning_signs = models.TextField(blank=True, null=True)
    diet = models.TextField(blank=True, null=True)
    exercise_routine = models.JSONField(blank=True, null=True)
    grooming_schedule = models.JSONField(blank=True, null=True)
    teeth_cleaning = models.JSONField(blank=True, null=True)
    hairball_prevention = models.JSONField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True, null=True, blank=True)  # Make this nullable

    def __str__(self):
        return f"HealthRecord for {self.cat.name}"

class Event(models.Model):
    title = models.CharField(max_length=100)
    start = models.DateTimeField()
    end = models.DateTimeField()
    allDay = models.BooleanField(default=False)
    location = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

class FeedingRecord(models.Model):
    cat = models.ForeignKey(CatProfile, on_delete=models.CASCADE)
    date = models.DateField(null=True, blank=True)
    time = models.TimeField(null=True, blank=True)
    portion_size = models.FloatField(null=True, blank=True)
    food_brand = models.CharField(max_length=100, null=True, blank=True)
    food_type = models.CharField(max_length=20, choices=[
        ('wet', 'Wet'),
        ('dry', 'Dry'),
        ('homemade', 'Homemade'),
        ('other', 'Other')
    ], null=True, blank=True)
    feeding_schedule = models.CharField(max_length=20, choices=[
        ('routine', 'Routine Feeding'),
        ('free', 'Free Feeding')
    ], null=True, blank=True)

    def __str__(self):
        return f"{self.cat.name}'s Feeding Record"

class InteractionRecord(models.Model):
    cat = models.ForeignKey(CatProfile, on_delete=models.CASCADE)
    date = models.DateField(null=True, blank=True)
    played = models.BooleanField(default=False)
    sleep_quality = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.cat.name}'s Interaction Record"

class HairballRecord(models.Model):
    cat = models.ForeignKey(CatProfile, on_delete=models.CASCADE)
    date = models.DateField(null=True, blank=True)
    method = models.CharField(max_length=100, null=True, blank=True)
    vomited = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.cat.name}'s Hairball Record"
    
class Resource(models.Model):
    CATEGORY_CHOICES = [
        ('behavior', 'Behavior'),
        ('diseases', 'Diseases'),
        ('enrichment', 'Enrichment'),
        ('care', 'Care'),
        ('grooming', 'Grooming'),
        ('nutrition', 'Nutrition'),
        ('vaccination', 'Vaccination'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=255)
    content = models.TextField()
    url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title

class Recommendation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('done', 'Done'),
        ('not_applicable', 'Not Applicable')
    ]
    
    cat = models.ForeignKey(CatProfile, on_delete=models.CASCADE)
    recommendation_type = models.CharField(max_length=50)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    resource = models.ForeignKey(Resource, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Recommendation for {self.cat.name}"



