"""
TTS Configuration for Romanian Automotive Ads
Custom voice instructions for OpenAI TTS
"""

# Voice instructions for Romanian automotive advertising
ROMANIAN_TTS_INSTRUCTIONS = """Role: Advertising voice

Language: Romanian. For international brands and models use their own pronunciation. E.g. Renault, Citroen, Peugeot - French; Mercedes or Mercedes-Benz, BMW, Volkswagen - German, Skoda - Czech, etc.
Where words are in two languages (e.g: an - meaning year) default to Romanian

Voice Affect: Excited and engaged; project quiet authority and confidence.
Modulate your voice a little bit, don't sound too bland.

Tone: Sincere, empathetic, and gently authoritative—express genuine apology while conveying competence.
Get extra excited about some car features (not all), trim levels or optionals (e.g. oglinzi electrice).
You're a native Romanian speaker, so roll the Rs accordingly.

Pacing: Fast, confident, sales-oriented.

Emotion: Genuine excitement and joy; speak with passion, especially about car features ("Scaune din piele", "pilot automat").

Pronunciation: Clear and precise, emphasizing key reassurances ("smoothly," "quickly," "promptly") to reinforce confidence."""

# Default TTS settings
TTS_DEFAULTS = {
    'model': 'gpt-4o-mini-tts',  # Using the new mini-tts model
    'voice': 'shimmer',
    'response_format': 'mp3',  # Use mp3 for compatibility with FFmpeg
    'instructions': ROMANIAN_TTS_INSTRUCTIONS
}

# Voice options (can be customized per category)
VOICE_OPTIONS = {
    'automotive': 'shimmer',  # Romanian automotive ads
    'electronics': 'nova',
    'fashion': 'shimmer',
    'default': 'alloy'
}


def get_tts_config(category='default', language='ro'):
    """
    Get TTS configuration for a specific category and language
    
    Args:
        category: Product category (automotive, electronics, fashion)
        language: Language code (ro, en)
    
    Returns:
        dict: TTS configuration
    """
    config = TTS_DEFAULTS.copy()
    
    # Use category-specific voice if available
    if category in VOICE_OPTIONS:
        config['voice'] = VOICE_OPTIONS[category]
    
    # Use Romanian instructions for Romanian language
    if language == 'ro':
        config['instructions'] = ROMANIAN_TTS_INSTRUCTIONS
    else:
        # For other languages, remove instructions (use default)
        config.pop('instructions', None)
    
    return config
