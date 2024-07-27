# Generated by Django 5.0.7 on 2024-07-26 17:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("health", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="feedingrecord",
            name="feeding_schedule",
            field=models.CharField(
                blank=True,
                choices=[("routine", "Routine Feeding"), ("free", "Free Feeding")],
                max_length=20,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="feedingrecord",
            name="food_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("wet", "Wet"),
                    ("dry", "Dry"),
                    ("homemade", "Homemade"),
                    ("other", "Other"),
                ],
                max_length=20,
                null=True,
            ),
        ),
    ]
