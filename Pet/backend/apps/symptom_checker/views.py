import os
import json
import urllib.request
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import ChatLog

VET_SYSTEM_PROMPT = """
You are an empathetic, clinical AI Veterinary Triage Assistant named "PawCare AI".
Analyze the pet owner's symptom description.

STRICT CLINICAL RULES:
1. NEVER provide a definitive medical diagnosis.
2. Formulate 2-3 potential non-definitive concerns (e.g. "could point to mild gastroenteritis, dietary indiscretion, or foreign body ingestion").
3. Ask 1-2 clarifying questions (e.g., duration, hydration, energy level).
4. Highlight critical RED FLAGS that require immediate ER attention (e.g., pale gums, severe lethargy, blood in stool/vomit, respiratory distress).
5. Always mandate an appointment booking with a board-certified veterinarian for physical palpation or diagnostic testing.
6. Keep tone calm, compassionate, and informative.
"""

MEDICAL_DISCLAIMER = (
    "\n\n⚠️ Medical Disclaimer: This AI analysis provides informational guidance only and is not "
    "a substitute for hands-on veterinary examination. If your pet exhibits severe distress, "
    "visit an emergency veterinary hospital immediately."
)

class SymptomCheckView(APIView):
    """
    POST /api/symptom_check/
    Accepts: { "message": "My cat is vomiting and lethargic", "pet_species": "Cat" }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_message = request.data.get('message', '').strip()
        pet_species = request.data.get('pet_species', 'Pet')

        if not user_message:
            return Response(
                {"error": "Please provide a description of your pet's symptoms."},
                status=status.HTTP_400_BAD_REQUEST
            )

        ai_response_text = ""
        triage_level = "Monitor"

        # Check for OpenAI API Key or use clinical fallback engine
        openai_key = os.environ.get('OPENAI_API_KEY')

        if openai_key:
            try:
                # Call OpenAI Chat Completion
                req_data = json.dumps({
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": VET_SYSTEM_PROMPT},
                        {"role": "user", "content": f"Pet Species: {pet_species}\nSymptoms: {user_message}"}
                    ],
                    "temperature": 0.4,
                    "max_tokens": 500
                }).encode('utf-8')

                req = urllib.request.Request(
                    "https://api.openai.com/v1/chat/completions",
                    data=req_data,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {openai_key}"
                    }
                )
                with urllib.request.urlopen(req, timeout=12) as response:
                    res_json = json.loads(response.read().decode('utf-8'))
                    ai_response_text = res_json['choices'][0]['message']['content']
            except Exception as e:
                # Fallback to local clinical triage engine if remote API fails
                ai_response_text = self._generate_clinical_fallback(pet_species, user_message)
        else:
            # High-fidelity built-in clinical triage rule engine
            ai_response_text = self._generate_clinical_fallback(pet_species, user_message)

        # Detect urgency for triage categorization
        lower_msg = user_message.lower()
        if any(w in lower_msg for w in ['blood', 'cannot breathe', 'choking', 'unresponsive', 'seizure', 'pale gum']):
            triage_level = "Urgent"
        elif any(w in lower_msg for w in ['vomit', 'diarrhea', 'limp', 'fever', 'lethargic', 'not eating']):
            triage_level = "Monitor"
        else:
            triage_level = "Routine"

        # Append mandatory disclaimer if not already in text
        if "Medical Disclaimer" not in ai_response_text:
            ai_response_text += MEDICAL_DISCLAIMER

        # Save to MySQL ChatLog
        ChatLog.objects.create(
            pet_species=pet_species,
            user_message=user_message,
            ai_response=ai_response_text,
            triage_level=triage_level,
            suggested_booking=True
        )

        return Response({
            "response": ai_response_text,
            "triage_level": triage_level,
            "suggest_booking": True,
            "booking_prompt": "Would you like to schedule an immediate consultation with an on-duty veterinarian?",
        }, status=status.HTTP_200_OK)

    def _generate_clinical_fallback(self, species, text):
        """Clinical heuristic fallback ensuring instant functionality without external keys."""
        lower = text.lower()
        advice = []

        if 'vomit' in lower or 'threw up' in lower:
            advice.append(
                f"Vomiting in a {species} can stem from mild issues like rapid eating or novel treats, "
                "or more serious concerns like gastroenteritis, pancreatitis, or dietary indiscretion."
            )
        elif 'letharg' in lower or 'tired' in lower or 'sleep' in lower:
            advice.append(
                f"Noticeable lethargy in a {species} is a non-specific clinical sign that suggests your pet "
                "may be fighting an infection, experiencing dehydration, or in discomfort."
            )
        elif 'limp' in lower or 'leg' in lower or 'walk' in lower:
            advice.append(
                f"Limping or lameness in a {species} often indicates soft-tissue strain, ligament sprains, "
                "or joint soreness that requires careful orthopedic palpation."
            )
        elif 'scratch' in lower or 'skin' in lower or 'itch' in lower:
            advice.append(
                f"Persistent scratching or itching in a {species} suggests potential allergic dermatitis, "
                "environmental contact irritation, or flea/parasite activity."
            )
        else:
            advice.append(
                f"Thank you for sharing your {species}'s symptoms. While some behavioral shifts are minor, "
                "changes in appetite, elimination, or energy levels warrant close clinical observation."
            )

        guidance = (
            f"Here is what our veterinary triage team recommends monitoring:\n\n"
            f"• Potential Concerns: {advice[0]}\n"
            f"• Clarifying Questions: How many hours have these symptoms persisted? Is your {species} still drinking fresh water?\n"
            f"• Red Flags to Watch: If you notice pale or tacky gums, persistent unresponsiveness, labored breathing, or severe abdominal bloating, proceed to an emergency clinic immediately.\n\n"
            f"We strongly recommend having our licensed veterinary clinicians assess your pet via video triage or in clinic."
        )
        return guidance
