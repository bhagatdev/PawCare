from django.db import models

class ChatLog(models.Model):
    """
    Anonymized Symptom Checker chat logs for veterinary triage analytics and auditing.
    """
    pet_species = models.CharField(max_length=50, blank=True, default='Pet')
    user_message = models.TextField()
    ai_response = models.TextField()
    triage_level = models.CharField(
        max_length=30,
        choices=(
            ('Routine', 'Routine / Non-Urgent'),
            ('Monitor', 'Monitor Closely'),
            ('Urgent', 'Urgent Veterinary Attention Needed'),
        ),
        default='Monitor'
    )
    suggested_booking = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Triage [{self.triage_level}] on {self.created_at.strftime('%Y-%m-%d %H:%M')}"
